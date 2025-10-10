'use strict';

class FDSAccordionGroup extends HTMLElement {

    /* Private methods */

    #updateHeadingLevel(headingLevel) {
        const accordions = this.querySelectorAll(':scope > fds-accordion');
        for (let i = 0; i < accordions.length; i++) {
            accordions[i].setAttribute('heading-level', headingLevel);
        }
    }

    /* Attributes which can invoke attributeChangedCallback() */

    static observedAttributes = ['heading-level'];

    /* --------------------------------------------------
    CUSTOM ELEMENT CONSTRUCTOR (do not access or add attributes in the constructor)
    -------------------------------------------------- */

    constructor() {
        super();
    }

    /* --------------------------------------------------
    CUSTOM ELEMENT ADDED TO DOCUMENT
    -------------------------------------------------- */

    connectedCallback() {
        if (this.hasAttribute('heading-level')) {
            this.#updateHeadingLevel(this.getAttribute('heading-level'));
        }
    }

    /* --------------------------------------------------
    CUSTOM ELEMENT'S ATTRIBUTE(S) CHANGED
    -------------------------------------------------- */

    attributeChangedCallback(attribute, oldValue, newValue) {
        if (attribute === 'heading-level') {
            this.#updateHeadingLevel(newValue);
        }
    }
}

export default FDSAccordionGroup;