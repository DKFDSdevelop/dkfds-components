'use strict';

import { generateUniqueIdWithPrefix } from '../../utils/generate-unique-id';

class FDSInput extends HTMLElement {

    /* Private instance fields */

    #input;
    #label;

    /* Private methods */

    #ensureMatchingIds() {
        const inputId = this.#input.id?.trim();
        const labelFor = this.#label.htmlFor?.trim();

        if (inputId && labelFor) {
            if (labelFor !== inputId) label.htmlFor = inputId;
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

    static observedAttributes = ['required', 'optional', 'readonly', 'disabled'];

    /* --------------------------------------------------
    CUSTOM ELEMENT ADDED TO DOCUMENT
    -------------------------------------------------- */

    connectedCallback() {
        this.#label = this.querySelector('label');
        this.#input = this.querySelector('input');

        if (!this.#label || !this.#input) return;

        this.#label.classList.add('form-label');
        this.#input.classList.add('form-input');

        //Ensuring correct ids
        this.#ensureMatchingIds();
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
    }
}

function registerInput() {
    if (customElements.get('fds-input') === undefined) {
        window.customElements.define('fds-input', FDSInput);
    }
}

export default registerInput;