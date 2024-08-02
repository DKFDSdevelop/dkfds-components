'use strict';

import * as Glossary from './fds-input-glossary';
import {isValidText, isValidInteger, isValidType} from './fds-input-attribute-validators';
import * as Helpers from './fds-input-helpers';
import * as HandleAttributeChange from './fds-input-attribute-changes';
import * as Build from './fds-input-build-element';
import Tooltip from '../../components/tooltip';

class FDSInput extends HTMLElement {
    
    /* Private instance fields */

    #wrapperElement;
    #labelElement;
    #tooltipElement;
    #helptextElement;
    #errorElement;
    #editWrapperElement;
    #inputWrapperElement;
    #prefixElement;
    #inputElement;
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
        if (isValidText(this.label)) {
            this.#labelElement.textContent = this.label;
        }

        // Update IDs
        Helpers.setHelptextId(this.#helptextElement, this.#inputElement);
        Helpers.setErrorId(this.#errorElement, this.#inputElement);
        Helpers.setCharacterLimitId(this.#characterLimitElement, this.#inputElement);
        Helpers.setTooltipId(this.#tooltipElement, this.#inputElement);

        // Set up aria-describedby attribute
        Build.setInputAriaDescribedBy(
            this.error, this.helptext, this.maxchar, 
            this.#errorElement, this.#helptextElement, this.#characterLimitElement, 
            this.#inputElement
        );

        // Set up edit button
        if (this.hasAttribute('editbutton') && isValidText(this.label)) {
            Helpers.updateEditButton(this.#editButtonElement, this.label, this.#glossary['editText']);
        }

        // Update error message
        if (isValidText(this.error)) {
            Helpers.updateErrorMessage(this.#errorElement, this.error, this.#glossary['errorText']);
        }
        
        // Add label
        this.#wrapperElement.appendChild(this.#labelElement);

        // Add 'required' label
        if (this.hasAttribute('showrequired') && isValidText(this.label)) {
            Helpers.updateRequiredLabel(this.#labelElement, this.label, this.#glossary['requiredText']);
        }

        // Add 'optional' label
        if (this.hasAttribute('showoptional') && isValidText(this.label)) {
            Helpers.updateOptionalLabel(this.#labelElement, this.label, this.#glossary['optionalText']);
        }

        // Add tooltip
        if (isValidText(this.tooltip)) { 
            this.#wrapperElement.appendChild(this.#tooltipElement);
            if (this.#tooltipElement.querySelector('.tooltip-arrow') === null) {
                new Tooltip(this.#tooltipElement).init();
            }
        }

        // Add helptext
        if (isValidText(this.helptext)) { 
            this.#wrapperElement.appendChild(this.#helptextElement); 
        }

        // Add error message
        if (isValidText(this.error)) { 
            this.#wrapperElement.appendChild(this.#errorElement); 
        }

        // Add wrapper for edit button
        if (this.hasAttribute('editbutton') && this.hasAttribute('readonly')) {
            this.#wrapperElement.appendChild(this.#editWrapperElement);
        }

        // Add wrapper for prefix and suffix
        if (isValidText(this.prefix) || isValidText(this.suffix)) {
            if (this.hasAttribute('editbutton') && this.hasAttribute('readonly')) {
                this.#editWrapperElement.appendChild(this.#inputWrapperElement);
            }
            else {
                this.#wrapperElement.appendChild(this.#inputWrapperElement);
            }
        }

        // Add prefix
        if (isValidText(this.prefix)) { 
            this.#inputWrapperElement.appendChild(this.#prefixElement); 
        }

        // Add input
        if (isValidText(this.prefix) || isValidText(this.suffix)) {
            this.#inputWrapperElement.appendChild(this.#inputElement);
        }
        else if (this.hasAttribute('editbutton') && this.hasAttribute('readonly')) {
            this.#editWrapperElement.appendChild(this.#inputElement);
        }
        else {
            this.#wrapperElement.appendChild(this.#inputElement);
        }

        // Add suffix
        if (isValidText(this.suffix)) { 
            this.#inputWrapperElement.appendChild(this.#suffixElement); 
        }

        // Add edit button
        if (this.hasAttribute('editbutton') && this.hasAttribute('readonly')) {
            this.#editWrapperElement.appendChild(this.#editButtonElement);
        }

        // Add character limit
        if (isValidInteger(this.maxchar)) {
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

    static observedAttributes = ['autocomplete', 'disabled', 'editbutton', 'error', 'helptext', 'inputid', 'label', 'maxchar', 'maxwidth', 'name', 'prefix', 'readonly', 'required', 'showoptional', 'showrequired', 'suffix', 'tooltip', 'type', 'value'];

    /*
    --------------------------------------------------
    ATTRIBUTE GETTERS AND SETTERS
    --------------------------------------------------
    */

    get autocomplete() { return this.getAttribute('autocomplete'); }
    set autocomplete(val) { this.setAttribute('autocomplete', val); }

    get disabled() { return this.getAttribute('disabled'); }
    set disabled(val) { this.setAttribute('disabled', val); }

    get editbutton() { return this.getAttribute('editbutton'); }
    set editbutton(val) { this.setAttribute('editbutton', val); }

    get error() { return this.getAttribute('error'); }
    set error(val) { this.setAttribute('error', val); }

    get helptext() { return this.getAttribute('helptext'); }
    set helptext(val) { this.setAttribute('helptext', val); }

    get inputid() { return this.getAttribute('inputid'); }
    set inputid(val) { this.setAttribute('inputid', val); }

    get label() { return this.getAttribute('label'); }
    set label(val) { this.setAttribute('label', val); }

    get maxchar() { return this.getAttribute('maxchar'); }
    set maxchar(val) { this.setAttribute('maxchar', val); }

    get maxwidth() { return this.getAttribute('maxwidth'); }
    set maxwidth(val) { this.setAttribute('maxwidth', val); }

    get name() { return this.getAttribute('name'); }
    set name(val) { this.setAttribute('name', val); }

    get prefix() { return this.getAttribute('prefix'); }
    set prefix(val) { this.setAttribute('prefix', val); }

    get readonly() { return this.getAttribute('readonly'); }
    set readonly(val) { this.setAttribute('readonly', val); }

    get required() { return this.getAttribute('required'); }
    set required(val) { this.setAttribute('required', val); }

    get showoptional() { return this.getAttribute('showoptional'); }
    set showoptional(val) { this.setAttribute('showoptional', val); }

    get showrequired() { return this.getAttribute('showrequired'); }
    set showrequired(val) { this.setAttribute('showrequired', val); }

    get suffix() { return this.getAttribute('suffix'); }
    set suffix(val) { this.setAttribute('suffix', val); }

    get tooltip() { return this.getAttribute('tooltip'); }
    set tooltip(val) { this.setAttribute('tooltip', val); }

    get type() { return this.getAttribute('type'); }
    set type(val) { this.setAttribute('type', val); }
    
    get value() { return this.#inputElement.value; }
    set value(val) { this.#inputElement.value = val; }

    /*
    --------------------------------------------------
    CUSTOM ELEMENT CONSTRUCTOR (do not access or add attributes in the constructor)
    --------------------------------------------------
    */

    constructor() {
        super();

        this.#initialised = false;
        this.#connected = false;
        this.#glossary = Glossary.glossary;

        this.#triggerRebuild = ['label', 'inputid', 'required', 'disabled', 'readonly', 'helptext', 'error', 'prefix', 'suffix', 'editbutton', 'showrequired', 'showoptional', 'maxchar', 'tooltip'];

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
    --------------------------------------------------
    CUSTOM ELEMENT FUNCTIONS
    --------------------------------------------------
    */

    getLabelElement() {
        return this.#labelElement;
    }

    getInputElement() {
        return this.#inputElement;
    }

    updateGlossary(newGlossary) {
        Glossary.updateGlossary(this.#glossary, newGlossary);

        /* Check if the old text is (potentially) visible to the user */
        let updateErrorTextNow = newGlossary['errorText'] !== undefined && isValidText(this.error);
        let updateEditTextNow = newGlossary['editText'] !== undefined && isValidText(this.label) && this.hasAttribute('editbutton');
        let updateRequiredTextNow = newGlossary['requiredText'] !== undefined && isValidText(this.label) && this.hasAttribute('showrequired');
        let updateOptionalTextNow = newGlossary['optionalText'] !== undefined && isValidText(this.label) && this.hasAttribute('showoptional');
        let updateCharactersTextNow = newGlossary['oneCharacterLeftText'] || newGlossary['manyCharactersLeftText'] || 
                                      newGlossary['oneCharacterExceededText'] || newGlossary['manyCharactersExceededText'];
        let updateMaxCharactersTextNow = newGlossary['maxCharactersText'] !== undefined && isValidInteger(this.maxchar);
        let updateTooltipIconText = newGlossary['tooltipIconText'] !== undefined;

        /* If the old text is visible to the user, update it immediately */
        if (updateErrorTextNow) {
            Helpers.updateErrorMessage(this.#errorElement, this.error, this.#glossary['errorText']);
        }
        if (updateEditTextNow) {
            Helpers.updateEditButton(this.#editButtonElement, this.label, this.#glossary['editText']);
        }
        if (updateRequiredTextNow) {
            Helpers.updateRequiredLabel(this.#labelElement, this.label, this.#glossary['requiredText']);
        }
        if (updateOptionalTextNow) {
            Helpers.updateOptionalLabel(this.#labelElement, this.label, this.#glossary['optionalText']);
        }
        if (updateCharactersTextNow) {
            /* Prevent screen readers from announcing the glossary change */
            let maxLimitText = this.#characterLimitElement.querySelector('.max-limit').innerHTML;
            this.#characterLimitElement.innerHTML = 
                '<span class="max-limit">' + maxLimitText + '</span>' + 
                '<span class="visible-message form-hint" aria-hidden="true"></span>' + 
                '<span class="sr-message"></span>';
            this.updateMessages();
            this.#characterLimitElement.querySelector('.sr-message').setAttribute('aria-live', 'polite');
        }
        if (updateMaxCharactersTextNow) {
            this.#characterLimitElement.querySelector('.max-limit').innerHTML = this.#glossary['maxCharactersText'].replace(/{value}/, this.maxchar);
        }
        if (updateTooltipIconText) {
            this.#tooltipElement.querySelector('button').setAttribute('aria-label', this.#glossary['tooltipIconText']);
        }
    }

    charactersLeft() {
        if (isValidInteger(this.maxchar)) {
            let currentLength = this.#inputElement.value.length;
            return parseInt(this.maxchar) - currentLength;
        }
        else {
            return undefined;
        }
    }

    updateMessages() {
        if (isValidInteger(this.maxchar)) {
            let chars = this.charactersLeft();
            Helpers.updateVisibleMessage(this.#glossary, chars, this.#inputElement, this.#characterLimitElement);
            Helpers.updateSRMessage(this.#glossary, chars, this.#characterLimitElement);
        }
    }

    /*
    --------------------------------------------------
    CUSTOM ELEMENT ADDED TO DOCUMENT
    --------------------------------------------------
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
            if (!isValidText(this.inputid)) {
                Helpers.setDefaultInputId(this.#labelElement, this.#inputElement);
            }

            /* Ensure input always has a type */
            if (!isValidType(this.type)) {
                Helpers.setDefaultType(this.#inputElement);
            }

            this.#rebuildElement();
            this.appendChild(this.#wrapperElement);

            if (isValidInteger(this.maxchar)) {
                this.#inputElement.addEventListener('keyup', this.#handleKeyUp, false);
                this.#inputElement.addEventListener('focus', this.#handleFocus, false);
                this.#inputElement.addEventListener('blur', this.#handleBlur, false);
                window.addEventListener('pageshow', this.#handlePageShow, false);
            }
            
            this.#connected = true;
        }
    }

    /* 
    --------------------------------------------------
    CUSTOM ELEMENT REMOVED FROM DOCUMENT
    --------------------------------------------------
    */ 

    disconnectedCallback() { }

    /*
    --------------------------------------------------
    CUSTOM ELEMENT'S ATTRIBUTE(S) CHANGED
    --------------------------------------------------
    */

    attributeChangedCallback(attribute, oldValue, newValue) {

        /* Element setup. Applied once on the first call to 
           attributeChangedCallback() before connectedCallback(). */

        if (!this.#initialised) {
            this.#wrapperElement        = Build.createWrapperElement();
            this.#labelElement          = Build.createLabelElement();
            this.#tooltipElement        = Build.createTooltipElement(this.#glossary);
            this.#helptextElement       = Build.createHelptextElement();
            this.#errorElement          = Build.createErrorElement();
            this.#editWrapperElement    = Build.createEditWrapperElement();
            this.#inputWrapperElement   = Build.createInputWrapperElement();
            this.#prefixElement         = Build.createPrefixElement();
            this.#inputElement          = Build.createInputElement();
            this.#suffixElement         = Build.createSuffixElement();
            this.#editButtonElement     = Build.createEditButtonElement(this.#handleEditClicked);
            this.#characterLimitElement = Build.createCharacterLimitElement();

            this.#initialised = true;
        }

        /* Attribute changes */

        if (attribute === 'autocomplete') {
            HandleAttributeChange.autocomplete(newValue, this.#inputElement);
        }

        if (attribute === 'disabled') {
            HandleAttributeChange.disabled(newValue, this.#labelElement, this.#inputElement);
        }

        // editbutton handled in rebuild step

        if (attribute === 'error') {
            HandleAttributeChange.error(newValue, this.#wrapperElement, this.#inputElement);
        }

        if (attribute === 'helptext') {
            HandleAttributeChange.helptext(newValue, this.#helptextElement);
        }

        if (attribute === 'inputid') { 
            HandleAttributeChange.inputid(newValue, this.#labelElement, this.#inputElement); 
        }

        if (attribute === 'label') { 
            HandleAttributeChange.label(newValue, this.#labelElement); 
        }

        if (attribute === 'maxchar') {
            HandleAttributeChange.maxchar(newValue, this.#inputElement, this.#characterLimitElement, this.#connected, this.#glossary, this.#handleKeyUp, this.#handleFocus, this.#handleBlur, this.#handlePageShow, this.value, this.contains(this.#characterLimitElement));
        }

        if (attribute === 'maxwidth') {
            HandleAttributeChange.maxwidth(newValue, this.#inputElement);
        }

        if (attribute === 'name') { 
            HandleAttributeChange.name(newValue, this.#inputElement); 
        }

        if (attribute === 'prefix') {
            HandleAttributeChange.prefix(newValue, this.#inputWrapperElement, this.#prefixElement);
        }

        if (attribute === 'readonly') {
            HandleAttributeChange.readonly(newValue, this.#inputElement);
        }

        if (attribute === 'required') {
            HandleAttributeChange.required(newValue, this.#inputElement);
        }

        // showoptional handled in rebuild step

        // showrequired handled in rebuild step

        if (attribute === 'suffix') {
            HandleAttributeChange.suffix(newValue, this.#inputWrapperElement, this.#suffixElement);
        }

        if (attribute === 'tooltip') {
            HandleAttributeChange.tooltip(newValue, this.#tooltipElement);
        }

        if (attribute === 'type') {
            HandleAttributeChange.type(newValue, this.#inputElement);
        }

        if (attribute === 'value') { 
            HandleAttributeChange.value(newValue, this.#inputElement, this.#characterLimitElement, this.#connected, this.#glossary, this.maxchar); 
        }

        Helpers.checkDisallowedCombinations(
            isValidText(this.error), 
            this.hasAttribute('required'), 
            this.hasAttribute('readonly'), 
            this.hasAttribute('disabled'),
            this.hasAttribute('showrequired'),
            this.hasAttribute('showoptional'),
            isValidInteger(this.maxchar)
        );

        /* Update HTML */

        if (this.#triggerRebuild.includes(attribute) && this.#initialised && this.#connected) {
            this.#rebuildElement();
        }
    }
}

export default FDSInput;