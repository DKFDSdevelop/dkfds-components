import { generateAndVerifyUniqueId } from '../../utils/generate-unique-id';
import * as Util from './fds-date-picker-utils';

class FDSDatePicker extends HTMLElement {

    /* Private instance fields */

    #initialized;
    #datePickerObserver;

    /* Private methods */

    #setupLabel() {
        const label = this.querySelector('label');

        if (!label) return;

        const input = this.querySelector('input');

        if (input) {
            label.htmlFor = input.id;
            label.classList.toggle('disabled', input.hasAttribute('disabled'));
        }
        else {
            label.removeAttribute('for');
        }
    }

    #setupInput() {
        const input = this.querySelector('input');

        if (!input) return;

        /* Set id */

        if (!input.id) {
            input.id = generateAndVerifyUniqueId('inp');
        }

        /* Add date picker button next to the input */

        if (!input.parentElement.classList.contains('input-wrapper')) {
            const inputWrapper = document.createElement('div');
            inputWrapper.classList.add('input-wrapper');
            this.appendChild(inputWrapper);

            inputWrapper.appendChild(input);

            const dateButton = document.createElement('button');
            dateButton.classList.add('button', 'button-icon-only', 'date-button');
            const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
            svg.classList.add('icon-svg');
            svg.setAttribute('focusable', 'false');
            svg.setAttribute('aria-hidden', 'true');
            const use = document.createElementNS('http://www.w3.org/2000/svg', 'use');
            use.setAttributeNS(null, 'href', `#calendar-month`);
            svg.appendChild(use);
            dateButton.appendChild(svg);
            inputWrapper.appendChild(dateButton);
        }

        /* Add or remove aria-describedby */

        input.removeAttribute('aria-describedby');
        const idsForAriaDescribedby = [];
        let isInvalid = false;
        const errorMessages = this.querySelectorAll('fds-error-message');
        const helpTexts = this.querySelectorAll('fds-help-text');

        const ariaDescribedbyElements = [...errorMessages, ...helpTexts];
        for (const element of ariaDescribedbyElements) {
            const notDisplayNone = window.getComputedStyle(element).display !== 'none';
            const notAriaHidden = !element.hasAttribute('aria-hidden') || element.getAttribute('aria-hidden') === 'false';

            const visibleToScreenReaders = notDisplayNone && notAriaHidden;
            if (element.id && visibleToScreenReaders) {
                idsForAriaDescribedby.push(element.id);

                if (element.tagName === 'FDS-ERROR-MESSAGE') {
                    isInvalid = true;
                }
            }
        }

        idsForAriaDescribedby.length > 0 ? input.setAttribute('aria-describedby', idsForAriaDescribedby.join(' ')) : input.removeAttribute('aria-describedby');
        isInvalid ? input.setAttribute('aria-invalid', 'true') : input.removeAttribute('aria-invalid');
    }

    #init() {
        if (this.#initialized) return;

        this.#setupObserver();

        this.#setupInput();
        this.#setupLabel();

        this.#initialized = true;
    }

    #showRequiredStatus(value) {
        const label = this.querySelector('label');
        const input = this.querySelector('input');

        if (!label || !input) return;

        let statusIndicator = label.querySelector(':scope > span.weight-normal');

        if (value === null && statusIndicator) {
            statusIndicator.remove();
            return;
        }

        if (!statusIndicator) {
            const span = document.createElement('span');
            span.className = 'weight-normal';
            label.appendChild(span);
            statusIndicator = span;
        }

        const isRequired = input.hasAttribute('required') || (input.hasAttribute('aria-required') && input.getAttribute('aria-required') !== 'false');

        let text = value;
        if (value === '' && isRequired) text = 'skal udfyldes';
        if (value === '' && !isRequired) text = 'frivilligt';

        statusIndicator.textContent = isRequired ? ` (*${text})` : ` (${text})`;
    }

    #setupObserver() {
        this.#datePickerObserver = new MutationObserver(this.#handleMutations);

        const config = {
            subtree: true,
            childList: true,
            attributes: true,
            attributeFilter: ['hidden', 'aria-hidden', 'id', 'class', 'disabled', 'required'],
            attributeOldValue: false,
            characterData: false,
            characterDataOldValue: false
        }

        this.#datePickerObserver.observe(this, config);
    }

    #handleMutations = (records, observer) => {
        //console.log(`${this.tagName} had mutations at ${Date.now()}`, records);

        const shouldUpdate = records.some(record => this.#hasRelevantMutationHappened(record.addedNodes, record.removedNodes, record.target, record.attributeName));

        if (shouldUpdate) {
            this.#setupInput();
            this.#setupLabel();
            if (this.hasAttribute('show-required-status')) this.#showRequiredStatus(this.getAttribute('show-required-status'));
        }
    }

    #hasRelevantMutationHappened(addedNodes, removedNodes, target, attributeName) {
        if (
            attributeName === 'disabled' && target?.tagName === 'INPUT' ||
            attributeName === 'required' && target?.tagName === 'INPUT' ||
            attributeName === 'class' && target?.tagName !== 'LABEL' ||
            attributeName === 'id' ||
            attributeName === 'hidden' ||
            attributeName === 'aria-hidden'
        ) {
            return true;
        }

        const relevantTagNames = ['LABEL', 'INPUT', 'FDS-ERROR-MESSAGE', 'FDS-HELP-TEXT'];
        const allNodes = [...addedNodes, ...removedNodes];
        return allNodes.some(node => relevantTagNames.includes(node?.tagName));
    }

    /* Attributes which can invoke attributeChangedCallback() */

    static observedAttributes = ['show-required-status'];

    /* --------------------------------------------------
    CUSTOM ELEMENT CONSTRUCTOR (do not access or add attributes in the constructor)
    -------------------------------------------------- */

    constructor() {
        super();

        this.#initialized = false;
        this.#datePickerObserver = null;
    }

    /* --------------------------------------------------
    CUSTOM ELEMENT ADDED TO DOCUMENT
    -------------------------------------------------- */

    connectedCallback() {
        if (this.#initialized) return;

        this.#init();
        if (this.hasAttribute('show-required-status')) this.#showRequiredStatus(this.getAttribute('show-required-status'));
    }

    /* --------------------------------------------------
    CUSTOM ELEMENT REMOVED FROM DOCUMENT
    -------------------------------------------------- */

    disconnectedCallback() {
        this.#initialized = false;

        if (this.#datePickerObserver) {
            this.#datePickerObserver.disconnect();
            this.#datePickerObserver = null;
        }
    }

    /* --------------------------------------------------
    CUSTOM ELEMENT'S ATTRIBUTE(S) CHANGED
    -------------------------------------------------- */

    attributeChangedCallback(attribute, oldValue, newValue) {
        if (!this.#initialized) return;

        if (attribute === 'show-required-status' && (oldValue !== newValue)) {
            this.#showRequiredStatus(newValue);
        }
    }
}

function registerDatePicker() {
    if (customElements.get('fds-date-picker') === undefined) {
        window.customElements.define('fds-date-picker', FDSDatePicker);
    }
}

export default registerDatePicker;