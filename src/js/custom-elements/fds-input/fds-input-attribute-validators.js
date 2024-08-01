'use strict';

export function isValidType(type) {
    const TYPES = ['text', 'email', 'number', 'password', 'tel', 'url'];

    if (TYPES.includes(type)) { 
        return true; 
    }
    else { 
        return false; 
    }
}

export function isValidInteger(integer) {
    let number = parseInt(integer);
    return Number.isInteger(number);
}

export function isNonEmptyString (s) {
    // If s is falsy, it is not a non-empty string
    if (!s) {
        return false;
    }
    // If s is a string, check that it doesn't contain only whitespace
    else if (typeof s === 'string' || s instanceof String) {
        if (s.trim() === '') {
            return false;
        }
        else {
            return true;
        }
    }
    // s is not a string
    else {
        return false;
    }
}