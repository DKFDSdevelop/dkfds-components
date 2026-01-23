import { generateAndVerifyUniqueId } from '../../utils/generate-unique-id';

class FDSSelect extends HTMLElement {

    /* Private instance fields */

    #initialized;
    #selectObserver = null;

    /* Private methods */

    #getSelectElement() {
        return this.querySelector('select');
    }

    #getLabelElement() {
        return this.querySelector('label');
    }

    #getErrorMessages() {
        return this.querySelectorAll('fds-error-message');
    }

    #getHelpTexts() {
        return this.querySelectorAll('fds-help-text');
    }

    #setupLabel() {
        const label = this.#getLabelElement();

        if (!label) return;

        label.classList.add('form-label');

        // Additional setup if a select element is present
        if (this.#getSelectElement()) {
            label.htmlFor = this.#getSelectElement().id;
            label.classList.toggle('disabled', this.#getSelectElement().hasAttribute('disabled'));
        }
        // Remove unnecessary attributes if select element is missing
        else {
            label.classList.remove('disabled');
            label.removeAttribute('for');
        }
    }

    #setupSelect() {
        const select = this.#getSelectElement();

        if (!select) return;

        /* Set id and classes */

        if (!select.id) {
            select.id = generateAndVerifyUniqueId('sel');
        }

        // Prevent infinite mutation loops by checking before adding the class
        if (!select.classList.contains('form-select')) {
            select.classList.add('form-select');
        }

        /* Add or remove aria-describedby */

        select.removeAttribute('aria-describedby');
        const idsForAriaDescribedby = [];
        let isInvalid = false;

        const ariaDescribedbyElements = [...this.#getErrorMessages(), ...this.#getHelpTexts()];
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

        idsForAriaDescribedby.length > 0 ? select.setAttribute('aria-describedby', idsForAriaDescribedby.join(' ')) : select.removeAttribute('aria-describedby');
        isInvalid ? select.setAttribute('aria-invalid', 'true') : select.removeAttribute('aria-invalid');
    }

    #init() {
        if (this.#initialized) return;

        this.#setupObserver();

        this.#setupSelect();
        this.#setupLabel();

        this.#initialized = true;
    }

    #showRequiredStatus(value) {
        if (!this.#getLabelElement() || !this.#getSelectElement()) return;

        let statusIndicator = this.#getLabelElement().querySelector(':scope > span.weight-normal');

        if (value === null && statusIndicator) {
            statusIndicator.remove();
            return;
        }

        if (!statusIndicator) {
            const span = document.createElement('span');
            span.className = 'weight-normal';
            this.#getLabelElement().appendChild(span);
            statusIndicator = span;
        }

        const isRequired =
            this.#getSelectElement().hasAttribute('required') ||
            (this.#getSelectElement().hasAttribute('aria-required') && this.#getSelectElement().getAttribute('aria-required') !== 'false');

        let text = value;
        if (value === '' && isRequired) text = 'skal udfyldes';
        if (value === '' && !isRequired) text = 'frivilligt';

        statusIndicator.textContent = isRequired ? ` (*${text})` : ` (${text})`;
    }

    #setupObserver() {
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
        //console.log(`${this.tagName} had mutations at ${Date.now()}`, records);

        const shouldUpdate = records.some(record => this.#hasRelevantMutationHappened(record.addedNodes, record.removedNodes, record.target, record.attributeName));

        if (shouldUpdate) {
            this.#setupSelect();
            this.#setupLabel();
            if (this.hasAttribute('show-required-status')) this.#showRequiredStatus(this.getAttribute('show-required-status'));
        }
    }

    #hasRelevantMutationHappened(addedNodes, removedNodes, target, attributeName) {
        if (
            attributeName === 'disabled' && target?.tagName === 'SELECT' ||
            attributeName === 'required' && target?.tagName === 'SELECT' ||
            attributeName === 'class' && target?.tagName !== 'LABEL' ||
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

    static observedAttributes = ['show-required-status'];

    /* --------------------------------------------------
    CUSTOM ELEMENT CONSTRUCTOR (do not access or add attributes in the constructor)
    -------------------------------------------------- */

    constructor() {
        super();

        this.#initialized = false;
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

        if (this.#selectObserver) {
            this.#selectObserver.disconnect();
            this.#selectObserver = null;
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

function registerSelect() {
    if (customElements.get('fds-select') === undefined) {
        window.customElements.define('fds-select', FDSSelect);
    }
}

export default registerSelect;