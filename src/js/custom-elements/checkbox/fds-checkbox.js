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
        return this.querySelector('input[type="checkbox"]');
    }

    #getLabelElement() {
        // Only get direct child labels, not labels inside collapsible content
        const directChildLabels = Array.from(this.children).filter(child =>
            child.tagName.toLowerCase() === 'label'
        );
        return directChildLabels[0] || null;
    }

    #getHelpTextElements() {
        return this.querySelectorAll('fds-help-text');
    }

    #ensureStructure() {
    if (this.#input && this.#label) {
        // Get all current children and their order
        const children = Array.from(this.children);
        const inputIndex = children.indexOf(this.#input);
        const labelIndex = children.indexOf(this.#label);
        
        // Move input to come before label
        if (inputIndex > labelIndex) {
            this.insertBefore(this.#input, this.#label);
        }
        
        // Handle help text elements - move them to the end if they're not already there
        const helpTextElements = this.#getHelpTextElements();
        helpTextElements.forEach(helpText => {
            this.insertBefore(helpText, this.#label.nextSibling);
        });
    } else {
        console.warn('<fds-checkbox> requires exactly one <input type="checkbox"> and one <label>.');
    }
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
    const input = this.querySelector(':scope > input[type="checkbox"]');
    if (!input) return;

    const possibleContent = this.querySelector('div');
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

        this.#ensureStructure();
        this.#applyRequiredOrOptional();
        this.setClasses();
        this.updateIdReferences();
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
    
    }
}

function registerCheckbox() {
    if (customElements.get('fds-checkbox') === undefined) {
        window.customElements.define('fds-checkbox', FDSCheckbox);
    }
}

export default registerCheckbox;