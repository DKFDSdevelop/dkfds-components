'use strict';

/* 
FUNCTIONS FOR VALIDATING ATTRIBUTES 
*/

function isValidLabel(label) {
    let s = label.trim(); // Results in an empty string if label only contains whitespace
    if (label === null || label === undefined || s === '' || !(typeof label === 'string' || label instanceof String)) {
        return false;
    }
    else {
        return true;
    }
}

function isValidName(name) {
    let s = name.trim(); // Results in an empty string if label only contains whitespace
    if (name === null || name === undefined || s === '' || !(typeof name === 'string' || name instanceof String)) {
        return false;
    }
    else {
        return true;
    }
}

function isValidInputId(inputid) {
    let s = inputid.trim(); // Results in an empty string if label only contains whitespace
    if (inputid === null || inputid === undefined || s === '' || !(typeof inputid === 'string' || inputid instanceof String)) {
        return false;
    }
    else {
        return true;
    }
}

/*
CUSTOM ELEMENT IMPLEMENTATION
*/

class FDSInput extends HTMLElement {
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
            if (this.inputid === null) {
                let randomString = 'input-' + Date.now().toString().substring(7) + Math.floor(Math.random() * 1000).toString();
                this.#labelElement.setAttribute('for', randomString);
                this.#inputElement.setAttribute('id', randomString);
            }

            this.appendChild(this.#labelElement);
            this.appendChild(this.#inputElement);
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
            this.#inputElement.type = 'text';
            this.#inputElement.classList.add('form-input');
        }

        /* Don't throw an error if newValue is null but don't modify the attribute either.
        A null value may temporarily appear for some attribute changes. */

        if (attribute === 'label') {
            if (newValue !== null && this.#labelElement !== undefined) {
                if (isValidLabel(newValue)) {
                    this.#labelElement.textContent = newValue;
                }
                else {
                    throw new Error(`Invalid label attribute value '${newValue}'.`);
                }
            }
        }

        if (attribute === 'name') {
            if (newValue !== null && this.#inputElement !== undefined) {
                if (isValidName(newValue)) {
                    this.#inputElement.setAttribute('name', newValue);
                }
                else {
                    throw new Error(`Invalid name attribute value '${newValue}'.`);
                }
            }
        }

        if (attribute === 'inputid') {
            if (newValue !== null && this.#labelElement !== undefined && this.#inputElement !== undefined) {
                if (isValidInputId(newValue)) {
                    this.#labelElement.setAttribute('for', newValue);
                    this.#inputElement.setAttribute('id', newValue);
                }
                else {
                    throw new Error(`Invalid inputid attribute value '${newValue}'.`);
                }
            }
        }
    }
}

export default FDSInput;