'use strict';

import { generateAndVerifyUniqueId } from '../../utils/generate-unique-id';
import * as CE from '../custom-element-utils';

class FDSCheckbox extends HTMLElement {

    /* Private instance fields */

    #initialized = false;
    #checkboxObserver = null;
    #input;
    #label;

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

    #getErrorMessages() {
        return this.querySelectorAll(':scope > fds-error-message, :scope > .form-group-checkbox > fds-error-message');
    }

    #getTooltipElement() {
        return this.querySelector('span.tooltip-wrapper');
    }

    #setupObserver() {
        if (this.#checkboxObserver) return;

        this.#checkboxObserver = new MutationObserver(this.#handleMutations);
        this.#checkboxObserver.observe(this, CE.mutationObserverConfig);
    }

    #handleMutations = (records) => {
        for (const { attributeName, target, addedNodes, removedNodes } of records) {
            const relevantTagNames = ['LABEL', 'INPUT', 'FDS-HELP-TEXT', 'FDS-ERROR-MESSAGE'];
            const allNodes = [...addedNodes, ...removedNodes];

            if (allNodes.some(node => relevantTagNames.includes(node?.tagName))) {
                this.#input = this.#getInputElement();
                this.#label = this.#getLabelElement();

                this.setClasses();
                this.#updateAccessibilityState();

                if (this.hasAttribute('show-required-status')) {
                    CE.showRequiredStatus(this.#label, this.#input, this.getAttribute('show-required-status'));
                }

                break;
            }

            if (attributeName === 'disabled' && target?.tagName === 'INPUT' && target.type === 'checkbox') {
                CE.setDisabledClass(this.#getLabelElement(), target);
            }

            else if (
                (attributeName === 'required' || attributeName === 'aria-required') &&
                target?.tagName === 'INPUT' && target.type === 'checkbox'
            ) {
                if (this.hasAttribute('show-required-status')) {
                    CE.showRequiredStatus(
                        this.#getLabelElement(),
                        target,
                        this.getAttribute('show-required-status')
                    );
                }
            }

            else if (
                attributeName === 'id' ||
                attributeName === 'hidden' ||
                attributeName === 'aria-hidden' ||
                (attributeName === 'class' && target?.tagName !== 'LABEL')
            ) {
                this.#updateAccessibilityState();

                if (attributeName === 'hidden' && target === this) {
                    CE.notifySummaryOnVisibilityChange(this);
                }
            }
        }
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

            const tooltipElement = this.#getTooltipElement();
            if (tooltipElement) {
                wrapper.appendChild(tooltipElement);
            }

            const helpTextElements = this.#getHelpTextElements();
            helpTextElements.forEach(helpText => {
                wrapper.appendChild(helpText);
            });
        }
    }

    #updateAccessibilityState() {
        const label = this.#getLabelElement();
        const input = this.#getInputElement();
        const errorMessages = this.#getErrorMessages();
        const helpTexts = this.#getHelpTextElements();

        CE.associateLabelWithElement(label, input, 'chk');
        CE.setAriaDescribedBy(input, errorMessages, helpTexts);
        CE.setInvalid(input, errorMessages);
    }

    /* Collapsible content */

    #handleCollapsibleCheckboxes() {
        const input = this.#input;
        const possibleContent = this.querySelector(':scope > div.checkbox-content');
        if (!input || !possibleContent) return;

        // Ensure the div has the expected classes
        possibleContent.classList.add('checkbox-content');

        // Ensure the content has an ID
        if (!possibleContent.id) {
            possibleContent.id = generateAndVerifyUniqueId('exp');
        }

        const updateState = () => {
            const expanded = input.checked;

            input.setAttribute('data-aria-controls', possibleContent.id);
            input.setAttribute('data-aria-expanded', String(expanded));

            possibleContent.setAttribute('aria-hidden', String(!expanded));
            possibleContent.classList.toggle('collapsed', !expanded);
        };

        if (this.#onInputChange) {
            input.removeEventListener('change', this.#onInputChange);
        }

        this.#onInputChange = updateState;

        updateState();

        input.addEventListener('change', this.#onInputChange);
    }

    /* Attributes which can invoke attributeChangedCallback() */

    static observedAttributes = ['show-required-status'];

    /* --------------------------------------------------
    CUSTOM ELEMENT METHODS
    -------------------------------------------------- */

    setClasses() {
        if (!this.#label || !this.#input) return;

        this.#label.classList.add('form-label');
        this.#input.classList.add('form-checkbox');
    }

    init() {
        this.#setupObserver();

        this.#input = this.#getInputElement();
        this.#label = this.#getLabelElement();

        this.#setStructure();

        if (this.hasAttribute('show-required-status')) {
            CE.showRequiredStatus(this.#label, this.#input, this.getAttribute('show-required-status'));
        }
        CE.setDisabledClass(this.#label, this.#input);

        this.setClasses();
        this.#updateAccessibilityState();
        this.#handleCollapsibleCheckboxes();

        this.#initialized = true;
    }

    /* --------------------------------------------------
    GETTERS AND SETTERS
    -------------------------------------------------- */

    get showRequiredStatus() { return this.getAttribute('show-required-status'); }
    set showRequiredStatus(value) { value === null ? this.removeAttribute('show-required-status') : this.setAttribute('show-required-status', value); }

    /* --------------------------------------------------
    CUSTOM ELEMENT ADDED TO DOCUMENT
    -------------------------------------------------- */

    connectedCallback() {
        if (!this.#initialized) { this.init(); }
    }

    /* --------------------------------------------------
    CUSTOM ELEMENT REMOVED FROM DOCUMENT
    -------------------------------------------------- */

    disconnectedCallback() {
        CE.notifySummaryOnDisconnect(this);

        if (this.#input) {
            this.#input.removeEventListener('change', this.#onInputChange);
        }

        this.#initialized = false;

        if (this.#checkboxObserver) {
            this.#checkboxObserver.disconnect();
            this.#checkboxObserver = null;
        }
    }

    /* --------------------------------------------------
    CUSTOM ELEMENT'S ATTRIBUTE(S) CHANGED
    -------------------------------------------------- */

    attributeChangedCallback(attribute, oldValue, newValue) {
        if (!this.#initialized) return;

        if (attribute === 'show-required-status' && (oldValue !== newValue)) {
            const label = this.#getLabelElement();
            const input = this.#getInputElement();
            CE.showRequiredStatus(label, input, newValue);
        }
    }
}

function registerCheckbox() {
    if (customElements.get('fds-checkbox') === undefined) {
        window.customElements.define('fds-checkbox', FDSCheckbox);
    }
}

export default registerCheckbox;