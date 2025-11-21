'use strict';

class FDSCheckboxGroup extends HTMLElement {

    /* Private instance fields */

    #fieldset;
    #legend;

    /* Private methods */

    #findOrCreateLegend(fieldset) {
        let legend = fieldset.querySelector('legend');
        if (!legend) {
            legend = document.createElement('legend');
            legend.className = 'form-label';
            fieldset.prepend(legend);
        }
        legend.classList.add('form-label');

        return legend;
    }

    #collectGroupHelpTexts() {
        // Help-texts explicitly placed directly under the custom element
        const direct = Array.from(this.querySelectorAll(':scope > fds-help-text'));

        // Help-texts wrongly authored inside a manually written <fieldset>
        const orphaned = this.querySelectorAll(':scope > fieldset > fds-help-text');

        return [...direct, ...orphaned];
    }

    #ensureFieldset() {
        const existing = this.querySelector('fieldset');
        if (existing) {
            this.#fieldset = existing;
            this.#legend = this.#findOrCreateLegend(existing);
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

    #normalizeHelpTexts(helpTexts) {
        // Move group-level help texts directly beneath <fieldset>
        helpTexts.forEach(ht => {
            ht.remove();
            this.#fieldset.insertBefore(ht, this.#legend.nextSibling);
        });
    }

    #moveChildrenIntoFieldset() {
        const toMove = Array.from(this.children)
            .filter(el => el !== this.#fieldset);

        toMove.forEach(el => this.#fieldset.appendChild(el));
    }

    #applyGroupLabel() {
        if (this.#legend) {
            const label = this.getAttribute('group-label');
            if (label != null) this.#legend.textContent = label;
        }
    }

    #applyAriaDescribedBy(helpTexts) {
        if (!helpTexts.length) {
            this.#fieldset.removeAttribute('aria-describedby');
            return;
        }

        const ids = helpTexts
            .map(ht => ht.querySelector(':scope > .help-text')?.id)
            .filter(Boolean);

        if (ids.length) {
            this.#fieldset.setAttribute('aria-describedby', ids.join(' '));
        } else {
            this.#fieldset.removeAttribute('aria-describedby');
        }
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
        const helpTexts = this.#collectGroupHelpTexts();

        this.#ensureFieldset();
        this.#normalizeHelpTexts(helpTexts);
        this.#applyGroupLabel();
        this.#moveChildrenIntoFieldset();
        this.#applyAriaDescribedBy(helpTexts);
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
