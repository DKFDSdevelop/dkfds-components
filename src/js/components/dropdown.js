'use strict';
const breakpoints = require('../utils/breakpoints').default;
const BUTTON = '.button-overflow-menu';
const jsDropdownCollapseModifier = 'js-dropdown--responsive-collapse'; //option: make dropdown behave as the collapse component when on small screens (used by submenus in the header and step-dropdown).
const TARGET = 'data-js-target';

/**
 * Add functionality to overflow menu component
 * @param {HTMLButtonElement} buttonElement Overflow menu button
 */
function Dropdown (buttonElement) {
  this.buttonElement = buttonElement;
  this.targetEl = null;
  this.responsiveListCollapseEnabled = false;

  if(this.buttonElement === null ||this.buttonElement === undefined){
    throw new Error(`Could not find button for overflow menu component.`);
  }
  let targetAttr = this.buttonElement.getAttribute(TARGET);
  if(targetAttr === null || targetAttr === undefined){
    throw new Error('Attribute could not be found on overflow menu component: '+TARGET);
  }
  let targetEl = document.getElementById(targetAttr);
  if(targetEl === null || targetEl === undefined){
    throw new Error('Panel for overflow menu component could not be found.');
  }
  this.targetEl = targetEl;

  document.addEventListener('focusin', closeOnFocusLost);
}

/**
 * Set click events
 */
Dropdown.prototype.init = function (){
  if(this.buttonElement !== null && this.buttonElement !== undefined && this.targetEl !== null && this.targetEl !== undefined){

    if(this.buttonElement.parentNode.classList.contains('overflow-menu--md-no-responsive') || this.buttonElement.parentNode.classList.contains('overflow-menu--lg-no-responsive')){
      this.responsiveListCollapseEnabled = true;
    }

    //Clicked outside dropdown -> close it
    document.getElementsByTagName('body')[ 0 ].removeEventListener('click', outsideClose);
    document.getElementsByTagName('body')[ 0 ].addEventListener('click', outsideClose);

    //Clicked on dropdown open button --> toggle it
    this.buttonElement.removeEventListener('click', toggleDropdown);
    this.buttonElement.addEventListener('click', toggleDropdown);

    document.removeEventListener('keyup', closeOnEscape);
    document.addEventListener('keyup', closeOnEscape);
  }
}

/**
 * Hide overflow menu
 */
Dropdown.prototype.hide = function(){
  toggle(this.buttonElement);
}

/**
 * Show overflow menu
 */
Dropdown.prototype.show = function(){
  toggle(this.buttonElement);
}

let closeOnEscape = function(event){
  var key = event.which || event.keyCode;
  if (key === 27) {
    closeAll(event);
  }
};

/**
 * Close all overflow menus
 * @param {event} event default is null
 */
let closeAll = function (event = null){
  let changed = false;
  const body = document.querySelector('body');

  let overflowMenuEl = document.querySelectorAll(".overflow-menu, .submenu");
  for (let oi = 0; oi < overflowMenuEl.length; oi++) {
    let currentOverflowMenuEL = overflowMenuEl[ oi ];
    let triggerEl = currentOverflowMenuEL.querySelector(BUTTON+'[aria-expanded="true"]');
    if(triggerEl !== null){
      changed = true;
      let targetEl = document.getElementById(triggerEl.getAttribute(TARGET).replace('#', ''));

        if (targetEl !== null && triggerEl !== null) {
          if(doResponsiveCollapse(triggerEl)){
            if(triggerEl.getAttribute('aria-expanded') === true){
              let eventClose = new Event('fds.dropdown.close');
              triggerEl.dispatchEvent(eventClose);
            }
            triggerEl.setAttribute('aria-expanded', 'false');
            targetEl.classList.add('collapsed');
          }
        }
    }
  }

  if(changed && event !== null){
    event.stopImmediatePropagation();
  }
};

let offset = function (el) {
  let rect = el.getBoundingClientRect(),
    scrollLeft = window.pageXOffset || document.documentElement.scrollLeft,
    scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  return { top: rect.top + scrollTop, left: rect.left + scrollLeft };
};

let toggleDropdown = function (event, forceClose = false) {
  event.stopPropagation();
  event.preventDefault();

  toggle(this, forceClose);

};

let toggle = function(button, forceClose = false){
  let triggerEl = button;
  let targetEl = null;
  if(triggerEl !== null && triggerEl !== undefined){
    let targetAttr = triggerEl.getAttribute(TARGET);
    if(targetAttr !== null && targetAttr !== undefined){
      targetEl = document.getElementById(targetAttr);
    }
  }
  if(triggerEl !== null && triggerEl !== undefined && targetEl !== null && targetEl !== undefined){
    //change state
    targetEl.style.left = null;
    targetEl.style.right = null;

    if(triggerEl.getAttribute('aria-expanded') === 'true' || forceClose){
      //close
      triggerEl.setAttribute('aria-expanded', 'false');
      targetEl.classList.add('collapsed');   
      let eventClose = new Event('fds.dropdown.close');
      triggerEl.dispatchEvent(eventClose);
    }
    else{
      //open
      triggerEl.setAttribute('aria-expanded', 'true');
      targetEl.classList.remove('collapsed');
      let eventOpen = new Event('fds.dropdown.open');
      triggerEl.dispatchEvent(eventOpen);

      let targetOffset = offset(targetEl);
      if (targetOffset.left < 0) {
        let leftAdjust = 4;
        /* Header menus have negative margin and may need additional adjustment */
        if (parseInt(window.getComputedStyle(targetEl).marginLeft) < 0) {
          leftAdjust = 0 - parseInt(window.getComputedStyle(targetEl).marginLeft);
        }
        targetEl.style.left = leftAdjust + 'px';
        targetEl.style.right = 'auto';
      }
      
      let right = targetOffset.left + targetEl.offsetWidth;
      if (right > document.documentElement.clientWidth) {
        targetEl.style.left = 'auto';

        if (targetEl.parentNode.classList.contains('submenu')) {
          targetEl.style.right = '-4px';
        }
        else {
          targetEl.style.right = '4px';
        }
      }
    }

  }
}

let hasParent = function (child, parentTagName){
  if(child.parentNode.tagName === parentTagName){
    return true;
  } else if(parentTagName !== 'BODY' && child.parentNode.tagName !== 'BODY'){
    return hasParent(child.parentNode, parentTagName);
  }else{
    return false;
  }
};

function closeOnFocusLost(event) {
  let overflowmenus = document.querySelectorAll('.overflow-menu, .submenu');
  for (let i = 0; i < overflowmenus.length; i++) {
    let listElements = overflowmenus[i].querySelectorAll('li');
    let toggleButton = overflowmenus[i].querySelector('.button-overflow-menu');
    if (toggleButton) {
      let isListElementFocused = [...listElements].includes(event.target.parentElement);
      let isToggleButtonFocused = toggleButton === event.target;
      if (!isListElementFocused && !isToggleButtonFocused) {
        toggle(toggleButton, true);
      }
    }
  }
}

let outsideClose = function (evt){
  if(!document.getElementsByTagName('body')[0].classList.contains('mobile-nav-active')){
    if(document.querySelector('body.mobile-nav-active') === null && !evt.target.classList.contains('button-menu-close')) {
      let openDropdowns = document.querySelectorAll(BUTTON+'[aria-expanded=true]');
      for (let i = 0; i < openDropdowns.length; i++) {
        let triggerEl = openDropdowns[i];
        let targetEl = null;
        let targetAttr = triggerEl.getAttribute(TARGET);
        if (targetAttr !== null && targetAttr !== undefined) {
          if(targetAttr.indexOf('#') !== -1){
            targetAttr = targetAttr.replace('#', '');
          }
          targetEl = document.getElementById(targetAttr);
        }
        if (doResponsiveCollapse(triggerEl) || (hasParent(triggerEl, 'HEADER') && !evt.target.classList.contains('overlay'))) {
          //closes dropdown when clicked outside
          if (evt.target !== triggerEl) {
            //clicked outside trigger, force close
            triggerEl.setAttribute('aria-expanded', 'false');
            targetEl.classList.add('collapsed');         
            let eventClose = new Event('fds.dropdown.close');
            triggerEl.dispatchEvent(eventClose);
          }
        }
      }
    }
  }
};

let doResponsiveCollapse = function (triggerEl){
  if(!triggerEl.classList.contains(jsDropdownCollapseModifier)){
    // not nav overflow menu
    if(triggerEl.parentNode.classList.contains('overflow-menu--md-no-responsive') || triggerEl.parentNode.classList.contains('overflow-menu--lg-no-responsive')) {
      // trinindikator overflow menu
      if (window.innerWidth <= getTringuideBreakpoint(triggerEl)) {
        // overflow menu på responsiv tringuide aktiveret
        return true;
      }
    } else{
      // normal overflow menu
      return true;
    }
  }

  return false;
};

let getTringuideBreakpoint = function (button){
  if(button.parentNode.classList.contains('overflow-menu--md-no-responsive')){
    return breakpoints.md;
  }
  if(button.parentNode.classList.contains('overflow-menu--lg-no-responsive')){
    return breakpoints.lg;
  }
};

export default Dropdown;