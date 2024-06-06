function getUrlParamValue(url, name) {
    var value = '';
    url.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(str, key, val) {
        if (key === name) {
            value = decodeURIComponent(val);
        }
    });
    return value;
}
//  ----------下拉显示，点击隐藏信息 --------- start 
var acc = document.getElementsByClassName("accordion_content");
var i;

for (i = 0; i < acc.length; i++) {

  acc[i].addEventListener("click", function (event) {

    event.preventDefault();
    event.stopPropagation()

    this.classList.toggle("active_content");
    var panel = this.nextElementSibling;
    if (panel.style.maxHeight) {
      panel.style.maxHeight = null;
    } else {
      panel.style.maxHeight = panel.scrollHeight + "px";
    }
  });
}
// HTML 搭配使用 ，css 见 content-common.css
{/* <button class="accordion_content center_text" type="button">Title</button>
<div class="panel_content">
    <br>
    <p>
    content
    </p>
</div>    */}
//  ----------下拉显示，点击隐藏信息 --------- end
