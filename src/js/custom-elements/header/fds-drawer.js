import * as CE from '../custom-element-utils';
import { generateAndVerifyUniqueId } from '../../utils/generate-unique-id';

class FDSDrawer extends HTMLElement {

    // #region - ATTRIBUTES (can invoke attributeChangedCallback()) -----------------------------------------

    static observedAttributes = ['open', 'ready', 'heading', 'close-button-text', 'heading-id'];

    // #endregion

    // #region - PRIVATE INSTANCE FIELDS --------------------------------------------------------------------

    #initialized = false;
    #resizeObserver = null;

    // #endregion

    // #region - PRIVATE EVENT HANDLERS ---------------------------------------------------------------------

    #handleCloseClick = () => {
        this.close();
    }

    #handleDrawerLinkClick = (event) => {
        if (event.target.closest('a')) {
            this.close();
        }
    }

    #handleResize = (entries) => {
        entries.forEach((entry) => {
            const style = window.getComputedStyle(entry.target);
            const isVisible = style.display !== 'none';
            if (!isVisible && this.hasAttribute('open')) {
                this.close();
            }
        });
    }

    #handleKeydown = (event) => {
        switch (event.key) {
            case 'Tab': {
                const focusableElementsString = 'a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, object, embed, [tabindex="0"], [contenteditable]';
                const drawer = this.querySelector('.mobile-drawer');
                const focusableElements = [...drawer.querySelectorAll(focusableElementsString)]
                    .filter(el => el.offsetWidth > 0 && el.offsetHeight > 0); // Exclude hidden elements from the focus trap

                const firstTabStop = focusableElements[0];
                const lastTabStop = focusableElements[focusableElements.length - 1];

                if (event.shiftKey) {
                    if (document.activeElement === firstTabStop) {
                        event.preventDefault();
                        lastTabStop.focus();
                    }
                }
                else {
                    if (document.activeElement === lastTabStop) {
                        event.preventDefault();
                        firstTabStop.focus();
                    }
                }
                break;
            }
            case 'Escape':
                this.close();
                break;
        }
    }

    // #endregion

    // #region - PRIVATE METHODS ----------------------------------------------------------------------------

    #setupHTML() {
        let overlay = this.querySelector('.overlay');
        let drawer = this.querySelector('.mobile-drawer');
        let menuTop = this.querySelector('.menu-top');
        let heading = this.querySelector('.menu-heading');
        let closeButton = this.querySelector('.button-menu-close');

        // Dark overlay when drawer is open
        if (!overlay) {
            overlay = document.createElement('div');
            overlay.classList.add('overlay');
            drawer ? this.insertBefore(overlay, drawer) : this.appendChild(overlay);
        }

        // Drawer
        if (!drawer) {
            drawer = document.createElement('div');
            drawer.classList.add('mobile-drawer');
            this.appendChild(drawer);
        }
        drawer.setAttribute('role', 'dialog');
        drawer.setAttribute('aria-modal', 'true');

        // The top container element inside the drawer
        if (!menuTop) {
            menuTop = document.createElement('div');
            menuTop.classList.add('menu-top');
            drawer.prepend(menuTop);
        }

        // Heading inside the drawer
        if (!heading) {
            heading = document.createElement('h2');
            heading.classList.add('menu-heading');
            menuTop.appendChild(heading);
        }
        if (!heading.id) {
            heading.id = this.getAttribute('heading-id') ?? generateAndVerifyUniqueId('hea-');
        }
        heading.textContent = this.getAttribute('heading') || 'Menu';
        drawer.setAttribute('aria-labelledby', heading.id);

        // Close button inside the drawer
        if (!closeButton) {
            closeButton = document.createElement('button');
            closeButton.classList.add('function-link', 'button-menu-close');
            menuTop.appendChild(closeButton);

            const closeButtonIcon = CE.createSvgIcon('m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z');
            closeButton.appendChild(closeButtonIcon);

            const closeButtonText = document.createElement('span');
            closeButtonText.textContent = this.getAttribute('close-button-text') || 'Luk';
            closeButton.appendChild(closeButtonText);
        }
        closeButton.setAttribute('aria-label', 'Luk menu');
    };

    #setupObserver() {
        if (this.#resizeObserver) return;

        this.#resizeObserver = new ResizeObserver(this.#handleResize);
        this.#resizeObserver.observe(this);
    }

    // #endregion

    // #region - PUBLIC METHODS -----------------------------------------------------------------------------

    init() {
        this.#setupHTML();

        this.querySelector('.button-menu-close').addEventListener('click', this.#handleCloseClick, false);
        this.querySelector('.overlay').addEventListener('click', this.#handleCloseClick, false);
        this.querySelector('.mobile-drawer').addEventListener('click', this.#handleDrawerLinkClick, false);

        this.#setupObserver();

        this.#initialized = true;
    }

    toggle() {
        if (!this.#initialized) return;

        const drawerIsVisible = this.hasAttribute('open') && this.getAttribute('open') !== 'false';
        drawerIsVisible ? this.close() : this.open();
    }

    open() {
        if (!this.#initialized) return;

        if (!this.hasAttribute('open') || this.getAttribute('open') === 'false') {
            this.setAttribute('open', '');
            document.addEventListener('fds.modal.shown', this.#handleCloseClick, false);
            document.addEventListener('keydown', this.#handleKeydown, false);

            this.querySelector('.button-menu-close')?.focus();
        }
    }

    close() {
        if (!this.#initialized) return;

        if (this.hasAttribute('open')) {
            this.removeAttribute('open');
            document.removeEventListener('fds.modal.shown', this.#handleCloseClick, false);
            document.removeEventListener('keydown', this.#handleKeydown, false);

            const drawerButton = document.querySelector(`fds-drawer-button[drawer=${this.id}] button`);
            const visibleDrawerButton = CE.isVisibleAndFocusable(drawerButton);
            if (visibleDrawerButton) {
                drawerButton.focus();
            }
        }
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
        this.#initialized = false;

        this.querySelector('.button-menu-close')?.removeEventListener('click', this.#handleCloseClick, false);
        this.querySelector('.overlay')?.removeEventListener('click', this.#handleCloseClick, false);
        this.querySelector('.mobile-drawer').removeEventListener('click', this.#handleDrawerLinkClick, false);
        document.removeEventListener('fds.modal.shown', this.#handleCloseClick, false);
        document.removeEventListener('keydown', this.#handleKeydown, false);

        if (this.#resizeObserver) {
            this.#resizeObserver.disconnect();
            this.#resizeObserver = null;
        }

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

            case 'open':

                const closeDrawer = newValue === null || newValue === 'false';
                if (closeDrawer) {
                    this.querySelector('.overlay')?.classList.remove('is-visible');
                    this.querySelector('.mobile-drawer')?.classList.remove('is-visible');
                    document.body.classList.remove('mobile-nav-active');
                }
                else {
                    this.querySelector('.overlay')?.classList.add('is-visible');
                    this.querySelector('.mobile-drawer')?.classList.add('is-visible');
                    document.body.classList.add('mobile-nav-active');
                }
                break;

            case 'heading':

                const heading = this.querySelector('.menu-heading');
                if (heading) { heading.textContent = newValue; }
                break;

            case 'close-button-text':

                if (newValue === null) return;

                const closeButtonText = this.querySelector('.button-menu-close span');
                if (closeButtonText) { closeButtonText.textContent = newValue; }
                break;

            case 'heading-id':

                if (newValue !== null) {
                    const heading = this.querySelector('.menu-heading');
                    const drawer = this.querySelector('.mobile-drawer');
                    heading.id = newValue;
                    drawer.setAttribute('aria-labelledby', newValue);
                }
                break;

        }
    }

    // #endregion
}

function registerDrawer() {
    if (customElements.get('fds-drawer') === undefined) {
        window.customElements.define('fds-drawer', FDSDrawer);
    }
}

export default registerDrawer;