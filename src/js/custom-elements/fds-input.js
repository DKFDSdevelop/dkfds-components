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

function isValidType(type) {
    const TYPES = ['text', 'email', 'number', 'password', 'tel', 'url'];
    if (TYPES.includes(type)) { return true; }
    else { return false; }
}

function isValidAutocomplete(autocomplete) {
    if (isNonEmptyString(autocomplete)) { return true; }
    else { return false; }
}

function isValidError(error) {
    if (isNonEmptyString(error)) { return true; }
    else { return false; }
}

/*
CUSTOM ELEMENT IMPLEMENTATION
*/

class FDSInput extends HTMLElement {
    #rebuildElement() {
        if (this.#wrapperElement !== undefined && this.#inputElement !== undefined) {
            
            // Reset HTML
            this.#wrapperElement.innerHTML = '';
            this.#inputElement.removeAttribute('aria-describedby');
            let ariaDescribedBy = '';

            this.#wrapperElement.appendChild(this.#labelElement);
            if (this.error) {
                if (ariaDescribedBy === '') {
                    ariaDescribedBy = this.#errorElement.id;
                }
                else {
                    ariaDescribedBy = ariaDescribedBy + ' ' + this.#errorElement.id;
                }
                this.#wrapperElement.appendChild(this.#errorElement);
            }
            if (ariaDescribedBy !== '') {
                this.#inputElement.setAttribute('aria-describedby', ariaDescribedBy);
            }
            this.#wrapperElement.appendChild(this.#inputElement);
        }
    }

    // Private instance fields
    #wrapperElement;
    #labelElement;
    #inputElement;
    #errorElement;
    #glossary;

    static observedAttributes = ['label', 'name', 'inputid', 'value', 'type', 'autocomplete', 'error'];

    /*
    ATTRIBUTE GETTERS AND SETTERS
    */

    get label() { return this.getAttribute('label'); }
    set label(val) { this.setAttribute('label', val); }

    get name() { return this.getAttribute('name'); }
    set name(val) { this.setAttribute('name', val); }

    get inputid() { return this.getAttribute('inputid'); }
    set inputid(val) { this.setAttribute('inputid', val); }

    get value() { return this.#inputElement.value; }
    set value(val) { this.#inputElement.value = val; }

    get type() { return this.getAttribute('type'); }
    set type(val) { this.setAttribute('type', val); }

    get autocomplete() { return this.getAttribute('autocomplete'); }
    set autocomplete(val) { this.setAttribute('autocomplete', val); }

    get error() { return this.getAttribute('error'); }
    set error(val) { this.setAttribute('error', val); }

    /*
    CUSTOM ELEMENT CONSTRUCTOR (do not access or add attributes in the constructor)
    */

    constructor() {
        super();
        this.#glossary = {
            'errorText': 'Fejl'
        };
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

    updateGlossary(glossary) {
        if (glossary['errorText'] !== undefined) {
            this.#glossary['errorText'] = glossary['errorText'];
            if (this.error) {
                this.#errorElement.innerHTML = '<span class="sr-only">' + this.#glossary['errorText'] + ': </span>' + this.error;
            }
        }
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
            /* Ensure input always has an ID */
            if (!isValidInputId(this.inputid)) {
                setDefaultInputId(this.#labelElement, this.#inputElement);
            }

            /* Ensure input always has a type */
            if (!isValidType(this.type)) {
                setDefaultType(this.#inputElement);
            }

            this.#errorElement.id = this.#inputElement.id + '-error';

            this.appendChild(this.#wrapperElement);
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

        /* Element setup. Applied once on the initial call before connectedCallback(). */

        if (this.#wrapperElement === undefined && this.querySelector('.form-group') === null) {
            this.#wrapperElement = document.createElement('div');
            this.#wrapperElement.classList.add('form-group');
        }

        if (this.#labelElement === undefined && this.querySelector('label') === null) {
            this.#labelElement = document.createElement('label');
            this.#labelElement.classList.add('form-label');
        }

        if (this.#inputElement === undefined && this.querySelector('input') === null) {
            this.#inputElement = document.createElement('input');
            this.#inputElement.classList.add('form-input');
        }

        if (this.#errorElement === undefined && this.querySelector('.form-error-message') === null) {
            this.#errorElement = document.createElement('span');
            this.#errorElement.classList.add('form-error-message');
        }

        /* Attribute changes */

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
                    this.#inputElement.setAttribute('value', newValue);
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

        if (attribute === 'error') {
            if (this.#wrapperElement !== undefined && this.#errorElement !== undefined && this.#inputElement !== undefined) {
                // Attribute changed
                if (newValue !== null) {
                    if (isValidError(newValue)) {
                        this.#wrapperElement.classList.add('form-error');
                        this.#errorElement.id = this.#inputElement.id + '-error';
                        this.#errorElement.innerHTML = '<span class="sr-only">' + this.#glossary['errorText'] + ': </span>' + newValue;
                        this.#inputElement.setAttribute('aria-invalid', 'true');
                    }
                    else {
                        throw new Error(`Invalid ${attribute} attribute '${newValue}'.`);
                    }
                }
                // Attribute removed
                else {
                    this.#wrapperElement.classList.remove('form-error');
                    this.#inputElement.removeAttribute('aria-invalid');
                }
            }
        }

        /* Update HTML */

        this.#rebuildElement();
    }
}

export default FDSInput;