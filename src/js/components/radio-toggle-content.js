'use strict';

class RadioToggleGroup{
    constructor(el){
        this.jsToggleTrigger = '.js-radio-toggle-group';
        this.jsToggleTarget = 'data-js-target';

        this.eventClose = document.createEvent('Event');
        this.eventClose.initEvent('fds.collapse.close', true, true);

        this.eventOpen = document.createEvent('Event');
        this.eventOpen.initEvent('fds.collapse.open', true, true);
        this.radioEls = null;
        this.targetEl = null;

        this.init(el);
    }

    init (el){
        this.radioGroup = el;
        this.radioEls = this.radioGroup.querySelectorAll('input[type="radio"]');
        var that = this;

        for(let i = 0; i < this.radioEls.length; i++){
          var radio = this.radioEls[ i ];
          radio.addEventListener('change', function (){
            let liParent = this.parentNode;
            let list = liParent.parentNode;
            let lis = list.children;
            console.log(lis);
            for(let a = 0; a < that.radioEls.length; a++ ){
              console.log('that.radioEls[ a ]', that.radioEls[ a ]);
              that.toggle(that.radioEls[ a ]);
            }
          });

          this.toggle(radio); //Initial value;
        }
    }
    toggle (triggerEl){
      if(triggerEl.checked){
        this.open(triggerEl);
      }else{
        this.close(triggerEl);
      }
    }

    open (triggerEl){
        console.log('treeItem', triggerEl.parentNode);
        triggerEl.parentNode.setAttribute('aria-expanded', 'true');
        triggerEl.dispatchEvent(this.eventOpen);
    }
    close (triggerEl){
        triggerEl.parentNode.setAttribute('aria-expanded', 'false');
        console.log('triggerEl.parentNode', triggerEl.parentNode);
        triggerEl.dispatchEvent(this.eventClose);
    }
}

module.exports = RadioToggleGroup;
