import { generateAndVerifyUniqueId } from '../../utils/generate-unique-id';

class FDSTextarea extends HTMLElement {

    /* Private instance fields */

    #initialized;
    #textareaObserver = null;

    /* Private methods */

    #setupLabel() {
        const label = this.querySelector('label');

        if (!label) return;

        if (!label.classList.contains('form-label')) {
            label.classList.add('form-label');
        }

        const textarea = this.querySelector('textarea');

        if (textarea) {
            label.htmlFor = textarea.id;
            label.classList.toggle('disabled', textarea.hasAttribute('disabled'));
        }
        else {
            label.removeAttribute('for');
        }
    }

    #setupTextarea() {
        const textarea = this.querySelector('textarea');

        if (!textarea) return;

        if (!textarea.classList.contains('form-input')) {
            textarea.classList.add('form-input');
        }

        if (!textarea.id) {
            textarea.id = generateAndVerifyUniqueId('txt');
        }

        // /* Add or remove aria-describedby */

        textarea.removeAttribute('aria-describedby');
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

        idsForAriaDescribedby.length > 0 ? textarea.setAttribute('aria-describedby', idsForAriaDescribedby.join(' ')) : textarea.removeAttribute('aria-describedby');
        isInvalid ? textarea.setAttribute('aria-invalid', 'true') : textarea.removeAttribute('aria-invalid');
    }

    #setupCharacterLimitListener() {
        const textarea = this.querySelector('textarea');

        if (!textarea) return;

        textarea.addEventListener('input', () => {
            const characterLimit = this.querySelector('fds-character-limit');

            if (characterLimit) {
                characterLimit.setCharactersUsed(textarea.value.length);
                characterLimit.updateMessages();
            }
        });
    }

    #init() {
        if (this.#initialized) return;

        this.#setupObserver();

        this.#setupTextarea();
        this.#setupLabel();
        this.#setupCharacterLimitListener();

        this.#initialized = true;
    }

    #showRequiredStatus(value) {
        const label = this.querySelector('label');
        const textarea = this.querySelector('textarea');

        if (!label || !textarea) return;

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

        const isRequired = textarea.hasAttribute('required') || (textarea.hasAttribute('aria-required') && textarea.getAttribute('aria-required') !== 'false');

        let text = value;
        if (value === '' && isRequired) text = 'skal udfyldes';
        if (value === '' && !isRequired) text = 'frivilligt';

        statusIndicator.textContent = isRequired ? ` (*${text})` : ` (${text})`;
    }

    #setupObserver() {
        this.#textareaObserver = new MutationObserver(this.#handleMutations);

        const config = {
            subtree: true,
            childList: true,
            attributes: true,
            attributeFilter: ['hidden', 'aria-hidden', 'id', 'class', 'disabled', 'required'],
            attributeOldValue: false,
            characterData: false,
            characterDataOldValue: false
        }

        this.#textareaObserver.observe(this, config);
    }

    #handleMutations = (records, observer) => {
        //console.log(`${this.tagName} had mutations at ${Date.now()}`, records);

        const shouldUpdate = records.some(record => this.#hasRelevantMutationHappened(record.addedNodes, record.removedNodes, record.target, record.attributeName));

        if (shouldUpdate) {
            this.#setupTextarea();
            this.#setupLabel();
            if (this.hasAttribute('show-required-status')) this.#showRequiredStatus(this.getAttribute('show-required-status'));
        }
    }

    #hasRelevantMutationHappened(addedNodes, removedNodes, target, attributeName) {
        if (
            attributeName === 'disabled' && target?.tagName === 'TEXTAREA' ||
            attributeName === 'required' && target?.tagName === 'TEXTAREA' ||
            attributeName === 'class' && target?.tagName !== 'LABEL' ||
            attributeName === 'id' ||
            attributeName === 'hidden' ||
            attributeName === 'aria-hidden'
        ) {
            return true;
        }

        if (target?.tagName === 'FDS-CHARACTER-LIMIT') {
            return true;
        }

        const relevantTagNames = ['LABEL', 'TEXTAREA', 'FDS-ERROR-MESSAGE', 'FDS-HELP-TEXT'];
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

        if (this.#textareaObserver) {
            this.#textareaObserver.disconnect();
            this.#textareaObserver = null;
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

function registerTextarea() {
    if (customElements.get('fds-textarea') === undefined) {
        window.customElements.define('fds-textarea', FDSTextarea);
    }
}

export default registerTextarea;