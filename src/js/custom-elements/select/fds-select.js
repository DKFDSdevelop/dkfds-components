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
        if (this.#getLabelElement()) {
            const labelHasFor = this.#getLabelElement().htmlFor;
            const labelHasClass = this.#getLabelElement().classList.contains('form-label');

            if (!labelHasFor && this.#getSelectElement()?.id) {
                this.#getLabelElement().htmlFor = this.#getSelectElement()?.id;
            }

            if (!labelHasClass) {
                this.#getLabelElement().classList.add('form-label');
            }
        }
    }

    #setupSelect() {
        if (this.#getSelectElement()) {

            /* Set id and classes */

            const selectHasId = this.#getSelectElement().id;
            const selectHasClass = this.#getSelectElement().classList.contains('form-select');

            if (!selectHasId) {
                this.#getSelectElement().id = generateAndVerifyUniqueId('sel');
            }

            if (!selectHasClass) {
                this.#getSelectElement().classList.add('form-select');
            }

            /* Add or remove aria-describedby */

            this.#getSelectElement().removeAttribute('aria-describedby');
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

            if (idsForAriaDescribedby.length > 0) {
                this.#getSelectElement().setAttribute('aria-describedby', idsForAriaDescribedby.join(' '));
            }
            else {
                this.#getSelectElement().removeAttribute('aria-describedby');
            }

            if (isInvalid) {
                this.#getSelectElement().setAttribute('aria-invalid', 'true');
            }
            else {
                this.#getSelectElement().removeAttribute('aria-invalid');
            }
        }
    }

    #init() {
        if (this.#initialized) return;

        this.#setupObserver();

        this.#setupSelect();
        this.#setupLabel();

        this.#initialized = true;
    }

    #setupObserver() {
        this.#selectObserver = new MutationObserver(this.#handleMutations);

        const config = {
            subtree: true,
            childList: true,
            attributes: true,
            attributeFilter: ['hidden', 'aria-hidden', 'id', 'class'],
            attributeOldValue: false,
            characterData: false,
            characterDataOldValue: false
        }

        this.#selectObserver.observe(this, config);
    }

    #handleMutations = (records, observer) => {
        console.log(`${this.tagName} with id ${this.id} had mutations at ${Date.now()}`);

        const shouldUpdate = records.some(record => this.#hasRelevantMutationHappened(record.addedNodes, record.removedNodes, record.target));

        if (shouldUpdate) {
            this.#setupSelect();
            this.#setupLabel();
        }
    }

    #hasRelevantMutationHappened(addedNodes, removedNodes, target) {
        const relevantTagNames = ['LABEL', 'SELECT', 'FDS-ERROR-MESSAGE', 'FDS-HELP-TEXT'];

        if (relevantTagNames.includes(target?.tagName)) {
            return true;
        }

        const allNodes = [...addedNodes, ...removedNodes];
        return allNodes.some(node => relevantTagNames.includes(node?.tagName));
    }

    /* Attributes which can invoke attributeChangedCallback() */

    static observedAttributes = [];

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
}

function registerSelect() {
    if (customElements.get('fds-select') === undefined) {
        window.customElements.define('fds-select', FDSSelect);
    }
}

export default registerSelect;