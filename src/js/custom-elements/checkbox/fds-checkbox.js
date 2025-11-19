'use strict';

import { generateAndVerifyUniqueId } from '../../utils/generate-unique-id';

class FDSCheckbox extends HTMLElement {

    /* Private instance fields */

    #input;
    #label;
    #helpText;

    #handleHelpTextCallback;

    /* Private methods */

    #getInputElement() {
        return this.querySelector('input[type="checkbox"]');
    }

    #getLabelElement() {
        return this.querySelector('label');
    }

     #getHelpTextElement() {
        return this.querySelector('fds-help-text');
    }

     #wrapElements() {
        if (this.querySelector(':scope > .form-group-checkbox')) return;

         const input = this.#getInputElement();
         const label = this.#getLabelElement();
         const helpText = this.#getHelpTextElement();

         if (!input || !label) {
             console.warn('<fds-checkbox> requires exactly one <input type="checkbox"> and one <label>.');
             return;
         }

         const wrapper = document.createElement('div');
         wrapper.className = 'form-group-checkbox';

        wrapper.append(input, label);

        if (helpText) {
            wrapper.append(helpText);
        }

        this.replaceChildren(wrapper);
    }
    

    /* Attributes which can invoke attributeChangedCallback() */

    static observedAttributes = [];

    /* --------------------------------------------------
    CUSTOM ELEMENT CONSTRUCTOR (do not access or add attributes in the constructor)
    -------------------------------------------------- */

    constructor() {
        super();

        this.#handleHelpTextCallback = () => { this.updateIdReferences(); };
    }

    /* --------------------------------------------------
    CUSTOM ELEMENT METHODS
    -------------------------------------------------- */

    updateIdReferences() {
        if (!this.#input || !this.#label) return;

        // Input ID
        if (!this.#input.id) {
            this.#input.id = generateAndVerifyUniqueId('chk');
        }

        // Label for=""
        this.#label.htmlFor = this.#input.id;

        // aria-describedby
        const ids = [];

        this.querySelectorAll('fds-help-text').forEach(help => {
            const span = help.querySelector(':scope > .help-text');
            if (span?.id) ids.push(span.id);
        });

        if (ids.length > 0) {
            this.#input.setAttribute('aria-describedby', ids.join(' '));
        } else {
            this.#input.removeAttribute('aria-describedby');
        }
    }

    setClasses() {
        if (!this.#label || !this.#input) return;

        this.#label.classList.add('form-label');
        this.#input.classList.add('form-checkbox');
    }

    /* --------------------------------------------------
    CUSTOM ELEMENT ADDED TO DOCUMENT
    -------------------------------------------------- */

    connectedCallback() {
        this.#wrapElements();

        this.#input = this.#getInputElement();
        this.#label = this.#getLabelElement();
        this.#helpText = this.#getHelpTextElement();

        this.setClasses();
        this.updateIdReferences();
        
        this.addEventListener('help-text-callback', this.#handleHelpTextCallback);
    }

    /* --------------------------------------------------
    CUSTOM ELEMENT REMOVED FROM DOCUMENT
    -------------------------------------------------- */

    disconnectedCallback() {
        this.removeEventListener('help-text-callback', this.#handleHelpTextCallback);
    }

    /* --------------------------------------------------
    CUSTOM ELEMENT'S ATTRIBUTE(S) CHANGED
    -------------------------------------------------- */

    attributeChangedCallback(attribute) {
    
    }
}

function registerCheckbox() {
    if (customElements.get('fds-checkbox') === undefined) {
        window.customElements.define('fds-checkbox', FDSCheckbox);
    }
}

export default registerCheckbox;