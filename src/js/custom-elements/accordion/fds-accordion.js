'use strict';

import { generateUniqueIdWithPrefix } from '../../utils/generate-unique-id';

class FDSAccordion extends HTMLElement {

    /* Private instance fields */

    #initialized;
    #expanded;

    #handleAccordionClick;

    /* Private methods */

    #init() {
        if (!this.#initialized) {
            let accordionRendered = true;

            if (this.children.length === 2) {
                const ACC_HEADING = this.children[0];
                const ACC_CONTENT = this.children[1];

                // Validate heading
                if (!['H1', 'H2', 'H3', 'H4', 'H5', 'H6'].includes(ACC_HEADING.tagName)) {
                    accordionRendered = false;
                }

                // Validate button in heading
                if (ACC_HEADING.querySelectorAll(':scope > button.accordion-button[aria-expanded][aria-controls]').length !== 1) {
                    accordionRendered = false;
                }

                // Validate accordion title
                if (ACC_HEADING.querySelectorAll(':scope > button.accordion-button[aria-expanded][aria-controls] > .accordion-title').length !== 1) {
                    accordionRendered = false;
                }

                // Validate content
                if (!(ACC_CONTENT.classList.contains('accordion-content') && ACC_CONTENT.hasAttribute('id') && ACC_CONTENT.hasAttribute('aria-hidden'))) {
                    accordionRendered = false;
                }

                // Validate variant and variant icon
                if (ACC_HEADING.querySelectorAll(':scope > button.accordion-button[aria-expanded][aria-controls] > .accordion-title + .accordion-icon').length === 1) {
                    if (!(ACC_HEADING.querySelectorAll(':scope > button.accordion-button[aria-expanded][aria-controls] > .accordion-title + .accordion-icon > .icon_text').length === 1 && ACC_HEADING.querySelectorAll(':scope > button.accordion-button[aria-expanded][aria-controls] > .accordion-title + .accordion-icon > .icon-svg').length)) {
                        accordionRendered = false;
                    }
                }
            }
            else {
                accordionRendered = false;
            }

            if (!accordionRendered) {
                /* Default values */

                let defaultId = '';
                do {
                    defaultId = generateUniqueIdWithPrefix('acc');
                } while (document.getElementById(defaultId));

                let defaultHeadingLevel = 'h3';

                this.#expanded = false;

                /* Accordion heading */

                const heading = document.createElement('span');
                heading.classList.add('accordion-title');

                const accordionButton = document.createElement('button');
                accordionButton.classList.add('accordion-button');
                accordionButton.setAttribute('aria-expanded', 'true');
                accordionButton.setAttribute('type', 'button');
                accordionButton.setAttribute('aria-controls', defaultId);

                let headingElement = document.createElement(defaultHeadingLevel);

                accordionButton.appendChild(heading);
                headingElement.appendChild(accordionButton);

                /* Accordion content */

                let contentElement = document.createElement('div');
                contentElement.classList.add('accordion-content');
                contentElement.setAttribute('id', defaultId);
                contentElement.setAttribute('aria-hidden', 'false');

                while (this.firstChild) {
                    contentElement.appendChild(this.firstChild);
                }

                this.appendChild(headingElement);
                this.appendChild(contentElement);
            }

            this.#initialized = true;
        }
    }

    #updateHeading(heading) {
        this.querySelector('.accordion-title').textContent = heading;
    }

    #updateHeadingLevel(headingLevel) {
        const newHeadingLevel = document.createElement(`${headingLevel}`);
        let headingElement = this.#getHeadingElement();
        newHeadingLevel.append(...headingElement.childNodes);
        headingElement.replaceWith(newHeadingLevel);
        headingElement = newHeadingLevel;
    }

    #updateExpanded(expanded) {
        this.#expanded = expanded === "true" ? true : false;
        if (this.#expanded) {
            this.expandAccordion();
        }
        else {
            this.collapseAccordion();
        }
    }

    #updateContentId(contentId) {
        this.#getHeadingElement().querySelector('.accordion-button').setAttribute('aria-controls', contentId);
        this.#getContentElement().setAttribute('id', contentId);
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

    #getHeadingElement() {
        return this.querySelector('h1, h2, h3, h4, h5, h6');
    }

    #getContentElement() {
        return this.querySelector('.accordion-content');
    }


    /* Attributes which can invoke attributeChangedCallback() */

    static observedAttributes = ['heading', 'heading-level', 'expanded', 'content-id', 'variant-text', 'variant-icon'];

    /* --------------------------------------------------
    CUSTOM ELEMENT CONSTRUCTOR (do not access or add attributes in the constructor)
    -------------------------------------------------- */

    constructor() {
        super();

        this.#initialized = false;

        /* Set up instance fields for event handling */

        this.#handleAccordionClick = () => {
            this.toggleAccordion();
        };
    }

    /* --------------------------------------------------
    CUSTOM ELEMENT FUNCTIONS
    -------------------------------------------------- */

    expandAccordion() {
        this.#getHeadingElement().querySelector('button.accordion-button').setAttribute('aria-expanded', 'true');
        this.#getContentElement().setAttribute('aria-hidden', 'false');
        this.#expanded = true;
        this.dispatchEvent(new Event('fds-accordion-expanded'));
    }

    collapseAccordion() {
        this.#getHeadingElement().querySelector('button.accordion-button').setAttribute('aria-expanded', 'false');
        this.#getContentElement().setAttribute('aria-hidden', 'true');
        this.#expanded = false;
        this.dispatchEvent(new Event('fds-accordion-collapsed'));
    }

    toggleAccordion() {
        if (this.#expanded) {
            this.collapseAccordion();
        }
        else {
            this.expandAccordion();
        }
    }

    /* --------------------------------------------------
    CUSTOM ELEMENT ADDED TO DOCUMENT
    -------------------------------------------------- */

    connectedCallback() {
        if (!this.#initialized) {
            this.#init();

            if (this.hasAttribute('heading')) {
                this.#updateHeading(this.getAttribute('heading'));
            }

            if (this.hasAttribute('heading-level')) {
                this.#updateHeadingLevel(this.getAttribute('heading-level'));
            }

            if (this.hasAttribute('expanded')) {
                this.#updateExpanded(this.getAttribute('expanded'));
            }
            else {
                this.#updateExpanded(this.#expanded);
            }

            if (this.hasAttribute('content-id')) {
                this.#updateContentId(this.getAttribute('content-id'));
            }

            if (this.hasAttribute('variant-text') && this.hasAttribute('variant-icon')) {
                this.#updateVariant(this.getAttribute('variant-text'), this.getAttribute('variant-icon'));
            }

            this.#getHeadingElement().querySelector('button.accordion-button').addEventListener('click', this.#handleAccordionClick, false);
        }
    }

    /* --------------------------------------------------
    CUSTOM ELEMENT REMOVED FROM DOCUMENT
    -------------------------------------------------- */

    disconnectedCallback() {
        if (this.#getHeadingElement()) {
            const button = this.#getHeadingElement().querySelector('button.accordion-button');
            if (button && this.#handleAccordionClick) {
                button.removeEventListener('click', this.#handleAccordionClick, false);
            }
        }
    }

    /* --------------------------------------------------
    CUSTOM ELEMENT'S ATTRIBUTE(S) CHANGED
    -------------------------------------------------- */

    attributeChangedCallback(attribute, oldValue, newValue) {
        if (this.#initialized) {

            if (attribute === 'heading') {
                this.#updateHeading(newValue);
            }

            if (attribute === 'heading-level') {
                this.#updateHeadingLevel(newValue);
            }

            if (attribute === 'expanded') {
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
}

export default FDSAccordion;