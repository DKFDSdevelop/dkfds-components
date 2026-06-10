class FDSMainMenu extends HTMLElement {

    // #region - ATTRIBUTES (can invoke attributeChangedCallback()) -----------------------------------------

    static observedAttributes = ['attr'];

    // #endregion

    // #region - Private instance fields --------------------------------------------------------------------

    #initialized = false;

    // #endregion

    // #region - Private event handlers ---------------------------------------------------------------------

    /* #handleClick = (event) => {
        console.log('Click event:', event);
    }; */

    // #endregion

    // #region - Private methods ----------------------------------------------------------------------------

    #setupHTML() {
        const listItems = this.querySelectorAll('li > fds-dropdown-menu > button, li > a');
        listItems.forEach(item => {
            item.dataset.menuItem = '';
        });
    }

    #addEventListeners() {
        //this.addEventListener('click', this.#handleClick);
    }

    #removeEventListeners() {
        //this.removeEventListener('click', this.#handleClick);
    }

    // #endregion

    // #region - ADDED TO DOCUMENT --------------------------------------------------------------------------

    connectedCallback() {
        this.#setupHTML();
        this.#addEventListeners();
        this.#initialized = true;
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

function registerMainMenu() {
    if (!customElements.get('fds-main-menu')) {
        customElements.define('fds-main-menu', FDSMainMenu);
    }
}

export default registerMainMenu;