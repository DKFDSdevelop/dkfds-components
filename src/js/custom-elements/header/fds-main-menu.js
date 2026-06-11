class FDSMainMenu extends HTMLElement {

    // #region - ATTRIBUTES (can invoke attributeChangedCallback()) -----------------------------------------

    static observedAttributes = ['attr'];

    // #endregion

    // #region - Private instance fields --------------------------------------------------------------------

    #initialized = false;
    #resizeObserver = null;

    // #endregion

    // #region - Private event handlers ---------------------------------------------------------------------

    #handleRebuildMoreMenu = () => {
        this.rebuildMoreMenu();
    }

    // #endregion

    // #region - Private methods ----------------------------------------------------------------------------

    #setupHTML() {
        const listItems = this.querySelectorAll('li > fds-dropdown-menu > button, li > a');
        listItems.forEach(item => {
            item.dataset.menuItem = '';
        });

        // More menu

        const isDesktopMainMenu = this.querySelector('.main-menu-inner');

        if (!isDesktopMainMenu) return;

        const moreMenuButtonSpan = document.createElement('span');
        moreMenuButtonSpan.textContent = 'Mere';
        const moreMenuButton = document.createElement('button');
        moreMenuButton.appendChild(moreMenuButtonSpan);

        const moreMenuDropdownList = document.createElement('ul');
        const moreMenuDropdown = document.createElement('div');
        moreMenuDropdown.appendChild(moreMenuDropdownList);

        const moreMenu = document.createElement('fds-dropdown-menu');
        moreMenu.setAttribute('expanded', 'false');
        moreMenu.appendChild(moreMenuButton);
        moreMenu.appendChild(moreMenuDropdown);

        const moreMenuListItem = document.createElement('li');
        moreMenuListItem.classList.add('more-button', 'd-none');
        moreMenuListItem.appendChild(moreMenu);

        const mainMenu = this.querySelector('.main-menu-inner > nav > ul');
        mainMenu?.appendChild(moreMenuListItem);
    }

    #addEventListeners() {
        const isDesktopMainMenu = this.querySelector('.main-menu-inner');

        if (!isDesktopMainMenu) return;

        window.addEventListener('load', this.#handleRebuildMoreMenu, { once: true });

        if (this.#resizeObserver) return;
        this.#resizeObserver = new ResizeObserver(this.#handleRebuildMoreMenu);
        this.#resizeObserver.observe(this);
    }

    #removeEventListeners() {
        if (this.#resizeObserver) {
            this.#resizeObserver.disconnect();
            this.#resizeObserver = null;
        }
    }

    /* More menu helper functions */

    // The main menu may contain other elements than <nav> such as search - get the space available to show main menu items
    #getAvailableSpace() {
        let usedWidth = 0;

        const otherMainMenuElements = this.querySelectorAll('.main-menu-inner > *:not(nav)');
        otherMainMenuElements.forEach(el => {
            usedWidth += el.getBoundingClientRect().width;
        });

        const totalSpace = this.querySelector('.main-menu-inner')?.getBoundingClientRect().width;

        return totalSpace - usedWidth;
    }

    // List items may be hidden in the main menu - get the length of a <li> regardless of visibility
    #getListItemWidth(listItem) {
        const isHidden = listItem.classList.contains('d-none');

        if (isHidden) { listItem.classList.remove('d-none'); }
        const width = listItem.getBoundingClientRect().width;
        if (isHidden) { listItem.classList.add('d-none'); }

        return width;
    };

    // Get the number of list items that can be displayed before a more menu should appear
    #maxVisibleListItems() {
        const availableSpace = this.#getAvailableSpace();
        const listItems = [...this.querySelectorAll('.main-menu-inner > nav > ul > li:not(.more-button)')];

        let totalWidth = 0;
        let count = 0;

        for (const item of listItems) {
            totalWidth += this.#getListItemWidth(item);
            if (totalWidth >= availableSpace) break;
            count++;
        }

        return count;
    }

    // #endregion

    // #region - PUBLIC METHODS -----------------------------------------------------------------------------

    rebuildMoreMenu() {
        if (document.readyState !== 'complete') return;
        if (!this.querySelector('.more-button')) return;

        const listItems = this.querySelectorAll('.main-menu-inner > nav > ul > li:not(.more-button)');
        const maxVisibleListItems = this.#maxVisibleListItems();

        console.log('maxVisibleListItems', maxVisibleListItems);

        this.querySelector('.more-button').classList.toggle('d-none', listItems.length === maxVisibleListItems);

        const moreMenuDropdownMenu = this.querySelector('.main-menu-inner li.more-button > fds-dropdown-menu > div > ul');

        moreMenuDropdownMenu.innerHTML = '';

        listItems.forEach((item, index) => {
            if (index < maxVisibleListItems) {
                item.classList.remove('d-none');
            }
            else {
                item.classList.add('d-none');

                const clone = item.cloneNode(true);
                clone.classList.remove('d-none');
                moreMenuDropdownMenu.appendChild(clone);
            }
        });
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