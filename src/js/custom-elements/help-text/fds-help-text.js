'use strict';

import { generateUniqueIdWithPrefix } from '../../utils/generate-unique-id';

class FDSHelpText extends HTMLElement {

    /* Private instance fields */

    #initialized;
    #helpText;

    /* Private methods */

    #getHelpText() {
        if (this.#helpText) return this.#helpText;

        this.#helpText = this.querySelector(':scope > .help-text');
        return this.#helpText;
    }

    #init() {
        if (this.#initialized) return;

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

        this.#initialized = true;
    }

    #updateId(newValue) {
        const span = this.#getHelpText();
        if (!span) return;

        const val = (newValue || '').trim();
        if (val) {
            span.id = val;
        } else {
            span.removeAttribute('id');
        }
    }

    /* Attributes which can invoke attributeChangedCallback() */

    static observedAttributes = ['help-text-id'];

    /* --------------------------------------------------
    CUSTOM ELEMENT CONSTRUCTOR (do not access or add attributes in the constructor)
    -------------------------------------------------- */

    constructor() {
        super();
        this.#initialized = false;
        this.#helpText = null;
    }

    /* --------------------------------------------------
    CUSTOM ELEMENT ADDED TO DOCUMENT
    -------------------------------------------------- */

    connectedCallback() {
        if (this.#initialized) return;

        this.#init();

        const helpText = this.#getHelpText();
        if (!helpText.id) {
            let randomId = '';
            do {
                randomId = generateUniqueIdWithPrefix('help');
            } while (document.getElementById(randomId));
            helpText.id = randomId;
        }
    }

    /* --------------------------------------------------
    CUSTOM ELEMENT REMOVED FROM DOCUMENT
    -------------------------------------------------- */

    disconnectedCallback() {
        this.#helpText = null;
        this.#initialized = false;
    }

    /* --------------------------------------------------
    CUSTOM ELEMENT'S ATTRIBUTE(S) CHANGED
    -------------------------------------------------- */

    attributeChangedCallback(name, oldValue, newValue) {
        if (!this.#initialized) return;

        if (name === 'help-text-id') {
            this.#updateId(newValue);
        }
    }
}

function registerHelpText() {
    if (customElements.get('fds-help-text') === undefined) {
        window.customElements.define('fds-help-text', FDSHelpText);
    }
}

export default registerHelpText;