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
                attributeName === 'class' ||
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

    #setupHTML() {
        // Fieldset
        let fieldset = this.querySelector('fieldset');
        if (fieldset === null) {
            fieldset = document.createElement('fieldset');
            this.appendChild(fieldset);
        }

        // Legend
        let legend = fieldset.querySelector('legend');
        if (legend === null) {
            legend = document.createElement('legend');
            fieldset.appendChild(legend);
        }
        if (legend.textContent === '') { legend.textContent = 'Indtast dato'; }

        // Div wrapper
        let divWrapper = fieldset.querySelector(':scope > div');
        if (divWrapper === null) {
            divWrapper = document.createElement('div');
            fieldset.appendChild(divWrapper);
        }

        // Div for day input
        let divDay = divWrapper.querySelector('[data-attribute="day"]');
        if (divDay === null) {
            divDay = document.createElement('div');
            divDay.setAttribute('data-attribute', 'day');
            divWrapper.appendChild(divDay);
        }

        // Div for month input
        let divMonth = divWrapper.querySelector('[data-attribute="month"]');
        if (divMonth === null) {
            divMonth = document.createElement('div');
            divMonth.setAttribute('data-attribute', 'month');
            divWrapper.appendChild(divMonth);
        }

        // Div for year input
        let divYear = divWrapper.querySelector('[data-attribute="year"]');
        if (divYear === null) {
            divYear = document.createElement('div');
            divYear.setAttribute('data-attribute', 'year');
            divWrapper.appendChild(divYear);
        }

        // Day label
        let labelDay = divDay.querySelector('label');
        if (labelDay === null) {
            labelDay = document.createElement('label');
            divDay.appendChild(labelDay);
        }
        if (labelDay.textContent === '') { labelDay.textContent = 'Dag'; }

        // Day input
        let inputDay = divDay.querySelector('input');
        if (inputDay === null) {
            inputDay = document.createElement('input');
            divDay.appendChild(inputDay);
        }
        if (!inputDay.hasAttribute('name')) { inputDay.setAttribute('name', 'day'); }
        if (!inputDay.hasAttribute('type')) { inputDay.setAttribute('type', 'number'); }

        // Month label
        let labelMonth = divMonth.querySelector('label');
        if (labelMonth === null) {
            labelMonth = document.createElement('label');
            divMonth.appendChild(labelMonth);
        }
        if (labelMonth.textContent === '') { labelMonth.textContent = 'Måned'; }

        // Month input
        let inputMonth = divMonth.querySelector('input');
        if (inputMonth === null) {
            inputMonth = document.createElement('input');
            divMonth.appendChild(inputMonth);
        }
        if (!inputMonth.hasAttribute('name')) { inputMonth.setAttribute('name', 'month'); }
        if (!inputMonth.hasAttribute('type')) { inputMonth.setAttribute('type', 'number'); }

        // Year label
        let labelYear = divYear.querySelector('label');
        if (labelYear === null) {
            labelYear = document.createElement('label');
            divYear.appendChild(labelYear);
        }
        if (labelYear.textContent === '') { labelYear.textContent = 'År'; }

        // Year input
        let inputYear = divYear.querySelector('input');
        if (inputYear === null) {
            inputYear = document.createElement('input');
            divYear.appendChild(inputYear);
        }
        if (!inputYear.hasAttribute('name')) { inputYear.setAttribute('name', 'year'); }
        if (!inputYear.hasAttribute('type')) { inputYear.setAttribute('type', 'number'); }
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
        this.#setupHTML();

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
            if (this.getAttribute('input-readonly') !== null && this.getAttribute('input-readonly') !== 'false') {
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
            if (this.getAttribute('input-required') !== null && this.getAttribute('input-required') !== 'false') {
                input.setAttribute('required', '');
            }
            else {
                input.removeAttribute('required');
            }
        });
    }

    #setInputId() {
        const inputWrappers = this.querySelectorAll('div[data-attribute]');
        inputWrappers.forEach(inputWrapper => {
            const label = inputWrapper.querySelector('label');
            const input = inputWrapper.querySelector('input');
            if (this.getAttribute('input-id') !== null && this.getAttribute('input-id') !== '') {
                input.id = `${inputWrapper.getAttribute('data-attribute')}-${this.getAttribute('input-id')}`;
            }
        });
    }

    /* Attributes which can invoke attributeChangedCallback() */

    static observedAttributes = ['show-required-status', 'input-readonly', 'input-required', 'legend', 'input-id'];

    /* --------------------------------------------------
    CUSTOM ELEMENT ADDED TO DOCUMENT
    -------------------------------------------------- */

    connectedCallback() {
        if (!this.#initialized) { this.#init(); }

        if (this.hasAttribute('input-readonly')) { this.#setReadonly(); }
        if (this.hasAttribute('input-required')) { this.#setRequired(); }
        if (this.hasAttribute('legend')) { this.querySelector('legend').textContent = this.getAttribute('legend'); }
        if (this.hasAttribute('input-id')) { this.#setInputId(); }
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

        if (attribute === 'legend' && oldValue !== newValue && newValue !== null) {
            this.querySelector('legend').textContent = newValue;
        }

        if (attribute === 'input-id' && oldValue !== newValue) {
            this.#setInputId();
        }
    }
}

function registerDateInput() {
    if (customElements.get('fds-date-input') === undefined) {
        window.customElements.define('fds-date-input', FDSDateInput);
    }
}

export default registerDateInput;