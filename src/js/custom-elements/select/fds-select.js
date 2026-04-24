import * as CE from '../custom-element-utils';

class FDSSelect extends HTMLElement {

    /* Private instance fields */

    #initialized = false;
    #selectObserver = null;

    /* Private methods */

    #setupObserver() {
        if (this.#selectObserver) return;

        this.#selectObserver = new MutationObserver(this.#handleMutations);
        this.#selectObserver.observe(this, CE.mutationObserverConfig);
    }

    #handleMutations = (records) => {
        for (const { attributeName, target, addedNodes, removedNodes } of records) {

            // A relevant child element was added or removed.
            const relevantTagNames = ['LABEL', 'SELECT', 'FDS-ERROR-MESSAGE', 'FDS-HELP-TEXT'];
            const allNodes = [...addedNodes, ...removedNodes];
            if (allNodes.some(node => relevantTagNames.includes(node?.tagName))) {
                const label = this.querySelector('label');
                const select = this.querySelector('select');
                const errorMessages = this.querySelectorAll('fds-error-message');
                const helpTexts = this.querySelectorAll('fds-help-text');

                CE.associateLabelWithElement(label, select, 'sel');
                CE.setAriaDescribedBy(select, errorMessages, helpTexts);
                CE.setInvalid(select, errorMessages);

                if (this.hasAttribute('show-required-status')) {
                    CE.showRequiredStatus(label, select, this.getAttribute('show-required-status'));
                }

                break;
            }

            // The select's required attribute changed
            if (attributeName === 'required' && target?.tagName === 'SELECT') {
                if (this.hasAttribute('show-required-status')) {
                    const label = this.querySelector('label');
                    CE.showRequiredStatus(label, target, this.getAttribute('show-required-status'));
                }
            }
            // Attributes which might affect aria-describedby
            else if (
                attributeName === 'id' ||
                attributeName === 'hidden' ||
                attributeName === 'aria-hidden' ||
                attributeName === 'class')
            {
                const select = this.querySelector('select');
                const errorMessages = this.querySelectorAll('fds-error-message');
                const helpTexts = this.querySelectorAll('fds-help-text');

                CE.setAriaDescribedBy(select, errorMessages, helpTexts);
                CE.setInvalid(select, errorMessages);

                if (attributeName === 'hidden' && target === this) {
                    CE.notifySummaryOnVisibilityChange(this);
                }
            }
        }
    }

    #init() {
        this.#setupObserver();

        const label = this.querySelector('label');
        const select = this.querySelector('select');
        const errorMessages = this.querySelectorAll('fds-error-message');
        const helpTexts = this.querySelectorAll('fds-help-text');

        CE.associateLabelWithElement(label, select, 'sel');
        CE.setAriaDescribedBy(select, errorMessages, helpTexts);
        CE.setInvalid(select, errorMessages);

        if (this.hasAttribute('show-required-status')) {
            CE.showRequiredStatus(label, select, this.getAttribute('show-required-status'));
        }

        this.#initialized = true;
    }

    /* Attributes which can invoke attributeChangedCallback() */

    static observedAttributes = ['show-required-status'];

    /* --------------------------------------------------
    GETTERS AND SETTERS
    -------------------------------------------------- */

    get showRequiredStatus() { return this.getAttribute('show-required-status'); }
    set showRequiredStatus(value) { value === null ? this.removeAttribute('show-required-status') : this.setAttribute('show-required-status', value); }

    /* --------------------------------------------------
    CUSTOM ELEMENT ADDED TO DOCUMENT
    -------------------------------------------------- */

    connectedCallback() {
        if (!this.#initialized) { this.#init(); }
    }

    /* --------------------------------------------------
    CUSTOM ELEMENT REMOVED FROM DOCUMENT
    -------------------------------------------------- */

    disconnectedCallback() {
        CE.notifySummaryOnDisconnect(this);

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
            const label = this.querySelector('label');
            const select = this.querySelector('select');
            CE.showRequiredStatus(label, select, newValue);
        }
    }
}

function registerSelect() {
    if (customElements.get('fds-select') === undefined) {
        window.customElements.define('fds-select', FDSSelect);
    }
}

export default registerSelect;