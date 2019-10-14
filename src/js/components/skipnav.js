'use strict';
const once = require('receptor/once');

class SetTabIndex {
  constructor (element){
    element.addEventListener('click', function (){
      // NB: we know because of the selector we're delegating to below that the
      // href already begins with '#'
      const id = this.getAttribute('href').slice(1);
      const target = document.getElementById(id);
      if (target) {
        target.setAttribute('tabindex', 0);
        target.addEventListener('blur', once(event => {
          target.setAttribute('tabindex', -1);
        }));
      } else {
        // throw an error?
      }
    });
  }
}

module.exports = SetTabIndex;
