/**
 * Collapse/expand.
 */

'use strict'

class Collapse {
  constructor (element, action = 'toggle'){
    this.jsCollapseTarget = 'data-js-target';
    this.triggerEl = element;
    this.targetEl;
    this.animateInProgress = false;
    let that = this;
    this.eventClose = document.createEvent('Event');
    this.eventClose.initEvent('fds.collapse.close', true, true);
    this.eventOpen = document.createEvent('Event');
    this.eventOpen.initEvent('fds.collapse.open', true, true);
    this.triggerEl.addEventListener('click', function (){
      that.toggle();
    });
  }

  toggleCollapse (forceClose) {
    let targetAttr = this.triggerEl.getAttribute(this.jsCollapseTarget);
    this.targetEl = document.querySelector(targetAttr);
    if(this.targetEl === null || this.targetEl == undefined){
      throw new Error(`Could not find panel element. Verify value of attribute `+ this.jsCollapseTarget);
    }
    //change state
    if(this.triggerEl.getAttribute('aria-expanded') === 'true' || this.triggerEl.getAttribute('aria-expanded') === undefined || forceClose ){
      //close
      this.animateCollapse();
    }else{
      //open
      this.animateExpand();
    }
  }

  toggle (){
    if(this.triggerEl !== null && this.triggerEl !== undefined){
      this.toggleCollapse();
    }
  }


  animateCollapse () {
    if(!this.animateInProgress){
      this.animateInProgress = true;

      this.targetEl.style.height = this.targetEl.clientHeight+ 'px';
      this.targetEl.classList.add('collapse-transition-collapse');
      let that = this;
      setTimeout(function (){
        that.targetEl.removeAttribute('style');
      }, 5);
      setTimeout(function (){
        that.targetEl.classList.add('collapsed');
        that.targetEl.classList.remove('collapse-transition-collapse');

        that.triggerEl.setAttribute('aria-expanded', 'false');
        that.targetEl.setAttribute('aria-hidden', 'true');
        that.animateInProgress = false;
        that.triggerEl.dispatchEvent(that.eventClose);
      }, 200);
    }
  }

  animateExpand () {
    if(!this.animateInProgress){
      this.animateInProgress = true;
      this.targetEl.classList.remove('collapsed');
      let expandedHeight = this.targetEl.clientHeight;
      this.targetEl.style.height = '0px';
      this.targetEl.classList.add('collapse-transition-expand');
      let that = this;
      setTimeout(function (){
        that.targetEl.style.height = expandedHeight+ 'px';
      }, 5);

      setTimeout(function (){
        that.targetEl.classList.remove('collapse-transition-expand');
        that.targetEl.removeAttribute('style');

        that.targetEl.setAttribute('aria-hidden', 'false');
        that.triggerEl.setAttribute('aria-expanded', 'true');
        that.animateInProgress = false;
        that.triggerEl.dispatchEvent(that.eventOpen);
      }, 200);
    }
  }
}

module.exports = Collapse;
