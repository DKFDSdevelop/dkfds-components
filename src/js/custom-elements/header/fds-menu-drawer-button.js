'use strict';

class FDSMenuDrawerButton extends HTMLElement {

    /* Private instance fields */

    #initialized;
    #button;
    #drawer;
    #handleButtonClick;
    #handleDrawerOpened;
    #handleDrawerClosed;

    /* Private methods */

    #getButtonElement() {
        return this.querySelector(':scope > button');
    }

    #getDrawerElement() {
        return document.getElementById(this.getAttribute('drawer'));
    }

    #createButtonElement() {
        const buttonElement = document.createElement('button');
        buttonElement.classList.add('function-link');
        buttonElement.setAttribute('type', 'button');

        const iconElement = this.#createIconElement();

        const textElement = document.createElement('span');
        textElement.textContent = this.getAttribute('button-text') || '';

        buttonElement.appendChild(iconElement);
        buttonElement.appendChild(textElement);

        return buttonElement;
    }

    #createIconElement() {
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.classList.add('icon-svg');
        svg.setAttribute('focusable', 'false');
        svg.setAttribute('aria-hidden', 'true');

        const use = document.createElementNS('http://www.w3.org/2000/svg', 'use');
        use.setAttributeNS(null, 'href', '#menu');

        svg.appendChild(use);

        return svg;
    }

    #ensureDOM() {
        let buttonElement = this.#getButtonElement();

        // Attribute mode:
        // No button markup provided - create canonical structure only when both drawer and button-text are present.
        if (!buttonElement) {
            if (!this.hasAttribute('drawer') || !this.hasAttribute('button-text')) {
                console.warn('<fds-menu-drawer-button> Missing child button. To generate one, provide both drawer and button-text attributes.');
                return false;
            }

            buttonElement = this.#createButtonElement();
            this.appendChild(buttonElement);
        }

        // Enhance mode:
        // Button exists - enhance the provided/generated structure.
        buttonElement.classList.add('function-link');
        buttonElement.setAttribute('type', buttonElement.getAttribute('type') || 'button');
        buttonElement.setAttribute('aria-haspopup', 'dialog');

        this.#button = buttonElement;
        this.#drawer = this.#getDrawerElement();

        return true;
    }

    #updateDrawerReference() {
        this.#removeEventListeners();

        this.#drawer = this.#getDrawerElement();

        this.#syncControls();
        this.#syncExpanded();
        this.#addEventListeners();
    }

    #updateButtonText(buttonText) {
        const textElement = this.#button?.querySelector(':scope > span');

        if (textElement) {
            textElement.textContent = buttonText || '';
        }
    }

    #syncControls() {
        if (!this.#button) return;

        const drawerId = this.getAttribute('drawer');

        if (drawerId) {
            this.#button.setAttribute('aria-controls', drawerId);
        } else {
            this.#button.removeAttribute('aria-controls');
        }
    }

    #syncExpanded() {
        if (!this.#button) return;

        this.#button.setAttribute(
            'aria-expanded',
            this.#drawer?.isOpen?.() ? 'true' : 'false'
        );
    }

    #syncAll() {
        this.#syncControls();
        this.#syncExpanded();
    }

    #addEventListeners() {
        if (!this.#button) return;

        this.#button.addEventListener('click', this.#handleButtonClick, false);

        if (this.#drawer) {
            this.#drawer.addEventListener(
                'fds-menu-drawer-opened',
                this.#handleDrawerOpened,
                false
            );

            this.#drawer.addEventListener(
                'fds-menu-drawer-closed',
                this.#handleDrawerClosed,
                false
            );
        }
    }

    #removeEventListeners() {
        this.#button?.removeEventListener('click', this.#handleButtonClick, false);

        if (this.#drawer) {
            this.#drawer.removeEventListener(
                'fds-menu-drawer-opened',
                this.#handleDrawerOpened,
                false
            );

            this.#drawer.removeEventListener(
                'fds-menu-drawer-closed',
                this.#handleDrawerClosed,
                false
            );
        }
    }

    /* Attributes which can invoke attributeChangedCallback() */

    static observedAttributes = ['drawer', 'button-text'];

    /* --------------------------------------------------
    CUSTOM ELEMENT CONSTRUCTOR (do not access or add attributes in the constructor)
    -------------------------------------------------- */

    constructor() {
        super();

        this.#initialized = false;
        this.#button = null;
        this.#drawer = null;

        this.#handleButtonClick = () => {this.#drawer?.toggleDrawer?.()};
        this.#handleDrawerOpened = () => {this.#syncExpanded()};

        this.#handleDrawerClosed = () => {
            this.#syncExpanded();
            this.#button?.focus();
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
        this.#addEventListeners();

        this.#initialized = true;
    }

    /* --------------------------------------------------
    CUSTOM ELEMENT ADDED TO DOCUMENT
    -------------------------------------------------- */

    connectedCallback() {
        this.init();
    }

    /* --------------------------------------------------
    CUSTOM ELEMENT REMOVED FROM DOCUMENT
    -------------------------------------------------- */

    disconnectedCallback() {
        this.#removeEventListeners();
        this.#initialized = false;
        this.#button = null;
        this.#drawer = null;
    }

    /* --------------------------------------------------
    CUSTOM ELEMENT'S ATTRIBUTE(S) CHANGED
    -------------------------------------------------- */

    attributeChangedCallback(attribute, oldValue, newValue) {
        if (!this.#initialized) return;

        if (attribute === 'drawer') { this.#updateDrawerReference() }

        if (attribute === 'button-text') {this.#updateButtonText(newValue)}
    }
}

function registerMenuDrawerButton() {
    if (customElements.get('fds-menu-drawer-button') === undefined) {
        window.customElements.define('fds-menu-drawer-button', FDSMenuDrawerButton);
    }
}

export default registerMenuDrawerButton;