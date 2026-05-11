import * as CE from '../custom-element-utils';

class FDSDrawerButton extends HTMLElement {

    /* Private instance fields */

    #initialized;
    #button;
    #drawer;
    #handleButtonClick;
    #handleDrawerOpened;
    #handleDrawerClosed;

    /* Private methods */

    #getDrawerElement() {
        return document.getElementById(this.getAttribute('drawer'));
    }

    #createButton() {
        const button = document.createElement('button');

        const svg = CE.createSvgIcon("M120-240v-80h720v80H120Zm0-200v-80h720v80H120Zm0-200v-80h720v80H120Z");

        const text = document.createElement('span');
        text.textContent = this.getAttribute('button-text') || 'Menu';

        button.appendChild(svg);
        button.appendChild(text);

        return button;
    }

    #setupHTML() {
        let button = this.querySelector('button');

        if (!button) {
            button = this.#createButton();
            this.appendChild(button);
        }

        button.setAttribute('type', 'button');
        button.setAttribute('aria-haspopup', 'dialog');

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
                'fds-drawer-opened',
                this.#handleDrawerOpened,
                false
            );

            this.#drawer.addEventListener(
                'fds-drawer-closed',
                this.#handleDrawerClosed,
                false
            );
        }
    }

    #removeEventListeners() {
        this.#button?.removeEventListener('click', this.#handleButtonClick, false);

        if (this.#drawer) {
            this.#drawer.removeEventListener(
                'fds-drawer-opened',
                this.#handleDrawerOpened,
                false
            );

            this.#drawer.removeEventListener(
                'fds-drawer-closed',
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

        this.#handleButtonClick = () => { this.#drawer?.toggleDrawer?.() };
        this.#handleDrawerOpened = () => { this.#syncExpanded() };

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

        this.#setupHTML();

        /* if (!this.hasAttribute('drawer')) {
            console.warn('drawer attribute missing in <fds-drawer-button>');
            return false;
        } */

        this.#button = this.querySelector('button');
        this.#drawer = this.#getDrawerElement();

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

        if (attribute === 'button-text') { this.#updateButtonText(newValue) }
    }
}

function registerDrawerButton() {
    if (customElements.get('fds-drawer-button') === undefined) {
        window.customElements.define('fds-drawer-button', FDSDrawerButton);
    }
}

export default registerDrawerButton;