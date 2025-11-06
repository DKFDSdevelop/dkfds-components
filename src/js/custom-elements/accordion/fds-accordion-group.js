'use strict';

class FDSAccordionGroup extends HTMLElement {

    /* Private instance fields */

    #rendered;
    #listenersAttached;
    #bulkButton;

    #handleBulkClick;
    #handleAccordionExpanded;
    #handleAccordionCollapsed;

    /* Private methods */

    #getBulkButton() {
        if (this.#bulkButton) return this.#bulkButton;

        this.#bulkButton = this.querySelector(':scope > .bulk-button');
        return this.#bulkButton;
    }

    #renderBulkButton() {
        if (!this.#getBulkButton()) {
            const bulkButton = document.createElement('button');
            bulkButton.classList.add('bulk-button');
            this.prepend(bulkButton);
            this.#bulkButton = bulkButton;
        }
    }

    #render() {
        if (this.#rendered) return;

        const hasRenderedBulkButton = this.querySelectorAll('button.bulk-button').length > 0;
        const hasBulkButtonFromAttr = this.getAttribute('has-bulk-button') !== null && this.getAttribute('has-bulk-button') !== 'false';

        if (hasBulkButtonFromAttr && !hasRenderedBulkButton) {
            this.#renderBulkButton();
        }
        this.#updateBulkButtonText();

        this.#rendered = true;
    }

    #updateHeadingLevel(headingLevel) {
        const valid = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'];
        if (!valid.includes(headingLevel)) return;
        this.#getAllAccordions().forEach(acc => acc.setAttribute('heading-level', headingLevel));
    }

    #getAllAccordions() {
        return Array.from(this.querySelectorAll(':scope > fds-accordion'));
    }

    #areAllExpanded() {
        return this.#getAllAccordions().every(acc => {
            const expandedAttr = acc.getAttribute('expanded');
            if (expandedAttr != null) return expandedAttr === 'true';
            const button = acc.querySelector('button.accordion-button');
            return button?.getAttribute('aria-expanded') === 'true';
        });
    }

    #updateBulkButtonText() {
        const button = this.#getBulkButton();
        if (!button) return;

        const openText = this.getAttribute('open-all-text') || 'Åbn alle';
        const closeText = this.getAttribute('close-all-text') || 'Luk alle';
        const allExpanded = this.#areAllExpanded();
        button.textContent = allExpanded ? closeText : openText;
        allExpanded ? button.classList.add('close') : button.classList.remove('close');
    }

    #updateHasBulkButton(attrValue) {
        const mustHasBulkButton = attrValue !== null && attrValue !== 'false';
        const hasBulkButton = this.#getBulkButton();

        if (mustHasBulkButton) {
            this.#renderBulkButton();
            this.#getBulkButton()?.removeEventListener('click', this.#handleBulkClick);
            this.#getBulkButton()?.addEventListener('click', this.#handleBulkClick);
        }
        else if (!mustHasBulkButton && hasBulkButton) {
            this.#getBulkButton()?.removeEventListener('click', this.#handleBulkClick);
            this.#getBulkButton()?.remove();
            this.#bulkButton = null;
        }

        this.#updateBulkButtonText();
    }

    /* Attributes which can invoke attributeChangedCallback() */

    static observedAttributes = ['heading-level', 'has-bulk-button', 'open-all-text', 'close-all-text'];

    /* --------------------------------------------------
    CUSTOM ELEMENT CONSTRUCTOR (do not access or add attributes in the constructor)
    -------------------------------------------------- */

    constructor() {
        super();
        this.#rendered = false;
        this.#listenersAttached = false;
        this.#bulkButton = null;

        this.#handleBulkClick = () => this.toggleAllAccordions();
        this.#handleAccordionExpanded = () => this.#updateBulkButtonText();
        this.#handleAccordionCollapsed = () => this.#updateBulkButtonText();
    }

    /* --------------------------------------------------
    CUSTOM ELEMENT METHODS
    -------------------------------------------------- */

    toggleAllAccordions() {
        const accordions = this.#getAllAccordions();

        const shouldExpandAll = !this.#areAllExpanded();
        const newValue = shouldExpandAll ? 'true' : 'false';

        accordions.forEach(acc => acc.setAttribute('expanded', newValue));
        this.#updateBulkButtonText();
    }

    /* --------------------------------------------------
    CUSTOM ELEMENT ADDED TO DOCUMENT
    -------------------------------------------------- */

    connectedCallback() {
        if (this.#rendered) return;

        this.#render();

        if (this.#listenersAttached) return;

        this.addEventListener('fds-accordion-expanded', this.#handleAccordionExpanded);
        this.addEventListener('fds-accordion-collapsed', this.#handleAccordionCollapsed);
        if (this.#getBulkButton()) {
            this.#getBulkButton().addEventListener('click', this.#handleBulkClick);
        }

        this.#listenersAttached = true;

        if (this.hasAttribute('heading-level')) {
            this.#updateHeadingLevel(this.getAttribute('heading-level'));
        }

        this.#updateBulkButtonText();
    }

    /* --------------------------------------------------
    CUSTOM ELEMENT REMOVED FROM DOCUMENT
    -------------------------------------------------- */

    disconnectedCallback() {
        this.#rendered = false;

        if (!this.#listenersAttached) return;

        this.removeEventListener('fds-accordion-expanded', this.#handleAccordionExpanded);
        this.removeEventListener('fds-accordion-collapsed', this.#handleAccordionCollapsed);

        if (this.#getBulkButton()) {
            this.#getBulkButton().removeEventListener('click', this.#handleBulkClick);
        }

        this.#listenersAttached = false;
    }

    /* --------------------------------------------------
    CUSTOM ELEMENT'S ATTRIBUTE(S) CHANGED
    -------------------------------------------------- */

    attributeChangedCallback(attribute, oldValue, newValue) {
        if (!this.#rendered) return;

        if (attribute === 'heading-level') {
            this.#updateHeadingLevel(newValue);
        }

        if (attribute === 'has-bulk-button') {
            this.#updateHasBulkButton(newValue);
        }

        if (attribute === 'open-all-text' || attribute === 'close-all-text') {
            this.#updateBulkButtonText();
        }
    }
}

function registerAccordionGroup() {
    if (customElements.get('fds-accordion-group') === undefined) {
        window.customElements.define('fds-accordion-group', FDSAccordionGroup);
    }
}

export default registerAccordionGroup;