'use strict';

import { generateAndVerifyUniqueId } from '../../utils/generate-unique-id';

class FDSCheckbox extends HTMLElement {

    /* Private instance fields */

    #input;
    #label;

    #handleHelpTextCallback;

    /* Private methods */

    #getInputElement() {
        return this.querySelector('input[type="checkbox"]');
    }

    #getLabelElement() {
        return this.querySelector('label');
    }

     #getHelpTextElements() {
        return this.querySelectorAll('fds-help-text');
    }

     #wrapElements() {
        if (this.querySelector(':scope > .form-group-checkbox')) return;

        const input = this.#getInputElement();
        const label = this.#getLabelElement();
        const helpText = this.#getHelpTextElements();

        if (!input || !label) {
            console.warn('<fds-checkbox> requires exactly one <input type="checkbox"> and one <label>.');
            return;
        }

        const wrapper = document.createElement('div');
        wrapper.className = 'form-group-checkbox';

        wrapper.append(input, label);

        if (helpText.length > 0) {
            wrapper.append(...helpText);
        }

        this.replaceChildren(wrapper);
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

        if (attributeName === 'checkbox-required') {
            this.#input?.setAttribute('required', '');
        }
    }

    #applyRequiredOrOptional() {
        if (this.hasAttribute('checkbox-required')) this.#updateRequired();
        else if (this.hasAttribute('checkbox-optional')) this.#updateOptional();
    }

    #updateRequired() {
        this.#addLabelIndicator('checkbox-required', '*skal udfyldes');
    }

    #updateOptional() {
        this.#addLabelIndicator('checkbox-optional', 'frivilligt');
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

        if (!this.#input.id) {
            this.#input.id = generateAndVerifyUniqueId('chk');
        }

        this.#label.htmlFor = this.#input.id;

        const idsForAriaDescribedby = [];
        const helpTexts = this.#getHelpTextElements();
        helpTexts.forEach(helptext => {
            const text = helptext.querySelector(':scope > .help-text');
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

        this.#applyRequiredOrOptional();
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