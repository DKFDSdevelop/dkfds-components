'use strict';

import { generateAndVerifyUniqueId } from '../../utils/generate-unique-id';

class FDSInputAffix extends HTMLElement {

    /* Private instance fields */

    #initialized = false;

    /* Private methods */

    #init() {
        const input = this.querySelector('input');

        if (!input) return;

        if (this.hasAttribute('input-prefix')) { this.#setPrefix(this.getAttribute('input-prefix')); }
        if (this.hasAttribute('input-suffix')) { this.#setSuffix(this.getAttribute('input-suffix')); }

        this.#initialized = true;
    }

    #setPrefix(value) {
        let prefixEl = this.querySelector('.form-input-prefix');

        if (value !== null && value !== '') {
            if (!prefixEl) {
                prefixEl = document.createElement('div');
                prefixEl.className = 'form-input-prefix';
                this.prepend(prefixEl);
            }
            prefixEl.setAttribute('aria-hidden', 'true');
            prefixEl.textContent = value;
        }
        else {
            prefixEl?.remove();
        }
    }

    #setSuffix(value) {
        let suffixEl = this.querySelector('.form-input-suffix');

        if (value !== null && value !== '') {
            if (!suffixEl) {
                suffixEl = document.createElement('div');
                suffixEl.className = 'form-input-suffix';
                this.appendChild(suffixEl);
            }
            suffixEl.setAttribute('aria-hidden', 'true');
            suffixEl.textContent = value;
        }
        else {
            suffixEl?.remove();
        }
    }

    
    /* Attributes which can invoke attributeChangedCallback() */

    static observedAttributes = ['input-prefix', 'input-suffix'];

    /* --------------------------------------------------
    CUSTOM ELEMENT ADDED TO DOCUMENT
    -------------------------------------------------- */

    connectedCallback() {
        if (!this.#initialized) { this.#init(); }
    }

    /* --------------------------------------------------
    CUSTOM ELEMENT REMOVED FROM DOCUMENT
    -------------------------------------------------- */

    disconnectedCallback() {
        this.#initialized = false;
    }

    /* --------------------------------------------------
    CUSTOM ELEMENT'S ATTRIBUTE(S) CHANGED
    -------------------------------------------------- */

    attributeChangedCallback(attribute, oldValue, newValue) {
        if (!this.#initialized) return;

        if (attribute === 'input-prefix' && (oldValue !== newValue)) {
            this.#setPrefix(newValue);
        }

        if (attribute === 'input-suffix' && (oldValue !== newValue)) {
            this.#setSuffix(newValue);
        }
    }
}

function registerInputAffix() {
    if (customElements.get('fds-input-affix') === undefined) {
        window.customElements.define('fds-input-affix', FDSInputAffix);
    }
}

export default registerInputAffix;