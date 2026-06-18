import * as CE from '../custom-element-utils';

class FDSRadioButtonGroup extends HTMLElement {

    // #region - Private instance fields --------------------------------------------------------------------

    #initialized = false;
    #radioButtonGroupObserver = null;
    #fieldset;
    #legend;

    // #endregion

    // #region - Private event handlers ---------------------------------------------------------------------

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

    // #endregion

    // #region - Private methods ----------------------------------------------------------------------------

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

    #addEventListeners() {
        this.addEventListener('radio-changed', this.#handleRadioChange);

        if (this.#radioButtonGroupObserver) return;

        this.#radioButtonGroupObserver = new MutationObserver(this.#handleMutations);
        this.#radioButtonGroupObserver.observe(this, CE.mutationObserverConfig);
    }

    #removeEventListeners() {
        this.removeEventListener('radio-changed', this.#handleRadioChange);

        if (this.#radioButtonGroupObserver) {
            this.#radioButtonGroupObserver.disconnect();
            this.#radioButtonGroupObserver = null;
        }
    }

    // #endregion

    // #region - PUBLIC METHODS -----------------------------------------------------------------------------

    init() {
        this.#fieldset = this.#getFieldsetElement();
        this.#legend = this.#getLegendElement();

        this.#setClasses();
        this.#setDisabledClass();
        this.#updateAccessibilityState();

        this.#addEventListeners();

        this.#initialized = true;
    }

    // #endregion

    // #region - ADDED TO DOCUMENT --------------------------------------------------------------------------

    connectedCallback() {
        if (!this.#initialized) { this.init(); }
    }

    // #endregion

    // #region - REMOVED FROM DOCUMENT ----------------------------------------------------------------------

    disconnectedCallback() {
        CE.notifySummaryOnDisconnect(this);
        this.#removeEventListeners();
        this.#initialized = false;
    }

    // #endregion
}

function registerRadioButtonGroup() {
    if (customElements.get('fds-radio-button-group') === undefined) {
        window.customElements.define('fds-radio-button-group', FDSRadioButtonGroup);
    }
}

export default registerRadioButtonGroup;