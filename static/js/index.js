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

    var elements = document.getElementsByClassName("nav-link"); //将"your-class"替换为需要操作的类名
    for (var i = 0; i < elements.length; i++) {
        elements[i].style.backgroundColor = "transparent"; //设置背景颜色为透明
    }

    //设置当前选择的项目
    var currentTarget = event.currentTarget;
    currentTarget.style.backgroundColor = "#5a5a6f22";

    //设置标题
    document.title = menu;
})