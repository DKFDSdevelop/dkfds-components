'use strict';

import { generateAndVerifyUniqueId } from '../../utils/generate-unique-id';
import * as CE from '../custom-element-utils';

class FDSInput extends HTMLElement {

    /* Private instance fields */

    #initialized = false;
    #inputObserver = null;

    #handleCharacterLimitConnection;
    #handleKeyUp;
    #handlePageshow;
    #handleFocus;
    #handleBlur;

    #lastKeyUpTimestamp;
    #oldValue;
    #intervalID;

    /* Private methods */

    #setupObserver() {
        if (this.#inputObserver) return;

        this.#inputObserver = new MutationObserver(this.#handleMutations);
        this.#inputObserver.observe(this, CE.mutationObserverConfig);
    }

    #handleMutations = (records) => {
        for (const { attributeName, target, addedNodes, removedNodes } of records) {

            // A relevant child element was added or removed.
            const relevantTagNames = ['LABEL', 'INPUT', 'FDS-ERROR-MESSAGE', 'FDS-HELP-TEXT', 'FDS-CHARACTER-LIMIT'];
            const allNodes = [...addedNodes, ...removedNodes];
            if (allNodes.some(node => relevantTagNames.includes(node?.tagName))) {
                const label = this.querySelector('label');
                const input = this.querySelector('input');
                const errorMessages = this.querySelectorAll('fds-error-message');
                const helpTexts = this.querySelectorAll('fds-help-text');
                const characterLimit = this.querySelector('fds-character-limit span.sr-only[id]');

                CE.associateLabelWithElement(label, input, 'inp');
                CE.setAriaDescribedBy(input, errorMessages, helpTexts, characterLimit);
                CE.setInvalid(input, errorMessages);

                if (this.hasAttribute('show-required-status')) {
                    CE.showRequiredStatus(label, input, this.getAttribute('show-required-status'));
                }

                break;
            }

            // The input's required attribute changed
            if (attributeName === 'required' && target?.tagName === 'INPUT') {
                if (this.hasAttribute('show-required-status')) {
                    const label = this.querySelector('label');
                    CE.showRequiredStatus(label, target, this.getAttribute('show-required-status'));
                }
            }
            // Attributes which might affect aria-describedby
            else if (
                attributeName === 'id' ||
                attributeName === 'hidden' ||
                attributeName === 'aria-hidden' ||
                attributeName === 'class') {
                const input = this.querySelector('input');
                const errorMessages = this.querySelectorAll('fds-error-message');
                const helpTexts = this.querySelectorAll('fds-help-text');
                const characterLimit = this.querySelector('fds-character-limit span.sr-only[id]');

                CE.setAriaDescribedBy(input, errorMessages, helpTexts, characterLimit);
                CE.setInvalid(input, errorMessages);

                if (attributeName === 'hidden' && target === this) {
                    CE.notifySummaryOnVisibilityChange(this);
                }
            }
        }
    }

    #init() {
        this.#setupObserver();

        const label = this.querySelector('label');
        const input = this.querySelector('input');
        const errorMessages = this.querySelectorAll('fds-error-message');
        const helpTexts = this.querySelectorAll('fds-help-text');
        const characterLimit = this.querySelector('fds-character-limit span.sr-only[id]');

        CE.associateLabelWithElement(label, input, 'inp');
        CE.setAriaDescribedBy(input, errorMessages, helpTexts, characterLimit);
        CE.setInvalid(input, errorMessages);

        if (this.hasAttribute('show-required-status')) {
            CE.showRequiredStatus(label, input, this.getAttribute('show-required-status'));
        }

        this.#initialized = true;
    }

    #getCharacterLimit() {
        return this.querySelector(':scope > fds-character-limit');
    }

    /* Maxwidth */

    #shouldHaveMaxwidth(value) {
        return value !== null && value !== '';
    }

    #setMaxwidth(value) {
        const input = this.querySelector('input');

        if (!input) return;

        const maxwidthClass = [...input.classList].find(cls => cls.startsWith('input-width-') || cls.startsWith('input-char-'));
        input.classList.remove(maxwidthClass);

        if (['xxs', 'xs', 's', 'm', 'l', 'xl'].includes(value)) {
            input.classList.add(`input-width-${value}`);
        } else if (/^\d+$/.test(value)) {
            input.classList.add(`input-char-${value}`);
        }
    }

    #removeMaxwidth() {
        const input = this.querySelector('input');

        if (!input) return;

        const maxwidthClass = [...input.classList].find(cls => cls.startsWith('input-width-') || cls.startsWith('input-char-'));
        input.classList.remove(maxwidthClass);
    }

    /* Character limitation */

    #callUpdateVisibleMessage() {
        const input = this.querySelector('input');

        this.#getCharacterLimit()?.setCharactersUsed(input.value.length);
        this.#getCharacterLimit()?.updateVisibleMessage();
    }

    #setCharacterLimitListeners() {
        const input = this.querySelector('input');

        input.addEventListener('keyup', this.#handleKeyUp);
        input.addEventListener('focus', this.#handleFocus);
        input.addEventListener('blur', this.#handleBlur);

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
                    const input = this.querySelector('input');
                    if (this.#oldValue !== input.value || !this.#getCharacterLimit().hasMatchingMessages()) {
                        this.#oldValue = input.value;
                        this.#getCharacterLimit().updateMessages();
                    }
                }
            }
        }, 1000);
    }

    /* Attributes which can invoke attributeChangedCallback() */

    static observedAttributes = ['show-required-status', 'input-maxwidth'];

    /* --------------------------------------------------
    GETTERS AND SETTERS
    -------------------------------------------------- */

    get showRequiredStatus() { return this.getAttribute('show-required-status'); }
    set showRequiredStatus(value) { value === null ? this.removeAttribute('show-required-status') : this.setAttribute('show-required-status', value); }

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
            const input = this.querySelector('input');
            if (this.#oldValue !== input.value) {
                this.#oldValue = input.value;
                this.#getCharacterLimit().updateVisibleMessage();
            }
            this.#getCharacterLimit().silenceSrMessage();
        }

        this.#handlePageshow = () => { this.#callUpdateVisibleMessage(); }

        this.#handleCharacterLimitConnection = () => { this.#setCharacterLimitListeners(); }
    }

    /* --------------------------------------------------
    CUSTOM ELEMENT ADDED TO DOCUMENT
    -------------------------------------------------- */

    connectedCallback() {
        if (!this.#initialized) { this.#init(); }

        if (this.#shouldHaveMaxwidth(this.getAttribute('input-maxwidth'))) this.#setMaxwidth(this.getAttribute('input-maxwidth'));

        this.addEventListener('character-limit-connection', this.#handleCharacterLimitConnection);
    }

    /* --------------------------------------------------
    CUSTOM ELEMENT REMOVED FROM DOCUMENT
    -------------------------------------------------- */

    disconnectedCallback() {
        this.removeEventListener('character-limit-connection', this.#handleCharacterLimitConnection);

        const input = this.querySelector('input');

        input.removeEventListener('keyup', this.#handleKeyUp);
        input.removeEventListener('focus', this.#handleFocus);
        input.removeEventListener('blur', this.#handleBlur);
        window.removeEventListener('pageshow', this.#handlePageshow);
        document.removeEventListener('DOMContentLoaded', this.#handlePageshow);

        CE.notifySummaryOnDisconnect(this);

        this.#initialized = false;

        if (this.#inputObserver) {
            this.#inputObserver.disconnect();
            this.#inputObserver = null;
        }
    }

    /* --------------------------------------------------
    CUSTOM ELEMENT'S ATTRIBUTE(S) CHANGED
    -------------------------------------------------- */

    attributeChangedCallback(attribute, oldValue, newValue) {
        if (!this.#initialized) return;

        if (attribute === 'show-required-status' && (oldValue !== newValue)) {
            const label = this.querySelector('label');
            const input = this.querySelector('input');
            CE.showRequiredStatus(label, input, newValue);
        }

        if (attribute === 'input-maxwidth' && (oldValue !== newValue)) {
            this.#shouldHaveMaxwidth(newValue) ? this.#setMaxwidth(newValue) : this.#removeMaxwidth();
        }
    }
}

function registerInput() {
    if (customElements.get('fds-input') === undefined) {
        window.customElements.define('fds-input', FDSInput);
    }
}

export default registerInput;