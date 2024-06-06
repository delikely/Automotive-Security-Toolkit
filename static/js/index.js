$(document).ready(function(){
    load_page();
})

function load_page(){
    var option = getUrlParamValue(location.href,"option");

    if(option=="attack_potential_calculator"){
        $("#attack_potential_calculator").click();
        document.getElementById("content").innerHTML = '<iframe src="attack_potential_21434_2021_calculator.html" style="width: 100%;height: 100%;"></iframe>'
        return
    }

    if(option=="WMI_lookup"){
        $("#WMI_lookup").click();
        document.getElementById("content").innerHTML = '<iframe src="WMI_lookup.html" style="width: 100%;height: 100%;"></iframe>'
        return
    }

    if(option=="UDS"){
        $("#UDS").click();
        document.getElementById("content").innerHTML = '<iframe src="UDS.html" style="width: 100%;height: 100%;"></iframe>'
        return
    }

    if(option=="UDS_NRC"){
        $("#UDS_NRC").click();
        document.getElementById("content").innerHTML = '<iframe src="UDS_NRC.html" style="width: 100%;height: 100%;"></iframe>'
        return
    }

    if(option=="UDS_DID"){
        $("#UDS_DID").click();
        document.getElementById("content").innerHTML = '<iframe src="UDS_DID.html" style="width: 100%;height: 100%;"></iframe>'
        return
    }

    if(option=="J1939"){
        $("#J1939").click();
        document.getElementById("content").innerHTML = '<iframe src="J1939.html" style="width: 100%;height: 100%;"></iframe>'
        return
    }
    
    // 都匹配不上，则到默认主页
    if(option=="home" || option ==""){
        $("#home").click();
        document.getElementById("content").innerHTML = '<iframe src="home.html" style="width: 100%;height: 100%;"></iframe>'
        return
    }


}

//子菜单选择
$(document).on('click', '.nav-link', function(event) {
    //获取选择的菜单
    var menu = event.currentTarget.childNodes[2].textContent.trim();

    var elements = document.getElementsByClassName("nav-link"); 
    for (var i = 0; i < elements.length; i++) {
        elements[i].style.backgroundColor = "transparent"; 
    }

    //设置当前选择的项目
    var currentTarget = event.currentTarget;
    currentTarget.style.backgroundColor = "#5a5a6f22";

    //设置标题
    document.title = menu;
})