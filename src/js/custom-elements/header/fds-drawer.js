'use strict';

import { generateAndVerifyUniqueId } from '../../utils/generate-unique-id';

class FDSDrawer extends HTMLElement {

    /* Private instance fields */

    #initialized;
    #handleCloseClick;
    #handleKeydown;

    /* Private methods */

    #getCloseButtonElement() {
        return this.querySelector(':scope > .menu-top .button-menu-close, :scope > .menu-top button');
    }

    #getMenuTopElement() {
        return this.querySelector(':scope > .menu-top');
    }

    #getHeadingElement() {
        return this.querySelector(
            ':scope > .menu-top h1, :scope > .menu-top h2, :scope > .menu-top h3, :scope > .menu-top h4, :scope > .menu-top h5, :scope > .menu-top h6'
        );
    }

    #getValidMenuTopElement() {
        const firstElementChild = this.firstElementChild;

        if (!firstElementChild) return null;

        const headingElement = firstElementChild.querySelector(
            ':scope > h1, :scope > h2, :scope > h3, :scope > h4, :scope > h5, :scope > h6'
        );

        const closeButton = firstElementChild.querySelector(':scope > button');

        if (!headingElement || !closeButton) return null;

        return firstElementChild;
    }

    #createMenuTopElement() {
        const menuTopElement = document.createElement('div');
        menuTopElement.classList.add('menu-top');

        const headingElement = document.createElement('h2');
        headingElement.classList.add('menu-heading');
        headingElement.textContent = this.getAttribute('heading') || '';

        const closeButtonText = this.getAttribute('close-button-text') || 'Luk';

        const closeButtonElement = document.createElement('button');
        closeButtonElement.classList.add('button-menu-close', 'function-link');
        closeButtonElement.setAttribute('type', 'button');
        closeButtonElement.setAttribute('aria-label', `${closeButtonText} menu`);

        const iconElement = this.#createCloseIconElement();

        const closeButtonTextElement = document.createElement('span');
        closeButtonTextElement.textContent = closeButtonText;

        closeButtonElement.appendChild(iconElement);
        closeButtonElement.appendChild(closeButtonTextElement);

        menuTopElement.appendChild(headingElement);
        menuTopElement.appendChild(closeButtonElement);

        return menuTopElement;
    }

    #createCloseIconElement() {
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.classList.add('icon-svg');
        svg.setAttribute('focusable', 'false');
        svg.setAttribute('aria-hidden', 'true');

        const use = document.createElementNS('http://www.w3.org/2000/svg', 'use');
        use.setAttributeNS(null, 'href', '#close');

        svg.appendChild(use);

        return svg;
    }

    #ensureDOM() {
        this.classList.add('mobile-drawer');

        const hasAttributeMode =
            this.hasAttribute('heading') && this.hasAttribute('close-button-text');

        let menuTopElement = this.#getMenuTopElement();

        // Attribute mode:
        // Only activated when both heading and close-button-text are present.
        if (hasAttributeMode) {
            if (!menuTopElement) {
                menuTopElement = this.#createMenuTopElement();
                this.prepend(menuTopElement);
            }
        }

        // Enhance mode:
        // Only used when attribute mode is not active. The component must already contain valid HTML.
        if (!hasAttributeMode) {
            menuTopElement = this.#getValidMenuTopElement();

            if (!menuTopElement) {
                return false;
            }

            menuTopElement.classList.add('menu-top');
        }

        const headingElement = this.#getHeadingElement();

        if (!headingElement) {
            return false;
        }

        headingElement.classList.add('menu-heading');

        const closeButton = this.#getCloseButtonElement();

        if (!closeButton) {
            return false;
        }

        closeButton.setAttribute('type', closeButton.getAttribute('type') || 'button');
        closeButton.classList.add('button-menu-close', 'function-link');

        if (!this.hasAttribute('role')) {
            this.setAttribute('role', 'dialog');
        }

        if (!this.hasAttribute('aria-modal')) {
            this.setAttribute('aria-modal', 'true');
        }

        if (!this.hasAttribute('tabindex')) {
            this.setAttribute('tabindex', '-1');
        }

        this.#ensureHeadingId();

        return true;
    }

    #ensureHeadingId() {
        const headingElement = this.#getHeadingElement();

        if (!headingElement) return;

        if (!headingElement.id) {
            headingElement.id = generateAndVerifyUniqueId('drawer-heading');
        }

        if (!this.hasAttribute('aria-labelledby')) {
            this.setAttribute('aria-labelledby', headingElement.id);
        }
    }

    #updateHeading(heading) {
        const headingElement = this.#getHeadingElement();

        if (headingElement) {
            headingElement.textContent = heading || '';
        }
    }

    #updateCloseButtonText(closeButtonText) {
        const closeButton = this.#getCloseButtonElement();
        const closeButtonTextElement = closeButton?.querySelector(':scope > span');

        if (closeButtonTextElement) {
            closeButtonTextElement.textContent = closeButtonText || '';
        }

        if (closeButton) {
            closeButton.setAttribute('aria-label', closeButtonText ? `${closeButtonText} menu` : '');
        }
    }

    #syncAll() {
        this.#updateOpen(this.getAttribute('open'));
    }

    #updateOpen(open) {
        const isOpen = open !== null && open !== 'false';
        this.#setOpenState(isOpen);
    }

    #setOpenState(isOpen) {
        this.classList.toggle('is-visible', isOpen);
        this.setAttribute('aria-hidden', isOpen ? 'false' : 'true');

        if (isOpen) {
            this.focus();
        }
    }

    /* Attributes which can invoke attributeChangedCallback() */

    static observedAttributes = ['open', 'ready', 'heading', 'close-button-text'];

    /* --------------------------------------------------
    CUSTOM ELEMENT CONSTRUCTOR (do not access or add attributes in the constructor)
    -------------------------------------------------- */

    constructor() {
        super();

        this.#initialized = false;

        this.#handleCloseClick = () => { this.closeDrawer(); };

        this.#handleKeydown = (event) => {
            if (event.key === 'Escape' && this.isOpen()) {
                this.closeDrawer();
            }
        };
    }

    /* --------------------------------------------------
    CUSTOM ELEMENT METHODS
    -------------------------------------------------- */

    init() {
        if (this.#initialized) return;

        const isValid = this.#ensureDOM();
        if (!isValid) return;

        this.#syncAll();

        this.#getCloseButtonElement()?.addEventListener('click', this.#handleCloseClick, false);
        document.addEventListener('keydown', this.#handleKeydown, false);

        this.#initialized = true;
    }

    openDrawer() {
        if (this.isOpen()) return;

        this.setAttribute('open', 'true');
        this.dispatchEvent(new CustomEvent('fds-drawer-opened', { bubbles: true }));
    }

    closeDrawer() {
        if (!this.isOpen()) return;

        this.setAttribute('open', 'false');
        this.dispatchEvent(new CustomEvent('fds-drawer-closed', { bubbles: true }));
    }

    toggleDrawer() {
        this.isOpen() ? this.closeDrawer() : this.openDrawer();
    }

    isOpen() {
        return this.hasAttribute('open') && this.getAttribute('open') !== 'false';
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
        this.#getCloseButtonElement()?.removeEventListener('click', this.#handleCloseClick, false);
        document.removeEventListener('keydown', this.#handleKeydown, false);

        this.#initialized = false;
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

        if (attribute === 'open' && oldValue !== newValue) {
            this.#updateOpen(newValue);
        }

        if (attribute === 'heading' && oldValue !== newValue) {
            this.#updateHeading(newValue);
        }

        if (attribute === 'close-button-text' && oldValue !== newValue) {
            this.#updateCloseButtonText(newValue);
        }
    }
}

function registerDrawer() {
    if (customElements.get('fds-drawer') === undefined) {
        window.customElements.define('fds-drawer', FDSDrawer);
    }
}

export default registerDrawer;