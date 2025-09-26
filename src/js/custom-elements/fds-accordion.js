'use strict';

class FDSAccordion extends HTMLElement {

    /* Private instance fields */

    #initialized;

    #headingElement;
    #contentElement;

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

            this.innerHTML = '';
            this.#initialized = true;
        }
    }

    /* Attributes which can invoke attributeChangedCallback() */

    static observedAttributes = ['heading'];

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
        this.#init();

        this.appendChild(this.#headingElement);
        this.appendChild(this.#contentElement);
    }

    /* --------------------------------------------------
    CUSTOM ELEMENT'S ATTRIBUTE(S) CHANGED
    -------------------------------------------------- */

    attributeChangedCallback(attribute, oldValue, newValue) {
        this.#init();

        if (attribute === 'heading') {
            this.#headingElement.querySelector('.accordion-title').textContent = newValue;
        }
    }
}

export default FDSAccordion;