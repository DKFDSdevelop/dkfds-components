/******/ (() => { // webpackBootstrap
/******/ 	"use strict";

;// CONCATENATED MODULE: ./src/js/custom-elements/fds-input/fds-input-glossary.js


let glossary = {
  'errorText': 'Fejl',
  'editText': 'Rediger',
  'requiredText': 'skal udfyldes',
  'optionalText': 'frivilligt',
  'oneCharacterLeftText': 'Du har {value} tegn tilbage',
  'manyCharactersLeftText': 'Du har {value} tegn tilbage',
  'oneCharacterExceededText': 'Du har {value} tegn for meget',
  'manyCharactersExceededText': 'Du har {value} tegn for meget',
  'maxCharactersText': 'Du kan indtaste op til {value} tegn',
  'tooltipIconText': 'Læs mere'
};
function updateGlossary(oldGlossary, newGlossary) {
  let keys = Object.keys(newGlossary);
  keys.forEach(key => {
    if (oldGlossary[key] !== undefined) {
      oldGlossary[key] = newGlossary[key];
    }
  });
}
;// CONCATENATED MODULE: ./src/js/custom-elements/fds-input/fds-input-attribute-validators.js


function isValidType(type) {
  const TYPES = ['text', 'email', 'number', 'password', 'tel', 'url'];
  if (TYPES.includes(type)) {
    return true;
  } else {
    return false;
  }
}
function isValidInteger(integer) {
  let number = parseInt(integer);
  return Number.isInteger(number);
}
function isValidText(s) {
  // If s is falsy, it is not a non-empty string
  if (!s) {
    return false;
  }
  // If s is a string, check that it doesn't contain only whitespace
  else if (typeof s === 'string' || s instanceof String) {
    if (s.trim() === '') {
      return false;
    } else {
      return true;
    }
  }
  // s is not a string
  else {
    return false;
  }
}
;// CONCATENATED MODULE: ./src/js/custom-elements/fds-input/fds-input-helpers.js


/* 
FUNCTIONS FOR DEFAULT SETTINGS
*/
function setDefaultInputId(labelElement, inputElement) {
  let randomString = 'input-' + Date.now().toString().slice(-3) + Math.floor(Math.random() * 1000000).toString();
  labelElement.setAttribute('for', randomString);
  inputElement.setAttribute('id', randomString);
}
function setDefaultType(inputElement) {
  inputElement.setAttribute('type', 'text');
}

/* 
CHARACTER LIMIT
*/

function characterLimitMessage(glossary, charactersLeft) {
  let message = "";
  if (charactersLeft === -1) {
    let exceeded = Math.abs(charactersLeft);
    message = glossary['oneCharacterExceededText'].replace(/{value}/, exceeded);
  } else if (charactersLeft === 1) {
    message = glossary['oneCharacterLeftText'].replace(/{value}/, charactersLeft);
  } else if (charactersLeft >= 0) {
    message = glossary['manyCharactersLeftText'].replace(/{value}/, charactersLeft);
  } else {
    let exceeded = Math.abs(charactersLeft);
    message = glossary['manyCharactersExceededText'].replace(/{value}/, exceeded);
  }
  return message;
}
function updateVisibleMessage(glossary, charactersLeft, inputElement, characterLimitElement) {
  let newMessage = characterLimitMessage(glossary, charactersLeft);
  let visibleMessage = characterLimitElement.querySelector('.visible-message');
  if (charactersLeft < 0) {
    visibleMessage.classList.add('limit-exceeded');
    inputElement.classList.add('form-limit-error');
  } else {
    visibleMessage.classList.remove('limit-exceeded');
    inputElement.classList.remove('form-limit-error');
  }
  visibleMessage.innerHTML = newMessage;
}
function updateSRMessage(glossary, charactersLeft, characterLimitElement) {
  let newMessage = characterLimitMessage(glossary, charactersLeft);
  let srMessage = characterLimitElement.querySelector('.sr-message');
  srMessage.innerHTML = newMessage;
}

/* 
REMAINING HELPERS
*/

function setHelptextId(helptextElement, inputElement) {
  helptextElement.id = inputElement.id + '-helptext';
}
function setErrorId(errorElement, inputElement) {
  errorElement.id = inputElement.id + '-error';
}
function setCharacterLimitId(characterLimitElement, inputElement) {
  characterLimitElement.querySelector('.max-limit').id = inputElement.id + '-limit';
}
function setTooltipId(tooltipElement, inputElement) {
  tooltipElement.dataset.tooltipId = inputElement.id + '-tooltip';
  ;
}
function updateErrorMessage(errorElement, errorText, srText) {
  errorElement.innerHTML = '<span class="sr-only">' + srText + ': </span>' + errorText;
}
function updateEditButton(editButtonElement, labelText, editText) {
  editButtonElement.innerHTML = '<svg class="icon-svg" focusable="false" aria-hidden="true"><use xlink:href="#mode"></use></svg>' + editText + '<span class="sr-only"> ' + labelText + '</span>';
}
function updateRequiredLabel(labelElement, labelText, requiredText) {
  labelElement.innerHTML = labelText + '<span class="weight-normal"> (*' + requiredText + ')</span>';
}
function updateOptionalLabel(labelElement, labelText, optionalText) {
  labelElement.innerHTML = labelText + '<span class="weight-normal"> (' + optionalText + ')</span>';
}
;// CONCATENATED MODULE: ./src/js/custom-elements/fds-input/fds-input-attribute-changes.js




function autocomplete(newValue, inputElement) {
  // Attribute changed to valid value
  if (isValidText(newValue)) {
    inputElement.setAttribute('autocomplete', newValue);
  }
  // Attribute removed or invalid value
  else {
    inputElement.removeAttribute('autocomplete');
  }
}
function disabled(newValue, labelElement, inputElement, inputWrapperElement) {
  // Attribute changed
  if (newValue !== null) {
    labelElement.classList.add('disabled');
    inputElement.setAttribute('disabled', '');
    inputWrapperElement.classList.add('disabled');
  }
  // Attribute removed
  else {
    labelElement.classList.remove('disabled');
    inputElement.removeAttribute('disabled');
    inputWrapperElement.classList.remove('disabled');
  }
}
function error(newValue, wrapperElement, inputElement) {
  // Attribute changed
  if (isValidText(newValue)) {
    wrapperElement.classList.add('form-error');
    inputElement.setAttribute('aria-invalid', 'true');
  }
  // Attribute removed
  else {
    wrapperElement.classList.remove('form-error');
    inputElement.removeAttribute('aria-invalid');
  }
}
function helptext(newValue, helptextElement) {
  // Attribute changed to valid value
  if (isValidText(newValue)) {
    helptextElement.textContent = newValue;
  }
  // Attribute removed or invalid value
  else {
    helptextElement.textContent = '';
  }
}
function inputid(newValue, labelElement, inputElement) {
  // Attribute changed to valid value
  if (isValidText(newValue)) {
    labelElement.setAttribute('for', newValue);
    inputElement.setAttribute('id', newValue);
  }
  // Attribute removed or invalid value
  else {
    setDefaultInputId(labelElement, inputElement);
  }
}
function label(newValue, labelElement) {
  if (isValidText(newValue)) {
    labelElement.textContent = newValue;
  }
}
function maxchar(newValue, inputElement, characterLimitElement, connected, glossary, handleKeyUp, handleFocus, handleBlur, handlePageShow, value, containsCharacterLimit) {
  // Attribute changed
  if (isValidInteger(newValue)) {
    characterLimitElement.querySelector('.max-limit').innerHTML = glossary['maxCharactersText'].replace(/{value}/, newValue);
    let charactersRemaining = newValue;
    if (value) {
      charactersRemaining = parseInt(newValue) - value.length;
    }
    updateVisibleMessage(glossary, charactersRemaining, inputElement, characterLimitElement);
    updateSRMessage(glossary, charactersRemaining, characterLimitElement);
  }

  // Attribute added
  if (connected && !containsCharacterLimit && isValidInteger(newValue)) {
    inputElement.addEventListener('keyup', handleKeyUp, false);
    inputElement.addEventListener('focus', handleFocus, false);
    inputElement.addEventListener('blur', handleBlur, false);
    window.addEventListener('pageshow', handlePageShow, false);
  }
  // Attribute removed or invalid
  else if (connected && containsCharacterLimit && !isValidInteger(newValue)) {
    inputElement.removeEventListener('keyup', handleKeyUp, false);
    inputElement.removeEventListener('focus', handleFocus, false);
    inputElement.removeEventListener('blur', handleBlur, false);
    window.removeEventListener('pageshow', handlePageShow, false);
  }
}
function maxwidth(newValue, inputElement) {
  // Attribute changed
  if (isValidInteger(newValue)) {
    let paddingPixels = 30; // Input padding-left and padding-right are 15px
    let borderPixels = 4; // Input border-left and border-right are 2px (worst case)
    inputElement.style.maxWidth = 'calc(' + parseInt(newValue) + 'ch + ' + (paddingPixels + borderPixels) + 'px)';
    inputElement.style.width = '100%';
  }
  // Attribute removed
  else {
    inputElement.style.maxWidth = '';
    inputElement.style.width = '';
  }
}
function fds_input_attribute_changes_name(newValue, inputElement) {
  if (isValidText(newValue)) {
    inputElement.setAttribute('name', newValue);
  }
}
function prefix(newValue, inputWrapperElement, prefixElement) {
  // Attribute changed to valid value
  if (isValidText(newValue)) {
    inputWrapperElement.classList.add('form-input-wrapper--prefix');
    prefixElement.textContent = newValue;
  }
  // Attribute removed or invalid value
  else {
    inputWrapperElement.classList.remove('form-input-wrapper--prefix');
  }
}
function readonly(newValue, inputElement, inputWrapperElement) {
  // Attribute changed
  if (newValue !== null) {
    inputElement.setAttribute('readonly', '');
    inputWrapperElement.classList.add('readonly');
  }
  // Attribute removed
  else {
    inputElement.removeAttribute('readonly');
    inputWrapperElement.classList.remove('readonly');
  }
}
function required(newValue, inputElement) {
  // Attribute changed
  if (newValue !== null) {
    inputElement.setAttribute('required', '');
  }
  // Attribute removed
  else {
    inputElement.removeAttribute('required');
  }
}
function suffix(newValue, inputWrapperElement, suffixElement) {
  // Attribute changed
  if (isValidText(newValue)) {
    inputWrapperElement.classList.add('form-input-wrapper--suffix');
    suffixElement.textContent = newValue;
  }
  // Attribute removed
  else {
    inputWrapperElement.classList.remove('form-input-wrapper--suffix');
  }
}
function tooltip(newValue, tooltipElement) {
  // Attribute changed
  if (isValidText(newValue)) {
    tooltipElement.dataset.tooltip = newValue;
  }
}
function type(newValue, inputElement) {
  if (isValidType(newValue)) {
    inputElement.setAttribute('type', newValue);
  } else {
    setDefaultType(inputElement);
  }
}
function value(newValue, inputElement, characterLimitElement, connected, glossary, maxchar) {
  // Attribute changed
  if (newValue !== null) {
    inputElement.setAttribute('value', newValue);
  }
  // Attribute removed
  else {
    inputElement.removeAttribute('value');
  }
  // Ensure character limit shows the correct number of remaining characters at element creation
  if (!connected && isValidInteger(maxchar)) {
    let chars = parseInt(maxchar) - newValue.length;
    updateVisibleMessage(glossary, chars, inputElement, characterLimitElement);
    updateSRMessage(glossary, chars, characterLimitElement);
  }
}
;// CONCATENATED MODULE: ./src/js/custom-elements/fds-input/fds-input-build-element.js




/* Functions for initial creation of fds-input elements */

function createWrapperElement() {
  let wrapperElement = document.createElement('div');
  wrapperElement.classList.add('form-group');
  return wrapperElement;
}
function createLabelElement() {
  let labelElement = document.createElement('label');
  labelElement.classList.add('form-label');
  return labelElement;
}
function createTooltipElement(glossary) {
  let tooltipElement = document.createElement('span');
  tooltipElement.classList.add('tooltip-wrapper', 'custom-element-tooltip', 'ml-2');
  tooltipElement.dataset.tooltip = '';
  tooltipElement.dataset.tooltipId = '';
  tooltipElement.dataset.position = 'above';
  tooltipElement.dataset.trigger = 'click';
  tooltipElement.innerHTML = '<button class="button button-unstyled tooltip-target" type="button" aria-label="' + glossary['tooltipIconText'] + '">' + '<svg class="icon-svg mr-0 mt-0" focusable="false" aria-hidden="true"><use xlink:href="#help"></use></svg>' + '</button>';
  return tooltipElement;
}
function createHelptextElement() {
  let helptextElement = document.createElement('span');
  helptextElement.classList.add('form-hint');
  return helptextElement;
}
function createErrorElement() {
  let errorElement = document.createElement('span');
  errorElement.classList.add('form-error-message');
  return errorElement;
}
function createEditWrapperElement() {
  let editWrapperElement = document.createElement('div');
  editWrapperElement.classList.add('edit-wrapper');
  return editWrapperElement;
}
function createInputWrapperElement() {
  let inputWrapperElement = document.createElement('div');
  inputWrapperElement.classList.add('form-input-wrapper');
  return inputWrapperElement;
}
function createPrefixElement() {
  let prefixElement = document.createElement('div');
  prefixElement.classList.add('form-input-prefix');
  prefixElement.setAttribute('aria-hidden', 'true');
  return prefixElement;
}
function createInputElement() {
  let inputElement = document.createElement('input');
  inputElement.classList.add('form-input');
  return inputElement;
}
function createSuffixElement() {
  let suffixElement = document.createElement('div');
  suffixElement.classList.add('form-input-suffix');
  suffixElement.setAttribute('aria-hidden', 'true');
  return suffixElement;
}
function createEditButtonElement(handleEditClicked) {
  let editButtonElement = document.createElement('button');
  editButtonElement.setAttribute('type', 'button');
  editButtonElement.classList.add('function-link', 'edit-button');
  editButtonElement.addEventListener('click', handleEditClicked, false);
  return editButtonElement;
}
function createCharacterLimitElement() {
  let characterLimitElement = document.createElement('div');
  characterLimitElement.classList.add('character-limit-wrapper');
  characterLimitElement.innerHTML = '<span class="max-limit"></span>' + '<span class="visible-message form-hint" aria-hidden="true"></span>' + '<span class="sr-message" aria-live="polite"></span>';
  return characterLimitElement;
}

/* Functions for rebuilding fds-input */

function setInputAriaDescribedBy(error, helptext, maxchar, errorElement, helptextElement, characterLimitElement, inputElement) {
  let ariaDescribedBy = '';
  if (isValidText(error)) {
    ariaDescribedBy = ariaDescribedBy + errorElement.id + ' ';
  }
  if (isValidText(helptext)) {
    ariaDescribedBy = ariaDescribedBy + helptextElement.id + ' ';
  }
  if (isValidInteger(maxchar)) {
    ariaDescribedBy = ariaDescribedBy + characterLimitElement.querySelector('.max-limit').id + ' ';
  }
  if (ariaDescribedBy.trim() !== '') {
    inputElement.setAttribute('aria-describedby', ariaDescribedBy.trim());
  }
}
;// CONCATENATED MODULE: ./src/js/components/tooltip.js


const ARROW_DISTANCE_TO_TARGET = 4; // Must match '$-arrow-dist-to-target' in 'src\stylesheets\components\_tooltip.scss'
const ARROW_HEIGHT = 8; // Must match '$-arrow-height' in 'src\stylesheets\components\_tooltip.scss'
const MIN_MARGIN = 8; // Minimum margin to the edge of the window

function Tooltip(wrapper) {
  if (wrapper.getElementsByClassName('tooltip-target').length === 0) {
    throw new Error(`Missing tooltip target. Add class 'tooltip-target' to element inside tooltip wrapper.`);
  } else if (!wrapper.hasAttribute('data-tooltip') || wrapper.dataset.tooltip === '') {
    throw new Error(`Missing tooltip text. Wrapper must have data attribute 'data-tooltip'.`);
  } else if (wrapper.dataset.trigger !== 'hover' && wrapper.dataset.trigger !== 'click') {
    throw new Error(`Missing trigger. Tooltip wrapper must have data attribute 'data-trigger="hover"' or 'data-trigger="click"'.`);
  } else if (!wrapper.hasAttribute('data-tooltip-id') || wrapper.dataset.tooltipId === '') {
    throw new Error(`Missing ID. Tooltip wrapper must have data attribute 'data-tooltip-id'.`);
  } else {
    this.wrapper = wrapper;
    this.target = wrapper.getElementsByClassName('tooltip-target')[0];
    this.tooltip = document.createElement('span');
    this.tooltip.classList.add('tooltip');
    let arrow = document.createElement('span');
    arrow.classList.add('tooltip-arrow');
    arrow.setAttribute('aria-hidden', true);
  }
}
Tooltip.prototype.init = function () {
  let wrapper = this.wrapper;
  let tooltipTarget = this.target;
  let tooltipEl = this.tooltip;
  hideTooltip(wrapper, tooltipTarget, tooltipEl);

  /* Ensure tooltip remains visible if window size is reduced */
  window.addEventListener('resize', function () {
    updateTooltipPosition(wrapper, tooltipTarget, tooltipEl);
  });
  document.getElementsByTagName('body')[0].addEventListener('click', closeAllTooltips);
  document.getElementsByTagName('body')[0].addEventListener('keyup', closeOnTab);

  /* A "true" tooltip describes the element which triggered it and is triggered on hover */
  let trueTooltip = wrapper.dataset.trigger === 'hover';
  tooltipEl.id = wrapper.dataset.tooltipId;
  if (trueTooltip) {
    wrapper.append(tooltipEl);
    appendArrow(wrapper);
    if (tooltipTarget.classList.contains('tooltip-is-label')) {
      tooltipTarget.setAttribute('aria-labelledby', wrapper.dataset.tooltipId);
    } else {
      tooltipTarget.setAttribute('aria-describedby', wrapper.dataset.tooltipId);
    }
    tooltipEl.setAttribute('role', 'tooltip');
    tooltipEl.innerText = wrapper.dataset.tooltip;
    tooltipTarget.addEventListener('focus', function () {
      showTooltip(wrapper, tooltipTarget, tooltipEl);
      updateTooltipPosition(wrapper, tooltipTarget, tooltipEl);
    });
    tooltipTarget.addEventListener('mouseover', function (e) {
      /* The tooltip should not appear if the user just briefly moves the cursor 
         across the component. Use the 'js-hover' class as a flag to check, if
         the hover action is persistant. */
      tooltipTarget.classList.add('js-hover');
      setTimeout(function () {
        if (tooltipTarget.classList.contains('js-hover')) {
          showTooltip(wrapper, tooltipTarget, tooltipEl);
          updateTooltipPosition(wrapper, tooltipTarget, tooltipEl);
        }
      }, 300);
    });
    tooltipTarget.addEventListener('pointerdown', function (e) {
      /* The tooltip should appear after pressing down for a while on the element.
         Use the 'js-pressed' class as a flag to check, if the element stays pressed
         down. */
      tooltipTarget.classList.add('js-pressed');
      setTimeout(function () {
        if (tooltipTarget.classList.contains('js-pressed')) {
          showTooltip(wrapper, tooltipTarget, tooltipEl);
          updateTooltipPosition(wrapper, tooltipTarget, tooltipEl);
        }
      }, 500);
    });
    tooltipTarget.addEventListener('mouseleave', function (e) {
      tooltipTarget.classList.remove('js-hover');
      tooltipTarget.classList.remove('js-pressed');
      let center = (tooltipTarget.getBoundingClientRect().top + tooltipTarget.getBoundingClientRect().bottom) / 2; // Use center of target due to rounding errors
      let onTooltip = false;
      if (wrapper.classList.contains('place-above')) {
        onTooltip = tooltipTarget.getBoundingClientRect().left <= e.clientX && e.clientX <= tooltipTarget.getBoundingClientRect().right && e.clientY <= center;
      } else if (wrapper.classList.contains('place-below')) {
        onTooltip = tooltipTarget.getBoundingClientRect().left <= e.clientX && e.clientX <= tooltipTarget.getBoundingClientRect().right && e.clientY >= center;
      }
      /* WCAG 1.4.13: It must be possible to hover on the tooltip */
      if (!onTooltip) {
        hideTooltip(wrapper, tooltipTarget, tooltipEl);
      }
    });
    tooltipTarget.addEventListener('click', function (e) {
      tooltipTarget.classList.remove('js-pressed');
      if (document.activeElement !== tooltipTarget) {
        /* The tooltip target was just clicked but is not the element with focus. That 
           means it probably shouldn't show the tooltip, for example due to an opened 
           modal. However, this also means that tooltip targets in Safari won't show 
           tooltip on click, since click events in Safari don't focus the target. */
        tooltipTarget.classList.remove('js-hover');
        hideTooltip(wrapper, tooltipTarget, tooltipEl);
      }
    });
    tooltipEl.addEventListener('mouseleave', function (e) {
      tooltipTarget.classList.remove('js-hover');
      tooltipTarget.classList.remove('js-pressed');
      let center = (tooltipEl.getBoundingClientRect().top + tooltipEl.getBoundingClientRect().bottom) / 2; // Use center of tooltip due to rounding errors
      let onTarget = false;
      if (wrapper.classList.contains('place-above')) {
        onTarget = tooltipEl.getBoundingClientRect().left <= e.clientX && e.clientX <= tooltipEl.getBoundingClientRect().right && e.clientY >= center;
      } else if (wrapper.classList.contains('place-below')) {
        onTarget = tooltipEl.getBoundingClientRect().left <= e.clientX && e.clientX <= tooltipEl.getBoundingClientRect().right && e.clientY <= center;
      }
      /* Don't remove tooltip if hover returns to the target which triggered the tooltip */
      if (!onTarget) {
        hideTooltip(wrapper, tooltipTarget, tooltipEl);
      }
    });

    /* If the mouse leaves while in the gap between the target and the tooltip,
       ensure that the tooltip closes */
    wrapper.addEventListener('mouseleave', function (e) {
      tooltipTarget.classList.remove('js-hover');
      tooltipTarget.classList.remove('js-pressed');
      hideTooltip(wrapper, tooltipTarget, tooltipEl);
    });
  }
  /* The "tooltip" is actually a "toggletip", i.e. a button which turns a tip on or off */else {
    let live_region = document.createElement('span');
    live_region.setAttribute('aria-live', 'assertive');
    live_region.setAttribute('aria-atomic', 'true');
    wrapper.append(live_region);
    live_region.append(tooltipEl);
    appendArrow(wrapper);
    tooltipTarget.setAttribute('aria-expanded', 'false');
    tooltipTarget.setAttribute('aria-controls', wrapper.dataset.tooltipId);
    tooltipTarget.addEventListener('click', function () {
      if (wrapper.classList.contains('hide-tooltip')) {
        showTooltip(wrapper, tooltipTarget, tooltipEl);
        updateTooltipPosition(wrapper, tooltipTarget, tooltipEl);
      } else {
        hideTooltip(wrapper, tooltipTarget, tooltipEl);
      }
    });
  }
};
function appendArrow(tooltipWrapper) {
  let arrow = document.createElement('span');
  arrow.classList.add('tooltip-arrow');
  arrow.setAttribute('aria-hidden', true);
  tooltipWrapper.append(arrow);
}
function setWidth(tooltipEl) {
  tooltipEl.style.width = 'max-content';
  let WCAG_Reflow_criteria = 320; // Width of 320 px defined in WCAG 2.1, Criterion 1.4.10 "Reflow"
  let accessibleMaxWidth = WCAG_Reflow_criteria - MIN_MARGIN * 2;
  if (parseInt(window.getComputedStyle(tooltipEl).width) > accessibleMaxWidth) {
    tooltipEl.style.width = accessibleMaxWidth + 'px';
  }
  let screenMaxWidth = document.body.clientWidth - MIN_MARGIN * 2;
  if (parseInt(window.getComputedStyle(tooltipEl).width) > screenMaxWidth) {
    tooltipEl.style.width = screenMaxWidth + 'px';
  }
}
function placeAboveOrBelow(tooltipWrapper, tooltipTarget, tooltipEl) {
  let spaceAbove = tooltipTarget.getBoundingClientRect().top;
  let spaceBelow = window.innerHeight - tooltipTarget.getBoundingClientRect().bottom;
  let height = tooltipEl.getBoundingClientRect().height + ARROW_DISTANCE_TO_TARGET + ARROW_HEIGHT;
  let placement = 'above'; // Default placement
  if (tooltipWrapper.dataset.position === 'below' && spaceBelow >= height || height > spaceAbove && height <= spaceBelow) {
    placement = 'below';
  }
  if (placement === 'above') {
    tooltipWrapper.classList.add('place-above');
    tooltipWrapper.classList.remove('place-below');
  } else if (placement === 'below') {
    tooltipWrapper.classList.add('place-below');
    tooltipWrapper.classList.remove('place-above');
  }
}
function setLeft(tooltipTarget, tooltipEl) {
  /* Center the tooltip on the tooltip arrow */
  let left = (parseInt(tooltipTarget.getBoundingClientRect().width) - parseInt(tooltipEl.getBoundingClientRect().width)) / 2;
  tooltipEl.style.left = left + 'px';
  /* If the tooltip exceeds the left side of the screen, adjust it */
  if (tooltipEl.getBoundingClientRect().left < MIN_MARGIN) {
    let adjustedLeft = 0 - parseInt(tooltipTarget.getBoundingClientRect().left) + MIN_MARGIN;
    tooltipEl.style.left = adjustedLeft + 'px';
  }
  /* If the tooltip exceeds the right side of the screen, adjust it */else if (tooltipEl.getBoundingClientRect().right > document.body.clientWidth - MIN_MARGIN) {
    let adjustedLeft = parseInt(window.getComputedStyle(tooltipEl).left) - (tooltipEl.getBoundingClientRect().right - document.body.clientWidth + MIN_MARGIN);
    tooltipEl.style.left = adjustedLeft + 'px';
  }
}
function setBottomAndTop(tooltipWrapper, tooltipEl) {
  let total = 0 - tooltipEl.getBoundingClientRect().height - ARROW_HEIGHT - ARROW_DISTANCE_TO_TARGET + 1;
  if (tooltipWrapper.classList.contains('place-above')) {
    tooltipEl.style.top = total + 'px';
    tooltipEl.style.bottom = 'auto';
  } else if (tooltipWrapper.classList.contains('place-below')) {
    tooltipEl.style.bottom = total + 'px';
    tooltipEl.style.top = 'auto';
  }
}
function updateTooltipPosition(tooltipWrapper, tooltipTarget, tooltipEl) {
  setWidth(tooltipEl);
  placeAboveOrBelow(tooltipWrapper, tooltipTarget, tooltipEl);
  setLeft(tooltipTarget, tooltipEl);
  setBottomAndTop(tooltipWrapper, tooltipEl);
}
function hideTooltip(tooltipWrapper, tooltipTarget, tooltipEl) {
  tooltipWrapper.classList.add('hide-tooltip');
  if (tooltipTarget.hasAttribute('aria-expanded')) {
    tooltipTarget.setAttribute('aria-expanded', 'false');
    tooltipEl.innerText = "";
  }
}
function showTooltip(tooltipWrapper, tooltipTarget, tooltipEl) {
  tooltipWrapper.classList.remove('hide-tooltip');
  if (tooltipTarget.hasAttribute('aria-expanded')) {
    tooltipTarget.setAttribute('aria-expanded', 'true');
    tooltipEl.innerText = tooltipWrapper.dataset.tooltip;
  }
}
function closeAllTooltips(event) {
  let tooltips = document.getElementsByClassName('tooltip-wrapper');
  for (let t = 0; t < tooltips.length; t++) {
    let wrapper = tooltips[t];
    let target = wrapper.getElementsByClassName('tooltip-target')[0];
    let tooltip = wrapper.getElementsByClassName('tooltip')[0];
    let clickedOnTarget = target.getBoundingClientRect().left <= event.clientX && event.clientX <= target.getBoundingClientRect().right && target.getBoundingClientRect().top <= event.clientY && event.clientY <= target.getBoundingClientRect().bottom;
    let clickedOnTooltip = window.getComputedStyle(tooltip).display !== 'none' && tooltip.getBoundingClientRect().left <= event.clientX && event.clientX <= tooltip.getBoundingClientRect().right && tooltip.getBoundingClientRect().top <= event.clientY && event.clientY <= tooltip.getBoundingClientRect().bottom;
    if (!clickedOnTarget && target !== document.activeElement && !clickedOnTooltip) {
      hideTooltip(wrapper, target, tooltip);
    }
  }
}
function closeOnTab(e) {
  let key = e.key;
  let tooltips = document.getElementsByClassName('tooltip-wrapper');
  if (key === 'Tab') {
    for (let t = 0; t < tooltips.length; t++) {
      let wrapper = tooltips[t];
      let target = wrapper.getElementsByClassName('tooltip-target')[0];
      let tooltip = wrapper.getElementsByClassName('tooltip')[0];
      /* If the user is tabbing to an element, where a tooltip already is open,
         keep it open */
      if (document.activeElement !== target) {
        hideTooltip(wrapper, target, tooltip);
      }
    }
  } else if (key === 'Escape') {
    for (let t = 0; t < tooltips.length; t++) {
      let wrapper = tooltips[t];
      let target = wrapper.getElementsByClassName('tooltip-target')[0];
      let tooltip = wrapper.getElementsByClassName('tooltip')[0];
      hideTooltip(wrapper, target, tooltip);
    }
  }
}
/* harmony default export */ const components_tooltip = (Tooltip);
;// CONCATENATED MODULE: ./src/js/custom-elements/fds-input/fds-input.js








class FDSInput extends HTMLElement {
  /* Private instance fields */

  #wrapperElement;
  #labelElement;
  #tooltipElement;
  #helptextElement;
  #errorElement;
  #editWrapperElement;
  #inputWrapperElement;
  #prefixElement;
  #inputElement;
  #suffixElement;
  #editButtonElement;
  #characterLimitElement;
  #handleEditClicked;
  #handleKeyUp;
  #handleBlur;
  #handleFocus;
  #handlePageShow;
  #glossary;
  #connected;
  #initialized;
  #triggerRebuild;
  #lastKeyUpTimestamp;
  #oldValue;
  #intervalID;

  /* Private methods */

  #init() {
    if (!this.#initialized) {
      this.#wrapperElement = createWrapperElement();
      this.#labelElement = createLabelElement();
      this.#tooltipElement = createTooltipElement(this.#glossary);
      this.#helptextElement = createHelptextElement();
      this.#errorElement = createErrorElement();
      this.#editWrapperElement = createEditWrapperElement();
      this.#inputWrapperElement = createInputWrapperElement();
      this.#prefixElement = createPrefixElement();
      this.#inputElement = createInputElement();
      this.#suffixElement = createSuffixElement();
      this.#editButtonElement = createEditButtonElement(this.#handleEditClicked);
      this.#characterLimitElement = createCharacterLimitElement();
      this.#initialized = true;
    }
  }
  #rebuildElement() {
    // Reset HTML
    this.#wrapperElement.innerHTML = '';
    this.#inputWrapperElement.innerHTML = '';
    this.#inputElement.removeAttribute('aria-describedby');
    if (isValidText(this.label)) {
      this.#labelElement.textContent = this.label;
    }

    // Update IDs
    setHelptextId(this.#helptextElement, this.#inputElement);
    setErrorId(this.#errorElement, this.#inputElement);
    setCharacterLimitId(this.#characterLimitElement, this.#inputElement);
    setTooltipId(this.#tooltipElement, this.#inputElement);

    // Set up aria-describedby attribute
    setInputAriaDescribedBy(this.error, this.helptext, this.maxchar, this.#errorElement, this.#helptextElement, this.#characterLimitElement, this.#inputElement);

    // Set up edit button
    if (this.hasAttribute('editbutton') && isValidText(this.label)) {
      updateEditButton(this.#editButtonElement, this.label, this.#glossary['editText']);
    }

    // Update error message
    if (isValidText(this.error)) {
      updateErrorMessage(this.#errorElement, this.error, this.#glossary['errorText']);
    }

    // Add label
    if (isValidText(this.label)) {
      this.#wrapperElement.appendChild(this.#labelElement);
    }

    // Add 'required' label
    if (this.hasAttribute('showrequired') && isValidText(this.label)) {
      updateRequiredLabel(this.#labelElement, this.label, this.#glossary['requiredText']);
    }

    // Add 'optional' label
    if (this.hasAttribute('showoptional') && isValidText(this.label)) {
      updateOptionalLabel(this.#labelElement, this.label, this.#glossary['optionalText']);
    }

    // Add tooltip
    if (isValidText(this.tooltip)) {
      this.#wrapperElement.appendChild(this.#tooltipElement);
      if (this.#tooltipElement.querySelector('.tooltip-arrow') === null) {
        new components_tooltip(this.#tooltipElement).init();
      }
    }

    // Add helptext
    if (isValidText(this.helptext)) {
      this.#wrapperElement.appendChild(this.#helptextElement);
    }

    // Add error message
    if (isValidText(this.error)) {
      this.#wrapperElement.appendChild(this.#errorElement);
    }

    // Add wrapper for edit button
    if (this.hasAttribute('editbutton') && this.hasAttribute('readonly')) {
      this.#wrapperElement.appendChild(this.#editWrapperElement);
    }

    // Add wrapper for prefix and suffix
    if (isValidText(this.prefix) || isValidText(this.suffix)) {
      if (this.hasAttribute('editbutton') && this.hasAttribute('readonly')) {
        this.#editWrapperElement.appendChild(this.#inputWrapperElement);
      } else {
        this.#wrapperElement.appendChild(this.#inputWrapperElement);
      }
    }

    // Add prefix
    if (isValidText(this.prefix)) {
      this.#inputWrapperElement.appendChild(this.#prefixElement);
    }

    // Add input
    if (isValidText(this.label)) {
      if (isValidText(this.prefix) || isValidText(this.suffix)) {
        this.#inputWrapperElement.appendChild(this.#inputElement);
      } else if (this.hasAttribute('editbutton') && this.hasAttribute('readonly')) {
        this.#editWrapperElement.appendChild(this.#inputElement);
      } else {
        this.#wrapperElement.appendChild(this.#inputElement);
      }
    }

    // Add suffix
    if (isValidText(this.suffix)) {
      this.#inputWrapperElement.appendChild(this.#suffixElement);
    }

    // Add edit button
    if (this.hasAttribute('editbutton') && this.hasAttribute('readonly')) {
      this.#editWrapperElement.appendChild(this.#editButtonElement);
    }

    // Add character limit
    if (isValidInteger(this.maxchar)) {
      this.#wrapperElement.appendChild(this.#characterLimitElement);
    }
  }
  #removeReadOnly() {
    if (this.hasAttribute('readonly')) {
      this.removeAttribute('readonly');
      this.#inputElement.focus();
      let eventEditClicked = new Event('fds-edit-clicked');
      this.dispatchEvent(eventEditClicked);
    }
  }

  /* Attributes which can invoke attributeChangedCallback() */

  static observedAttributes = ['autocomplete', 'disabled', 'editbutton', 'error', 'helptext', 'inputid', 'label', 'maxchar', 'maxwidth', 'name', 'prefix', 'readonly', 'required', 'showoptional', 'showrequired', 'suffix', 'tooltip', 'type', 'value'];

  /*
  --------------------------------------------------
  ATTRIBUTE GETTERS AND SETTERS
  --------------------------------------------------
  */

  get autocomplete() {
    return this.getAttribute('autocomplete');
  }
  set autocomplete(val) {
    this.setAttribute('autocomplete', val);
  }
  get disabled() {
    return this.getAttribute('disabled');
  }
  set disabled(val) {
    this.setAttribute('disabled', val);
  }
  get editbutton() {
    return this.getAttribute('editbutton');
  }
  set editbutton(val) {
    this.setAttribute('editbutton', val);
  }
  get error() {
    return this.getAttribute('error');
  }
  set error(val) {
    this.setAttribute('error', val);
  }
  get helptext() {
    return this.getAttribute('helptext');
  }
  set helptext(val) {
    this.setAttribute('helptext', val);
  }
  get inputid() {
    return this.getAttribute('inputid');
  }
  set inputid(val) {
    this.setAttribute('inputid', val);
  }
  get label() {
    return this.getAttribute('label');
  }
  set label(val) {
    this.setAttribute('label', val);
  }
  get maxchar() {
    return this.getAttribute('maxchar');
  }
  set maxchar(val) {
    this.setAttribute('maxchar', val);
  }
  get maxwidth() {
    return this.getAttribute('maxwidth');
  }
  set maxwidth(val) {
    this.setAttribute('maxwidth', val);
  }
  get name() {
    return this.getAttribute('name');
  }
  set name(val) {
    this.setAttribute('name', val);
  }
  get prefix() {
    return this.getAttribute('prefix');
  }
  set prefix(val) {
    this.setAttribute('prefix', val);
  }
  get readonly() {
    return this.getAttribute('readonly');
  }
  set readonly(val) {
    this.setAttribute('readonly', val);
  }
  get required() {
    return this.getAttribute('required');
  }
  set required(val) {
    this.setAttribute('required', val);
  }
  get showoptional() {
    return this.getAttribute('showoptional');
  }
  set showoptional(val) {
    this.setAttribute('showoptional', val);
  }
  get showrequired() {
    return this.getAttribute('showrequired');
  }
  set showrequired(val) {
    this.setAttribute('showrequired', val);
  }
  get suffix() {
    return this.getAttribute('suffix');
  }
  set suffix(val) {
    this.setAttribute('suffix', val);
  }
  get tooltip() {
    return this.getAttribute('tooltip');
  }
  set tooltip(val) {
    this.setAttribute('tooltip', val);
  }
  get type() {
    return this.getAttribute('type');
  }
  set type(val) {
    this.setAttribute('type', val);
  }
  get value() {
    return this.#inputElement.value;
  }
  set value(val) {
    this.#inputElement.value = val;
  }

  /*
  --------------------------------------------------
  CUSTOM ELEMENT CONSTRUCTOR (do not access or add attributes in the constructor)
  --------------------------------------------------
  */

  constructor() {
    super();
    this.#initialized = false;
    this.#connected = false;
    this.#glossary = glossary;
    this.#triggerRebuild = ['label', 'inputid', 'required', 'disabled', 'readonly', 'helptext', 'error', 'prefix', 'suffix', 'editbutton', 'showrequired', 'showoptional', 'maxchar', 'tooltip'];
    this.#lastKeyUpTimestamp = null;
    this.#oldValue = '';
    this.#intervalID = null;
    this.#handleEditClicked = () => {
      this.#removeReadOnly();
    };
    this.#handleKeyUp = () => {
      let chars = this.charactersLeft();
      updateVisibleMessage(this.#glossary, chars, this.#inputElement, this.#characterLimitElement);
      this.#lastKeyUpTimestamp = Date.now();
    };
    this.#handleFocus = () => {
      /* Reset the screen reader message on focus to force an update of the message.
      This ensures that a screen reader informs the user of how many characters there is left
      on focus and not just what the character limit is. */
      if (this.#inputElement.value !== "") {
        let srMessage = this.#characterLimitElement.querySelector('.sr-message');
        srMessage.innerHTML = '';
      }
      this.#intervalID = setInterval(function () {
        /* Don't update the Screen Reader message unless it's been awhile
        since the last key up event. Otherwise, the user will be spammed
        with audio notifications while typing. */
        if (!this.#lastKeyUpTimestamp || Date.now() - 500 >= this.#lastKeyUpTimestamp) {
          let srMessage = this.#characterLimitElement.querySelector('.sr-message').innerHTML;
          let visibleMessage = this.#characterLimitElement.querySelector('.visible-message').innerHTML;

          /* Don't update the messages unless the input has changed or if there
          is a mismatch between the visible message and the screen reader message. */
          if (this.#oldValue !== this.#inputElement.value || srMessage !== visibleMessage) {
            this.#oldValue = this.#inputElement.value;
            this.updateMessages();
          }
        }
      }.bind(this), 1000);
    };
    this.#handleBlur = () => {
      clearInterval(this.#intervalID);
      // Don't update the messages on blur unless the value of the textarea/text input has changed
      if (this.#oldValue !== this.#inputElement.value) {
        this.#oldValue = this.#inputElement.value;
        this.updateMessages();
      }
    };
    this.#handlePageShow = () => {
      this.updateMessages();
    };
  }

  /*
  --------------------------------------------------
  CUSTOM ELEMENT FUNCTIONS
  --------------------------------------------------
  */

  getLabelElement() {
    return this.#labelElement;
  }
  getInputElement() {
    return this.#inputElement;
  }
  updateGlossary(newGlossary) {
    updateGlossary(this.#glossary, newGlossary);

    /* Check if the old text is (potentially) visible to the user */
    let updateErrorTextNow = newGlossary['errorText'] !== undefined && isValidText(this.error);
    let updateEditTextNow = newGlossary['editText'] !== undefined && isValidText(this.label) && this.hasAttribute('editbutton');
    let updateRequiredTextNow = newGlossary['requiredText'] !== undefined && isValidText(this.label) && this.hasAttribute('showrequired');
    let updateOptionalTextNow = newGlossary['optionalText'] !== undefined && isValidText(this.label) && this.hasAttribute('showoptional');
    let updateCharactersTextNow = newGlossary['oneCharacterLeftText'] || newGlossary['manyCharactersLeftText'] || newGlossary['oneCharacterExceededText'] || newGlossary['manyCharactersExceededText'];
    let updateMaxCharactersTextNow = newGlossary['maxCharactersText'] !== undefined && isValidInteger(this.maxchar);
    let updateTooltipIconText = newGlossary['tooltipIconText'] !== undefined;

    /* If the old text is visible to the user, update it immediately */
    if (updateErrorTextNow) {
      updateErrorMessage(this.#errorElement, this.error, this.#glossary['errorText']);
    }
    if (updateEditTextNow) {
      updateEditButton(this.#editButtonElement, this.label, this.#glossary['editText']);
    }
    if (updateRequiredTextNow) {
      updateRequiredLabel(this.#labelElement, this.label, this.#glossary['requiredText']);
    }
    if (updateOptionalTextNow) {
      updateOptionalLabel(this.#labelElement, this.label, this.#glossary['optionalText']);
    }
    if (updateCharactersTextNow) {
      /* Prevent screen readers from announcing the glossary change */
      let maxLimitText = this.#characterLimitElement.querySelector('.max-limit').innerHTML;
      this.#characterLimitElement.innerHTML = '<span class="max-limit">' + maxLimitText + '</span>' + '<span class="visible-message form-hint" aria-hidden="true"></span>' + '<span class="sr-message"></span>';
      this.updateMessages();
      this.#characterLimitElement.querySelector('.sr-message').setAttribute('aria-live', 'polite');
    }
    if (updateMaxCharactersTextNow) {
      this.#characterLimitElement.querySelector('.max-limit').innerHTML = this.#glossary['maxCharactersText'].replace(/{value}/, this.maxchar);
    }
    if (updateTooltipIconText) {
      this.#tooltipElement.querySelector('button').setAttribute('aria-label', this.#glossary['tooltipIconText']);
    }
  }
  charactersLeft() {
    if (isValidInteger(this.maxchar)) {
      let currentLength = this.#inputElement.value.length;
      return parseInt(this.maxchar) - currentLength;
    } else {
      return undefined;
    }
  }
  updateMessages() {
    if (isValidInteger(this.maxchar)) {
      let chars = this.charactersLeft();
      updateVisibleMessage(this.#glossary, chars, this.#inputElement, this.#characterLimitElement);
      updateSRMessage(this.#glossary, chars, this.#characterLimitElement);
    }
  }

  /*
  --------------------------------------------------
  CUSTOM ELEMENT ADDED TO DOCUMENT
  --------------------------------------------------
  */

  connectedCallback() {
    /* Element setup. Only called at this point if the element was created without attributes. */
    this.#init();

    /* Remove any initial content from the custom element */
    this.innerHTML = '';

    /* Ensure input always has an ID and type */
    if (!isValidText(this.inputid)) {
      setDefaultInputId(this.#labelElement, this.#inputElement);
    }
    if (!isValidType(this.type)) {
      setDefaultType(this.#inputElement);
    }
    this.#rebuildElement();
    this.appendChild(this.#wrapperElement);
    if (isValidInteger(this.maxchar)) {
      this.#inputElement.addEventListener('keyup', this.#handleKeyUp, false);
      this.#inputElement.addEventListener('focus', this.#handleFocus, false);
      this.#inputElement.addEventListener('blur', this.#handleBlur, false);
      window.addEventListener('pageshow', this.#handlePageShow, false);
    }
    this.#connected = true;
  }

  /* 
  --------------------------------------------------
  CUSTOM ELEMENT REMOVED FROM DOCUMENT
  --------------------------------------------------
  */

  disconnectedCallback() {}

  /*
  --------------------------------------------------
  CUSTOM ELEMENT'S ATTRIBUTE(S) CHANGED
  --------------------------------------------------
  */

  attributeChangedCallback(attribute, oldValue, newValue) {
    /* Element setup. Applied once on the first call to attributeChangedCallback() before connectedCallback(). */

    this.#init();

    /* Attribute changes (editbutton, showoptional, and showrequired handled in rebuild step) */

    if (attribute === 'autocomplete') {
      autocomplete(newValue, this.#inputElement);
    }
    if (attribute === 'disabled') {
      disabled(newValue, this.#labelElement, this.#inputElement, this.#inputWrapperElement);
    }
    if (attribute === 'error') {
      error(newValue, this.#wrapperElement, this.#inputElement);
    }
    if (attribute === 'helptext') {
      helptext(newValue, this.#helptextElement);
    }
    if (attribute === 'inputid') {
      inputid(newValue, this.#labelElement, this.#inputElement);
    }
    if (attribute === 'label') {
      label(newValue, this.#labelElement);
    }
    if (attribute === 'maxchar') {
      maxchar(newValue, this.#inputElement, this.#characterLimitElement, this.#connected, this.#glossary, this.#handleKeyUp, this.#handleFocus, this.#handleBlur, this.#handlePageShow, this.value, this.contains(this.#characterLimitElement));
    }
    if (attribute === 'maxwidth') {
      maxwidth(newValue, this.#inputElement);
    }
    if (attribute === 'name') {
      fds_input_attribute_changes_name(newValue, this.#inputElement);
    }
    if (attribute === 'prefix') {
      prefix(newValue, this.#inputWrapperElement, this.#prefixElement);
    }
    if (attribute === 'readonly') {
      readonly(newValue, this.#inputElement, this.#inputWrapperElement);
    }
    if (attribute === 'required') {
      required(newValue, this.#inputElement);
    }
    if (attribute === 'suffix') {
      suffix(newValue, this.#inputWrapperElement, this.#suffixElement);
    }
    if (attribute === 'tooltip') {
      tooltip(newValue, this.#tooltipElement);
    }
    if (attribute === 'type') {
      type(newValue, this.#inputElement);
    }
    if (attribute === 'value') {
      value(newValue, this.#inputElement, this.#characterLimitElement, this.#connected, this.#glossary, this.maxchar);
    }

    /* Update HTML */

    if (this.#triggerRebuild.includes(attribute) && this.#initialized && this.#connected) {
      this.#rebuildElement();
    }
  }
}
/* harmony default export */ const fds_input = (FDSInput);
;// CONCATENATED MODULE: ./src/js/dkfds-custom-elements.js

if (customElements.get('fds-input') === undefined) {
  window.customElements.define('fds-input', fds_input);
}
/******/ })()
;
//# sourceMappingURL=dkfds-custom-elements.js.map