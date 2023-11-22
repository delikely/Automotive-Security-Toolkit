### 简介

能够运行在 Android aarch64 车机上的 Python 环境，基于 [Termux package](https://packages.termux.dev/) 制作。更多内容见[车联网安全进阶之Trick——Android车机运行Python](https://mp.weixin.qq.com/s/mPA2akY2pYXbbG59NkbAfg)。

### 使用说明

adb 上传`pydroid.tar.gz`到 `/data/local/tmp` 目录下，解压后设置环境变量并进入python虚拟环境中。

```sh
msmnile_gvmq:/data/local/tmp/pydroid $ export LD_LIBRARY_PATH=/data/local/tmp/pydroid/lib
msmnile_gvmq:/data/local/tmp/pydroid $ export PATH=$PATH:/data/local/tmp/pydroid/bin
msmnile_gvmq:/data/local/tmp/pydroid $ source venv/bin/activate
(venv) msmnile_gvmq:/data/local/tmp/pydroid $ python --version
Python 3.11.6
(venv) msmnile_gvmq:/data/local/tmp/pydroid $ pip --version
pip 23.2.1 from /data/local/tmp/pydroid/venv/lib/python3.11/site-packages/pip (python 3.11)
```

