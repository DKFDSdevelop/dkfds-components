'use strict';

class FDSCheckboxGroup extends HTMLElement {

    /* Private instance fields */

    #fieldset;
    #legend;

    /* Private methods */

    #ensureFieldset() {
        if (this.querySelector(':scope > fieldset')) {
            this.#fieldset = this.querySelector(':scope > fieldset');
            this.#legend = this.#fieldset.querySelector('legend');
            return;
        }

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
        this.#legend.textContent = this.getAttribute('group-label') ?? '';
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
        this.#ensureFieldset();
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
