class FDSDropdownMenu extends HTMLElement {

    // #region - ATTRIBUTES (can invoke attributeChangedCallback()) -----------------------------------------

    static observedAttributes = ['attr'];

    // #endregion

    // #region - Private instance fields --------------------------------------------------------------------

    #initialized = false;

    // #endregion

    // #region - Private event handlers ---------------------------------------------------------------------

    #handleClick = (event) => {
        console.log('Click event:', event);
    };

    // #endregion

    // #region - Private methods ----------------------------------------------------------------------------

    #setupHTML() {
        // --- Button ---
        let button = this.querySelector('button');
        if (!button) {
            button = document.createElement('button');
            this.appendChild(button);
        }
        button.textContent = 'Click me';
    }

    #addEventListeners() {
        this.addEventListener('click', this.#handleClick);
    }

    #removeEventListeners() {
        this.removeEventListener('click', this.#handleClick);
    }

    // #endregion

    // #region - PUBLIC METHODS -----------------------------------------------------------------------------

    init() {
        this.#setupHTML();
        this.#addEventListeners();
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
        this.#removeEventListeners();
        this.#initialized = false;
    }

    // #endregion

    // #region - ATTRIBUTE(S) CHANGED -----------------------------------------------------------------------

    attributeChangedCallback(attribute, oldValue, newValue) {
        if (!this.#initialized) return;
        if (oldValue === newValue) return;

        switch (attribute) {
            case 'attr':
                console.log('attr changed to', newValue);
                break;
        }
    }

    // #endregion
}

function registerDropdownMenu() {
    if (!customElements.get('fds-dropdown-menu')) {
        customElements.define('fds-dropdown-menu', FDSDropdownMenu);
    }
}

export default registerDropdownMenu;