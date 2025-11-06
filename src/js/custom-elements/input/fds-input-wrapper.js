'use strict';

import { generateUniqueIdWithPrefix } from '../../utils/generate-unique-id';

class FDSInputWrapper extends HTMLElement {

    /* Private instance fields */

    #input;
    #label;
    #wrapper;

    /* Private methods */

    #ensureMatchingIds() {
        const inputId = this.#input.id?.trim();
        const labelFor = this.#label.htmlFor?.trim();

        if (inputId && labelFor) {
            if (labelFor !== inputId) this.#label.htmlFor = inputId;
            return;
        }

        if (inputId && !labelFor) {
            this.#label.htmlFor = inputId;
            return;
        }

        if (!inputId && labelFor) {
            this.#input.id = labelFor;
            return;
        }

        const autoId = generateUniqueIdWithPrefix('inp');
        this.#input.id = autoId;
        this.#label.htmlFor = autoId;
    }

    #connectHelpText() {
        const helpEls = this.querySelectorAll('fds-help-text, .form-hint');
        if (!helpEls.length) return;

        const ids = Array.from(helpEls).map(helpEl => {
            const helpId = helpEl.id?.trim() || generateUniqueIdWithPrefix('hint');
            helpEl.id = helpId;
            return helpId;
        });

        this.#input.setAttribute('aria-describedby', ids.join(' '));
    }

    #setupPrefixSuffix() {
        if (!this.#input) return;

        const hasPrefix = this.hasAttribute('prefix');
        const hasSuffix = this.hasAttribute('suffix');

        // Remove wrapper if no prefix/suffix needed
        if (!hasPrefix && !hasSuffix) {
            this.#wrapper?.replaceWith(this.#input);
            this.#wrapper = null;
            return;
        }

        // Create wrapper if it doesn't exist
        if (!this.#wrapper) {
            this.#wrapper = document.createElement('div');
            this.insertBefore(this.#wrapper, this.#input);
            this.#wrapper.appendChild(this.#input);
        }

        // Set wrapper classes
        this.#wrapper.className = 'form-input-wrapper';
        if (hasPrefix) this.#wrapper.classList.add('form-input-wrapper--prefix');
        if (hasSuffix) this.#wrapper.classList.add('form-input-wrapper--suffix');
        if (this.hasAttribute('disabled') && this.getAttribute('disabled') !== 'false') {
            this.#wrapper.classList.add('disabled');
        }
        if (this.hasAttribute('readonly') && this.getAttribute('readonly') !== 'false') {
            this.#wrapper.classList.add('readonly');
        }

        // Handle prefix
        let prefixEl = this.#wrapper.querySelector('.form-input-prefix');
        if (hasPrefix) {
            if (!prefixEl) {
                prefixEl = document.createElement('div');
                prefixEl.className = 'form-input-prefix';
                prefixEl.setAttribute('aria-hidden', 'true');
                this.#wrapper.insertBefore(prefixEl, this.#input);
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

        if (!this.#label) return;

        // Remove an existing trailing indicator span if present
        this.#label.querySelector(':scope > span.weight-normal')?.remove();

        const attributeValue = this.getAttribute(attributeName);
        const span = document.createElement('span');
        span.className = 'weight-normal';
        span.textContent = attributeValue && attributeValue !== 'true' && attributeValue !== ''
            ? ` (${attributeValue})`
            : ` (${defaultText})`;

        this.#label.appendChild(span);

        if (attributeName === 'required') {
            this.#input?.setAttribute('required', '');
        }
    }

    #applyRequiredOrOptional() {
        if (this.hasAttribute('required')) this.#updateRequired();
        else if (this.hasAttribute('optional')) this.#updateOptional();
    }

    #updateRequired() {
        this.#addLabelIndicator('required', '*skal udfyldes');
    }

    #updateOptional() {
        this.#addLabelIndicator('optional', 'frivilligt');
    }

    #applyReadonly() {
        if (!this.#input) return;

        if (this.hasAttribute('readonly') && this.getAttribute('readonly') !== 'false') {
            this.#input.setAttribute('readonly', '');
        } else {
            this.#input.removeAttribute('readonly');
        }
    }

    #applyDisabled() {
        if (!this.#input) return;

        if (this.hasAttribute('disabled') && this.getAttribute('disabled') !== 'false') {
            this.#input.setAttribute('disabled', '');
            this.#label.classList.add('disabled');
        } else {
            this.#input.removeAttribute('disabled');
            this.#label.classList.remove('disabled');
        }
    }

    /* Attributes which can invoke attributeChangedCallback() */

    static observedAttributes = ['required', 'optional', 'readonly', 'disabled', 'prefix', 'suffix'];

    /* --------------------------------------------------
    CUSTOM ELEMENT ADDED TO DOCUMENT
    -------------------------------------------------- */

    connectedCallback() {
        this.#label = this.querySelector('label');
        this.#input = this.querySelector('input');

        if (!this.#label || !this.#input) return;

        this.#label.classList.add('form-label');
        this.#input.classList.add('form-input');

        this.#ensureMatchingIds();
        this.#setupPrefixSuffix();
        this.#connectHelpText();
        this.#applyRequiredOrOptional();
        this.#applyReadonly();
        this.#applyDisabled();
    }

    /* --------------------------------------------------
    CUSTOM ELEMENT'S ATTRIBUTE(S) CHANGED
    -------------------------------------------------- */

    attributeChangedCallback(attribute) {
        if (!this.isConnected) return;

        if (attribute === 'required') {
            this.#updateRequired();
        }

        if (attribute === 'optional') {
            this.#updateOptional();
        }

        if (attribute === 'readonly') {
            this.#applyReadonly();
        }

        if (attribute === 'disabled') {
            this.#applyDisabled();
        }

        if (attribute === 'prefix' || attribute === 'suffix') {
            this.#setupPrefixSuffix();
        }
    }
}

function registerInputWrapper() {
    if (customElements.get('fds-input-wrapper') === undefined) {
        window.customElements.define('fds-input-wrapper', FDSInputWrapper);
    }
}

export default registerInputWrapper;