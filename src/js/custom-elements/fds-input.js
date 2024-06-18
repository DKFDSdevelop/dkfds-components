'use strict';

const INVALID_LABEL_VALUE = 'Invalid label attribute value';
const AT_ELEMENT_CREATION = 'at element creation.';
const AT_ATTRIBUTE_CHANGE = 'at attribute change.';

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

/*
CUSTOM ELEMENT IMPLEMENTATION
*/

class FDSInput extends HTMLElement {
    static observedAttributes = ['label', 'name', 'id', 'value'];

    /*
    GETTERS AND SETTERS
    */

    get label() {
        return this.getAttribute('label');
    }

    set label(val) {
        if (isValidLabel(val)) { 
            this.setAttribute('label', val); 
        }
        else { 
            throw new Error(`${INVALID_LABEL_VALUE} '${val}'.`);
        }
    }

    /*
    CUSTOM ELEMENT CONSTRUCTOR
    */

    constructor() {
        super();
    }

    /*
    CUSTOM ELEMENT FUNCTIONS
    */

    getLabel() {
        return this.querySelector('label');
    }

    /*
    CUSTOM ELEMENT ADDED TO DOCUMENT
    */

    connectedCallback() {
        if (this.innerHTML === '') {

            /* Label */
            let labelElement = document.createElement('label');
            labelElement.classList.add('form-label');
            labelElement.setAttribute('for', 'input-text');
            if (this.label !== null) {
                if (isValidLabel(this.label)) {
                    labelElement.textContent = this.label;
                }
                else {
                    throw new Error(`${INVALID_LABEL_VALUE} '${this.label}' ${AT_ELEMENT_CREATION}`);
                }
            }
            this.appendChild(labelElement);

            /* Input */
            let inputElement = document.createElement('input');
            inputElement.type = 'text';
            inputElement.id = 'input-text';
            inputElement.name = 'input-text';
            inputElement.classList.add('form-input');
            this.appendChild(inputElement);
        }
        
        else {
            throw new Error(`'fds-input' must not contain content ${AT_ELEMENT_CREATION}`);
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

        /* Don't throw an error if newValue is null but don't modify the attribute either.
        A null value may temporarily appear for some attribute changes. */

        if (attribute === 'label' && this.getLabel() !== null) {
            if (newValue !== null) {
                if (isValidLabel(newValue)) {
                    this.getLabel().textContent = newValue;
                }
                else {
                    throw new Error(`${INVALID_LABEL_VALUE} '${newValue}' ${AT_ATTRIBUTE_CHANGE}`);
                }
            }
        }

    }
}

export default FDSInput;