'use strict';

class FDSAccordion extends HTMLElement {

    /* Private instance fields */

    #initialized;
    #expanded;

    #headingElement;
    #contentElement;

    #handleAccordionClick;

    /* Private methods */

    #init() {
        if (!this.#initialized) {

            /* Accordion heading */

            const heading = document.createElement('span');
            heading.classList.add('accordion-title');

            const accordionButton = document.createElement('button');
            accordionButton.classList.add('accordion-button');
            accordionButton.setAttribute('aria-expanded', 'true');
            accordionButton.setAttribute('aria-controls', 'a1');
            accordionButton.setAttribute('type', 'button');

            this.#headingElement = document.createElement('h2');

            accordionButton.appendChild(heading);
            this.#headingElement.appendChild(accordionButton);

            /* Accordion content */

            this.#contentElement = document.createElement('div');
            this.#contentElement.classList.add('accordion-content');
            this.#contentElement.setAttribute('id', 'a1');
            this.#contentElement.setAttribute('aria-hidden', 'false');
            this.#contentElement.innerHTML = this.innerHTML;

            /* Default accordion state if no attribute is set */

            this.#expanded = true;

            /* Clear accordion content for proper construction in connectedCallback() */

            this.innerHTML = '';
            this.#initialized = true;
        }
    }

    #updateHeading(heading) {
        this.#headingElement.querySelector('.accordion-title').textContent = heading;
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

    /* Attributes which can invoke attributeChangedCallback() */

    static observedAttributes = ['heading', 'expanded'];

    /* --------------------------------------------------
    CUSTOM ELEMENT CONSTRUCTOR (do not access or add attributes in the constructor)
    -------------------------------------------------- */

    constructor() {
        super();

        this.#initialized = false;

        this.#handleAccordionClick = () => {
            this.toggleAccordion();
        };
    }

    /*
    --------------------------------------------------
    CUSTOM ELEMENT FUNCTIONS
    --------------------------------------------------
    */

    expandAccordion() {
        this.#headingElement.querySelector('button.accordion-button').setAttribute('aria-expanded', 'true');
        this.#contentElement.setAttribute('aria-hidden', 'false');
        this.#expanded = true;
    }

    collapseAccordion() {
        this.#headingElement.querySelector('button.accordion-button').setAttribute('aria-expanded', 'false');
        this.#contentElement.setAttribute('aria-hidden', 'true');
        this.#expanded = false;
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

            this.appendChild(this.#headingElement);
            this.appendChild(this.#contentElement);

            if (this.hasAttribute('heading')) {
                this.#updateHeading(this.getAttribute('heading'));
            }

            if (this.hasAttribute('expanded')) {
                this.#updateExpanded(this.getAttribute('expanded'));
            }

            this.#headingElement.querySelector('button.accordion-button').addEventListener('click', this.#handleAccordionClick, false);
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

            if (attribute === 'expanded') {
                this.#updateExpanded(newValue);
            }
        }
    }
}

export default FDSAccordion;