'use strict';

import {isNonEmptyString, isValidInteger, isValidType} from './fds-input-attribute-validators';
import * as Helpers from './fds-input-helpers';

export function autocomplete(newValue, inputElement) {
    // Attribute changed to valid value
    if (isNonEmptyString(newValue)) {
        inputElement.setAttribute('autocomplete', newValue);
    }
    // Attribute removed or invalid value
    else {
        inputElement.removeAttribute('autocomplete');
    }
}

export function disabled(newValue, labelElement, inputElement) {
    // Attribute changed
    if (newValue !== null) {
        labelElement.classList.add('disabled');
        inputElement.setAttribute('disabled', '');
    }
    // Attribute removed
    else {
        labelElement.classList.remove('disabled');
        inputElement.removeAttribute('disabled');
    }
}

export function editbutton() { }

export function error(newValue, wrapperElement, inputElement) {
    // Attribute changed
    if (isNonEmptyString(newValue)) {
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
    if (isNonEmptyString(newValue)) {
        helptextElement.textContent = newValue;
    }
    // Attribute removed or invalid value
    else {
        helptextElement.textContent = '';
    }
}

export function inputid(newValue, labelElement, inputElement) {
    // Attribute changed to valid value
    if (isNonEmptyString(newValue)) {
        labelElement.setAttribute('for', newValue);
        inputElement.setAttribute('id', newValue);
    }
    // Attribute removed or invalid value
    else {
        Helpers.setDefaultInputId(labelElement, inputElement);
    }
}

export function label(newValue, labelElement) {
    // Attribute changed
    if (newValue !== null) {
        if (isNonEmptyString(newValue)) {
            labelElement.textContent = newValue;
        }
        else {
            throw new Error(`Invalid label attribute '${newValue}'.`);
        }
    }
    // Do nothing on attribute removed to avoid throwing an error in those  
    // rare cases where two calls are made to attributeChangedCallback()
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
    // Attribute changed
    if (newValue !== null) {
        if (isNonEmptyString(newValue)) {
            inputElement.setAttribute('name', newValue);
        }
        else {
            throw new Error(`Invalid name attribute '${newValue}'.`);
        }
    }
    // Do nothing on attribute removed to avoid throwing an error in those  
    // rare cases where two calls are made to attributeChangedCallback()
}

export function prefix(newValue, inputWrapperElement, prefixElement) {
    // Attribute changed to valid value
    if (isNonEmptyString(newValue)) {
        inputWrapperElement.classList.add('form-input-wrapper--prefix');
        prefixElement.textContent = newValue;
    }
    // Attribute removed or invalid value
    else {
        inputWrapperElement.classList.remove('form-input-wrapper--prefix');
    }
}

export function readonly(newValue, inputElement) {
    // Attribute changed
    if (newValue !== null) {
        inputElement.setAttribute('readonly', '');
    }
    // Attribute removed
    else {
        inputElement.removeAttribute('readonly');
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

export function showoptional() { }

export function showrequired() { }

export function suffix(newValue, inputWrapperElement, suffixElement) {
    // Attribute changed
    if (isNonEmptyString(newValue)) {
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
    if (isNonEmptyString(newValue)) {
        tooltipElement.dataset.tooltip = newValue;
    }
}

export function type(newValue, inputElement) {
    // Attribute changed to text
    if (isNonEmptyString(newValue)) {
        if (isValidType(newValue)) {
            inputElement.setAttribute('type', newValue);
        }
        else {
            throw new Error(`Invalid type attribute '${newValue}'.`);
        }
    }
    // Attribute removed or changed to non-text
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