import * as CE from '../custom-element-utils';

class FDSToggleSwitch extends HTMLElement {

    // #region - ATTRIBUTES (can invoke attributeChangedCallback()) -----------------------------------------

    static observedAttributes = ['state', 'label'];

    // #endregion

    // #region - GETTERS AND SETTERS ------------------------------------------------------------------------

    get state() { return this.getAttribute('state'); }
    set state(value) { value == null ? this.removeAttribute('state') : this.setAttribute('state', value); }

    get state() { return this.getAttribute('label'); }
    set state(value) { value == null ? this.removeAttribute('state') : this.setAttribute('label', value); }

    // #endregion

    // #region - PRIVATE INSTANCE FIELDS --------------------------------------------------------------------

    #initialized = false;

    // #endregion

    // #region - PRIVATE EVENT HANDLERS ---------------------------------------------------------------------

    #handleClick = (event) => {
        console.log('Click event:', event);
    };

    // #endregion

    // #region - PRIVATE METHODS ----------------------------------------------------------------------------

    #setupHTML() {
        let button = this.querySelector('button');
        if (!button) {
            button = document.createElement('button');
        }

        let buttonText = this.querySelector('button span');
        if (!buttonText) {
            buttonText = document.createElement('span');
        }

        // Ensure label attribute is used as label when present
        if (this.getAttribute('label')) {
            buttonText.textContent = this.getAttribute('label');
        }

        // Add the button text if not already present
        if (!this.querySelector('button span')) {
            button.appendChild(buttonText);
        }

        // Set the right state of the button
        let ariaChecked = 'false';
        if (this.hasAttribute('state')) {
            ariaChecked = this.getAttribute('state') === 'off' ? 'false' : 'true';
        }
        button.setAttribute('aria-checked', ariaChecked);

        // Add the button if not already present
        button.setAttribute('type', 'button');
        button.setAttribute('role', 'switch');
        if (!this.querySelector('button')) {
            this.appendChild(button);
        }
    }

    // #endregion

    // #region - PUBLIC METHODS -----------------------------------------------------------------------------

    init() {
        this.#setupHTML();
        this.querySelector('button')?.addEventListener('click', this.#handleClick);
        this.#initialized = true;
    }

    // #endregion

    // #region - ADDED TO DOCUMENT --------------------------------------------------------------------------

    connectedCallback() {
        this.init();
    }

    // #endregion

    // #region - REMOVED FROM DOCUMENT ----------------------------------------------------------------------

    disconnectedCallback() {
        this.querySelector('button').removeEventListener('click', this.#handleClick);
        this.#initialized = false;
    }

    // #endregion

    // #region - ATTRIBUTE(S) CHANGED -----------------------------------------------------------------------

    attributeChangedCallback(attribute, oldValue, newValue) {
        if (!this.#initialized) return;
        if (oldValue === newValue) return;

        switch (attribute) {

            case 'state':
                let ariaChecked = newValue === 'off' ? 'false' : 'true';
                this.querySelector('button').setAttribute('aria-checked', ariaChecked);
                break;

            case 'label':
                if (newValue) {
                    this.querySelector('button span').textContent = newValue;
                }
                break;
        }
    }

    // #endregion
}

function registerToggleSwitch() {
    if (!customElements.get('fds-toggle-switch')) {
        customElements.define('fds-toggle-switch', FDSToggleSwitch);
    }
}

export default registerToggleSwitch;