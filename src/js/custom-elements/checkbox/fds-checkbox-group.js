'use strict';

class FDSCheckboxGroup extends HTMLElement {

    /* Private instance fields */

    #fieldset;
    #legend;

    /* Private methods */

    #getFieldsetElement() {
        if (this.#fieldset) return this.#fieldset;

        this.#fieldset = this.querySelector('fieldset');
        return this.#fieldset;
    }

    #handleLegend() {
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

    #getGroupHelpTexts() {
        const direct = Array.from(this.querySelectorAll(':scope > fds-help-text'));
        // Help-texts inside a manually written <fieldset>
        const orphaned = Array.from(this.querySelectorAll(':scope > fieldset > fds-help-text'));

        return [...direct, ...orphaned];
    }

    #getErrorMessages() {
        const directErrors = Array.from(this.querySelectorAll(':scope > fds-error-message'));
        const orphanedErrors = Array.from(this.querySelectorAll(':scope > fieldset > fds-error-message'));

        return [...directErrors, ...orphanedErrors];
    }

    #setStructure() {
        this.#fieldset = this.querySelector('fieldset') || (() => {
            const fieldset = document.createElement('fieldset');
            this.prepend(fieldset);
            return fieldset;
        })();

        this.#legend = this.#handleLegend();

        const helpTexts = this.#getGroupHelpTexts();
        const errors = this.#getErrorMessages();

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

    #setGroupLabel() {
        if (this.#legend) {
            const label = this.getAttribute('group-label');
            if (label != null) this.#legend.textContent = label;
        }
    }

    #setAriaDescribedBy(describers) {
        if (!describers.length) {
            this.#fieldset.removeAttribute('aria-describedby');
            return;
        }

        const ids = describers
            .map(el => {
                return el.id || el.querySelector('[id]')?.id;
            })
            .filter(Boolean);

        if (ids.length) {
            this.#fieldset.setAttribute('aria-describedby', ids.join(' '));
        } else {
            this.#fieldset.removeAttribute('aria-describedby');
        }
    }

    /* Disabled */

    #shouldHaveDisabled(value) {
        return value !== null && value !== 'false' && value !== false;
    }

    #setDisabled() {
        this.#getFieldsetElement()?.setAttribute('disabled', '');
        this.#getFieldsetElement()?.classList.add('disabled');
    }

    #removeDisabled() {
        this.#getFieldsetElement()?.removeAttribute('disabled');
        this.#getFieldsetElement()?.classList.remove('disabled');
    }

    /* Attributes which can invoke attributeChangedCallback() */

    static observedAttributes = ['group-label', 'group-disabled'];

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
        const { helpTexts, errors } = this.#setStructure();
        this.#setGroupLabel();
        if (this.#shouldHaveDisabled(this.getAttribute('group-disabled'))) this.#setDisabled();
        this.#setAriaDescribedBy([...helpTexts, ...errors]);
    }

    /* --------------------------------------------------
CUSTOM ELEMENT'S ATTRIBUTE(S) CHANGED
-------------------------------------------------- */

    attributeChangedCallback(name, oldValue, newValue) {
        if (name === 'group-label') {
            this.#setGroupLabel();
        }

        if (name === 'group-disabled' && (oldValue !== newValue)) {
            this.#shouldHaveDisabled(newValue) ? this.#setDisabled() : this.#removeDisabled();
        }
    }
}

function registerCheckboxGroup() {
    if (!customElements.get('fds-checkbox-group')) {
        customElements.define('fds-checkbox-group', FDSCheckboxGroup);
    }
}

export default registerCheckboxGroup;
