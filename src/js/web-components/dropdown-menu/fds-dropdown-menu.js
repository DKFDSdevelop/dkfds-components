import * as CE from '../custom-element-utils';

class FDSDropdownMenu extends HTMLElement {

    // #region - ATTRIBUTES (can invoke attributeChangedCallback()) -----------------------------------------

    static observedAttributes = ['expanded', 'ready'];

    // #endregion

    // #region - GETTERS AND SETTERS ------------------------------------------------------------------------

    get ready() { return this.getAttribute('ready') !== 'false'; }
    set ready(value) { this.setAttribute('ready', value ? 'true' : 'false'); }

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

    #handleOutsideClick = (event) => {
        if (!this.contains(event.target)) {
            this.close();
        }
    };

    #handleResize = () => {
        this.#positionMenu();
    };

    // #endregion

    // #region - PRIVATE METHODS ----------------------------------------------------------------------------

    // The dropdown menu should behave differently when it is used inside a modal drawer.
    #isDrawerSubmenu() {
        return !!this.closest('fds-main-menu') && !this.closest('fds-main-menu .main-menu-inner');
    }

    #setupHTML() {
        // Dropdown button
        if (!this.querySelector(':scope > .dropdown-button')) {
            this.querySelector(':scope > button')?.classList.add('dropdown-button');
        }

        // Dropdown button icon
        if (!this.querySelector(':scope > .dropdown-button span svg')) {
            let collapsedIcon = this.#moreVertIcon;
            let expandedIcon = this.#moreVertIcon;
            if (this.closest('fds-modal fds-main-menu')) {
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

        // Mark interactive menu items so clicking them closes the dropdown
        this.querySelectorAll(':scope > .dropdown-menu a, :scope > .dropdown-menu button').forEach(item => {
            if (item.closest('fds-dropdown-menu') === this) {
                item.setAttribute('data-menu-item', '');
            }
        });

        // Expanded attribute on fds-dropdown-menu
        if (!this.hasAttribute('expanded')) {
            this.setAttribute('expanded', 'false');
        }
        this.#updateExpanded(this.getAttribute('expanded'));

        // Don't close the dropdown when something non-clickable inside it is clicked (like a subtitle)
        if (!this.#isDrawerSubmenu()) {
            this.querySelector(':scope > .dropdown-menu')?.setAttribute('tabindex', '-1');
        }
    }

    // Ensure the dropdown doesn't cross the viewport's left or right side.
    #positionMenu() {
        const menu = this.querySelector(':scope > .dropdown-menu');
        if (!menu) return;

        menu.style.removeProperty('max-width');
        menu.style.removeProperty('left');
        menu.style.removeProperty('right');

        const rect = menu.getBoundingClientRect();
        const viewportWidth = window.visualViewport?.width ?? document.documentElement.clientWidth;

        if (menu.offsetWidth > viewportWidth) {
            menu.style.maxWidth = `${viewportWidth}px`;
        }
        else if (rect.left < 0) {
            menu.style.left = '0px';
            menu.style.right = 'auto';
        }
        else if (rect.left + menu.offsetWidth > viewportWidth) {
            menu.style.left = 'auto';
            menu.style.right = '0px';
        }
    }

    #updateExpanded(value) {
        const dropdownButton = this.querySelector(':scope > .dropdown-button');
        const menu = this.querySelector(':scope > .dropdown-menu');
        if (value === 'false') {
            dropdownButton?.setAttribute('aria-expanded', 'false');
            menu?.classList.add('collapsed');
            menu?.removeAttribute('style');
            window.removeEventListener('resize', this.#handleResize);
            if (!this.#isDrawerSubmenu()) {
                document.removeEventListener('mousedown', this.#handleOutsideClick, false);
            }
            this.dispatchEvent(new Event('fds-dropdown-menu-closed'));
        }
        else {
            dropdownButton?.setAttribute('aria-expanded', 'true');
            menu?.classList.remove('collapsed');
            if (!this.#isDrawerSubmenu()) {
                document.addEventListener('mousedown', this.#handleOutsideClick, false);
            }

            /* Check if the dropdown is within the screen borders */

            this.#positionMenu();
            window.addEventListener('resize', this.#handleResize);

            /* Dispatch event */

            this.dispatchEvent(new Event('fds-dropdown-menu-opened'));
        }
    }

    #addEventListeners() {
        this.querySelector(':scope > .dropdown-button')?.addEventListener('click', this.#handleClick);
        if (!this.#isDrawerSubmenu()) {
            this.addEventListener('focusout', this.#handleFocusOut, false);
            this.addEventListener('keydown', this.#handleKeydown, false);
            this.querySelector(':scope > .dropdown-menu')?.addEventListener('click', this.#handleMenuItemClick, false);
        }
    }

    #removeEventListeners() {
        this.querySelector(':scope > .dropdown-button')?.removeEventListener('click', this.#handleClick);
        if (!this.#isDrawerSubmenu()) {
            this.removeEventListener('focusout', this.#handleFocusOut, false);
            this.removeEventListener('keydown', this.#handleKeydown, false);
            this.querySelector(':scope > .dropdown-menu')?.removeEventListener('click', this.#handleMenuItemClick, false);
        }
    }

    // #endregion

    // #region - PUBLIC METHODS -----------------------------------------------------------------------------

    init() {
        this.#setupHTML();
        this.#addEventListeners();
        this.#initialized = true;
    }

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
        if (this.getAttribute('ready') === 'false') return;

        this.init();
    }

    // #endregion

    // #region - REMOVED FROM DOCUMENT ----------------------------------------------------------------------

    disconnectedCallback() {
        this.#removeEventListeners();
        window.removeEventListener('resize', this.#handleResize);
        if (!this.#isDrawerSubmenu()) {
            document.removeEventListener('mousedown', this.#handleOutsideClick, false);
        }
        this.#initialized = false;
    }

    // #endregion

    // #region - ATTRIBUTE(S) CHANGED -----------------------------------------------------------------------

    attributeChangedCallback(attribute, oldValue, newValue) {
        if (attribute === 'ready') {
            if (!this.#initialized && this.isConnected && newValue !== 'false') {
                this.init();
            }
            return;
        }

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