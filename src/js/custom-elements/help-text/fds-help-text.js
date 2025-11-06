'use strict';

import { generateUniqueIdWithPrefix } from '../../utils/generate-unique-id';

class FDSHelpText extends HTMLElement {

    /* Private instance fields */

    #rendered;
    #helpText;
    #parentWrapper;

    /* Private methods */

    #getHelpText() {
        if (this.#helpText) return this.#helpText;

        this.#helpText = this.querySelector(':scope > .help-text');
        return this.#helpText;
    }

    #render() {
        if (this.#rendered) return;

        let span = this.#getHelpText();
        if (!span) {
            span = document.createElement('span');
            span.className = 'help-text';

            // Move existing child nodes into the span
            while (this.firstChild) {
                span.appendChild(this.firstChild);
            }

            this.appendChild(span);
        }

        if (this.getAttribute('help-text-id') !== null && this.getAttribute('help-text-id') !== '') {
            this.#getHelpText().id = this.getAttribute('help-text-id');
        }

        this.#rendered = true;
    }

    #updateId(newValue) {
        const span = this.#getHelpText();
        if (!span) return;

        if (newValue !== null && newValue !== '') {
            span.id = newValue;
        } else {
            span.id = createRandomId();
        }
    }

    /* Attributes which can invoke attributeChangedCallback() */

    static observedAttributes = ['help-text-id'];

    /* --------------------------------------------------
    CUSTOM ELEMENT CONSTRUCTOR (do not access or add attributes in the constructor)
    -------------------------------------------------- */

    constructor() {
        super();
        this.#rendered = false;
        this.#helpText = null;
        this.#parentWrapper = null;
    }

    /* --------------------------------------------------
    CUSTOM ELEMENT ADDED TO DOCUMENT
    -------------------------------------------------- */

    connectedCallback() {
        if (this.#rendered) return;

        this.#render();

        const helpText = this.#getHelpText();
        if (!helpText.id) {
            helpText.id = createRandomId();
        }

        // During disconnect, the custom element may lose connection to the input-wrapper.
        // Save the input-wrapper and use it to dispatch events - otherwise, the events may be lost.
        this.#parentWrapper = this.closest('fds-input-wrapper');

        this.#parentWrapper?.dispatchEvent(new Event('help-text-callback'));
    }

    /* --------------------------------------------------
    CUSTOM ELEMENT REMOVED FROM DOCUMENT
    -------------------------------------------------- */

    disconnectedCallback() {
        this.#parentWrapper?.dispatchEvent(new Event('help-text-callback'));

        this.#helpText = null;
        this.#parentWrapper = null;
        this.#rendered = false;
    }

    /* --------------------------------------------------
    CUSTOM ELEMENT'S ATTRIBUTE(S) CHANGED
    -------------------------------------------------- */

    attributeChangedCallback(name, oldValue, newValue) {
        if (!this.#rendered) return;

        if (name === 'help-text-id') {
            this.#updateId(newValue);
        }

        this.#parentWrapper?.dispatchEvent(new Event('help-text-callback'));
    }
}

function registerHelpText() {
    if (customElements.get('fds-help-text') === undefined) {
        window.customElements.define('fds-help-text', FDSHelpText);
    }
}

function createRandomId() {
    let randomId = generateUniqueIdWithPrefix('help');
    let attempts = 10; // Precaution to prevent long loops - more than 10 failed attempts should be extremely rare

    while (document.getElementById(randomId) && attempts > 0) {
        randomId = generateUniqueIdWithPrefix('help');
        attempts--;
    }

    return randomId;
}

export default registerHelpText;