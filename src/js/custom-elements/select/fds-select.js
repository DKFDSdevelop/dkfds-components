import { generateAndVerifyUniqueId } from '../../utils/generate-unique-id';

class FDSSelect extends HTMLElement {

    /* Private instance fields */

    #initialized;
    #selectObserver = null;

    /* Private methods */

    #setupLabel() {
        const label = this.querySelector('label');

        if (!label) return;

        const select = this.querySelector('select');

        if (select) {
            label.htmlFor = select.id;
            label.classList.toggle('disabled', select.hasAttribute('disabled'));
        }
        else {
            label.removeAttribute('for');
        }
    }

    #setupSelect() {
        const select = this.querySelector('select');

        if (!select) return;

        /* Set id */

        if (!select.id) {
            select.id = generateAndVerifyUniqueId('sel');
        }

        /* Add or remove aria-describedby */

        select.removeAttribute('aria-describedby');
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
        const label = this.querySelector('label');
        const select = this.querySelector('select');

        if (!label || !select) return;

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

        const isRequired = select.hasAttribute('required') || (select.hasAttribute('aria-required') && select.getAttribute('aria-required') !== 'false');

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