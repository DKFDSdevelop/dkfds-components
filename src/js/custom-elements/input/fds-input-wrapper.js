'use strict';

import { generateAndVerifyUniqueId } from '../../utils/generate-unique-id';

class FDSInputWrapper extends HTMLElement {

    /* Private instance fields */

    #input;
    #label;
    #wrapper;
    #limit;

    #handleHelpTextCallback;
    #handleCharacterLimitCallback;
    #handleCharacterLimitConnection;

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

    #setupPrefixSuffix() {
        if (!this.#getInputElement()) return;

        const hasPrefix = this.hasAttribute('prefix');
        const hasSuffix = this.hasAttribute('suffix');

        // Remove wrapper if no prefix/suffix needed
        if (!hasPrefix && !hasSuffix) {
            this.#wrapper?.replaceWith(this.#getInputElement());
            this.#wrapper = null;
            return;
        }

        // Create wrapper if it doesn't exist
        if (!this.#wrapper) {
            this.#wrapper = document.createElement('div');
            this.insertBefore(this.#wrapper, this.#getInputElement());
            this.#wrapper.appendChild(this.#getInputElement());
        }

        // Set wrapper classes
        this.#wrapper.className = 'form-input-wrapper';
        if (hasPrefix) this.#wrapper.classList.add('form-input-wrapper--prefix');
        if (hasSuffix) this.#wrapper.classList.add('form-input-wrapper--suffix');
        if (this.hasAttribute('input-disabled') && this.getAttribute('input-disabled') !== 'false') {
            this.#wrapper.classList.add('disabled');
        }
        if (this.hasAttribute('input-readonly') && this.getAttribute('input-readonly') !== 'false') {
            this.#wrapper.classList.add('readonly');
        }

        // Handle prefix
        let prefixEl = this.#wrapper.querySelector('.form-input-prefix');
        if (hasPrefix) {
            if (!prefixEl) {
                prefixEl = document.createElement('div');
                prefixEl.className = 'form-input-prefix';
                prefixEl.setAttribute('aria-hidden', 'true');
                this.#wrapper.insertBefore(prefixEl, this.#getInputElement());
            }
            prefixEl.textContent = this.getAttribute('prefix');
        } else if (prefixEl) {
            prefixEl.remove();
        }

        // Handle suffix
        let suffixEl = this.#wrapper.querySelector('.form-input-suffix');
        if (hasSuffix) {
            if (!suffixEl) {
                suffixEl = document.createElement('div');
                suffixEl.className = 'form-input-suffix';
                suffixEl.setAttribute('aria-hidden', 'true');
                this.#wrapper.appendChild(suffixEl);
            }
            suffixEl.textContent = this.getAttribute('suffix');
        } else if (suffixEl) {
            suffixEl.remove();
        }
    }

    #addLabelIndicator(attributeName, defaultText) {
        if (!(this.hasAttribute(attributeName) && this.getAttribute(attributeName) !== 'false')) return;

        if (!this.#getLabelElement()) return;

        // Remove an existing trailing indicator span if present
        this.#getLabelElement().querySelector(':scope > span.weight-normal')?.remove();

        const attributeValue = this.getAttribute(attributeName);
        const span = document.createElement('span');
        span.className = 'weight-normal';
        span.textContent = attributeValue && attributeValue !== 'true' && attributeValue !== ''
            ? ` (${attributeValue})`
            : ` (${defaultText})`;

        this.#getLabelElement().appendChild(span);

        if (attributeName === 'input-required') {
            this.#getInputElement()?.setAttribute('required', '');
        }
    }

    #applyRequiredOrOptional() {
        if (this.hasAttribute('input-required')) this.#updateRequired();
        else if (this.hasAttribute('input-optional')) this.#updateOptional();
    }

    #updateRequired() {
        this.#addLabelIndicator('input-required', '*skal udfyldes');
    }

    #updateOptional() {
        this.#addLabelIndicator('input-optional', 'frivilligt');
    }

    #applyReadonly() {
        if (!this.#getInputElement()) return;

        if (this.hasAttribute('input-readonly') && this.getAttribute('input-readonly') !== 'false') {
            this.#getInputElement().setAttribute('readonly', '');
        } else {
            this.#getInputElement().removeAttribute('readonly');
        }
    }

    #applyDisabled() {
        if (!this.#getInputElement()) return;

        if (this.hasAttribute('input-disabled') && this.getAttribute('input-disabled') !== 'false') {
            this.#getInputElement().setAttribute('disabled', '');
            this.#getLabelElement().classList.add('disabled');
        } else {
            this.#getInputElement().removeAttribute('disabled');
            this.#getLabelElement().classList.remove('disabled');
        }
    }

    #applyMaxWidth() {
        if (!this.#getInputElement()) return;

        this.#getInputElement().classList.forEach(cls => {
            if (cls.startsWith('input-width-') || cls.startsWith('input-char-')) {
                this.#getInputElement().classList.remove(cls);
            }
        });

        const value = this.getAttribute('maxwidth');
        if (!value) return;

        if (['xxs', 'xs', 's', 'm', 'l', 'xl'].includes(value)) {
            this.#getInputElement().classList.add(`input-width-${value}`);
        } else if (/^\d+$/.test(value)) {
            this.#getInputElement().classList.add(`input-char-${value}`);
        }
    }

    #handleKeyUp() {
        this.#getCharacterLimit().setCharactersUsed(this.#getInputElement().value.length);
        this.#getCharacterLimit().updateVisibleMessage();
        //lastKeyUpTimestamp = Date.now();
    }

    #setKeyUpListener() {
        this.#getInputElement().addEventListener('keyup', () => {
            this.#handleKeyUp();
        });
    }

    /* Attributes which can invoke attributeChangedCallback() */

    static observedAttributes = ['input-required', 'input-optional', 'input-readonly', 'input-disabled', 'prefix', 'suffix', 'maxwidth'];

    /* --------------------------------------------------
    CUSTOM ELEMENT CONSTRUCTOR (do not access or add attributes in the constructor)
    -------------------------------------------------- */

    constructor() {
        super();

        this.#handleHelpTextCallback = () => { this.updateIdReferences(); };
        this.#handleCharacterLimitCallback = () => { this.updateIdReferences(); };
        this.#handleCharacterLimitConnection = () => { this.#setKeyUpListener() };
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

        // Set/remove aria-describedby on input
        const idsForAriaDescribedby = [];
        this.querySelectorAll('fds-help-text').forEach(helptext => {
            const text = helptext.querySelector(':scope > .help-text');
            if (text?.hasAttribute('id')) {
                idsForAriaDescribedby.push(text.id);
            }
        });
        this.querySelectorAll('fds-character-limit').forEach(limit => {
            const text = limit.querySelector(':scope > span[id]');
            if (text?.hasAttribute('id')) {
                idsForAriaDescribedby.push(text.id);
            }
        });
        if (idsForAriaDescribedby.length > 0) {
            this.#getInputElement().setAttribute('aria-describedby', idsForAriaDescribedby.join(' '));
        }
        else {
            this.#getInputElement().removeAttribute('aria-describedby');
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
        this.#setupPrefixSuffix();
        this.#applyRequiredOrOptional();
        this.#applyReadonly();
        this.#applyDisabled();
        this.#applyMaxWidth();
        this.updateIdReferences();

        this.addEventListener('help-text-callback', this.#handleHelpTextCallback);
        this.addEventListener('character-limit-callback', this.#handleCharacterLimitCallback);
        this.addEventListener('character-limit-connection', this.#handleCharacterLimitConnection);
    }

    /* --------------------------------------------------
    CUSTOM ELEMENT REMOVED FROM DOCUMENT
    -------------------------------------------------- */

    disconnectedCallback() {
        this.removeEventListener('help-text-callback', this.#handleHelpTextCallback);
        this.removeEventListener('character-limit-callback', this.#handleCharacterLimitCallback);
    }

    /* --------------------------------------------------
    CUSTOM ELEMENT'S ATTRIBUTE(S) CHANGED
    -------------------------------------------------- */

    attributeChangedCallback(attribute) {
        if (!this.isConnected) return;

        if (attribute === 'input-required') {
            this.#updateRequired();
        }

        if (attribute === 'input-optional') {
            this.#updateOptional();
        }

        if (attribute === 'input-readonly') {
            this.#applyReadonly();
        }

        if (attribute === 'input-disabled') {
            this.#applyDisabled();
        }

        if (attribute === 'prefix' || attribute === 'suffix') {
            this.#setupPrefixSuffix();
        }

        if (attribute === 'maxwidth') {
            this.#applyMaxWidth();
        }
    }
}

function registerInputWrapper() {
    if (customElements.get('fds-input-wrapper') === undefined) {
        window.customElements.define('fds-input-wrapper', FDSInputWrapper);
    }
}

export default registerInputWrapper;