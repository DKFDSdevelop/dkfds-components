'use strict';

class FDSCheckboxGroup extends HTMLElement {

    /* Private instance fields */

    #fieldset;
    #legend;

    /* Private methods */

     #findOrCreateLegend() {
        let legend = this.#fieldset.querySelector('legend') || this.querySelector(':scope > legend');
        
        if (legend && legend.parentNode !== this.#fieldset) {
            legend.remove();
            this.#fieldset.prepend(legend);
        } else if (!legend) {
            legend = document.createElement('legend');
            this.#fieldset.prepend(legend);
        }
        
        legend.classList.add('form-label');
        return legend;
    }

    #collectGroupHelpTexts() {
        const direct = Array.from(this.querySelectorAll(':scope > fds-help-text'));
        // Help-texts inside a manually written <fieldset>
        const orphaned = Array.from(this.querySelectorAll(':scope > fieldset > fds-help-text'));

        return [...direct, ...orphaned];
    }

    #collectErrorMessages() {
        const directErrors = Array.from(this.querySelectorAll(':scope > fds-error-message'));
        const orphanedErrors = Array.from(this.querySelectorAll(':scope > fieldset > fds-error-message'));

        return [...directErrors, ...orphanedErrors];
    }

    #ensureStructure() {
    this.#fieldset = this.querySelector('fieldset') || (() => {
        const fieldset = document.createElement('fieldset');
        this.prepend(fieldset);
        return fieldset;
    })();
    
    this.#legend = this.#findOrCreateLegend();
    
    const helpTexts = this.#collectGroupHelpTexts();
    const errors = this.#collectErrorMessages();
    
    [...helpTexts, ...errors].forEach(el => el.remove());
    
    let insertionPoint = this.#legend.nextSibling;
    helpTexts.forEach(ht => {
        this.#fieldset.insertBefore(ht, insertionPoint);
    });
    
    errors.forEach(error => {
        this.#fieldset.insertBefore(error, insertionPoint);
    });
    
    // Move remaining children
    const toMove = Array.from(this.children).filter(el => el !== this.#fieldset);
    toMove.forEach(el => this.#fieldset.appendChild(el));
    
    return { helpTexts, errors };
}

    #applyGroupLabel() {
        if (this.#legend) {
            const label = this.getAttribute('group-label');
            if (label != null) this.#legend.textContent = label;
        }
    }

    #applyAriaDescribedBy(describers) {
        if (!describers.length) {
            this.#fieldset.removeAttribute('aria-describedby');
            return;
        }

        const ids = describers
            .map(el => el.querySelector('[id]')?.id)
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
        const { helpTexts, errors } = this.#ensureStructure();
        this.#applyGroupLabel();
        this.#applyAriaDescribedBy([...helpTexts, ...errors]);
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
