import * as Util from './fds-select-utils';

class FDSSelect extends HTMLElement {

    /* Private instance fields */

    #initialized;
    #selectObserver = null;

    #label = null;
    #select = null;
    #errorMessages = null;
    #helpTexts = null;

    /* Private methods */

    #refreshReferences() {
        this.#label = this.querySelector('label');
        this.#select = this.querySelector('select');
        this.#errorMessages = this.querySelectorAll('fds-error-message');
        this.#helpTexts = this.querySelectorAll('fds-help-text');
    }

    #showRequiredStatus(value) {
        if (!this.#label || !this.#select) return;

        let statusIndicator = this.#label.querySelector(':scope > span.weight-normal');

        if (value === null && statusIndicator) {
            statusIndicator.remove();
            return;
        }

        if (!statusIndicator) {
            const span = document.createElement('span');
            span.className = 'weight-normal';
            this.#label.appendChild(span);
            statusIndicator = span;
        }

        const isRequired = this.#select.hasAttribute('required') || (this.#select.hasAttribute('aria-required') && this.#select.getAttribute('aria-required') !== 'false');

        let text = value;
        if (value === '' && isRequired) text = 'skal udfyldes';
        if (value === '' && !isRequired) text = 'frivilligt';

        statusIndicator.textContent = isRequired ? ` (*${text})` : ` (${text})`;
    }

    #setupObserver() {
        if (this.#selectObserver) return;

        this.#selectObserver = new MutationObserver(this.#handleMutations);

        const config = {
            subtree: true,
            childList: true,
            attributes: true,
            attributeFilter: ['hidden', 'aria-hidden', 'id', 'class', 'disabled', 'required'],
            attributeOldValue: false,
            characterData: false,
            characterDataOldValue: false
        }

        this.#selectObserver.observe(this, config);
    }

    #handleMutations = (records, observer) => {
        const shouldUpdate = records.some(record => this.#hasRelevantMutationHappened(record.addedNodes, record.removedNodes, record.target, record.attributeName));

        if (shouldUpdate) {
            this.#refreshReferences();
            Util.associateLabelWithSelect(this.#label, this.#select);
            Util.setDisabledClass(this.#label, this.#select);
            Util.setAriaDescribedBy(this.#select, this.#errorMessages, this.#helpTexts);
            Util.setInvalid(this.#select, this.#errorMessages);

            if (this.hasAttribute('show-required-status')) this.#showRequiredStatus(this.getAttribute('show-required-status'));
        }
    }

    #hasRelevantMutationHappened(addedNodes, removedNodes, target, attributeName) {
        if (
            (attributeName === 'disabled' && target?.tagName === 'SELECT') ||
            (attributeName === 'required' && target?.tagName === 'SELECT') ||
            (attributeName === 'class' && target?.tagName !== 'LABEL') ||
            attributeName === 'id' ||
            attributeName === 'hidden' ||
            attributeName === 'aria-hidden'
        ) {
            return true;
        }

        const relevantTagNames = ['LABEL', 'SELECT', 'FDS-ERROR-MESSAGE', 'FDS-HELP-TEXT'];
        const allNodes = [...addedNodes, ...removedNodes];
        return allNodes.some(node => relevantTagNames.includes(node?.tagName));
    }

    /* Attributes which can invoke attributeChangedCallback() */

    static observedAttributes = ['show-required-status', 'ready'];

    /* --------------------------------------------------
    CUSTOM ELEMENT CONSTRUCTOR (do not access or add attributes in the constructor)
    -------------------------------------------------- */

    constructor() {
        super();

        this.#initialized = false;
    }

    /* --------------------------------------------------
    CUSTOM ELEMENT METHODS
    -------------------------------------------------- */

    init() {
        this.#setupObserver();

        this.#refreshReferences();

        Util.associateLabelWithSelect(this.#label, this.#select);
        Util.setDisabledClass(this.#label, this.#select);
        Util.setAriaDescribedBy(this.#select, this.#errorMessages, this.#helpTexts);
        Util.setInvalid(this.#select, this.#errorMessages);

        if (this.hasAttribute('show-required-status')) this.#showRequiredStatus(this.getAttribute('show-required-status'));

        this.#initialized = true;
    }

    /* --------------------------------------------------
    CUSTOM ELEMENT ADDED TO DOCUMENT
    -------------------------------------------------- */

    connectedCallback() {
        const ready = this.getAttribute('ready');

        if (ready === 'false') return;

        if (!this.#initialized) this.init();
    }

    /* --------------------------------------------------
    CUSTOM ELEMENT REMOVED FROM DOCUMENT
    -------------------------------------------------- */

    disconnectedCallback() {
        this.#initialized = false;

        if (this.#selectObserver) {
            this.#selectObserver.disconnect();
            this.#selectObserver = null;
        }

        this.#label = null;
        this.#select = null;
        this.#errorMessages = null;
        this.#helpTexts = null;
    }

    /* --------------------------------------------------
    CUSTOM ELEMENT'S ATTRIBUTE(S) CHANGED
    -------------------------------------------------- */

    attributeChangedCallback(attribute, oldValue, newValue) {
        if (attribute === 'ready') {
            if (newValue !== 'false') {
                this.init();
            }
        }

        if (!this.#initialized) return;

        if (attribute === 'show-required-status' && (oldValue !== newValue)) {
            this.#refreshReferences();
            this.#showRequiredStatus(newValue);
        }
    }
}

function registerSelect() {
    if (customElements.get('fds-select') === undefined) {
        window.customElements.define('fds-select', FDSSelect);
    }
}

export default registerSelect;