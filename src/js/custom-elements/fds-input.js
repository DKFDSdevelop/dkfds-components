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
    #characterLimitElement;

    #handleEditClicked;
    #handleKeyUp;
    #handleBlur;
    #handleFocus;
    #handlePageShow;

    #glossary;
    #connected
    #initialised;
    #triggerRebuild;

    #lastKeyUpTimestamp;
    #oldValue;
    #intervalID;

    /* Private methods */

    #rebuildElement() {
        // Reset HTML
        this.#wrapperElement.innerHTML = '';
        this.#inputWrapperElement.innerHTML = '';
        this.#inputElement.removeAttribute('aria-describedby');
        if (isNonEmptyString(this.label)) {
            this.#labelElement.textContent = this.label;
        }

        // Update IDs
        Helpers.setHelptextId(this.#helptextElement, this.#inputElement);
        Helpers.setErrorId(this.#errorElement, this.#inputElement);
        Helpers.setCharacterLimitId(this.#characterLimitElement, this.#inputElement);

        // Set up aria-describedby attribute
        let ariaDescribedBy = '';
        if (isNonEmptyString(this.error)) {
            ariaDescribedBy = ariaDescribedBy + this.#errorElement.id + ' ';
        }
        if (isNonEmptyString(this.helptext)) {
            ariaDescribedBy = ariaDescribedBy + this.#helptextElement.id + ' ';
        }
        if (Helpers.isValidInteger(this.maxchar)) {
            ariaDescribedBy = ariaDescribedBy + this.#characterLimitElement.querySelector('.max-limit').id + ' ';
        }
        if (ariaDescribedBy.trim() !== '') {
            this.#inputElement.setAttribute('aria-describedby', ariaDescribedBy.trim());
        }

        // Set up edit button
        if (this.hasAttribute('editbutton') && isNonEmptyString(this.label)) {
            Helpers.updateEditButton(this.#editButtonElement, this.label, this.#glossary['editText']);
        }

        // Update error message
        if (isNonEmptyString(this.error)) {
            Helpers.updateErrorMessage(this.#errorElement, this.error, this.#glossary['errorText']);
        }
        
        // Add label
        this.#wrapperElement.appendChild(this.#labelElement);

        // Add required label
        if (this.hasAttribute('showrequired') && isNonEmptyString(this.label)) {
            Helpers.updateRequiredLabel(this.#labelElement, this.label, this.#glossary['requiredText']);
        }

        // Add optional label
        if (this.hasAttribute('showoptional') && isNonEmptyString(this.label)) {
            Helpers.updateOptionalLabel(this.#labelElement, this.label, this.#glossary['optionalText']);
        }

        // Add helptext
        if (isNonEmptyString(this.helptext)) { 
            this.#wrapperElement.appendChild(this.#helptextElement); 
        }

        // Add error message
        if (isNonEmptyString(this.error)) { 
            this.#wrapperElement.appendChild(this.#errorElement); 
        }

        // Add wrapper for edit button
        if (this.hasAttribute('editbutton') && this.hasAttribute('readonly')) {
            this.#wrapperElement.appendChild(this.#editWrapperElement);
        }

        // Add wrapper for prefix and suffix
        if (isNonEmptyString(this.prefix) || isNonEmptyString(this.suffix)) {
            if (this.hasAttribute('editbutton') && this.hasAttribute('readonly')) {
                this.#editWrapperElement.appendChild(this.#inputWrapperElement);
            }
            else {
                this.#wrapperElement.appendChild(this.#inputWrapperElement);
            }
        }

        // Add prefix
        if (isNonEmptyString(this.prefix)) { 
            this.#inputWrapperElement.appendChild(this.#prefixElement); 
        }

        // Add input
        if (isNonEmptyString(this.prefix) || isNonEmptyString(this.suffix)) {
            this.#inputWrapperElement.appendChild(this.#inputElement);
        }
        else if (this.hasAttribute('editbutton') && this.hasAttribute('readonly')) {
            this.#editWrapperElement.appendChild(this.#inputElement);
        }
        else {
            this.#wrapperElement.appendChild(this.#inputElement);
        }

        // Add suffix
        if (isNonEmptyString(this.suffix)) { 
            this.#inputWrapperElement.appendChild(this.#suffixElement); 
        }

        // Add edit button
        if (this.hasAttribute('editbutton') && this.hasAttribute('readonly')) {
            this.#editWrapperElement.appendChild(this.#editButtonElement);
        }

        // Add character limit
        if (Helpers.isValidInteger(this.maxchar)) {
            this.#wrapperElement.appendChild(this.#characterLimitElement);
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

    static observedAttributes = ['label', 'name', 'inputid', 'value', 'type', 'required', 'disabled', 'readonly', 'autocomplete', 'helptext', 'error', 'prefix', 'suffix', 'editbutton', 'showrequired', 'showoptional', 'maxwidth', 'maxchar'];

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

    get required() { return this.getAttribute('required'); }
    set required(val) { this.setAttribute('required', val); }

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

    get showrequired() { return this.getAttribute('showrequired'); }
    set showrequired(val) { this.setAttribute('showrequired', val); }

    get showoptional() { return this.getAttribute('showoptional'); }
    set showoptional(val) { this.setAttribute('showoptional', val); }

    get maxwidth() { return this.getAttribute('maxwidth'); }
    set maxwidth(val) { this.setAttribute('maxwidth', val); }

    get maxchar() { return this.getAttribute('maxchar'); }
    set maxchar(val) { this.setAttribute('maxchar', val); }

    /*
    CUSTOM ELEMENT CONSTRUCTOR (do not access or add attributes in the constructor)
    */

    constructor() {
        super();

        this.#initialised = false;
        this.#connected = false;
        this.#glossary = {
            'errorText': 'Fejl',
            'editText': 'Rediger',
            'requiredText': 'skal udfyldes',
            'optionalText': 'frivilligt',
            'oneCharacterLeftText': 'Du har {value} tegn tilbage',
            'manyCharactersLeftText': 'Du har {value} tegn tilbage',
            'oneCharacterExceededText': 'Du har {value} tegn for meget',
            'manyCharactersExceededText': 'Du har {value} tegn for meget',
            'maxCharactersText': 'Du kan indtaste op til {value} tegn'
        };
        this.#triggerRebuild = ['label', 'inputid', 'required', 'disabled', 'readonly', 'helptext', 'error', 'prefix', 'suffix', 'editbutton', 'showrequired', 'showoptional', 'maxchar'];

        this.#lastKeyUpTimestamp = null;
        this.#oldValue = '';
        this.#intervalID = null;

        this.#handleEditClicked = () => { this.#removeReadOnly() };
        this.#handleKeyUp = () => {
            let chars = this.charactersLeft();
            Helpers.updateVisibleMessage(this.#glossary, chars, this.#inputElement, this.#characterLimitElement);
            this.#lastKeyUpTimestamp = Date.now();
        };
        this.#handleFocus = () => {
            /* Reset the screen reader message on focus to force an update of the message.
            This ensures that a screen reader informs the user of how many characters there is left
            on focus and not just what the character limit is. */
            if (this.#inputElement.value !== "") {
                let srMessage = this.#characterLimitElement.querySelector('.sr-message');
                srMessage.innerHTML = '';
            }
        
            this.#intervalID = setInterval(function () {
                /* Don't update the Screen Reader message unless it's been awhile
                since the last key up event. Otherwise, the user will be spammed
                with audio notifications while typing. */
                if (!this.#lastKeyUpTimestamp || (Date.now() - 500) >= this.#lastKeyUpTimestamp) {
                    let srMessage = this.#characterLimitElement.querySelector('.sr-message').innerHTML;
                    let visibleMessage = this.#characterLimitElement.querySelector('.visible-message').innerHTML;     
        
                    /* Don't update the messages unless the input has changed or if there
                    is a mismatch between the visible message and the screen reader message. */
                    if (this.#oldValue !== this.#inputElement.value || srMessage !== visibleMessage) {
                        this.#oldValue = this.#inputElement.value;
                        this.updateMessages();
                    }
                }
            }.bind(this), 1000);
        };
        this.#handleBlur = () => {
            clearInterval(this.#intervalID);
            // Don't update the messages on blur unless the value of the textarea/text input has changed
            if (this.#oldValue !== this.#inputElement.value) {
                this.#oldValue = this.#inputElement.value;
                this.updateMessages();
            }
        };
        this.#handlePageShow = () => {
            this.updateMessages();
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
            if (isNonEmptyString(this.error)) {
                Helpers.updateErrorMessage(this.#errorElement, this.error, this.#glossary['errorText']);
            }
        }
        if (glossary['editText'] !== undefined) {
            this.#glossary['editText'] = glossary['editText'];
            if (isNonEmptyString(this.label) && this.hasAttribute('editbutton')) {
                Helpers.updateEditButton(this.#editButtonElement, this.label, this.#glossary['editText']);
            }
        }
        if (glossary['requiredText'] !== undefined) {
            this.#glossary['requiredText'] = glossary['requiredText'];
            if (isNonEmptyString(this.label) && this.hasAttribute('showrequired')) {
                Helpers.updateRequiredLabel(this.#labelElement, this.label, this.#glossary['requiredText']);
            }
        }
        if (glossary['optionalText'] !== undefined) {
            this.#glossary['optionalText'] = glossary['optionalText'];
            if (isNonEmptyString(this.label) && this.hasAttribute('showoptional')) {
                Helpers.updateOptionalLabel(this.#labelElement, this.label, this.#glossary['optionalText']);
            }
        }
        if (glossary['oneCharacterLeftText'] !== undefined) {
            this.#glossary['oneCharacterLeftText'] = glossary['oneCharacterLeftText'];
        }
        if (glossary['manyCharactersLeftText'] !== undefined) {
            this.#glossary['manyCharactersLeftText'] = glossary['manyCharactersLeftText'];
        }
        if (glossary['oneCharacterExceededText'] !== undefined) {
            this.#glossary['oneCharacterExceededText'] = glossary['oneCharacterExceededText'];
        }
        if (glossary['manyCharactersExceededText'] !== undefined) {
            this.#glossary['manyCharactersExceededText'] = glossary['manyCharactersExceededText'];
        }
        if (glossary['oneCharacterLeftText'] || glossary['manyCharactersLeftText'] || glossary['oneCharacterExceededText'] || glossary['manyCharactersExceededText']) {
            /* Prevent screen readers from announcing the glossary change in the aria-live region */
            let maxLimitText = this.#characterLimitElement.querySelector('.max-limit').innerHTML;
            this.#characterLimitElement.innerHTML = 
                '<span class="max-limit">' + maxLimitText + '</span>' + 
                '<span class="visible-message form-hint" aria-hidden="true"></span>' + 
                '<span class="sr-message"></span>';
            this.updateMessages();
            this.#characterLimitElement.querySelector('.sr-message').setAttribute('aria-live', 'polite');
        }
        if (glossary['maxCharactersText'] !== undefined) {
            this.#glossary['maxCharactersText'] = glossary['maxCharactersText'];
            if (Helpers.isValidInteger(this.maxchar)) {
                this.#characterLimitElement.querySelector('.max-limit').innerHTML = this.#glossary['maxCharactersText'].replace(/{value}/, this.maxchar);
            }
        }
    }

    charactersLeft() {
        if (Helpers.isValidInteger(this.maxchar)) {
            let currentLength = this.#inputElement.value.length;
            return parseInt(this.maxchar) - currentLength;
        }
        else {
            return undefined;
        }
    }

    updateMessages() {
        if (Helpers.isValidInteger(this.maxchar)) {
            let chars = this.charactersLeft();
            Helpers.updateVisibleMessage(this.#glossary, chars, this.#inputElement, this.#characterLimitElement);
            Helpers.updateSRMessage(this.#glossary, chars, this.#characterLimitElement);
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
            if (!isNonEmptyString(this.inputid)) {
                Helpers.setDefaultInputId(this.#labelElement, this.#inputElement);
            }

            /* Ensure input always has a type */
            if (!Helpers.isValidType(this.type)) {
                Helpers.setDefaultType(this.#inputElement);
            }

            this.#rebuildElement();
            this.appendChild(this.#wrapperElement);

            if (Helpers.isValidInteger(this.maxchar)) {
                this.#inputElement.addEventListener('keyup', this.#handleKeyUp, false);
                this.#inputElement.addEventListener('focus', this.#handleFocus, false);
                this.#inputElement.addEventListener('blur', this.#handleBlur, false);
                window.addEventListener('pageshow', this.#handlePageShow, false);
            }
            
            this.#connected = true;
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

        /* Element setup. Applied once on the first call to 
           attributeChangedCallback() before connectedCallback(). */

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

            this.#characterLimitElement = document.createElement('div');
            this.#characterLimitElement.innerHTML = 
                '<span class="max-limit"></span>' + 
                '<span class="visible-message form-hint" aria-hidden="true"></span>' + 
                '<span class="sr-message" aria-live="polite"></span>';
            this.#characterLimitElement.classList.add('character-limit-wrapper');
            
            this.#initialised = true;
        }

        /* Attribute changes */

        if (attribute === 'label') {
            // Attribute changed
            if (newValue !== null) {
                if (isNonEmptyString(newValue)) {
                    this.#labelElement.textContent = newValue;
                }
                else {
                    throw new Error(`Invalid ${attribute} attribute '${newValue}'.`);
                }
            }
            // Do nothing on attribute removed to avoid throwing an error in those  
            // rare cases where two calls are made to attributeChangedCallback()
        }

        if (attribute === 'name') {
            // Attribute changed
            if (newValue !== null) {
                if (isNonEmptyString(newValue)) {
                    this.#inputElement.setAttribute('name', newValue);
                }
                else {
                    throw new Error(`Invalid ${attribute} attribute '${newValue}'.`);
                }
            }
            // Do nothing on attribute removed to avoid throwing an error in those  
            // rare cases where two calls are made to attributeChangedCallback()
        }

        if (attribute === 'inputid') {
            // Attribute changed to valid value
            if (isNonEmptyString(newValue)) {
                this.#labelElement.setAttribute('for', newValue);
                this.#inputElement.setAttribute('id', newValue);
            }
            // Attribute removed or invalid value
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
            // Ensure character limit shows the correct number of remaining characters at element creation
            if (!this.#connected && Helpers.isValidInteger(this.maxchar)) {
                let chars = parseInt(this.maxchar) - newValue.length;
                Helpers.updateVisibleMessage(this.#glossary, chars, this.#inputElement, this.#characterLimitElement);
                Helpers.updateSRMessage(this.#glossary, chars, this.#characterLimitElement);
            }
        }

        if (attribute === 'type') {
            // Attribute changed to text
            if (isNonEmptyString(newValue)) {
                if (Helpers.isValidType(newValue)) {
                    this.#inputElement.setAttribute('type', newValue);
                }
                else {
                    throw new Error(`Invalid ${attribute} attribute '${newValue}'.`);
                }
            }
            // Attribute removed or changed to non-text
            else {
                Helpers.setDefaultType(this.#inputElement);
            }
        }

        if (attribute === 'required') {
            // Attribute changed
            if (newValue !== null) {
                this.#inputElement.setAttribute('required', '');
            }
            // Attribute removed
            else {
                this.#inputElement.removeAttribute('required');
            }
        }

        if (attribute === 'disabled') {
            // Attribute changed
            if (newValue !== null) {
                this.#labelElement.classList.add('disabled');
                this.#inputElement.setAttribute('disabled', '');
            }
            // Attribute removed
            else {
                this.#labelElement.classList.remove('disabled');
                this.#inputElement.removeAttribute('disabled');
            }
        }

        if (attribute === 'readonly') {
            // Attribute changed
            if (newValue !== null) {
                this.#inputElement.setAttribute('readonly', '');
            }
            // Attribute removed
            else {
                this.#inputElement.removeAttribute('readonly');
            }
        }

        if (attribute === 'autocomplete') {
            // Attribute changed to valid value
            if (isNonEmptyString(newValue)) {
                this.#inputElement.setAttribute('autocomplete', newValue);
            }
            // Attribute removed or invalid value
            else {
                this.#inputElement.removeAttribute('autocomplete');
            }
        }

        if (attribute === 'helptext') {
            // Attribute changed to valid value
            if (isNonEmptyString(newValue)) {
                this.#helptextElement.textContent = newValue;
            }
            // Attribute removed or invalid value
            else {
                this.#helptextElement.textContent = '';
            }
        }

        if (attribute === 'error') {
            // Attribute changed
            if (isNonEmptyString(newValue)) {
                this.#wrapperElement.classList.add('form-error');
                this.#inputElement.setAttribute('aria-invalid', 'true');
            }
            // Attribute removed
            else {
                this.#wrapperElement.classList.remove('form-error');
                this.#inputElement.removeAttribute('aria-invalid');
            }
        }

        if (attribute === 'prefix') {
            // Attribute changed to valid value
            if (isNonEmptyString(newValue)) {
                this.#inputWrapperElement.classList.add('form-input-wrapper--prefix');
                this.#prefixElement.textContent = newValue;
            }
            // Attribute removed or invalid value
            else {
                this.#inputWrapperElement.classList.remove('form-input-wrapper--prefix');
            }
        }

        if (attribute === 'suffix') {
            // Attribute changed
            if (isNonEmptyString(newValue)) {
                this.#inputWrapperElement.classList.add('form-input-wrapper--suffix');
                this.#suffixElement.textContent = newValue;
            }
            // Attribute removed
            else {
                this.#inputWrapperElement.classList.remove('form-input-wrapper--suffix');
            }
        }

        if (attribute === 'maxwidth') {
            // Attribute changed
            if (Helpers.isValidInteger(newValue)) {
                let paddingPixels = 30; // Input padding-left and padding-right are 15px
                let borderPixels = 4; // Input border-left and border-right are 2px (worst case)
                this.#inputElement.style.maxWidth = 'calc(' + parseInt(newValue) + 'ch + ' + (paddingPixels + borderPixels) + 'px)';  
                this.#inputElement.style.width = '100%';
            }
            // Attribute removed
            else {
                this.#inputElement.style.maxWidth = '';
                this.#inputElement.style.width = '';
            }
        }

        if (attribute === 'maxchar') {
            // Attribute changed
            if (Helpers.isValidInteger(newValue)) {
                this.#characterLimitElement.querySelector('.max-limit').innerHTML = this.#glossary['maxCharactersText'].replace(/{value}/, newValue);

                let charactersRemaining = newValue;
                if (this.value) {
                    charactersRemaining = parseInt(newValue) - this.value.length;
                }
                Helpers.updateVisibleMessage(this.#glossary, charactersRemaining, this.#inputElement, this.#characterLimitElement);
                Helpers.updateSRMessage(this.#glossary, charactersRemaining, this.#characterLimitElement);
            }

            // Attribute added
            if (this.#connected && !this.contains(this.#characterLimitElement) && Helpers.isValidInteger(newValue)) {
                this.#inputElement.addEventListener('keyup', this.#handleKeyUp, false);
                this.#inputElement.addEventListener('focus', this.#handleFocus, false);
                this.#inputElement.addEventListener('blur', this.#handleBlur, false);
                window.addEventListener('pageshow', this.#handlePageShow, false);
            }
            // Attribute removed or invalid
            else if (this.#connected && this.contains(this.#characterLimitElement) && !Helpers.isValidInteger(newValue)) {
                this.#inputElement.removeEventListener('keyup', this.#handleKeyUp, false);
                this.#inputElement.removeEventListener('focus', this.#handleFocus, false);
                this.#inputElement.removeEventListener('blur', this.#handleBlur, false);
                window.removeEventListener('pageshow', this.#handlePageShow, false);
            }
        }

        Helpers.checkDisallowedCombinations(
            isNonEmptyString(this.error), 
            this.hasAttribute('required'), 
            this.hasAttribute('readonly'), 
            this.hasAttribute('disabled'),
            this.hasAttribute('showrequired'),
            this.hasAttribute('showoptional'),
            this.hasAttribute('maxchar')
        );

        /* Update HTML */

        if (this.#triggerRebuild.includes(attribute) && this.#initialised && this.#connected) {
            this.#rebuildElement();
        }
    }
}

export default FDSInput;