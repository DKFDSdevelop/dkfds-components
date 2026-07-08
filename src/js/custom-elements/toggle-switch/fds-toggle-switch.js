import * as CE from '../custom-element-utils';

class FDSToggleSwitch extends HTMLElement {

    // #region - ATTRIBUTES (can invoke attributeChangedCallback()) -----------------------------------------

    static observedAttributes = ['state', 'label', 'disabled-switch'];

    // #endregion

    // #region - GETTERS AND SETTERS ------------------------------------------------------------------------

    get state() { return this.getAttribute('state'); }
    set state(value) { value == null ? this.removeAttribute('state') : this.setAttribute('state', value); }

    get label() { return this.getAttribute('label'); }
    set label(value) { value == null ? this.removeAttribute('label') : this.setAttribute('label', value); }

    get disabledSwitch() { return this.getAttribute('disabled-switch'); }
    set disabledSwitch(value) { value == null ? this.removeAttribute('disabled-switch') : this.setAttribute('disabled-switch', value); }

    // #endregion

    // #region - PRIVATE INSTANCE FIELDS --------------------------------------------------------------------

    #initialized = false;

    // #endregion

    // #region - PRIVATE EVENT HANDLERS ---------------------------------------------------------------------

    #handleClick = (event) => {
        this.toggle();
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

        // Add the button if not already present
        button.setAttribute('type', 'button');
        button.setAttribute('role', 'switch');
        if (!this.querySelector('button')) {
            this.appendChild(button);
        }

        // Set on-off state of the button
        this.#stateChange(this.getAttribute('state'), false);

        // Set disabled state of the button
        !this.hasAttribute('disabled-switch') || this.getAttribute('disabled-switch') === 'false' ? button.removeAttribute('disabled') : button.setAttribute('disabled', '');
    }

    #stateChange(newState, dispatchEvent) {
        const button = this.querySelector('button');

        let eventName = 'toggle-off';

        if (newState === 'off' || !newState) {
            button.setAttribute('aria-checked', 'false');
        }
        else {
            button.setAttribute('aria-checked', 'true');
            eventName = 'toggle-on';
        }

        if (dispatchEvent && !button.disabled) {
            this.dispatchEvent(new Event(eventName));
        }
    }

    // #endregion

    // #region - PUBLIC METHODS -----------------------------------------------------------------------------

    init() {
        this.#setupHTML();
        this.querySelector('button')?.addEventListener('click', this.#handleClick);
        this.#initialized = true;
    }

    on() {
        this.setAttribute('state', 'on');
    }

    off() {
        this.setAttribute('state', 'off');
    }

    toggle() {
        !this.hasAttribute('state') || this.getAttribute('state') === 'off' ? this.on() : this.off();
    }

    // #endregion

    // #region - ADDED TO DOCUMENT --------------------------------------------------------------------------

    connectedCallback() {
        this.init();
    }

    // #endregion

    // #region - REMOVED FROM DOCUMENT ----------------------------------------------------------------------

    disconnectedCallback() {
        this.querySelector('button')?.removeEventListener('click', this.#handleClick);
        this.#initialized = false;
    }

    // #endregion

    // #region - ATTRIBUTE(S) CHANGED -----------------------------------------------------------------------

    attributeChangedCallback(attribute, oldValue, newValue) {
        if (!this.#initialized) return;
        if (oldValue === newValue) return;

        switch (attribute) {

            case 'state':
                this.#stateChange(newValue, true);
                break;

            case 'label':
                if (newValue) {
                    this.querySelector('button span').textContent = newValue;
                }
                break;

            case 'disabled-switch':
                const button = this.querySelector('button');
                newValue === null || newValue === 'false' ? button.removeAttribute('disabled') : button.setAttribute('disabled', '');
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