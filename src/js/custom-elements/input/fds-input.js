'use strict';

import { generateUniqueIdWithPrefix } from '../../utils/generate-unique-id';

class FDSInput extends HTMLElement {

    /* Private methods */

    #ensureMatchingIds(label, input) {
        const inputId = input.id?.trim();
        const labelFor = label.htmlFor?.trim();

        if (inputId && labelFor) {
            if (labelFor !== inputId) label.htmlFor = inputId;
            return;
        }

        if (inputId && !labelFor) {
            label.htmlFor = inputId;
            return;
        }

        if (!inputId && labelFor) {
            input.id = labelFor;
            return;
        }

        const autoId = generateUniqueIdWithPrefix('inp');
        input.id = autoId;
        label.htmlFor = autoId;
    }

    #connectHelpText(input) {
        const helpEls = this.querySelectorAll('fds-help-text, .form-hint');
        if (!helpEls.length) return;

        const ids = Array.from(helpEls).map(helpEl => {
            const helpId = helpEl.id?.trim() || generateUniqueIdWithPrefix('hint');
            helpEl.id = helpId;
            return helpId;
        });

        input.setAttribute('aria-describedby', ids.join(' '));
    }


    #addLabelIndicator(attributeName, defaultText) {
        if (!(this.hasAttribute(attributeName) && this.getAttribute(attributeName) !== 'false')) return;

        const label = this.querySelector('label');
        if (!label) return;

        // Remove an existing trailing indicator span if present
        label.querySelector(':scope > span.weight-normal')?.remove();

        const attributeValue = this.getAttribute(attributeName);
        const span = document.createElement('span');
        span.className = 'weight-normal';
        span.textContent = attributeValue && attributeValue !== 'true' && attributeValue !== ''
            ? ` (${attributeValue})`
            : ` (${defaultText})`;

        label.appendChild(span);

        if (attributeName === 'required') {
            this.querySelector('input')?.setAttribute('required', '');
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
        const input = this.querySelector('input');
        if (!input) return;

        if (this.hasAttribute('readonly') && this.getAttribute('readonly') !== 'false') {
            input.setAttribute('readonly', '');
        }
    }

    /* Attributes which can invoke attributeChangedCallback() */

    static observedAttributes = ['required', 'optional', 'readonly'];

    /* --------------------------------------------------
    CUSTOM ELEMENT ADDED TO DOCUMENT
    -------------------------------------------------- */

    connectedCallback() {
        const label = this.querySelector('label');
        const input = this.querySelector('input');

        if (!label || !input) return;

        label.classList.add('form-label')
        input.classList.add('form-input')

        //Ensuring correct ids
        this.#ensureMatchingIds(label, input)
        this.#connectHelpText(input);
        this.#applyRequiredOrOptional(input)
        this.#applyReadonly();
    }

    /* --------------------------------------------------
    CUSTOM ELEMENT'S ATTRIBUTE(S) CHANGED
    -------------------------------------------------- */

    attributeChangedCallback(attribute, oldValue, newValue) {
        if (!this.isConnected) return;

        if (attribute === 'required') {
            this.#updateRequired(newValue);
        }

        if (attribute === 'optional') {
            this.#updateOptional(newValue);
        }

        if (attribute === 'readonly') {
            this.#applyReadonly();
        }
    }
}

function registerInput() {
    if (customElements.get('fds-input') === undefined) {
        window.customElements.define('fds-input', FDSInput);
    }
}

export default registerInput;