'use strict';

import { generateAndVerifyUniqueId } from '../../utils/generate-unique-id';

class FDSCheckbox extends HTMLElement {

    /* Private instance fields */

    #input;
    #label;

    #handleHelpTextCallback;
    #onInputChange;

    /* Private methods */

    #getInputElement() {
        // Look for input as direct child first, then in wrapper
        return this.querySelector(':scope > input[type="checkbox"], :scope > .form-group-checkbox > input[type="checkbox"]');
    }

    #getLabelElement() {
        // Look for label as direct child first, then in wrapper  
        return this.querySelector(':scope > label, :scope > .form-group-checkbox > label');
    }

    #getHelpTextElements() {
        return this.querySelectorAll(':scope > fds-help-text, :scope > .form-group-checkbox > fds-help-text');
    }

    #setStructure() {
        if (this.#input && this.#label) {
            if (this.#input.closest('.form-group-checkbox')) {
                return;
            }
            const wrapper = document.createElement('div');
            wrapper.className = "form-group-checkbox";

            this.insertBefore(wrapper, this.#input);

            // Ensure input comes before label
            wrapper.appendChild(this.#input);
            wrapper.appendChild(this.#label);

            const helpTextElements = this.#getHelpTextElements();
            helpTextElements.forEach(helpText => {
                wrapper.appendChild(helpText);
            });
        }
    }

    #setLabelIndicator(attributeName, defaultText) {
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
    }

    #setRequiredOrOptional() {
        if (this.hasAttribute('checkbox-required')) this.#handleRequired();
        else if (this.hasAttribute('checkbox-optional')) this.#handleOptional();
    }

    #handleRequired() {
        if (this.hasAttribute('checkbox-required') && this.getAttribute('checkbox-required') !== 'false') {
            this.#setLabelIndicator('checkbox-required', '*skal udfyldes');
            this.#input?.setAttribute('required', '');
        } else {
            this.#removeLabelIndicator();
            this.#input?.removeAttribute('required');
        }
    }

    #handleOptional() {
        if (this.hasAttribute('checkbox-optional') && this.getAttribute('checkbox-optional') !== 'false') {
            this.#setLabelIndicator('checkbox-optional', 'frivilligt');
        } else {
            this.#removeLabelIndicator();
        }
    }

    #removeLabelIndicator() {
        this.#label?.querySelector(':scope > span.weight-normal')?.remove();
    }

    /* Attributes which can invoke attributeChangedCallback() */

    static observedAttributes = ['checkbox-required', 'checkbox-optional'];

    /* --------------------------------------------------
    CUSTOM ELEMENT CONSTRUCTOR (do not access or add attributes in the constructor)
    -------------------------------------------------- */

    constructor() {
        super();

        this.#handleHelpTextCallback = () => { this.handleIdReferences(); };
    }

    /* --------------------------------------------------
    CUSTOM ELEMENT METHODS
    -------------------------------------------------- */

    handleIdReferences() {
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
            this.#input.setAttribute('aria-describedby', idsForAriaDescribedby.join(' '));
        } else {
            this.#input.removeAttribute('aria-describedby');
        }
    }

    setClasses() {
        if (!this.#label || !this.#input) return;

        this.#label.classList.add('form-label');
        this.#input.classList.add('form-checkbox');
    }

    #handleCollapsibleCheckboxes() {
        const input = this.#input;
        if (!input) return;

        const possibleContent = this.querySelector('div.checkbox-content');
        if (!possibleContent) return;

        // Ensure the div has the expected classes
        possibleContent.classList.add('checkbox-content', 'collapsed');

        // Ensure the content has an ID
        const collapseId = generateAndVerifyUniqueId('exp');
        if (!possibleContent.id) {
            possibleContent.id = collapseId;
        }

        possibleContent.setAttribute('aria-hidden', 'true');
        input.setAttribute('data-aria-controls', possibleContent.id);
        input.setAttribute('data-aria-expanded', 'false');

        this.#onInputChange = () => {
            const expanded = input.checked;
            input.setAttribute('data-aria-expanded', String(expanded));
            possibleContent.setAttribute('aria-hidden', String(!expanded));
            possibleContent.classList.toggle('collapsed', !expanded);
        };

        input.addEventListener('change', this.#onInputChange);
    }

    /* --------------------------------------------------
    CUSTOM ELEMENT ADDED TO DOCUMENT
    -------------------------------------------------- */

    connectedCallback() {
        this.#input = this.#getInputElement();
        this.#label = this.#getLabelElement();

        this.#setStructure();
        this.#setRequiredOrOptional();
        this.setClasses();
        this.handleIdReferences();
        this.#handleCollapsibleCheckboxes()

        this.addEventListener('help-text-callback', this.#handleHelpTextCallback);
    }

    /* --------------------------------------------------
    CUSTOM ELEMENT REMOVED FROM DOCUMENT
    -------------------------------------------------- */

    disconnectedCallback() {
        this.removeEventListener('help-text-callback', this.#handleHelpTextCallback);

        if (this.#input) {
            this.#input.removeEventListener('change', this.#onInputChange);
        }
    }

    /* --------------------------------------------------
    CUSTOM ELEMENT'S ATTRIBUTE(S) CHANGED
    -------------------------------------------------- */

    attributeChangedCallback(attribute) {
        if (!this.isConnected) return;

        if (attribute === 'checkbox-required') {
            this.#handleRequired();
        }

        if (attribute === 'checkbox-optional') {
            this.#handleOptional();
        }
    }
}

function registerCheckbox() {
    if (customElements.get('fds-checkbox') === undefined) {
        window.customElements.define('fds-checkbox', FDSCheckbox);
    }
}

export default registerCheckbox;