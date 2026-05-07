//import { generateAndVerifyUniqueId } from '../../utils/generate-unique-id';
import * as CE from '../custom-element-utils';

class FDSDateInput extends HTMLElement {

    /* Private instance fields */

    #initialized = false;
    #dateInputObserver = null;

    /* Private methods */

    #setupObserver() {
        if (this.#dateInputObserver) return;

        this.#dateInputObserver = new MutationObserver(this.#handleMutations);
        this.#dateInputObserver.observe(this, CE.mutationObserverConfig);
    }

    #handleMutations = (records) => {
        for (const { attributeName, target, addedNodes, removedNodes } of records) {

            // A relevant child element was added or removed.
            const relevantTagNames = ['LABEL', 'INPUT', 'FDS-ERROR-MESSAGE', 'FDS-HELP-TEXT'];
            const allNodes = [...addedNodes, ...removedNodes];
            if (allNodes.some(node => relevantTagNames.includes(node?.tagName))) {
                const legend = this.querySelector('legend');
                const fieldset = this.querySelector('fieldset');
                const errorMessages = this.querySelectorAll('fds-error-message');
                const helpTexts = this.querySelectorAll('fds-help-text');

                const label_day = this.querySelector('[data-attribute="day"] label');
                const label_month = this.querySelector('[data-attribute="month"] label');
                const label_year = this.querySelector('[data-attribute="year"] label');
                const input_day = this.querySelector('[data-attribute="day"] input');
                const input_month = this.querySelector('[data-attribute="month"] input');
                const input_year = this.querySelector('[data-attribute="year"] input');

                CE.associateLabelWithElement(label_day, input_day, 'day');
                CE.associateLabelWithElement(label_month, input_month, 'month');
                CE.associateLabelWithElement(label_year, input_year, 'year');

                CE.setAriaDescribedBy(fieldset, errorMessages, helpTexts);

                this.#setInvalidForInput('day', input_day, errorMessages);
                this.#setInvalidForInput('month', input_month, errorMessages);
                this.#setInvalidForInput('year', input_year, errorMessages);

                if (this.hasAttribute('show-required-status')) {
                    CE.showRequiredStatus(legend, fieldset, this.getAttribute('show-required-status'));
                }

                break;
            }

            // The input's required attribute changed
            if (attributeName === 'required' && target?.tagName === 'INPUT') {
                if (this.hasAttribute('show-required-status')) {
                    const legend = this.querySelector('legend');
                    const fieldset = this.querySelector('fieldset');
                    CE.showRequiredStatus(legend, fieldset, this.getAttribute('show-required-status'));
                }
            }
            // Attributes which might affect aria-describedby
            else if (
                attributeName === 'id' ||
                attributeName === 'hidden' ||
                attributeName === 'aria-hidden' ||
                attributeName === 'class',
                attributeName === 'targets') {

                const legend = this.querySelector('legend');
                const fieldset = this.querySelector('fieldset');
                const errorMessages = this.querySelectorAll('fds-error-message');
                const helpTexts = this.querySelectorAll('fds-help-text');

                const label_day = this.querySelector('[data-attribute="day"] label');
                const label_month = this.querySelector('[data-attribute="month"] label');
                const label_year = this.querySelector('[data-attribute="year"] label');
                const input_day = this.querySelector('[data-attribute="day"] input');
                const input_month = this.querySelector('[data-attribute="month"] input');
                const input_year = this.querySelector('[data-attribute="year"] input');

                CE.associateLabelWithElement(label_day, input_day, 'day');
                CE.associateLabelWithElement(label_month, input_month, 'month');
                CE.associateLabelWithElement(label_year, input_year, 'year');

                CE.setAriaDescribedBy(fieldset, errorMessages, helpTexts);

                this.#setInvalidForInput('day', input_day, errorMessages);
                this.#setInvalidForInput('month', input_month, errorMessages);
                this.#setInvalidForInput('year', input_year, errorMessages);

                if (attributeName === 'hidden' && target === this) {
                    CE.notifySummaryOnVisibilityChange(this);
                }
            }
        }
    }

    #setInvalidForInput(target, inputElement, errorMessages) {
        const relevantErrors = Array.from(errorMessages).filter(errorMsg => {
            const targets = errorMsg.getAttribute('targets');
            return targets && targets.includes(target);
        });

        if (relevantErrors.length > 0) {
            CE.setInvalid(inputElement, relevantErrors);
        }
    }

    #init() {
        this.#setupObserver();

        const legend = this.querySelector('legend');
        const fieldset = this.querySelector('fieldset');
        const errorMessages = this.querySelectorAll('fds-error-message');
        const helpTexts = this.querySelectorAll('fds-help-text');

        const label_day = this.querySelector('[data-attribute="day"] label');
        const label_month = this.querySelector('[data-attribute="month"] label');
        const label_year = this.querySelector('[data-attribute="year"] label');
        const input_day = this.querySelector('[data-attribute="day"] input');
        const input_month = this.querySelector('[data-attribute="month"] input');
        const input_year = this.querySelector('[data-attribute="year"] input');

        CE.associateLabelWithElement(label_day, input_day, 'day');
        CE.associateLabelWithElement(label_month, input_month, 'month');
        CE.associateLabelWithElement(label_year, input_year, 'year');

        CE.setAriaDescribedBy(fieldset, errorMessages, helpTexts);

        this.#setInvalidForInput('day', input_day, errorMessages);
        this.#setInvalidForInput('month', input_month, errorMessages);
        this.#setInvalidForInput('year', input_year, errorMessages);

        if (this.hasAttribute('show-required-status')) {
            CE.showRequiredStatus(legend, fieldset, this.getAttribute('show-required-status'));
        }

        this.#initialized = true;
    }

    
    #setReadonly() {
        const inputs = this.querySelectorAll('input');
        inputs.forEach(input => {
            if (this.hasAttribute('input-readonly')) {
                input.setAttribute('readonly', '');
            }
            else {
                input.removeAttribute('readonly');
            }
        });
    }

    #setRequired() {
        const inputs = this.querySelectorAll('input');
        inputs.forEach(input => {
            if (this.hasAttribute('input-required')) {
                input.setAttribute('required', '');
            }
            else {
                input.removeAttribute('required');
            }
        });
    }

    /* Attributes which can invoke attributeChangedCallback() */

    static observedAttributes = ['show-required-status', 'input-readonly', 'input-required'];

    /* --------------------------------------------------
    CUSTOM ELEMENT ADDED TO DOCUMENT
    -------------------------------------------------- */

    connectedCallback() {
        if (!this.#initialized) { this.#init(); }

        this.#setReadonly();
        this.#setRequired();
    }

    /* --------------------------------------------------
    CUSTOM ELEMENT REMOVED FROM DOCUMENT
    -------------------------------------------------- */

    disconnectedCallback() {
        CE.notifySummaryOnDisconnect(this);

        this.#initialized = false;

        if (this.#dateInputObserver) {
            this.#dateInputObserver.disconnect();
            this.#dateInputObserver = null;
        }
    }

    /* --------------------------------------------------
    CUSTOM ELEMENT'S ATTRIBUTE(S) CHANGED
    -------------------------------------------------- */

    attributeChangedCallback(attribute, oldValue, newValue) {
        if (!this.#initialized) return;

        if (attribute === 'show-required-status' && (oldValue !== newValue)) {
            const legend = this.querySelector('legend');
            const fieldset = this.querySelector('fieldset');
            CE.showRequiredStatus(legend, fieldset, newValue);
        }

        if (attribute === 'input-readonly' && (oldValue !== newValue)) {
            this.#setReadonly();
        }

        if (attribute === 'input-required' && (oldValue !== newValue)) {
            this.#setRequired();
        }
    }
}

function registerDateInput() {
    if (customElements.get('fds-date-input') === undefined) {
        window.customElements.define('fds-date-input', FDSDateInput);
    }
}

export default registerDateInput;