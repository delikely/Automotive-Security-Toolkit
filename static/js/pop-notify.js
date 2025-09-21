//popup https://github.com/minitek/polipop
let pp;

(function(document) {
    'use strict';
    const selector = 'mypolipop';
    function initPolipop(selector, options) {
        if (document.querySelector(selector))
            document.querySelector(selector).remove();
  
        pp = new Polipop(selector, options);
    }
  
    document.addEventListener('DOMContentLoaded', function() {
        const options = {
            layout: 'popups',
            // position: 'bottom-right',
            position: 'bottom-left',
            theme: 'default',
            icons: true,
            insert: 'before',
            pool: 0,
            sticky: false,
            pauseOnHover: true,
            life: 3000,
            progressbar: true,
            effect: 'slide',
            easing: 'ease-in-out',
        };
  
        initPolipop(selector, options);
    });
  })(document);
  
function pop_notify(type,title,content){
    pp.add({
        type: type,
        title: title,
        content: content
    })
    return true;
}
