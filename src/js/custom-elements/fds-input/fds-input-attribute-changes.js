'use strict';

import {isValidText, isValidInteger, isValidType} from './fds-input-attribute-validators';
import * as Helpers from './fds-input-helpers';

export function autocomplete(newValue, inputElement) {
    // Attribute changed to valid value
    if (isValidText(newValue)) {
        inputElement.setAttribute('autocomplete', newValue);
    }
    // Attribute removed or invalid value
    else {
        inputElement.removeAttribute('autocomplete');
    }
}

export function disabled(newValue, labelElement, inputElement, inputWrapperElement) {
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

export function error(newValue, wrapperElement, inputElement) {
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

export function helptext(newValue, helptextElement) {
    // Attribute changed to valid value
    if (isValidText(newValue)) {
        helptextElement.textContent = newValue;
    }
    // Attribute removed or invalid value
    else {
        helptextElement.textContent = '';
    }
}

export function inputid(newValue, labelElement, inputElement) {
    // Attribute changed to valid value
    if (isValidText(newValue)) {
        labelElement.setAttribute('for', newValue);
        inputElement.setAttribute('id', newValue);
    }
    // Attribute removed or invalid value
    else {
        Helpers.setDefaultInputId(labelElement, inputElement);
    }
}

export function label(newValue, labelElement) {
    if (isValidText(newValue)) {
        labelElement.textContent = newValue;
    }
}

export function maxchar(newValue, inputElement, characterLimitElement, connected, glossary, handleKeyUp, handleFocus, handleBlur, handlePageShow, value, containsCharacterLimit) {
    // Attribute changed
    if (isValidInteger(newValue)) {
        characterLimitElement.querySelector('.max-limit').innerHTML = glossary['maxCharactersText'].replace(/{value}/, newValue);

        let charactersRemaining = newValue;
        if (value) {
            charactersRemaining = parseInt(newValue) - value.length;
        }
        Helpers.updateVisibleMessage(glossary, charactersRemaining, inputElement, characterLimitElement);
        Helpers.updateSRMessage(glossary, charactersRemaining, characterLimitElement);
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

export function maxwidth(newValue, inputElement) {
    // Attribute changed
    if (isValidInteger(newValue)) {
        let paddingPixels = 30; // Input padding-left and padding-right are 15px
        let borderPixels =   4; // Input border-left and border-right are 2px (worst case)
        inputElement.style.maxWidth = 'calc(' + parseInt(newValue) + 'ch + ' + (paddingPixels + borderPixels) + 'px)';  
        inputElement.style.width = '100%';
    }
    // Attribute removed
    else {
        inputElement.style.maxWidth = '';
        inputElement.style.width = '';
    }
}

export function name(newValue, inputElement) {
    if (isValidText(newValue)) {
        inputElement.setAttribute('name', newValue);
    }
}

export function prefix(newValue, inputWrapperElement, prefixElement) {
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

export function readonly(newValue, inputElement, inputWrapperElement) {
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

export function required(newValue, inputElement) {
    // Attribute changed
    if (newValue !== null) {
        inputElement.setAttribute('required', '');
    }
    // Attribute removed
    else {
        inputElement.removeAttribute('required');
    }
}

export function suffix(newValue, inputWrapperElement, suffixElement) {
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

export function tooltip(newValue, tooltipElement) {
    // Attribute changed
    if (isValidText(newValue)) {
        tooltipElement.dataset.tooltip = newValue;
    }
}

export function type(newValue, inputElement) {
    if (isValidType(newValue)) {
        inputElement.setAttribute('type', newValue);
    }
    else {
        Helpers.setDefaultType(inputElement);
    }
}

export function value(newValue, inputElement, characterLimitElement, connected, glossary, maxchar) {
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
        Helpers.updateVisibleMessage(glossary, chars, inputElement, characterLimitElement);
        Helpers.updateSRMessage(glossary, chars, characterLimitElement);
    }
}