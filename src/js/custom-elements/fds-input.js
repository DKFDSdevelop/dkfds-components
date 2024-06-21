'use strict';

import isNonEmptyString from '../utils/is-non-empty-string';

function setDefaultInputId(labelElement, inputElement) {
    let randomString = 'input-' + Date.now().toString().slice(-3) + Math.floor(Math.random() * 1000000).toString();
    labelElement.setAttribute('for', randomString);
    inputElement.setAttribute('id', randomString);
}

function setDefaultType(inputElement) {
    inputElement.setAttribute('type', 'text');
}

/* 
FUNCTIONS FOR VALIDATING ATTRIBUTES 
*/

function isValidLabel(label) {
    if (isNonEmptyString(label)) { return true; }
    else { return false; }
}

function isValidName(name) {
    if (isNonEmptyString(name)) { return true; }
    else { return false; }
}

function isValidInputId(inputid) {
    if (isNonEmptyString(inputid)) { return true; }
    else { return false; }
}

function isValidValue(value) {
    if (isNonEmptyString(value)) { return true; }
    else { return false; }
}

function isValidType(type) {
    const TYPES = ['text', 'email', 'number', 'password', 'tel', 'url'];
    if (TYPES.includes(type)) { return true; }
    else { return false; }
}

function isValidAutocomplete(autocomplete) {
    if (isNonEmptyString(autocomplete)) { return true; }
    else { return false; }
}

/*
CUSTOM ELEMENT IMPLEMENTATION
*/

class FDSInput extends HTMLElement {
    #wrapper;
    #labelElement;
    #inputElement;

    static observedAttributes = ['label', 'name', 'inputid', 'value', 'type', 'autocomplete'];

    /*
    ATTRIBUTE GETTERS AND SETTERS
    */

    get label() { return this.getAttribute('label'); }
    set label(val) { this.setAttribute('label', val); }

    get name() { return this.getAttribute('name'); }
    set name(val) { this.setAttribute('name', val); }

    get inputid() { return this.getAttribute('inputid'); }
    set inputid(val) { this.setAttribute('inputid', val); }

    get value() { return this.getAttribute('value'); }
    set value(val) { this.setAttribute('value', val); }

    get type() { return this.getAttribute('type'); }
    set type(val) { this.setAttribute('type', val); }

    get autocomplete() { return this.getAttribute('autocomplete'); }
    set autocomplete(val) { this.setAttribute('autocomplete', val); }

    /*
    CUSTOM ELEMENT CONSTRUCTOR (do not access or add attributes in the constructor)
    */

    constructor() {
        super();
    }

    /*
    CUSTOM ELEMENT FUNCTIONS
    */

    getLabelElement() {
        return this.#labelElement;
    }

    getInputElement() {
        return this.#inputElement;
    }

    /*
    CUSTOM ELEMENT ADDED TO DOCUMENT
    */

    connectedCallback() {

        if (this.label === null || this.name === null) {
            throw new Error(`Custom element 'fds-input' not created. Element must always have the attributes 'label' and 'name'.`);
        }
        else if (this.innerHTML !== '') {
            throw new Error(`Custom element 'fds-input' not created. Element must not contain content at element creation.`);
        }
        else {
            /* Note: Error messsages caused by invalid attributes are 
            handled by attributeChangedCallback() */

            if (!isValidInputId(this.inputid)) {
                setDefaultInputId(this.#labelElement, this.#inputElement);
            }
            if (!isValidType(this.type)) {
                setDefaultType(this.#inputElement);
            }

            this.#wrapper = document.createElement('div');
            this.#wrapper.classList.add('form-group');
            this.#wrapper.appendChild(this.#labelElement);
            this.#wrapper.appendChild(this.#inputElement);
            this.appendChild(this.#wrapper);
        }
    }

    /*
    CUSTOM ELEMENT REMOVED FROM DOCUMENT
    */

    disconnectedCallback() { }

    /*
    CUSTOM ELEMENT'S ATTRIBUTE(S) CHANGED
    */

    attributeChangedCallback(attribute, oldValue, newValue) {

        if (this.#labelElement === undefined && this.querySelector('label') === null) {
            this.#labelElement = document.createElement('label');
            this.#labelElement.classList.add('form-label');
        }

        if (this.#inputElement === undefined && this.querySelector('input') === null) {
            this.#inputElement = document.createElement('input');
            this.#inputElement.classList.add('form-input');
        }

        /* Note: Some attribute changes invoke attributeChangedCallback() twice;
        first call removes the old value, second call sets a new value. */

        if (attribute === 'label') {
            if (this.#labelElement !== undefined) {
                // Attribute changed
                if (newValue !== null) {
                    if (isValidLabel(newValue)) {
                        this.#labelElement.textContent = newValue;
                    }
                    else {
                        throw new Error(`Invalid ${attribute} attribute '${newValue}'.`);
                    }
                }
                // Do nothing on attribute removed
            }
            
        }

        if (attribute === 'name') {
            if (this.#inputElement !== undefined) {
                // Attribute changed
                if (newValue !== null) {
                    if (isValidName(newValue)) {
                        this.#inputElement.setAttribute('name', newValue);
                    }
                    else {
                        throw new Error(`Invalid ${attribute} attribute '${newValue}'.`);
                    }
                }
                // Do nothing on attribute removed
            }
        }

        if (attribute === 'inputid') {
            if (this.#labelElement !== undefined && this.#inputElement !== undefined) {
                // Attribute changed
                if (newValue !== null) {
                    if (isValidInputId(newValue)) {
                        this.#labelElement.setAttribute('for', newValue);
                        this.#inputElement.setAttribute('id', newValue);
                    }
                    else {
                        throw new Error(`Invalid ${attribute} attribute '${newValue}'.`);
                    }
                }
                // Attribute removed
                else {
                    setDefaultInputId(this.#labelElement, this.#inputElement);
                }
            }
        }

        if (attribute === 'value') {
            if (this.#inputElement !== undefined) {
                // Attribute changed
                if (newValue !== null) {
                    if (isValidValue(newValue)) {
                        this.#inputElement.setAttribute('value', newValue);
                    }
                    else {
                        throw new Error(`Invalid ${attribute} attribute '${newValue}'.`);
                    }
                }
                // Attribute removed
                else {
                    this.#inputElement.removeAttribute('value');
                }
            }
        }

        if (attribute === 'type') {
            if (this.#inputElement !== undefined) {
                // Attribute changed
                if (newValue !== null) {
                    if (isValidType(newValue)) {
                        this.#inputElement.setAttribute('type', newValue);
                    }
                    else {
                        throw new Error(`Invalid ${attribute} attribute '${newValue}'.`);
                    }
                }
                // Attribute removed
                else {
                    setDefaultType(this.#inputElement);
                }
            }
        }

        if (attribute === 'autocomplete') {
            if (this.#inputElement !== undefined) {
                // Attribute changed
                if (newValue !== null) {
                    if (isValidAutocomplete(newValue)) {
                        this.#inputElement.setAttribute('autocomplete', newValue);
                    }
                    else {
                        throw new Error(`Invalid ${attribute} attribute '${newValue}'.`);
                    }
                }
                // Attribute removed
                else {
                    this.#inputElement.removeAttribute('autocomplete');
                }
            }
        }
    }
}

export default FDSInput;