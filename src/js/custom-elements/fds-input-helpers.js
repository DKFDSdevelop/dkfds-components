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