'use strict';

import { generateAndVerifyUniqueId } from '../../utils/generate-unique-id';

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
            span.id = generateAndVerifyUniqueId('help');
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
            helpText.id = generateAndVerifyUniqueId('help');
        }

        // During disconnect, the custom element may lose connection to the wrapper.
        // Save the wrapper and use it to dispatch events - otherwise, the events may be lost.
        this.#parentWrapper = this.closest('fds-input-wrapper, fds-checkbox, fds-checkbox-group');

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

export default registerHelpText;