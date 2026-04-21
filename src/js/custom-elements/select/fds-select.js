import * as Util from './fds-select-utils';
import * as CE from '../custom-element-utils';

class FDSSelect extends HTMLElement {

    /* Private instance fields */

    #initialized = false;
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
        this.#refreshReferences();
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
        this.#selectObserver.observe(this, CE.mutationObserverConfig);
    }

    #handleMutations = (records) => {
        for (const { attributeName, target, addedNodes, removedNodes } of records) {

            // A relevant child element was added or removed.
            // Refresh everything as multiple mutations may occur simultaneously.
            const relevantTagNames = ['LABEL', 'SELECT', 'FDS-ERROR-MESSAGE', 'FDS-HELP-TEXT'];
            const allNodes = [...addedNodes, ...removedNodes];
            if (allNodes.some(node => relevantTagNames.includes(node?.tagName))) {
                this.#refreshReferences();
                CE.associateLabelWithElement(this.#label, this.#select, 'sel');
                Util.setDisabledClass(this.#label, this.#select);
                Util.setAriaDescribedBy(this.#select, this.#errorMessages, this.#helpTexts);
                Util.setInvalid(this.#select, this.#errorMessages);
                if (this.hasAttribute('show-required-status')) this.#showRequiredStatus(this.getAttribute('show-required-status'));
                break;
            }

            // The select's disabled attribute changed
            if (attributeName === 'disabled' && target?.tagName === 'SELECT') {
                Util.setDisabledClass(this.#label, this.#select);
            }

            // The select's required attribute changed
            else if (attributeName === 'required' && target?.tagName === 'SELECT') {
                if (this.hasAttribute('show-required-status')) this.#showRequiredStatus(this.getAttribute('show-required-status'));
            }

            // Class changes on the label are excluded to prevent an infinite loop, as setDisabledClass adds/removes the 'disabled' class on the label.
            else if (
                attributeName === 'id' ||
                attributeName === 'hidden' ||
                attributeName === 'aria-hidden' ||
                (attributeName === 'class' && target?.tagName !== 'LABEL')
            ) {
                Util.setAriaDescribedBy(this.#select, this.#errorMessages, this.#helpTexts);
                Util.setInvalid(this.#select, this.#errorMessages);

                if (attributeName === 'hidden' && target === this) {
                    this.#notifySummaryOnVisibilityChange();
                }
            }
        }
    }

    #notifySummaryOnDisconnect() {
        if (!document.querySelector('fds-error-summary[auto]')) return;

        this.querySelectorAll('fds-error-message[id]').forEach((errorMessage) => {
            document.dispatchEvent(new CustomEvent('error-message-callback', {
                detail: {
                    errorId: errorMessage.id,
                    isRemoved: true
                }
            }));
        });
    }

    #notifySummaryOnVisibilityChange() {
        if (!document.querySelector('fds-error-summary[auto]')) return;

        this.querySelectorAll('fds-error-message[id]').forEach((errorMessage) => {
            document.dispatchEvent(new CustomEvent('error-message-visibility-changed', {
                detail: {
                    errorId: errorMessage.id
                }
            }));
        });
    }

    /* Attributes which can invoke attributeChangedCallback() */

    static observedAttributes = ['show-required-status'];

    /* --------------------------------------------------
    GETTERS AND SETTERS
    -------------------------------------------------- */

    get showRequiredStatus() { return this.getAttribute('show-required-status'); }
    set showRequiredStatus(value) { this.setAttribute('show-required-status', value); }

    /* --------------------------------------------------
    CUSTOM ELEMENT METHODS
    -------------------------------------------------- */

    init() {
        this.#setupObserver();

        this.#refreshReferences();

        CE.associateLabelWithElement(this.#label, this.#select, 'sel');
        Util.setDisabledClass(this.#label, this.#select);
        Util.setAriaDescribedBy(this.#select, this.#errorMessages, this.#helpTexts);
        Util.setInvalid(this.#select, this.#errorMessages);

        if (this.hasAttribute('show-required-status')) { this.#showRequiredStatus(this.getAttribute('show-required-status')); }

        this.#initialized = true;
    }

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
        this.#notifySummaryOnDisconnect();

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