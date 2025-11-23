'use strict';

import { generateAndVerifyUniqueId } from '../../utils/generate-unique-id';

class FDSErrorMessage extends HTMLElement {

    /* Private instance fields */

    #rendered;
    #errorText;
    #srOnlyText;
    #parentWrapper;

    #getErrorText() {
        if (this.#errorText) return this.#errorText;

        this.#errorText = this.querySelector(':scope > .form-error-message');
        return this.#errorText;
    }

    #ensureSrOnlyPrefix() {
        const span = this.#getErrorText();
        if (!span) return;

        const firstElement = span.firstElementChild;
        if (!firstElement || !firstElement.classList.contains('sr-only')) {
            const srText = this.getAttribute('sr-text');
            if (srText !== null && srText !== '') {
                this.#srOnlyText = srText;
            }

            const sr = document.createElement('span');
            sr.className = 'sr-only';
            sr.textContent = `${this.#srOnlyText}: `;

            span.insertBefore(sr, span.firstChild);
        }
    }

    #render() {
        if (this.#rendered) return;

        let span = this.#getErrorText();
        if (!span) {
            span = document.createElement('span');
            span.className = 'form-error-message';

            // Move existing child nodes into the span
            while (this.firstChild) {
                span.appendChild(this.firstChild);
            }

            this.appendChild(span);
            this.#errorText = span;
        }

        // If explicit id attribute is set, use it
        const attrValue = this.getAttribute('error-message-id');
        if (attrValue !== null && attrValue !== '') {
            span.id = attrValue;
        }

        this.#ensureSrOnlyPrefix();

        this.#rendered = true;
    }

    #updateId(newValue) {
        const span = this.#getErrorText();
        if (!span) return;

        if (newValue !== null && newValue !== '') {
            span.id = newValue;
        } else {
            span.id = generateAndVerifyUniqueId('error');
        }
    }

    /* Attributes which can invoke attributeChangedCallback() */

    static observedAttributes = ['error-message-id', 'sr-text'];

    /* --------------------------------------------------
    CUSTOM ELEMENT CONSTRUCTOR (do not access or add attributes in the constructor)
    -------------------------------------------------- */

    constructor() {
        super();
        this.#rendered = false;
        this.#errorText = null;
        this.#srOnlyText = 'Fejl';
        this.#parentWrapper = null;
    }

    /* --------------------------------------------------
    CUSTOM ELEMENT ADDED TO DOCUMENT
    -------------------------------------------------- */

    connectedCallback() {
        if (this.#rendered) return;

        this.#render();

        const span = this.#getErrorText();
        if (span && !span.id) {
            span.id = generateAndVerifyUniqueId('error');
        }

        // Save reference to parent wrapper
        this.#parentWrapper = this.closest('fds-input-wrapper');

        this.#parentWrapper?.dispatchEvent(new Event('error-message-callback'));
    }

    /* --------------------------------------------------
    CUSTOM ELEMENT REMOVED FROM DOCUMENT
    -------------------------------------------------- */

    disconnectedCallback() {
        this.#parentWrapper?.dispatchEvent(new Event('error-message-callback'));

        this.#errorText = null;
        this.#parentWrapper = null;
        this.#rendered = false;
    }

    /* --------------------------------------------------
    CUSTOM ELEMENT'S ATTRIBUTE(S) CHANGED
    -------------------------------------------------- */

    attributeChangedCallback(name, oldValue, newValue) {
        if (!this.#rendered) return;

        if (name === 'error-message-id') {
            this.#updateId(newValue);
        }

        if (name === 'sr-text') {
            this.#srOnlyText = newValue;
            this.querySelector(':scope > .form-error-message > .sr-only').textContent = this.#srOnlyText;
        }

        this.#parentWrapper?.dispatchEvent(new Event('error-message-callback'));
    }
}

function registerErrorMessage() {
    if (customElements.get('fds-error-message') === undefined) {
        window.customElements.define('fds-error-message', FDSErrorMessage);
    }
}

export default registerErrorMessage;