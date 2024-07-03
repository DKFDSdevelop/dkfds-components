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

export function isValidMaxChar(maxchar) {
    let number = parseInt(maxchar);
    return Number.isInteger(number);
}

/* 
CHARACTER LIMIT
*/

function characterLimitMessage(glossary, charactersLeft) {
    let message = "";

    if (charactersLeft === -1) {
        let exceeded = Math.abs(charactersLeft);
        message = glossary['oneCharacterExceededText'].replace(/{value}/, exceeded);
    }
    else if (charactersLeft === 1) {
        message = glossary['oneCharacterLeftText'].replace(/{value}/, charactersLeft);
    }
    else if (charactersLeft >= 0) {
        message = glossary['manyCharactersLeftText'].replace(/{value}/, charactersLeft);
    }
    else {
        let exceeded = Math.abs(charactersLeft);
        message = glossary['manyCharactersExceededText'].replace(/{value}/, exceeded);
    }

    return message;
}

export function updateVisibleMessage(glossary, charactersLeft, inputElement, characterLimitElement) {
    let newMessage = characterLimitMessage(glossary, charactersLeft);
    let visibleMessage = characterLimitElement.querySelector('.visible-message');

    if (charactersLeft < 0) {
        visibleMessage.classList.add('limit-exceeded');
        inputElement.classList.add('form-limit-error');
    }
    else {
        visibleMessage.classList.remove('limit-exceeded');
        inputElement.classList.remove('form-limit-error');
    }

    visibleMessage.innerHTML = newMessage;
}

export function updateSRMessage(glossary, charactersLeft, characterLimitElement) {
    let newMessage = characterLimitMessage(glossary, charactersLeft);
    let srMessage = characterLimitElement.querySelector('.sr-message');
    srMessage.innerHTML = newMessage;
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

export function setCharacterLimitId(characterLimitElement, inputElement) {
    characterLimitElement.querySelector('.max-limit').id = inputElement.id + '-limit';
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

export function checkDisallowedCombinations(hasError, isRequired, isReadonly, isDisabled, showRequired, showOptional, hasMaxChar) {
    let isOptional = !isRequired;
    if (hasError && isDisabled) {
        throw new Error(`'error' and 'disabled' attributes must not both present on fds-input.`);
    }
    if (hasError && isReadonly) {
        throw new Error(`'error' and 'readonly' attributes must not both present on fds-input.`);
    }
    if (isRequired && isDisabled) {
        throw new Error(`'required' and 'disabled' attributes must not both present on fds-input.`);
    }
    if (isRequired && isReadonly) {
        throw new Error(`'required' and 'readonly' attributes must not both present on fds-input.`);
    }
    if (isOptional && showRequired) {
        throw new Error(`'required' label must not be displayed on optional fds-input.`);
    }
    if (isRequired && showOptional) {
        throw new Error(`'optional' label must not be displayed on required fds-input.`);
    }
    if (showRequired && showOptional) {
        throw new Error(`Show only 'optional' or 'required' label on fds-input.`);
    }
    if (hasMaxChar && isDisabled) {
        throw new Error(`'maxchar' and 'disabled' attributes must not both present on fds-input.`);
    }
    if (hasMaxChar && isReadonly) {
        throw new Error(`'maxchar' and 'readonly' attributes must not both present on fds-input.`);
    }
}