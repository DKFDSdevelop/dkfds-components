'use strict';

import { generateAndVerifyUniqueId } from '../../utils/generate-unique-id';

class FDSAccordion extends HTMLElement {

    /* Private instance fields */

    #rendered;
    #handleAccordionClick;

    /* Private methods */

    #getHeadingElement() {
        return this.querySelector('h1, h2, h3, h4, h5, h6');
    }

    #getContentElement() {
        return this.querySelector('.accordion-content');
    }

    #normalizeHeadingLevel(headingLevel) {
        const normalizedHeadingLevel = (headingLevel || 'h3').toLowerCase();
        return ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].includes(normalizedHeadingLevel) ? normalizedHeadingLevel : 'h3';
    }

    #ensureDOM() {
        const headingLevel = this.#normalizeHeadingLevel(this.getAttribute('heading-level'));

        let headingElement = this.#getHeadingElement();
        let contentElement = this.#getContentElement();

        // Create heading element if missing
        if (!headingElement) {
            headingElement = document.createElement(headingLevel);

            const existingButtonElement = this.querySelector(':scope > button.accordion-button');

            if (existingButtonElement) {
                existingButtonElement.replaceWith(headingElement);
                headingElement.appendChild(existingButtonElement);
            }
            else {
                this.prepend(headingElement);
            }
        }

        // Create button if missing
        let buttonElement = headingElement.querySelector('button.accordion-button');
        if (!buttonElement) {
            const preservedHeadingNodes = Array.from(headingElement.childNodes);

            buttonElement = document.createElement('button');
            buttonElement.classList.add('accordion-button');
            buttonElement.setAttribute('type', 'button');

            headingElement.replaceChildren(buttonElement);

            const titleElement = document.createElement('span');
            titleElement.classList.add('accordion-title');

            if (this.hasAttribute('heading')) {
                titleElement.textContent = this.getAttribute('heading');
            }
            else {
                const fragment = document.createDocumentFragment();
                preservedHeadingNodes.forEach(node => fragment.appendChild(node));

                if (fragment.childNodes.length > 0) {
                    titleElement.appendChild(fragment);
                }
            }

            buttonElement.appendChild(titleElement);
        }

        // Create title element if missing
        let titleElement = buttonElement.querySelector('.accordion-title');
        if (!titleElement) {
            titleElement = document.createElement('span');
            titleElement.classList.add('accordion-title');

            if (this.hasAttribute('heading')) {
                titleElement.textContent = this.getAttribute('heading');
            }

            buttonElement.prepend(titleElement);
        }

        // Create content container if missing
        if (!contentElement) {
            contentElement = document.createElement('div');
            contentElement.classList.add('accordion-content');

            const fragment = document.createDocumentFragment();
            const nodesToMove = Array.from(this.childNodes).filter(node => node !== headingElement);

            nodesToMove.forEach(node => fragment.appendChild(node));
            contentElement.appendChild(fragment);

            this.appendChild(contentElement);
        }
    }

    #updateHeading(heading) {
        this.querySelector('.accordion-title').textContent = heading;
    }

    #updateHeadingLevel(headingLevel) {
        const normalizedHeadingLevel = this.#normalizeHeadingLevel(headingLevel);
        let headingElement = this.#getHeadingElement();

        if (!headingElement || headingElement.tagName.toLowerCase() === normalizedHeadingLevel) return;

        const newHeadingLevel = document.createElement(normalizedHeadingLevel);
        newHeadingLevel.append(...headingElement.childNodes);
        headingElement.replaceWith(newHeadingLevel);
    }

    #setExpandedState(isExpanded) {
        const button = this.#getHeadingElement()?.querySelector('button.accordion-button');
        const content = this.#getContentElement();

        if (!button || !content) return;

        button.setAttribute('aria-expanded', isExpanded ? 'true' : 'false');
        content.setAttribute('aria-hidden', isExpanded ? 'false' : 'true');
    }

    #updateExpanded(expanded) {
        const isExpanded = expanded !== null && expanded !== 'false';
        this.#setExpandedState(isExpanded);
    }

    #updateContentId(contentId) {
        this.#getHeadingElement().querySelector('.accordion-button').setAttribute('aria-controls', contentId);
        this.#getContentElement().setAttribute('id', contentId);
    }

    #ensureContentId() {
        const headingElement = this.#getHeadingElement();
        const contentElement = this.#getContentElement();

        if (!headingElement || !contentElement) return;

        const buttonHeadingId = headingElement.querySelector('.accordion-button').getAttribute('aria-controls');
        const contentId = contentElement.getAttribute('id');

        if (this.hasAttribute('content-id')) {
            this.#updateContentId(this.getAttribute('content-id'));
        }
        else if (contentId && buttonHeadingId === contentId) {
            return;
        }
        else if (contentId) {
            this.#updateContentId(contentId);
        }
        else if (buttonHeadingId) {
            this.#updateContentId(buttonHeadingId);
        }
        else {
            this.#updateContentId(generateAndVerifyUniqueId('acc'));
        }
    }

    #updateVariant(text, icon) {
        const button = this.#getHeadingElement().querySelector('button.accordion-button');

        if (text && icon) {
            let variantEl = button.querySelector('.accordion-icon');
            if (!variantEl) {
                variantEl = document.createElement('span');
                variantEl.classList.add('accordion-icon');
                button.appendChild(variantEl);
            }

            variantEl.innerHTML = '';

            const textEl = document.createElement('span');
            textEl.classList.add('icon_text');
            textEl.textContent = text;
            variantEl.appendChild(textEl);

            const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
            svg.classList.add('icon-svg');
            svg.setAttribute('focusable', 'false');
            svg.setAttribute('aria-hidden', 'true');

            const use = document.createElementNS('http://www.w3.org/2000/svg', 'use');
            use.setAttributeNS(null, 'href', `#${icon}`);
            svg.appendChild(use);

            variantEl.appendChild(svg);
        }
        else if (button.querySelector('.accordion-icon')) {
            button.querySelector('.accordion-icon').remove();
        }
    }

    //Apply all current attributes to the DOM
    //Ensures that attr values take precedence if they conflict with pre-generated HTML.
    #syncAll() {
        if (this.hasAttribute('heading')) {
            this.#updateHeading(this.getAttribute('heading'));
        }

        this.#updateHeadingLevel(this.getAttribute('heading-level'));
        this.#updateExpanded(this.getAttribute('expanded'));
        this.#ensureContentId();

        if (this.hasAttribute('variant-text') || this.hasAttribute('variant-icon')) {
            this.#updateVariant(
                this.getAttribute('variant-text'),
                this.getAttribute('variant-icon')
            );
        }
        else {
            this.#updateVariant('', '');
        }
    }

    /* Attributes which can invoke attributeChangedCallback() */

    static observedAttributes = ['heading', 'heading-level', 'expanded', 'content-id', 'variant-text', 'variant-icon', 'ready'];

    /* Getters and setters */

    get heading() { return this.getAttribute('heading'); }
    set heading(val) { this.setAttribute('heading', val); }

    /* --------------------------------------------------
    CUSTOM ELEMENT CONSTRUCTOR (do not access or add attributes in the constructor)
    -------------------------------------------------- */

    constructor() {
        super();

        this.#rendered = false;

        /* Set up instance fields for event handling */

        this.#handleAccordionClick = () => { this.toggleAccordion(); };
    }

    /* --------------------------------------------------
    CUSTOM ELEMENT METHODS
    -------------------------------------------------- */

    init() {
        if (this.#rendered) return;

        this.#ensureDOM();
        this.#syncAll();

        const button = this.#getHeadingElement()?.querySelector('button.accordion-button');
        if (button) {
            button.removeEventListener('click', this.#handleAccordionClick, false);
            button.addEventListener('click', this.#handleAccordionClick, false);
        }

        this.#rendered = true;
    }

    expandAccordion() {
        this.#setExpandedState(true);
        if (this.getAttribute('expanded') !== 'true') {
            this.setAttribute('expanded', 'true');
        }
        this.dispatchEvent(new CustomEvent('fds-accordion-expanded', { bubbles: true }));
    }

    collapseAccordion() {
        this.#setExpandedState(false);
        if (this.getAttribute('expanded') !== 'false') {
            this.setAttribute('expanded', 'false');
        }
        this.dispatchEvent(new CustomEvent('fds-accordion-collapsed', { bubbles: true }));
    }

    toggleAccordion() {
        this.isExpanded() ? this.collapseAccordion() : this.expandAccordion();
    }

    isExpanded() {
        return this.hasAttribute('expanded') && this.getAttribute('expanded') !== 'false';
    }

    /* --------------------------------------------------
    CUSTOM ELEMENT ADDED TO DOCUMENT
    -------------------------------------------------- */

    connectedCallback() {
        if (this.#rendered) return;

        if (this.hasAttribute('ready') && this.getAttribute('ready') !== 'true') return;

        this.init();
    }

    /* --------------------------------------------------
    CUSTOM ELEMENT REMOVED FROM DOCUMENT
    -------------------------------------------------- */

    disconnectedCallback() {
        const button = this.#getHeadingElement()?.querySelector('button.accordion-button');
        if (button) {
            button.removeEventListener('click', this.#handleAccordionClick, false);
        }
    }

    /* --------------------------------------------------
    CUSTOM ELEMENT'S ATTRIBUTE(S) CHANGED
    -------------------------------------------------- */

    attributeChangedCallback(attribute, oldValue, newValue) {
        if (attribute === 'ready') {
            if (!this.#rendered && this.isConnected && newValue === 'true') {
                this.init();
            }
            return;
        }

        if (!this.#rendered) return;

        if (attribute === 'heading') {
            this.#updateHeading(newValue);
        }

        if (attribute === 'heading-level') {
            this.#updateHeadingLevel(newValue);
        }

        if (attribute === 'expanded' && oldValue !== newValue) {
            this.#updateExpanded(newValue);
        }

        if (attribute === 'content-id') {
            this.#updateContentId(newValue);
        }

        if (attribute === 'variant-text') {
            if (this.hasAttribute('variant-icon')) {
                this.#updateVariant(newValue, this.getAttribute('variant-icon'));
            }
            else {
                this.#updateVariant(newValue, '');
            }
        }

        if (attribute === 'variant-icon') {
            if (this.hasAttribute('variant-text')) {
                this.#updateVariant(this.getAttribute('variant-text'), newValue);
            }
            else {
                this.#updateVariant('', newValue);
            }
        }
    }
}

function registerAccordion() {
    if (customElements.get('fds-accordion') === undefined) {
        window.customElements.define('fds-accordion', FDSAccordion);
    }
}

export default registerAccordion;