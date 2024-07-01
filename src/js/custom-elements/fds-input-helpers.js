'use strict';

import isNonEmptyString from '../utils/is-non-empty-string';

/* 
FUNCTIONS FOR DEFAULT SETTINGS
*/

export function setDefaultInputId(labelElement, inputElement) {
    let randomString = 'input-' + Date.now().toString().slice(-3) + Math.floor(Math.random() * 1000000).toString();
    labelElement.setAttribute('for', randomString);
    inputElement.setAttribute('id', randomString);
}

export function setDefaultType(inputElement) {
    inputElement.setAttribute('type', 'text');
}

/* 
FUNCTIONS FOR VALIDATING ATTRIBUTES 
*/

export function isValidType(type) {
    const TYPES = ['text', 'email', 'number', 'password', 'tel', 'url'];

    if (TYPES.includes(type)) { 
        return true; 
    }
    else { 
        return false; 
    }
}

/* 
REMAINING HELPERS
*/

export function setHelptextId(helptextElement, inputElement) {
    helptextElement.id = inputElement.id + '-helptext';
}

export function setErrorId(errorElement, inputElement) {
    errorElement.id = inputElement.id + '-error';
}

export function updateErrorMessage(errorElement, errorText, srText) {
    errorElement.innerHTML = '<span class="sr-only">' + srText + ': </span>' + errorText;
}

export function updateEditButton(editButtonElement, labelText, editText) {
    editButtonElement.innerHTML = '<svg class="icon-svg" focusable="false" aria-hidden="true"><use xlink:href="#mode"></use></svg>' + editText + '<span class="sr-only"> ' + labelText + '</span>';
}

export function updateRequiredLabel(labelElement, labelText, requiredText) {
    labelElement.innerHTML = labelText + '<span class="weight-normal"> (*' + requiredText + ')</span>';
}

export function updateOptionalLabel(labelElement, labelText, optionalText) {
    labelElement.innerHTML = labelText + '<span class="weight-normal"> (' + optionalText + ')</span>';
}

export function checkDisallowedCombinations(hasError, isRequired, isReadonly, isDisabled, showRequired, showOptional) {
    let isOptional = !isRequired;
    if (hasError && isDisabled) {
        throw new Error(`'error' and 'disabled' attributes both present on fds-input.`);
    }
    if (hasError && isReadonly) {
        throw new Error(`'error' and 'readonly' attributes both present on fds-input.`);
    }
    if (isRequired && isDisabled) {
        throw new Error(`'required' and 'disabled' attributes both present on fds-input.`);
    }
    if (isRequired && isReadonly) {
        throw new Error(`'required' and 'readonly' attributes both present on fds-input.`);
    }
    if (isOptional && showRequired) {
        throw new Error(`'required' label displayed on optional fds-input.`);
    }
    if (isRequired && showOptional) {
        throw new Error(`'optional' label displayed on required fds-input.`);
    }
    if (showRequired && showOptional) {
        throw new Error(`Both 'optional' and 'required' labels displayed on fds-input.`);
    }
}