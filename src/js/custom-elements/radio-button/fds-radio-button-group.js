'use strict';

import * as CE from '../custom-element-utils';

class FDSRadioButtonGroup extends HTMLElement {

    /* Private instance fields */

    #initialized = false;
    #radioButtonGroupObserver = null;
    #fieldset;
    #legend;

    /* Private methods */

    #getFieldsetElement() {
        return this.querySelector('fieldset');
    }

    #getLegendElement() {
        return this.querySelector(':scope > fieldset > legend');
    }

    #getGroupHelpTexts() {
        return this.querySelectorAll(':scope > fieldset > fds-help-text');
    }

    #getErrorMessages() {
        return this.querySelectorAll(':scope > fieldset > fds-error-message');
    }

    #setupObserver() {
        if (this.#radioButtonGroupObserver) return;

        this.#radioButtonGroupObserver = new MutationObserver(this.#handleMutations);
        this.#radioButtonGroupObserver.observe(this, CE.mutationObserverConfig);
    }

    #handleMutations = (records) => {
        for (const { attributeName, target, addedNodes, removedNodes } of records) {
            const relevantTagNames = [
                'FIELDSET',
                'LEGEND',
                'FDS-HELP-TEXT',
                'FDS-ERROR-MESSAGE'
            ];

            const allNodes = [...addedNodes, ...removedNodes];

            if (allNodes.some(node => relevantTagNames.includes(node?.tagName))) {
                this.#fieldset = this.#getFieldsetElement();
                this.#legend = this.#getLegendElement();

                this.#setClasses();
                this.#setDisabledClass();
                this.#updateAccessibilityState();

                break;
            }

            if (
                attributeName === 'disabled' &&
                target === this.#getFieldsetElement()
            ) {
                target.classList.toggle('disabled', target.hasAttribute('disabled'));
            }

            else if (
                attributeName === 'id' ||
                attributeName === 'hidden' ||
                attributeName === 'aria-hidden' ||
                (attributeName === 'class' && !['LEGEND', 'FIELDSET'].includes(target?.tagName))
            ) {
                this.#updateAccessibilityState();

                if (attributeName === 'hidden' && target === this) {
                    CE.notifySummaryOnVisibilityChange(this);
                }
            }
        }
    }

    #updateAccessibilityState() {
        const fieldset = this.#getFieldsetElement();
        const errorMessages = this.#getErrorMessages();
        const helpTexts = this.#getGroupHelpTexts();

        CE.setAriaDescribedBy(fieldset, errorMessages, helpTexts);
    }

    #setClasses() {
        this.#legend?.classList.add('form-label');
    }

    #setDisabledClass() {
        const fieldset = this.#getFieldsetElement();
        if (!fieldset) return;

        fieldset.classList.toggle('disabled', fieldset.hasAttribute('disabled'));
    }

    #handleRadioChange = (event) => {
        const changedRadioButton = event.target.closest('fds-radio-button');

        if (event.detail.checked) {
            const allRadios = this.querySelectorAll('fds-radio-button');
            allRadios.forEach(radio => {
                if (radio !== changedRadioButton) {
                    radio.collapseContent?.();
                }
            });
        }
    }

    /* --------------------------------------------------
    CUSTOM ELEMENT METHODS
    -------------------------------------------------- */

    init() {
        this.#fieldset = this.#getFieldsetElement();
        this.#legend = this.#getLegendElement();

        this.#setClasses();
        this.#setDisabledClass();
        this.#updateAccessibilityState();

        this.removeEventListener('radio-changed', this.#handleRadioChange);
        this.addEventListener('radio-changed', this.#handleRadioChange);

        this.#setupObserver();

        this.#initialized = true;
    }

    /* --------------------------------------------------
    CUSTOM ELEMENT ADDED TO DOCUMENT
    -------------------------------------------------- */

    connectedCallback() {
        if (!this.#initialized) { this.init(); }
    }

    /* --------------------------------------------------
    CUSTOM ELEMENT REMOVED FROM DOCUMENT
    -------------------------------------------------- */

    disconnectedCallback() {
        CE.notifySummaryOnDisconnect(this);

        this.removeEventListener('radio-changed', this.#handleRadioChange);

        this.#initialized = false;

        if (this.#radioButtonGroupObserver) {
            this.#radioButtonGroupObserver.disconnect();
            this.#radioButtonGroupObserver = null;
        }
    }
}

function registerRadioButtonGroup() {
    if (customElements.get('fds-radio-button-group') === undefined) {
        window.customElements.define('fds-radio-button-group', FDSRadioButtonGroup);
    }
}

export default registerRadioButtonGroup;