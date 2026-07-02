import * as CE from '../custom-element-utils';

class FDSDropdownMenu extends HTMLElement {

    // #region - ATTRIBUTES (can invoke attributeChangedCallback()) -----------------------------------------

    static observedAttributes = ['expanded'];

    // #endregion

    // #region - PRIVATE INSTANCE FIELDS --------------------------------------------------------------------

    #initialized = false;
    #plusIcon = 'M440-440H200v-80h240v-240h80v240h240v80H520v240h-80v-240Z';
    #minusIcon = 'M200-440v-80h560v80H200Z';
    #chevronDownIcon = 'M480-344 240-584l56-56 184 184 184-184 56 56-240 240Z';
    #chevronUpIcon = 'M480-528 296-344l-56-56 240-240 240 240-56 56-184-184Z';
    #moreVertIcon = 'M480-160q-33 0-56.5-23.5T400-240q0-33 23.5-56.5T480-320q33 0 56.5 23.5T560-240q0 33-23.5 56.5T480-160Zm0-240q-33 0-56.5-23.5T400-480q0-33 23.5-56.5T480-560q33 0 56.5 23.5T560-480q0 33-23.5 56.5T480-400Zm0-240q-33 0-56.5-23.5T400-720q0-33 23.5-56.5T480-800q33 0 56.5 23.5T560-720q0 33-23.5 56.5T480-640Z';

    // #endregion

    // #region - PRIVATE EVENT HANDLERS ---------------------------------------------------------------------

    #handleClick = (event) => {
        this.toggle();
    };

    #handleFocusOut = (event) => {
        const focusLeftDropdownMenu = !this.contains(event.relatedTarget);
        if (focusLeftDropdownMenu) {
            this.close();
        }
    }

    #handleKeydown = (event) => {
        switch (event.key) {
            case 'Escape':
                this.close();
                this.querySelector(':scope > .dropdown-button')?.focus();
                break;
        }
    }

    #handleMenuItemClick = (event) => {
        if (event.target.closest('[data-menu-item]')) {
            this.close();
        }
    }

    // #endregion

    // #region - PRIVATE METHODS ----------------------------------------------------------------------------

    #setupHTML() {
        // Dropdown button
        if (!this.querySelector(':scope > .dropdown-button')) {
            this.querySelector(':scope > button')?.classList.add('dropdown-button');
        }

        // Dropdown button icon
        if (!this.querySelector(':scope > .dropdown-button span svg')) {
            let collapsedIcon = this.#moreVertIcon;
            let expandedIcon = this.#moreVertIcon;
            if (this.closest('fds-drawer fds-main-menu')) {
                collapsedIcon = this.#plusIcon;
                expandedIcon = this.#minusIcon;
            }
            else if (this.closest('fds-main-menu .main-menu-inner li:not(.more-button)')) {
                collapsedIcon = this.#chevronDownIcon;
                expandedIcon = this.#chevronUpIcon;
            }
            const span = this.querySelector(':scope > .dropdown-button span');
            const collapsed = CE.createSvgIcon(collapsedIcon);
            collapsed.classList.add('collapsed-icon');
            span?.appendChild(collapsed);
            const expanded = CE.createSvgIcon(expandedIcon);
            expanded.classList.add('expanded-icon');
            span?.appendChild(expanded);
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

        // If the overflow menu opens on top of content, ensure it doesn't close on misclick inside the opened menu
        if (this.closest('fds-main-menu .main-menu-inner')) {
            this.querySelector(':scope > .dropdown-menu').setAttribute('tabindex', '-1');
        }
    }

    #updateExpanded(value) {
        const dropdownButton = this.querySelector(':scope > .dropdown-button');
        const menu = this.querySelector(':scope > .dropdown-menu');
        if (value === 'false') {
            dropdownButton?.setAttribute('aria-expanded', 'false');
            menu?.classList.add('collapsed');
            menu.removeAttribute('style');
            this.dispatchEvent(new Event('fds-dropdown-menu-closed'));
        }
        else {
            dropdownButton?.setAttribute('aria-expanded', 'true');
            menu?.classList.remove('collapsed');

            /* Check if the dropdown is within the screen borders */

            const rect = menu.getBoundingClientRect();
            const viewportWidth = window.visualViewport?.width ?? document.documentElement.clientWidth;

            if (menu.offsetWidth > viewportWidth) {
                menu.style.maxWidth = `${viewportWidth}px`;
            } 
            else if (rect.left < 0) {
                menu.style.left = '0px';
            } 
            else if (rect.left + menu.offsetWidth > viewportWidth) {
                menu.style.right = '0px';
            }

            /* Dispatch event */

            this.dispatchEvent(new Event('fds-dropdown-menu-opened'));
        }
    }

    #addEventListeners() {
        this.querySelector(':scope > .dropdown-button')?.addEventListener('click', this.#handleClick);
        if (this.closest('fds-main-menu .main-menu-inner')) {
            this.addEventListener('focusout', this.#handleFocusOut, false);
            this.addEventListener('keydown', this.#handleKeydown, false);
            this.querySelector('.dropdown-menu').addEventListener('click', this.#handleMenuItemClick, false);
        }
    }

    #removeEventListeners() {
        this.querySelector(':scope > .dropdown-button')?.removeEventListener('click', this.#handleClick);
        if (this.closest('fds-main-menu .main-menu-inner')) {
            this.removeEventListener('focusout', this.#handleFocusOut, false);
            this.removeEventListener('keydown', this.#handleKeydown, false);
            this.querySelector('.dropdown-menu').removeEventListener('click', this.#handleMenuItemClick, false);
        }
    }

    // #endregion

    // #region - PUBLIC METHODS -----------------------------------------------------------------------------

    toggle() {
        this.getAttribute('expanded') === 'false' ? this.setAttribute('expanded', 'true') : this.setAttribute('expanded', 'false');
    }

    open() {
        this.setAttribute('expanded', 'true');
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