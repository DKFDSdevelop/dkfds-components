class FDSMainMenu extends HTMLElement {

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
            item.setAttribute('data-menu-item', '');
        });

        // More menu

        const isDesktopMainMenu = this.querySelector('.main-menu-inner');

        if (!isDesktopMainMenu) return;

        const moreMenuButtonSpan = document.createElement('span');
        moreMenuButtonSpan.textContent = 'Mere';
        const moreMenuButton = document.createElement('button');
        moreMenuButton.setAttribute('data-menu-item', '');
        moreMenuButton.appendChild(moreMenuButtonSpan);

        const moreMenuDropdownList = document.createElement('ul');
        const moreMenuDropdown = document.createElement('div');
        moreMenuDropdown.appendChild(moreMenuDropdownList);

        const moreMenu = document.createElement('fds-dropdown-menu');
        moreMenu.setAttribute('expanded', 'false');
        moreMenu.appendChild(moreMenuButton);
        moreMenu.appendChild(moreMenuDropdown);

        const moreMenuListItem = document.createElement('li');
        moreMenuListItem.classList.add('more-button');
        moreMenuListItem.setAttribute('data-hidden', '');
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
        const MAIN_MENU_INNER_PADDING_RIGHT = 16;
        let usedWidth = MAIN_MENU_INNER_PADDING_RIGHT;

        const otherMainMenuElements = this.querySelectorAll('.main-menu-inner > *:not(nav)');
        otherMainMenuElements.forEach(el => {
            usedWidth += Math.ceil(el.getBoundingClientRect().width);
        });

        const totalSpace = Math.floor(this.querySelector('.main-menu-inner')?.getBoundingClientRect().width);

        return totalSpace - usedWidth;
    }

    // List items may be hidden in the main menu - get the length of a <li> regardless of visibility
    #getListItemWidth(listItem) {
        const isHidden = listItem.hasAttribute('data-hidden');

        if (isHidden) { listItem.removeAttribute('data-hidden'); }
        const width = Math.ceil(listItem.getBoundingClientRect().width);
        if (isHidden) { listItem.setAttribute('data-hidden', ''); }

        return width;
    };

    // Get the number of list items that can be displayed before a more menu should appear
    #maxVisibleListItems() {
        const availableSpace = this.#getAvailableSpace();
        const listItems = [...this.querySelectorAll('.main-menu-inner > nav > ul > li:not(.more-button)')];

        let totalListWidth = 0;
        listItems.forEach(item => totalListWidth += this.#getListItemWidth(item));

        // All items fit without the more button
        if (totalListWidth <= availableSpace) return listItems.length;

        // Not all items fit, recalculate with more button width included
        const moreButtonWidth = this.#getListItemWidth(this.querySelector('.more-button'));
        let totalWidth = 0;
        let count = 0;

        for (const item of listItems) {
            totalWidth += this.#getListItemWidth(item);
            if (totalWidth + moreButtonWidth >= availableSpace) break;
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

        this.querySelector('.more-button').toggleAttribute('data-hidden', listItems.length === maxVisibleListItems);

        const moreMenuDropdownMenu = this.querySelector('.main-menu-inner li.more-button > fds-dropdown-menu > .dropdown-menu > ul');

        moreMenuDropdownMenu.innerHTML = '';

        listItems.forEach((item, index) => {
            if (index < maxVisibleListItems) {
                item.removeAttribute('data-hidden');
            }
            else {
                item.setAttribute('data-hidden', '');

                if (item.querySelector('fds-dropdown-menu')) {
                    const customListItem = document.createElement('li');
                    moreMenuDropdownMenu.appendChild(customListItem);

                    const subTitle = document.createElement('span');
                    subTitle.classList.add('sub-title');
                    subTitle.setAttribute('aria-hidden', 'true');
                    subTitle.textContent = item.querySelector('fds-dropdown-menu > .dropdown-button > span').textContent;
                    customListItem.appendChild(subTitle);

                    const customUnorderedList = document.createElement('ul');
                    customUnorderedList.setAttribute('aria-label', subTitle.textContent);
                    customListItem.appendChild(customUnorderedList);

                    const dropdownListItems = item.querySelectorAll('fds-dropdown-menu > .dropdown-menu > ul > li');
                    dropdownListItems.forEach((dropdownItem) => {
                        const clone = dropdownItem.cloneNode(true);
                        customUnorderedList.appendChild(clone);
                    });
                }
                else {
                    const clone = item.cloneNode(true);
                    clone.removeAttribute('data-hidden');
                    moreMenuDropdownMenu.appendChild(clone);
                }
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
}

function registerMainMenu() {
    if (!customElements.get('fds-main-menu')) {
        customElements.define('fds-main-menu', FDSMainMenu);
    }
}

export default registerMainMenu;