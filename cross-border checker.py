# Date： 2023/05/12
# Version: 1.0
# Author: delikely
# Description：脚本用验证《汽车整车信息安全技术要求》（征求意见稿）中提到跨境传输检测要求，“使用网络数据抓包工具进行不少于3600秒的数据抓包，解析通信报文数据，分析目的IP地址中是否包含境外IP地址，并记录测试结果，应不包含境外IP地址。”

import argparse
from scapy.all import *
import ipaddress
import requests
import json
from prettytable import PrettyTable

banner = ''' 
░█▀▄░█▀▀▄░▄▀▀▄░█▀▀░█▀▀░░░█▀▀▄░▄▀▀▄░█▀▀▄░█▀▄░█▀▀░█▀▀▄░░░█▀▄░█░░░░█▀▀░█▀▄░█░▄
░█░░░█▄▄▀░█░░█░▀▀▄░▀▀▄░░░█▀▀▄░█░░█░█▄▄▀░█░█░█▀▀░█▄▄▀░░░█░░░█▀▀█░█▀▀░█░░░█▀▄
░▀▀▀░▀░▀▀░░▀▀░░▀▀▀░▀▀▀░░░▀▀▀▀░░▀▀░░▀░▀▀░▀▀░░▀▀▀░▀░▀▀░░░▀▀▀░▀░░▀░▀▀▀░▀▀▀░▀░▀
                                                                        
'''
# 检查是否公网IP，是则返回真
def is_public_ip(ip):
    ip = ipaddress.ip_address(ip)
    if ip.is_private or ip.is_loopback or ip.is_multicast or ip.is_reserved:
        return False
    else:
        return True

# 检查IP，如果是境外IP则返回所在地址
def cross_border_addr(ip):
    # 百度IP信息查询API
    query_api = "https://opendata.baidu.com/api.php?co=&resource_id=6006&oe=utf8&query="
    homeland = ["中国","北京","天津","河北","山西","内蒙古","辽宁","吉林","黑龙江","上海","江苏","浙江","安徽","福建","江西","山东","河南","湖北","湖南","广东","广西","海南","重庆","四川","贵州","云南","西藏","陕西","甘肃","青海","宁夏","新疆"] 
    response = requests.get(query_api+ip)
    location = json.loads(response.content.decode())["data"][0]["location"]
    if location[0:2] not in homeland:
        return location
    else:
        return False

# 读取流量包检测其中是否存在境外IP
def cross_border_check(pcap):
    print("分析中...\n")
    packets = rdpcap(pcap)
    table = PrettyTable(["序号",'IP', '国家/地区'])
    ip_list = []
    for pkt in packets:
        if IP in pkt:
            src_ip = pkt[IP].src
            dst_ip = pkt[IP].dst
            if src_ip not in ip_list:
                ip_list.append(src_ip)
            if dst_ip not in ip_list:
                ip_list.append(dst_ip)
    
    for ip in ip_list:
        if is_public_ip(ip):
            location = cross_border_addr(ip)
            if location:
                table.add_row([len(table.rows)+1,ip,location])

    print("访问的境外IP地址列表如下:")
    print(table)
    
if __name__ == '__main__':
    print(banner)
    parser = argparse.ArgumentParser(prog='PROG', usage='%(prog)s [options]',description='流量包跨境传输检查')
    parser.add_argument('-f', '--file', type=str, required=True, help='pcap file')
    args = parser.parse_args()
    cross_border_check(args.file)

