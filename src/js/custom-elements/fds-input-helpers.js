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

export function isValidLabel(label) {
    if (isNonEmptyString(label)) { return true; }
    else { return false; }
}

export function isValidName(name) {
    if (isNonEmptyString(name)) { return true; }
    else { return false; }
}

export function isValidInputId(inputid) {
    if (isNonEmptyString(inputid)) { return true; }
    else { return false; }
}

export function isValidType(type) {
    const TYPES = ['text', 'email', 'number', 'password', 'tel', 'url'];
    if (TYPES.includes(type)) { return true; }
    else { return false; }
}

export function isValidAutocomplete(autocomplete) {
    if (isNonEmptyString(autocomplete)) { return true; }
    else { return false; }
}

export function isValidHelptext(helptext) {
    if (isNonEmptyString(helptext)) { return true; }
    else { return false; }
}

export function isValidError(error) {
    if (isNonEmptyString(error)) { return true; }
    else { return false; }
}

export function isValidPrefix(prefix) {
    if (isNonEmptyString(prefix)) { return true; }
    else { return false; }
}

export function isValidSuffix(suffix) {
    if (isNonEmptyString(suffix)) { return true; }
    else { return false; }
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