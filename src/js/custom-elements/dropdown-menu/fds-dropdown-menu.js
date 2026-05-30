import * as CE from '../custom-element-utils';

class FDSDropdownMenu extends HTMLElement {

    // #region - ATTRIBUTES (can invoke attributeChangedCallback()) -----------------------------------------

    static observedAttributes = ['expanded'];

    // #endregion

    // #region - Private instance fields --------------------------------------------------------------------

    #initialized = false;

    // #endregion

    // #region - Private event handlers ---------------------------------------------------------------------

    #handleClick = (event) => {
        this.toggle();
    };

    #handleFocusOut(event) {
        if (!this.contains(event.relatedTarget)) {
            this.close();
        }
    }

    #handleKeydown(event) {
        switch (event.key) {
            case 'Escape':
                this.close();
                this.querySelector(':scope > .dropdown-button')?.focus();
                break;
        }
    }

    // #endregion

    // #region - Private methods ----------------------------------------------------------------------------

    #setupHTML() {
        // Dropdown button
        if (!this.querySelector(':scope > .dropdown-button')) {
            this.querySelector(':scope > button')?.classList.add('dropdown-button');
        }

        // Dropdown button icon
        if (!this.querySelector(':scope > .dropdown-button span svg')) {
            const span = this.querySelector(':scope > .dropdown-button span');
            const chevronDown = CE.createSvgIcon('M480-344 240-584l56-56 184 184 184-184 56 56-240 240Z');
            chevronDown.classList.add('chevron-down');
            span?.appendChild(chevronDown);
            const chevronUp = CE.createSvgIcon('M480-528 296-344l-56-56 240-240 240 240-56 56-184-184Z');
            chevronUp.classList.add('chevron-up');
            span?.appendChild(chevronUp);
        }

        // Dropdown menu
        if (!this.querySelector(':scope > .dropdown-menu')) {
            this.querySelector(':scope > div')?.classList.add('dropdown-menu');
        }

        // Expanded attribute on fds-dropdown-menu
        if (!this.hasAttribute('expanded')) {
            this.setAttribute('expanded', 'false');
        }
        this.#updateExpanded(this.getAttribute('expanded'));
    }

    #updateExpanded(value) {
        const dropdownButton = this.querySelector(':scope > .dropdown-button');
        const menu = this.querySelector(':scope > .dropdown-menu');
        if (value === 'false') {
            dropdownButton?.setAttribute('aria-expanded', 'false');
            menu?.classList.add('collapsed');
        }
        else {
            dropdownButton?.setAttribute('aria-expanded', 'true');
            menu?.classList.remove('collapsed');
        }
    }

    #addEventListeners() {
        this.querySelector(':scope > .dropdown-button')?.addEventListener('click', this.#handleClick);
        this.addEventListener('focusout', this.#handleFocusOut, false);
        this.addEventListener('keydown', this.#handleKeydown, false);
    }

    #removeEventListeners() {
        this.querySelector(':scope > .dropdown-button')?.removeEventListener('click', this.#handleClick);
        this.removeEventListener('focusout', this.#handleFocusOut, false);
        this.removeEventListener('keydown', this.#handleKeydown, false);
    }

    // #endregion

    // #region - PUBLIC METHODS -----------------------------------------------------------------------------

    toggle() {
        this.getAttribute('expanded') === 'false' ? this.setAttribute('expanded', 'true') : this.setAttribute('expanded', 'false');
    }

    close() {
        this.setAttribute('expanded', 'false');
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
            case 'expanded':
                this.#updateExpanded(newValue);
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