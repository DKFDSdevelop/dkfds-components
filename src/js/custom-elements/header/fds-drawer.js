import * as CE from '../custom-element-utils';
import { generateAndVerifyUniqueId } from '../../utils/generate-unique-id';

class FDSDrawer extends HTMLElement {

    /* Private instance fields */

    #initialized = false;
    #resizeObserver = null;

    #handleCloseButtonClick = () => {
        this.close();
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

    /* Private methods */

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
        let headingId = heading.id;
        if (!headingId) {
            headingId = generateAndVerifyUniqueId('hea');
            heading.id = headingId;
        }
        heading.textContent = this.getAttribute('heading') || 'Menu';
        drawer.setAttribute('aria-labelledby', headingId);

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

    /* --------------------------------------------------
    CUSTOM ELEMENT ATTRIBUTES (can invoke attributeChangedCallback())
    -------------------------------------------------- */

    static observedAttributes = ['open', 'ready', 'heading', 'close-button-text'];

    /* --------------------------------------------------
    CUSTOM ELEMENT METHODS
    -------------------------------------------------- */

    init() {
        this.#setupHTML();

        this.querySelector('.button-menu-close').addEventListener('click', this.#handleCloseButtonClick, false);

        const links = this.querySelectorAll('.mobile-drawer a');
        links.forEach(link => {
            link.addEventListener('click', this.#handleCloseButtonClick, false);
        });

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

            document.addEventListener('fds.modal.shown', this.#handleCloseButtonClick, false);
        }
    }

    close() {
        if (!this.#initialized) return;

        if (this.hasAttribute('open')) {
            this.removeAttribute('open');

            document.removeEventListener('fds.modal.shown', this.#handleCloseButtonClick, false);
        }
    }

    /* --------------------------------------------------
    CUSTOM ELEMENT ADDED TO DOCUMENT
    -------------------------------------------------- */

    connectedCallback() {
        if (this.getAttribute('ready') === 'false') return;

        this.init();
    }

    /* --------------------------------------------------
    CUSTOM ELEMENT REMOVED FROM DOCUMENT
    -------------------------------------------------- */

    disconnectedCallback() {
        this.#initialized = false;

        this.querySelector('.button-menu-close')?.removeEventListener('click', this.#handleCloseButtonClick, false);

        const links = this.querySelectorAll('.mobile-drawer a');
        links.forEach(link => {
            link.removeEventListener('click', this.#handleCloseButtonClick, false);
        });

        if (this.#resizeObserver) {
            this.#resizeObserver.disconnect();
            this.#resizeObserver = null;
        }

    }

    /* --------------------------------------------------
    CUSTOM ELEMENT'S ATTRIBUTE(S) CHANGED
    -------------------------------------------------- */

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

                const closeDrawer = newValue === null || newValue === false;
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

        }
    }
}

function registerDrawer() {
    if (customElements.get('fds-drawer') === undefined) {
        window.customElements.define('fds-drawer', FDSDrawer);
    }
}

export default registerDrawer;