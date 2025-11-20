'use strict';

class FDSCheckboxGroup extends HTMLElement {

    /* Private instance fields */

    #fieldset;
    #legend;

    /* Private methods */

    #ensureStructure() {
        // FIELDSET ALREADY EXISTS
        const existingFieldset = this.querySelector(':scope > fieldset');
        if (existingFieldset) {
            this.#fieldset = existingFieldset;

            let legend = existingFieldset.querySelector('legend');
            if (!legend) {
                legend = document.createElement('legend');
                legend.className = 'form-label';
                existingFieldset.prepend(legend);
            }

            this.#legend = legend;
            return;
        }

        // NO FIELDSET 
        const fieldset = document.createElement('fieldset');
        const legend = document.createElement('legend');
        legend.className = 'form-label';

        fieldset.appendChild(legend);
        this.prepend(fieldset);

        this.#fieldset = fieldset;
        this.#legend = legend;
    }

    #applyGroupLabel() {
        if (!this.#legend) return;

        const label = this.getAttribute('group-label');

        if (label != null) {
            this.#legend.textContent = label;
        }
    }

    #moveChildrenIntoFieldset() {
        const children = Array.from(this.children)
            .filter(el => el !== this.#fieldset);

        children.forEach(child => {
            this.#fieldset.appendChild(child);
        });
    }


    /* Attributes which can invoke attributeChangedCallback() */

    static observedAttributes = ['group-label'];

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
        this.#ensureStructure();
        this.#applyGroupLabel();
        this.#moveChildrenIntoFieldset();
    }

        /* --------------------------------------------------
    CUSTOM ELEMENT'S ATTRIBUTE(S) CHANGED
    -------------------------------------------------- */

    attributeChangedCallback(name, oldValue, newValue) {
        if (name === 'group-label') {
            this.#applyGroupLabel();
        }
    }

    
}

function registerCheckboxGroup() {
    if (!customElements.get('fds-checkbox-group')) {
        customElements.define('fds-checkbox-group', FDSCheckboxGroup);
    }
}

export default registerCheckboxGroup;
