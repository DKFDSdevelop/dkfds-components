'use strict';

import { generateAndVerifyUniqueId } from '../../utils/generate-unique-id';
import * as CE from '../custom-element-utils';

class FDSInput extends HTMLElement {

    /* Private instance fields */

    #initialized = false;
    #inputObserver = null;

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
    #handleVisibilityChange;

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
            const relevantTagNames = ['LABEL', 'INPUT', 'FDS-ERROR-MESSAGE', 'FDS-HELP-TEXT'];
            const allNodes = [...addedNodes, ...removedNodes];
            if (allNodes.some(node => relevantTagNames.includes(node?.tagName))) {
                const label = this.querySelector('label');
                const input = this.querySelector('input');

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
        }
    }

    #init() {
        this.#setupObserver();

        const label = this.querySelector('label');
        const input = this.querySelector('input');

        if (this.hasAttribute('show-required-status')) {
            CE.showRequiredStatus(label, input, this.getAttribute('show-required-status'));
        }

        this.#initialized = true;
    }

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
        return this.querySelector(':scope > fds-character-limit');
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

    #processVisibilityChange(event) {
        const { detail } = event;

        // Extract ID and hidden status - works for both error and help-text events
        const elementId = detail.errorId || detail.helptextId || detail.characterLimitId;
        const isHidden = detail.isHidden;

        const element = this.querySelector(`#${elementId}`);
        if (element) {
            element.hiddenStatus = isHidden;
        }
        this.updateIdReferences();
    }

    #isElementHidden = (element) => {
        return element.hiddenStatus !== undefined
            ? element.hiddenStatus
            : (element.hasAttribute('hidden') && element.getAttribute('hidden') !== 'false');
    };

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
        this.#handleVisibilityChange = (event) => { this.#processVisibilityChange(event); };
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
            if (helptext.hasAttribute('id')) {
                const isHidden = this.#isElementHidden(helptext);
                if (!isHidden) {
                    idsForAriaDescribedby.push(helptext.id);
                }
            }
        });

        // Error message IDs
        let hasError = false;
        let hasVisibleError = false;
        this.querySelectorAll('fds-error-message').forEach(errorText => {
            if (errorText?.id) {
                hasError = true;
                const isHidden = this.#isElementHidden(errorText);
                if (!isHidden) {
                    idsForAriaDescribedby.push(errorText.id);
                    hasVisibleError = true;
                }
            }
        });

        // Character limit ID
        const characterLimit = this.#getCharacterLimit();
        if (characterLimit) {
            const spanId = characterLimit.querySelector(':scope > span');
            if (spanId?.hasAttribute('id')) {
                const isHidden = this.#isElementHidden(characterLimit);
                if (!isHidden) {
                    idsForAriaDescribedby.push(spanId.id);
                }
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
        if (hasError && hasVisibleError) {
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
        if (!this.#initialized) { this.#init(); }

        this.setClasses();
        if (this.#shouldHaveMaxwidth(this.getAttribute('input-maxwidth'))) this.#setMaxwidth(this.getAttribute('input-maxwidth'));
        this.updateIdReferences();

        this.addEventListener('help-text-callback', this.#handleHelpTextCallback);
        this.addEventListener('error-message-callback', this.#handleErrorMessageCallback);
        this.addEventListener('character-limit-callback', this.#handleCharacterLimitCallback);
        this.addEventListener('character-limit-connection', this.#handleCharacterLimitConnection);
        this.addEventListener('error-message-visibility-changed', this.#handleVisibilityChange);
        this.addEventListener('help-text-visibility-changed', this.#handleVisibilityChange);
        this.addEventListener('character-limit-visibility-changed', this.#handleVisibilityChange);
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
        this.removeEventListener('error-message-visibility-changed', this.#handleVisibilityChange);
        this.removeEventListener('help-text-visibility-changed', this.#handleVisibilityChange);
        this.removeEventListener('character-limit-visibility-changed', this.#handleVisibilityChange);

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