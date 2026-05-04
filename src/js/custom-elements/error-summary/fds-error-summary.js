'use strict';

import { generateAndVerifyUniqueId } from "../../utils/generate-unique-id";

const ERROR_WRAPPER_SELECTORS = [
    'fds-input',
    'fds-checkbox',
    'fds-checkbox-group',
    'fds-radio-button-group',
    'fds-date-input',
    'fds-textarea',
    'fds-select',
    'fds-upload-file',
    'fds-date-picker'
];

const ERROR_WRAPPER_SELECTOR = ERROR_WRAPPER_SELECTORS.join(', ');
const ERROR_MESSAGE_SELECTOR = ERROR_WRAPPER_SELECTORS
    .map(selector => `${selector} fds-error-message`)
    .join(', ');

class FDSErrorSummary extends HTMLElement {

    /* Private instance fields */

    #initialized;
    #handleErrorMessageEvents;

    /* Private methods */

    #getSummaryElements() {
        const navElement = this.querySelector(':scope > nav');
        const headingElement = navElement?.querySelector(':scope > h1, :scope > h2, :scope > h3, :scope > h4, :scope > h5, :scope > h6');
        const listElement = navElement?.querySelector(':scope > ul');

        return { navElement, headingElement, listElement };
    }

    #getErrorWrapper(errorMessage) {
        return errorMessage?.closest(ERROR_WRAPPER_SELECTOR);
    }

    #findFocusableControl(errorMessage) {
        const wrapper = this.#getErrorWrapper(errorMessage);
        if (!wrapper) return null;

        return wrapper.querySelector(
            'input:not([disabled]), ' +
            'select:not([disabled]), ' +
            'textarea:not([disabled]), ' +
            'button:not([disabled]), ' +
            '[tabindex]:not([tabindex="-1"])'
        );
    }

    #normalizeHeadingLevel(headingLevel) {
        const normalizedHeadingLevel = (headingLevel || 'h2').toLowerCase();
        return ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].includes(normalizedHeadingLevel)
            ? normalizedHeadingLevel
            : 'h2';
    }

    #hasHiddenAttribute(element) {
        if (!element) return true;

        const hiddenValue = element.getAttribute('hidden');
        return hiddenValue === '' || hiddenValue === 'true';
    }

    #isEligibleErrorMessage(errorMessage) {
        if (!errorMessage?.matches('fds-error-message')) return false;

        const wrapper = this.#getErrorWrapper(errorMessage);
        if (!wrapper) return false;

        return !this.#hasHiddenAttribute(wrapper);
    }

    #syncVisibility() {
        const { listElement } = this.#getSummaryElements();
        const hasErrors = !!listElement?.querySelector(':scope > li');

        this.hidden = !hasErrors;
    }

    #updateHeadingId(headingId) {
        const { navElement, headingElement } = this.#getSummaryElements();
        if (!navElement || !headingElement) return;

        headingElement.id = headingId || headingElement.id || generateAndVerifyUniqueId('error-summary-heading');
        navElement.setAttribute('aria-labelledby', headingElement.id);
    }

    #ensureDOM() {
        const headingLevel = this.#normalizeHeadingLevel(this.getAttribute('heading-level'));

        let navElement = this.querySelector(':scope > nav');

        // Attribute mode:
        // No nav markup provided, so create canonical structure from attributes
        if (!navElement) {
            navElement = document.createElement('nav');

            const iconElement = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
            iconElement.setAttribute('aria-label', 'Fejl');
            iconElement.setAttribute('focusable', 'false');

            const useElement = document.createElementNS('http://www.w3.org/2000/svg', 'use');
            useElement.setAttributeNS(null, 'href', '#error');
            iconElement.appendChild(useElement);

            const headingElement = document.createElement(headingLevel);
            headingElement.textContent = this.getAttribute('heading') || 'Der er problemer';

            const listElement = document.createElement('ul');

            navElement.appendChild(iconElement);
            navElement.appendChild(headingElement);
            navElement.appendChild(listElement);

            this.appendChild(navElement);
            this.#updateHeadingId();
            return true;
        }

        const headingElement = navElement.querySelector(':scope > h1, :scope > h2, :scope > h3, :scope > h4, :scope > h5, :scope > h6');
        if (!headingElement) {
            console.warn('<fds-error-summary> Missing direct child heading inside nav.');
            return false;
        }

        // Enhance mode: 
        // Nav exists, so the supported prerendered structure must already be present
        const listElement = navElement.querySelector(':scope > ul');
        if (!listElement) {
            console.warn('<fds-error-summary> Missing direct child ul inside nav.');
            return false;
        }

        this.#updateHeadingId();
        return true;
    }

    #updateHeading(heading) {
        const { headingElement } = this.#getSummaryElements();
        if (headingElement) {
            headingElement.textContent = heading;
        }
    }

    #updateHeadingLevel(headingLevel) {
        const normalizedHeadingLevel = this.#normalizeHeadingLevel(headingLevel);
        const { navElement, headingElement } = this.#getSummaryElements();

        if (!headingElement || headingElement.tagName.toLowerCase() === normalizedHeadingLevel) return;

        const newHeadingElement = document.createElement(normalizedHeadingLevel);

        for (const attr of headingElement.attributes) {
            newHeadingElement.setAttribute(attr.name, attr.value);
        }

        newHeadingElement.append(...headingElement.childNodes);
        headingElement.replaceWith(newHeadingElement);

        if (navElement && newHeadingElement.id) {
            navElement.setAttribute('aria-labelledby', newHeadingElement.id);
        }
    }

    #syncAll() {
        const heading = this.getAttribute('heading');
        const headingLevel = this.getAttribute('heading-level');
        const headingId = this.getAttribute('heading-id');

        if (heading !== null) {
            this.#updateHeading(heading);
        }

        if (headingLevel !== null) {
            this.#updateHeadingLevel(headingLevel);
        }

        this.#updateHeadingId(headingId);
    }

    #addError(errorId, message) {
        const { listElement } = this.#getSummaryElements();
        if (!listElement || !errorId || !message) return;

        const sourceError = document.getElementById(errorId);
        if (!sourceError) return;

        const focusTarget = this.#findFocusableControl(sourceError);
        let li = listElement.querySelector(`[data-error-id="${errorId}"]`);

        if (!li) {
            li = document.createElement('li');
            li.dataset.errorId = errorId;

            const link = document.createElement('a');
            link.classList.add('function-link');
            li.appendChild(link);

            listElement.appendChild(li);
        }

        const link = li.querySelector('a');
        if (link) {
            link.href = focusTarget?.id ? `#${focusTarget.id}` : '#';
            link.textContent = message;

            link.onclick = (e) => {
                e.preventDefault();

                if (focusTarget) {
                    focusTarget.focus();
                }
            };
        }

        // Reinsert in correct DOM order
        const items = [...listElement.querySelectorAll(':scope > li')]
            .filter(item => item !== li);

        let inserted = false;

        for (const item of items) {
            const itemErrorId = item.dataset.errorId;
            const itemSourceError = itemErrorId ? document.getElementById(itemErrorId) : null;

            if (!itemSourceError) continue;

            const isBefore =
                sourceError.compareDocumentPosition(itemSourceError) &
                Node.DOCUMENT_POSITION_FOLLOWING;

            if (isBefore) {
                listElement.insertBefore(li, item);
                inserted = true;
                break;
            }
        }

        if (!inserted) {
            listElement.appendChild(li);
        }

        this.#syncVisibility();
    }

    #removeError(errorId) {
        const { listElement } = this.#getSummaryElements();
        listElement?.querySelector(`[data-error-id="${errorId}"]`)?.remove();

        this.#syncVisibility();
    }

    #syncErrorMessage(errorMessage) {
        if (!errorMessage?.id || !this.#isEligibleErrorMessage(errorMessage)) {
            if (errorMessage?.id) {
                this.#removeError(errorMessage.id);
            }
            return;
        }

        const isHidden = this.#hasHiddenAttribute(errorMessage);
        const message = errorMessage.querySelector(':scope > .visible-message')?.textContent?.trim()
            || errorMessage.textContent?.trim();

        if (isHidden || !message) {
            this.#removeError(errorMessage.id);
            return;
        }

        this.#addError(errorMessage.id, message);
    }

    #syncErrorById(errorId) {
        if (!errorId) return;

        const errorMessage = document.getElementById(errorId);

        if (!errorMessage || !this.#isEligibleErrorMessage(errorMessage)) {
            this.#removeError(errorId);
            return;
        }

        this.#syncErrorMessage(errorMessage);
    }

    #scanAllErrors() {
        document.querySelectorAll(ERROR_MESSAGE_SELECTOR).forEach((errorMessage) => {
            this.#syncErrorMessage(errorMessage);
        });

        this.#syncVisibility();
    }

    #cleanupAutoMode() {
        if (!this.#handleErrorMessageEvents) return;

        document.removeEventListener('error-message-visibility-changed', this.#handleErrorMessageEvents);
        document.removeEventListener('error-message-callback', this.#handleErrorMessageEvents);
        this.#handleErrorMessageEvents = null;
    }

    #initAutoMode() {
        this.#cleanupAutoMode();

        const { listElement } = this.#getSummaryElements();
        if (listElement) {
            listElement.innerHTML = '';
        }

        this.#syncVisibility();
        this.#scanAllErrors();

        this.#handleErrorMessageEvents = (e) => {
            const { errorId, isRemoved } = e.detail || {};

            if (e.type === 'error-message-callback' && !errorId) {
                this.#scanAllErrors();
                return;
            }

            if (!errorId) return;

            if (isRemoved) {
                this.#removeError(errorId);
                return;
            }

            this.#syncErrorById(errorId);
        };

        document.addEventListener('error-message-visibility-changed', this.#handleErrorMessageEvents);
        document.addEventListener('error-message-callback', this.#handleErrorMessageEvents);
    }

    static observedAttributes = ['heading', 'heading-level', 'heading-id', 'auto'];

    constructor() {
        super();

        this.#initialized = false;
        this.#handleErrorMessageEvents = null;
    }

    /* --------------------------------------------------
    CUSTOM ELEMENT METHODS
    -------------------------------------------------- */

    init() {
        if (this.#initialized) return;

        const isValid = this.#ensureDOM();
        if (!isValid) return;

        this.#syncAll();

        if (this.hasAttribute('auto')) {
            this.#initAutoMode();
        }

        this.#initialized = true;
    }

    /* --------------------------------------------------
    CUSTOM ELEMENT ADDED TO DOCUMENT
    -------------------------------------------------- */

    connectedCallback() {
        this.init();
    }

    /* --------------------------------------------------
    CUSTOM ELEMENT REMOVED FROM DOCUMENT
    -------------------------------------------------- */

    disconnectedCallback() {
        this.#cleanupAutoMode();
        this.#initialized = false;
    }

    /* --------------------------------------------------
    CUSTOM ELEMENT'S ATTRIBUTE(S) CHANGED
    -------------------------------------------------- */

    attributeChangedCallback(attribute, oldValue, newValue) {
        if (attribute === 'auto') {
            if (this.#initialized && newValue !== null && oldValue === null) {
                this.#initAutoMode();
            } else if (this.#initialized && newValue === null && oldValue !== null) {
                this.#cleanupAutoMode();
            }
            return;
        }

        if (!this.#initialized) return;

        if (attribute === 'heading') {
            this.#updateHeading(newValue);
        }

        if (attribute === 'heading-id') {
            this.#updateHeadingId(newValue)
        }

        if (attribute === 'heading-level') {
            this.#updateHeadingLevel(newValue);
        }
    }
}

function registerErrorSummary() {
    if (customElements.get('fds-error-summary') === undefined) {
        window.customElements.define('fds-error-summary', FDSErrorSummary);
    }
}

export default registerErrorSummary;