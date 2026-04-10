'use strict';

import { generateAndVerifyUniqueId } from "../../utils/generate-unique-id";

class FDSErrorSummary extends HTMLElement {

    /* Private instance fields */

    #initialized;

    /* Private methods */

    #getSummaryElements() {
        const navElement = this.querySelector(':scope > nav');
        const headingElement = navElement?.querySelector(':scope > h1, :scope > h2, :scope > h3, :scope > h4, :scope > h5, :scope > h6');
        const listElement = navElement?.querySelector(':scope > ul');

        return { navElement, headingElement, listElement };
    }

    #normalizeHeadingLevel(headingLevel) {
        const normalizedHeadingLevel = (headingLevel || 'h2').toLowerCase();
        return ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].includes(normalizedHeadingLevel)
            ? normalizedHeadingLevel
            : 'h2';
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
            headingElement.id = generateAndVerifyUniqueId('error-summary-heading');

            const listElement = document.createElement('ul');

            navElement.appendChild(iconElement);
            navElement.appendChild(headingElement);
            navElement.appendChild(listElement);

            navElement.setAttribute('aria-labelledby', headingElement.id);

            this.appendChild(navElement);

            return true;
        }

        // Enhance mode:
        // Nav exists, so the supported prerendered structure must already be present

        const headingElement = alertElement.querySelector(':scope > h1, :scope > h2, :scope > h3, :scope > h4, :scope > h5, :scope > h6');
        if (!headingElement) {
            console.warn('<fds-error-summary> Missing direct child heading inside alert.');
            return false;
        }

        const listElement = alertElement.querySelector(':scope > ul');
        if (!listElement) {
            console.warn('<fds-error-summary> Missing direct child ul inside alert.');
            return false;
        }

        if (!headingElement.id) {
            headingElement.id = generateAndVerifyUniqueId('error-summary-heading');
        }

        navElement.setAttribute('aria-labelledby', headingElement.id);

        return true;
    }

    #updateHeading(heading) {
        const { headingElement } = this.#getSummaryElements();
        if (!headingElement) return;

        headingElement.textContent = heading;
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
        if (this.hasAttribute('heading')) {
            this.#updateHeading(this.getAttribute('heading'));
        }

        if (this.hasAttribute('heading-level')) {
            this.#updateHeadingLevel(this.getAttribute('heading-level'));
        }
    }

    /* Attributes which can invoke attributeChangedCallback() */

    static observedAttributes = ['heading', 'heading-level', 'ready'];

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
        if (this.#initialized) return;

        const isValid = this.#ensureDOM();
        if (!isValid) return;

        this.#syncAll();

        this.#initialized = true;
    }

    /* --------------------------------------------------
    CUSTOM ELEMENT ADDED TO DOCUMENT
    -------------------------------------------------- */

    connectedCallback() {
        if (this.getAttribute('ready') === 'false') return;

        this.init();
    }

    /* --------------------------------------------------
    CUSTOM ELEMENT REMOVED FROM DOCUMENT
    -------------------------------------------------- */

    disconnectedCallback() {
        this.#initialized = false;
    }

    /* --------------------------------------------------
    CUSTOM ELEMENT'S ATTRIBUTE(S) CHANGED
    -------------------------------------------------- */

    attributeChangedCallback(attribute, oldValue, newValue) {
        if (attribute === 'ready') {
            if (!this.#initialized && this.isConnected && newValue === 'true') {
                this.init();
            }
            return;
        }

        if (!this.#initialized) return;

        if (attribute === 'heading') {
            this.#updateHeading(newValue);
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