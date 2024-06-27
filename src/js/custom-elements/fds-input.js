'use strict';

import isNonEmptyString from '../utils/is-non-empty-string';
import * as Helpers from './fds-input-helpers';

class FDSInput extends HTMLElement {
    
    /* Private instance fields */

    #wrapperElement;
    #labelElement;
    #inputElement;
    #inputWrapperElement;
    #editWrapperElement;
    #helptextElement;
    #errorElement;
    #prefixElement;
    #suffixElement;
    #editButtonElement;

    #handleEditClicked;

    #glossary;
    #initialised;

    /* Private methods */

    #rebuildElement() {
        if (this.#wrapperElement !== undefined && this.#inputElement !== undefined) {
            
            // Reset HTML
            this.#wrapperElement.innerHTML = '';
            this.#inputWrapperElement.innerHTML = '';
            this.#inputElement.removeAttribute('aria-describedby');

            // Set up aria-describedby attribute
            if (isNonEmptyString(this.helptext) && isNonEmptyString(this.error)) {
                let ariaDescribedBy = this.#helptextElement.id + ' ' + this.#errorElement.id;
                this.#inputElement.setAttribute('aria-describedby', ariaDescribedBy);
            }
            else if (isNonEmptyString(this.helptext)) {
                this.#inputElement.setAttribute('aria-describedby', this.#helptextElement.id);
            }
            else if (isNonEmptyString(this.error)) {
                this.#inputElement.setAttribute('aria-describedby', this.#errorElement.id);
            }

            // Set up edit button
            if (this.hasAttribute('editbutton') && isNonEmptyString(this.label)) {
                this.#editButtonElement.innerHTML = '<svg class="icon-svg" focusable="false" aria-hidden="true"><use xlink:href="#mode"></use></svg>Rediger<span class="sr-only"> ' + this.label + '</span>';
            }

            // Build element
            this.#wrapperElement.appendChild(this.#labelElement);                                               // Label
            if (isNonEmptyString(this.helptext)) { this.#wrapperElement.appendChild(this.#helptextElement); }   // Helptext
            if (isNonEmptyString(this.error)) { this.#wrapperElement.appendChild(this.#errorElement); }         // Error message
            if (this.hasAttribute('editbutton') && this.hasAttribute('readonly')) {
                this.#wrapperElement.appendChild(this.#editWrapperElement);                                     // Wrapper for edit button
            }
            if (this.prefix || this.suffix) {
                if (this.hasAttribute('editbutton') && this.hasAttribute('readonly')) {
                    this.#editWrapperElement.appendChild(this.#inputWrapperElement);
                }
                else {
                    this.#wrapperElement.appendChild(this.#inputWrapperElement);
                }
                if (this.prefix) { this.#inputWrapperElement.appendChild(this.#prefixElement); }                // Prefix
                this.#inputWrapperElement.appendChild(this.#inputElement);                                      // Input
                if (this.suffix) { this.#inputWrapperElement.appendChild(this.#suffixElement); }                // Suffix
            }
            else {                                                                                              // Input with no prefix or suffix:
                if (this.hasAttribute('editbutton') && this.hasAttribute('readonly')) {
                    this.#editWrapperElement.appendChild(this.#inputElement);
                }
                else {
                    this.#wrapperElement.appendChild(this.#inputElement);
                }
            }
            if (this.hasAttribute('editbutton') && this.hasAttribute('readonly')) {
                this.#editWrapperElement.appendChild(this.#editButtonElement);                      // Edit button
            }
        }
    }

    #removeReadOnly() {
        if (this.hasAttribute('readonly')) {
            this.removeAttribute('readonly');
            this.#inputElement.focus();
            let eventEditClicked = new Event('fds-edit-clicked');
            this.dispatchEvent(eventEditClicked);
        }
    }

    /* Attributes which can invoke attributeChangedCallback() */

    static observedAttributes = ['label', 'name', 'inputid', 'value', 'type', 'disabled', 'readonly', 'autocomplete', 'helptext', 'error', 'prefix', 'suffix', 'editbutton'];

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

    get disabled() { return this.getAttribute('disabled'); }
    set disabled(val) { this.setAttribute('disabled', val); }

    get readonly() { return this.getAttribute('readonly'); }
    set readonly(val) { this.setAttribute('readonly', val); }

    get autocomplete() { return this.getAttribute('autocomplete'); }
    set autocomplete(val) { this.setAttribute('autocomplete', val); }

    get helptext() { return this.getAttribute('helptext'); }
    set helptext(val) { this.setAttribute('helptext', val); }

    get error() { return this.getAttribute('error'); }
    set error(val) { this.setAttribute('error', val); }

    get prefix() { return this.getAttribute('prefix'); }
    set prefix(val) { this.setAttribute('prefix', val); }

    get suffix() { return this.getAttribute('suffix'); }
    set suffix(val) { this.setAttribute('suffix', val); }

    get editbutton() { return this.getAttribute('editbutton'); }
    set editbutton(val) { this.setAttribute('editbutton', val); }

    /*
    CUSTOM ELEMENT CONSTRUCTOR (do not access or add attributes in the constructor)
    */

    constructor() {
        super();
        this.#initialised = false;
        this.#glossary = {
            'errorText': 'Fejl'
        };
        this.#handleEditClicked = () => { this.#removeReadOnly() };
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
            if (!Helpers.isValidInputId(this.inputid)) {
                Helpers.setDefaultInputId(this.#labelElement, this.#inputElement);
            }

            /* Ensure input always has a type */
            if (!Helpers.isValidType(this.type)) {
                Helpers.setDefaultType(this.#inputElement);
            }

            Helpers.setHelptextId(this.#helptextElement, this.#inputElement);
            Helpers.setErrorId(this.#errorElement, this.#inputElement);

            this.#rebuildElement();
            
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

        if (!this.#initialised) {
            this.#wrapperElement = document.createElement('div');
            this.#wrapperElement.classList.add('form-group');

            this.#labelElement = document.createElement('label');
            this.#labelElement.classList.add('form-label');

            this.#inputElement = document.createElement('input');
            this.#inputElement.classList.add('form-input');

            this.#inputWrapperElement = document.createElement('div');
            this.#inputWrapperElement.classList.add('form-input-wrapper');

            this.#editWrapperElement = document.createElement('div');
            this.#editWrapperElement.classList.add('edit-wrapper');

            this.#helptextElement = document.createElement('span');
            this.#helptextElement.classList.add('form-hint');

            this.#errorElement = document.createElement('span');
            this.#errorElement.classList.add('form-error-message');

            this.#prefixElement = document.createElement('div');
            this.#prefixElement.classList.add('form-input-prefix');
            this.#prefixElement.setAttribute('aria-hidden', 'true');

            this.#suffixElement = document.createElement('div');
            this.#suffixElement.classList.add('form-input-suffix');
            this.#suffixElement.setAttribute('aria-hidden', 'true');

            this.#editButtonElement = document.createElement('button');
            this.#editButtonElement.setAttribute('type', 'button');
            this.#editButtonElement.classList.add('function-link', 'edit-button');
            this.#editButtonElement.addEventListener('click', this.#handleEditClicked, false);

            this.#initialised = true;
        }

        /* Attribute changes */

        if (attribute === 'label') {
            // Attribute changed
            if (newValue !== null) {
                if (Helpers.isValidLabel(newValue)) {
                    this.#labelElement.textContent = newValue;
                }
                else {
                    throw new Error(`Invalid ${attribute} attribute '${newValue}'.`);
                }
            }
            // Do nothing on attribute removed
        }

        if (attribute === 'name') {
            // Attribute changed
            if (newValue !== null) {
                if (Helpers.isValidName(newValue)) {
                    this.#inputElement.setAttribute('name', newValue);
                }
                else {
                    throw new Error(`Invalid ${attribute} attribute '${newValue}'.`);
                }
            }
            // Do nothing on attribute removed
        }

        if (attribute === 'inputid') {
            // Attribute changed
            if (newValue !== null) {
                if (Helpers.isValidInputId(newValue)) {
                    this.#labelElement.setAttribute('for', newValue);
                    this.#inputElement.setAttribute('id', newValue);
                }
                else {
                    throw new Error(`Invalid ${attribute} attribute '${newValue}'.`);
                }
            }
            // Attribute removed
            else {
                Helpers.setDefaultInputId(this.#labelElement, this.#inputElement);
            }
        }

        if (attribute === 'value') {
            // Attribute changed
            if (newValue !== null) {
                this.#inputElement.setAttribute('value', newValue);
            }
            // Attribute removed
            else {
                this.#inputElement.removeAttribute('value');
            }
        }

        if (attribute === 'type') {
            // Attribute changed
            if (newValue !== null) {
                if (Helpers.isValidType(newValue)) {
                    this.#inputElement.setAttribute('type', newValue);
                }
                else {
                    throw new Error(`Invalid ${attribute} attribute '${newValue}'.`);
                }
            }
            // Attribute removed
            else {
                Helpers.setDefaultType(this.#inputElement);
            }
        }

        if (attribute === 'disabled') {
            // Attribute changed
            if (newValue !== null) {
                Helpers.disabledUpdated(this.#labelElement, this.#inputElement);
                if (this.hasAttribute('error')) {
                    throw new Error(`${attribute} attribute not allowed on elements with errors.`);
                }
            }
            // Attribute removed
            else {
                Helpers.disabledRemoved(this.#labelElement, this.#inputElement);
            }
        }

        if (attribute === 'readonly') {
            // Attribute changed
            if (newValue !== null) {
                this.#inputElement.setAttribute('readonly', '');
                if (this.hasAttribute('error')) {
                    throw new Error(`${attribute} attribute not allowed on elements with errors.`);
                }
            }
            // Attribute removed
            else {
                this.#inputElement.removeAttribute('readonly');
            }
        }

        if (attribute === 'autocomplete') {
            // Attribute changed
            if (newValue !== null) {
                if (Helpers.isValidAutocomplete(newValue)) {
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

        if (attribute === 'helptext') {
            // Attribute changed
            if (newValue !== null) {
                if (Helpers.isValidHelptext(newValue)) {
                    Helpers.setHelptextId(this.#helptextElement, this.#inputElement);
                    this.#helptextElement.textContent = newValue;
                }
                else {
                    this.#helptextElement.textContent = '';
                }
            }
            // Do nothing on attribute removed. HTML is removed at rebuild step.
        }

        if (attribute === 'error') {
            // Attribute changed
            if (newValue !== null) {
                if (Helpers.isValidError(newValue)) {
                    this.#wrapperElement.classList.add('form-error');
                    Helpers.setErrorId(this.#errorElement, this.#inputElement);
                    this.#errorElement.innerHTML = '<span class="sr-only">' + this.#glossary['errorText'] + ': </span>' + newValue;
                    this.#inputElement.setAttribute('aria-invalid', 'true');
                    if (this.hasAttribute('disabled')) {
                        throw new Error(`${attribute} attribute not allowed on disabled input.`);
                    }
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

        if (attribute === 'prefix') {
            // Attribute changed
            if (newValue !== null) {
                if (Helpers.isValidPrefix(newValue)) {
                    this.#inputWrapperElement.classList.add('form-input-wrapper--prefix');
                    this.#prefixElement.textContent = newValue;
                }
                else {
                    throw new Error(`Invalid ${attribute} attribute '${newValue}'.`);
                }
            }
            // Attribute removed
            else {
                this.#inputWrapperElement.classList.remove('form-input-wrapper--prefix');
            }
        }

        if (attribute === 'suffix') {
            // Attribute changed
            if (newValue !== null) {
                if (Helpers.isValidSuffix(newValue)) {
                    this.#inputWrapperElement.classList.add('form-input-wrapper--suffix');
                    this.#suffixElement.textContent = newValue;
                }
                else {
                    throw new Error(`Invalid ${attribute} attribute '${newValue}'.`);
                }
            }
            // Attribute removed
            else {
                this.#inputWrapperElement.classList.remove('form-input-wrapper--suffix');
            }
        }

        /* Update HTML */

        this.#rebuildElement();
    }
}

export default FDSInput;