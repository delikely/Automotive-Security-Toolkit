function getUrlParamValue(url, name) {
    var value = '';
    url.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(str, key, val) {
        if (key === name) {
            value = decodeURIComponent(val);
        }
    });
    return value;
}
