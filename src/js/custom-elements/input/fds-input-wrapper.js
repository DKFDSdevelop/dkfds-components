'use strict';

import { generateAndVerifyUniqueId } from '../../utils/generate-unique-id';

class FDSInputWrapper extends HTMLElement {

    /* Private instance fields */

    #input;
    #label;
    #limit;

    #handleHelpTextCallback;
    #handleErrorMessageCallback;
    #handleCharacterLimitCallback;
    #handleCharacterLimitConnection;
    #handleKeyUp;
    #handlePageshow;
    #handleFocus;
    #handleBlur;

    #lastKeyUpTimestamp;
    #oldValue;
    #intervalID;

    /* Private methods */

    #getInputElement() {
        if (this.#input) return this.#input;

        this.#input = this.querySelector('input');
        return this.#input;
    }

    #getLabelElement() {
        if (this.#label) return this.#label;

        this.#label = this.querySelector('label');
        return this.#label;
    }

    #getCharacterLimit() {
        if (this.#limit) return this.#limit;

        this.#limit = this.querySelector(':scope > fds-character-limit');
        return this.#limit;
    }

    /* Indicator */

    #shouldHaveIndicator(value) {
        return value !== null;
    }

    #setIndicator(value = '') {
        if (!this.#getLabelElement() || !this.#getInputElement()) return;

        if (!this.#getLabelElement().querySelector(':scope > span.weight-normal')) {
            const span = document.createElement('span');
            span.className = 'weight-normal';
            this.#getLabelElement().appendChild(span);
        }

        const isRequired = 
            this.#getInputElement().hasAttribute('required') || 
            (this.#getInputElement().hasAttribute('aria-required') && this.#getInputElement().getAttribute('aria-required') !== 'false');

        let text = value;
        if (value === '' && isRequired) text = 'skal udfyldes';
        if (value === '' && !isRequired) text = 'frivilligt';

        if (isRequired) {
            this.#getLabelElement().querySelector(':scope > span.weight-normal').textContent = ` (*${text})`;
        }
        else {
            this.#getLabelElement().querySelector(':scope > span.weight-normal').textContent = ` (${text})`;
        }
    }

    #removeIndicator() {
        this.#getLabelElement()?.querySelector(':scope > span.weight-normal')?.remove();
    }
    
    /* Readonly */

    #shouldHaveReadonly(value) {
        return value !== null && value !== 'false' && value !== false;
    }

    #setReadonly() {
        this.#getInputElement()?.setAttribute('readonly', '');
        this.querySelector(':scope > .form-input-wrapper')?.classList.add('readonly');
    }

    #removeReadonly() {
        this.#getInputElement()?.removeAttribute('readonly');
        this.querySelector(':scope > .form-input-wrapper')?.classList.remove('readonly');
    }

    /* Disabled */

    #shouldHaveDisabled(value) {
        return value !== null && value !== 'false' && value !== false;
    }

    #setDisabled() {
        this.#getInputElement()?.setAttribute('disabled', '');
        this.#getLabelElement()?.classList.add('disabled');
        this.querySelector(':scope > .form-input-wrapper')?.classList.add('disabled');
    }

    #removeDisabled() {
        this.#getInputElement()?.removeAttribute('disabled');
        this.#getLabelElement()?.classList.remove('disabled');
        this.querySelector(':scope > .form-input-wrapper')?.classList.remove('disabled');
    }

    /* Prefix */

    #shouldHavePrefix(value) {
        return value !== null && value !== '';
    }

    #setPrefix(value) {
        if (!this.#getInputElement()) return;

        let wrapper = this.querySelector(':scope > .form-input-wrapper');

        if (!wrapper) {
            wrapper = document.createElement('div');
            this.insertBefore(wrapper, this.#getInputElement());
            wrapper.appendChild(this.#getInputElement());
        }

        wrapper.classList.add('form-input-wrapper', 'form-input-wrapper--prefix');
        this.#shouldHaveDisabled(this.#getInputElement()?.hasAttribute('disabled')) ? wrapper.classList.add('disabled') : wrapper.classList.remove('disabled');
        this.#shouldHaveReadonly(this.#getInputElement()?.hasAttribute('readonly')) ? wrapper.classList.add('readonly') : wrapper.classList.remove('readonly');

        let prefixEl = wrapper.querySelector('.form-input-prefix');
        if (!prefixEl) {
            prefixEl = document.createElement('div');
            prefixEl.className = 'form-input-prefix';
            prefixEl.setAttribute('aria-hidden', 'true');
            wrapper.insertBefore(prefixEl, this.#getInputElement());
        }
        prefixEl.textContent = value;
    }

    #removePrefix() {
        let wrapper = this.querySelector(':scope > .form-input-wrapper');
        if (!wrapper || !this.#getInputElement()) return;

        let prefixEl = wrapper.querySelector('.form-input-prefix');
        prefixEl?.remove();
        wrapper.classList.remove('form-input-wrapper--prefix');

        if (!wrapper.classList.contains('form-input-wrapper--prefix') && !wrapper.classList.contains('form-input-wrapper--suffix')) {
            wrapper.replaceWith(this.#getInputElement());
        }
    }

    /* Suffix */

    #shouldHaveSuffix(value) {
        return value !== null && value !== '';
    }

    #setSuffix(value) {
        if (!this.#getInputElement()) return;

        let wrapper = this.querySelector(':scope > .form-input-wrapper');

        if (!wrapper) {
            wrapper = document.createElement('div');
            this.insertBefore(wrapper, this.#getInputElement());
            wrapper.appendChild(this.#getInputElement());
        }

        wrapper.classList.add('form-input-wrapper', 'form-input-wrapper--suffix');
        this.#shouldHaveDisabled(this.#getInputElement()?.hasAttribute('disabled')) ? wrapper.classList.add('disabled') : wrapper.classList.remove('disabled');
        this.#shouldHaveReadonly(this.#getInputElement()?.hasAttribute('readonly')) ? wrapper.classList.add('readonly') : wrapper.classList.remove('readonly');

        let suffixEl = wrapper.querySelector('.form-input-suffix');
        if (!suffixEl) {
            suffixEl = document.createElement('div');
            suffixEl.className = 'form-input-suffix';
            suffixEl.setAttribute('aria-hidden', 'true');
            wrapper.appendChild(suffixEl);
        }
        suffixEl.textContent = value;
    }

    #removeSuffix() {
        let wrapper = this.querySelector(':scope > .form-input-wrapper');
        if (!wrapper || !this.#getInputElement()) return;

        let suffixEl = wrapper.querySelector('.form-input-suffix');
        suffixEl?.remove();
        wrapper.classList.remove('form-input-wrapper--suffix');

        if (!wrapper.classList.contains('form-input-wrapper--prefix') && !wrapper.classList.contains('form-input-wrapper--suffix')) {
            wrapper.replaceWith(this.#getInputElement());
        }
    }

    /* Maxwidth */

    #shouldHaveMaxwidth(value) {
        return value !== null && value !== '';
    }

    #setMaxwidth(value) {
        if (!this.#getInputElement()) return;

        const maxwidthClass = [...this.#getInputElement().classList].find(cls => cls.startsWith('input-width-') || cls.startsWith('input-char-'));
        this.#getInputElement().classList.remove(maxwidthClass);

        if (['xxs', 'xs', 's', 'm', 'l', 'xl'].includes(value)) {
            this.#getInputElement().classList.add(`input-width-${value}`);
        } else if (/^\d+$/.test(value)) {
            this.#getInputElement().classList.add(`input-char-${value}`);
        }
    }

    #removeMaxwidth() {
        if (!this.#getInputElement()) return;

        const maxwidthClass = [...this.#getInputElement().classList].find(cls => cls.startsWith('input-width-') || cls.startsWith('input-char-'));
        this.#getInputElement().classList.remove(maxwidthClass);
    }

    /* Character limitation */

    #callUpdateVisibleMessage() {
        this.#getCharacterLimit()?.setCharactersUsed(this.#getInputElement().value.length);
        this.#getCharacterLimit()?.updateVisibleMessage();
    }

    #setCharacterLimitListeners() {
        this.#getInputElement().addEventListener('keyup', this.#handleKeyUp);
        this.#getInputElement().addEventListener('focus', this.#handleFocus);
        this.#getInputElement().addEventListener('blur', this.#handleBlur);

        /* If the browser supports the pageshow event, use it to update the character limit
        message and sr-message once a page has loaded. Second best, use the DOMContentLoaded event. 
        This ensures that if the user navigates to another page in the browser and goes back, the 
        message and sr-message will show/tell the correct amount of characters left. */
        if ('onpageshow' in window) {
            window.addEventListener('pageshow', this.#handlePageshow);
        }
        else {
            document.addEventListener('DOMContentLoaded', this.#handlePageshow);
        }
    }

    #intervalSetup() {
        if (this.#intervalID !== null) {
            window.clearInterval(this.#intervalID);
            this.#intervalID = null;
        }

        this.#getCharacterLimit().silenceVisibleMessage();

        this.#intervalID = window.setInterval(() => {
            /* Don't update the Screen Reader message unless it's been awhile
            since the last key up event. Otherwise, the user will be spammed
            with audio notifications while typing. */
            if (this.#getCharacterLimit()) {
                if (!this.#lastKeyUpTimestamp || (Date.now() - 500) >= this.#lastKeyUpTimestamp) {
                    if (this.#oldValue !== this.#getInputElement().value || !this.#getCharacterLimit().hasMatchingMessages()) {
                        this.#oldValue = this.#getInputElement().value;
                        this.#getCharacterLimit().updateMessages();
                    }
                }
            }
        }, 1000);
    }

    /* Attributes which can invoke attributeChangedCallback() */

    static observedAttributes = ['input-indicator', 'input-readonly', 'input-disabled', 'input-prefix', 'input-suffix', 'input-maxwidth'];

    /* --------------------------------------------------
    CUSTOM ELEMENT CONSTRUCTOR (do not access or add attributes in the constructor)
    -------------------------------------------------- */

    constructor() {
        super();
        this.#lastKeyUpTimestamp = null;
        this.#oldValue = null;
        this.#intervalID = null;

        this.#handleKeyUp = () => {
            this.#callUpdateVisibleMessage();
            this.#lastKeyUpTimestamp = Date.now();
        }

        this.#handleFocus = () => { this.#intervalSetup(); }

        this.#handleBlur = () => {
            window.clearInterval(this.#intervalID);
            this.#intervalID = null;
            if (this.#oldValue !== this.#getInputElement().value) {
                this.#oldValue = this.#getInputElement().value;
                this.#getCharacterLimit().updateVisibleMessage();
            }
            this.#getCharacterLimit().silenceSrMessage();
        }

        this.#handlePageshow = () => { this.#callUpdateVisibleMessage(); }

        this.#handleHelpTextCallback = () => { this.updateIdReferences(); }
        this.#handleErrorMessageCallback = () => { this.updateIdReferences(); }
        this.#handleCharacterLimitCallback = () => { this.updateIdReferences(); }
        this.#handleCharacterLimitConnection = () => { this.#setCharacterLimitListeners(); }
    }

    /* --------------------------------------------------
    CUSTOM ELEMENT METHODS
    -------------------------------------------------- */

    updateIdReferences() {
        if (!this.#getInputElement()) return;

        // Set/remove 'for' on label
        if (this.#getLabelElement()) {
            if (!this.#getInputElement().id) {
                this.#getInputElement().id = generateAndVerifyUniqueId('inp');
            }
            this.#getLabelElement().htmlFor = this.#getInputElement().id;
        }

        // IDs to be used in aria-describedby
        const idsForAriaDescribedby = [];

        // Help text ID
        this.querySelectorAll('fds-help-text').forEach(helptext => {
            const text = helptext.querySelector(':scope > .help-text');
            if (text?.hasAttribute('id')) {
                idsForAriaDescribedby.push(text.id);
            }
        });

        // Error message IDs
        let hasError = false;
        this.querySelectorAll('fds-error-message').forEach(errorText => {
            if (errorText?.id) {
                idsForAriaDescribedby.push(errorText.id);
                hasError = true;
            }
        });

        // Character limit ID
        if (this.#getCharacterLimit()) {
            const spanId = this.#getCharacterLimit().querySelector(':scope > span[id]');
            if (spanId?.hasAttribute('id')) {
                idsForAriaDescribedby.push(spanId.id);
            }
        }

        // Set/remove aria-describedby on input
        if (idsForAriaDescribedby.length > 0) {
            this.#getInputElement().setAttribute('aria-describedby', idsForAriaDescribedby.join(' '));
        }
        else {
            this.#getInputElement().removeAttribute('aria-describedby');
        }

        // Set aria-invalid if wrapper has error messages
        if (hasError) {
            this.#getInputElement().setAttribute('aria-invalid', 'true');
        } else {
            this.#getInputElement().removeAttribute('aria-invalid');
        }
    }

    setClasses() {
        if (!this.#getLabelElement() || !this.#getInputElement()) return;

        this.#getLabelElement().classList.add('form-label');
        this.#getInputElement().classList.add('form-input');
    }

    /* --------------------------------------------------
    CUSTOM ELEMENT ADDED TO DOCUMENT
    -------------------------------------------------- */

    connectedCallback() {
        this.setClasses();
        if (this.#shouldHaveIndicator(this.getAttribute('input-indicator'))) this.#setIndicator(this.getAttribute('input-indicator'));
        if (this.#shouldHaveReadonly(this.getAttribute('input-readonly'))) this.#setReadonly();
        if (this.#shouldHaveDisabled(this.getAttribute('input-disabled'))) this.#setDisabled();
        if (this.#shouldHavePrefix(this.getAttribute('input-prefix'))) this.#setPrefix(this.getAttribute('input-prefix'));
        if (this.#shouldHaveSuffix(this.getAttribute('input-suffix'))) this.#setSuffix(this.getAttribute('input-suffix'));
        if (this.#shouldHaveMaxwidth(this.getAttribute('input-maxwidth'))) this.#setMaxwidth(this.getAttribute('input-maxwidth'));
        this.updateIdReferences();

        this.addEventListener('help-text-callback', this.#handleHelpTextCallback);
        this.addEventListener('error-message-callback', this.#handleErrorMessageCallback);
        this.addEventListener('character-limit-callback', this.#handleCharacterLimitCallback);
        this.addEventListener('character-limit-connection', this.#handleCharacterLimitConnection);
    }

    /* --------------------------------------------------
    CUSTOM ELEMENT REMOVED FROM DOCUMENT
    -------------------------------------------------- */

    disconnectedCallback() {
        this.removeEventListener('help-text-callback', this.#handleHelpTextCallback);
        this.removeEventListener('error-message-callback', this.#handleErrorMessageCallback);
        this.removeEventListener('character-limit-callback', this.#handleCharacterLimitCallback);
        this.removeEventListener('character-limit-connection', this.#handleCharacterLimitConnection);

        this.#getInputElement().removeEventListener('keyup', this.#handleKeyUp);
        this.#getInputElement().removeEventListener('focus', this.#handleFocus);
        this.#getInputElement().removeEventListener('blur', this.#handleBlur);
        window.removeEventListener('pageshow', this.#handlePageshow);
        document.removeEventListener('DOMContentLoaded', this.#handlePageshow);
    }

    /* --------------------------------------------------
    CUSTOM ELEMENT'S ATTRIBUTE(S) CHANGED
    -------------------------------------------------- */

    attributeChangedCallback(attribute, oldValue, newValue) {
        if (!this.isConnected) return;

        if (attribute === 'input-indicator') {
            this.#shouldHaveIndicator(newValue) ? this.#setIndicator(newValue) : this.#removeIndicator();
        }

        if (attribute === 'input-readonly' && (oldValue !== newValue)) {
            this.#shouldHaveReadonly(newValue) ? this.#setReadonly() : this.#removeReadonly();
        }

        if (attribute === 'input-disabled' && (oldValue !== newValue)) {
            this.#shouldHaveDisabled(newValue) ? this.#setDisabled() : this.#removeDisabled();
        }

        if (attribute === 'input-prefix' && (oldValue !== newValue)) {
            this.#shouldHavePrefix(newValue) ? this.#setPrefix(newValue) : this.#removePrefix();
        }

        if (attribute === 'input-suffix' && (oldValue !== newValue)) {
            this.#shouldHaveSuffix(newValue) ? this.#setSuffix(newValue) : this.#removeSuffix();
        }

        if (attribute === 'input-maxwidth' && (oldValue !== newValue)) {
            this.#shouldHaveMaxwidth(newValue) ? this.#setMaxwidth(newValue) : this.#removeMaxwidth();
        }
    }
}

function registerInputWrapper() {
    if (customElements.get('fds-input-wrapper') === undefined) {
        window.customElements.define('fds-input-wrapper', FDSInputWrapper);
    }
}

export default registerInputWrapper;