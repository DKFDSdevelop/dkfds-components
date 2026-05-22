import * as CE from '../custom-element-utils';
import { styles } from './fds-portal-info-styling';

const sheet = new CSSStyleSheet();
sheet.replaceSync(styles);

class FDSPortalInfo extends HTMLElement {

    // #region - ATTRIBUTES (can invoke attributeChangedCallback()) -----------------------------------------

    static observedAttributes = ['attr', 'ready'];

    // #endregion

    // #region - Private instance fields --------------------------------------------------------------------

    #initialized = false;

    // #endregion

    // #region - Private event handlers ---------------------------------------------------------------------

    #handleSlotDrawerButtonChange = (event) => {
        event.target.assignedElements().forEach(element => {
            element.classList.add('ml-auto');
        });
    };

    #handleSlotUserChange = (event) => {
        event.target.assignedElements().forEach(element => {
            element.classList.add('user');
        });
    };

    #handleSlotLogOffButtonChange = (event) => {
        event.target.assignedElements().forEach(element => {
            element.classList.add('function-link', 'd-print-none', 'log-off');
        });
    };

    // #endregion

    // #region - Private methods ----------------------------------------------------------------------------

    #setupHTML() {
        if (this.closest('fds-drawer')) {
            // --- Section ---
            let section = this.shadowRoot.querySelector('.portal-info-mobile');
            if (!section) {
                section = document.createElement('section');
                section.classList.add('portal-info-mobile');
                this.shadowRoot.appendChild(section);
            }

            // --- User ---
            let userSlot = section.querySelector('slot[name="user"]');
            if (!userSlot) {
                userSlot = document.createElement('slot');
                userSlot.name = 'user';
                section.appendChild(userSlot);
            }

            // --- Log off button ---
            let logOffButtonSlot = section.querySelector('slot[name="log-off-button"]');
            if (!logOffButtonSlot) {
                logOffButtonSlot = document.createElement('slot');
                logOffButtonSlot.name = 'log-off-button';
                section.appendChild(logOffButtonSlot);
            }
        }
        else {
            // --- Inner wrapper ---
            let divWrapper = this.shadowRoot.querySelector('.portal-info-inner');
            if (!divWrapper) {
                divWrapper = document.createElement('div');
                divWrapper.classList.add('portal-info-inner');
                this.shadowRoot.appendChild(divWrapper);
            }

            // --- Logo wrapper ---
            let logoWrapper = divWrapper.querySelector('.logo');
            if (!logoWrapper) {
                logoWrapper = document.createElement('div');
                logoWrapper.classList.add('logo');
                divWrapper.appendChild(logoWrapper);
            }

            // --- Logo ---
            let portalLogo = logoWrapper.querySelector('slot[name="logo"]');
            if (!portalLogo) {
                portalLogo = document.createElement('slot');
                portalLogo.name = 'logo';
                logoWrapper.appendChild(portalLogo);
            }

            // --- Drawer button ---
            let drawerButtonSlot = divWrapper.querySelector('slot[name="drawer-button"]');
            if (!drawerButtonSlot) {
                drawerButtonSlot = document.createElement('slot');
                drawerButtonSlot.name = 'drawer-button';
                divWrapper.appendChild(drawerButtonSlot);
            }

            // --- User wrapper ---
            let userWrapper = divWrapper.querySelector('.portal-user');
            if (!userWrapper) {
                userWrapper = document.createElement('div');
                userWrapper.classList.add('portal-user');
                divWrapper.appendChild(userWrapper);
            }

            // --- User ---
            let userSlot = userWrapper.querySelector('slot[name="user"]');
            if (!userSlot) {
                userSlot = document.createElement('slot');
                userSlot.name = 'user';
                userWrapper.appendChild(userSlot);
            }

            // --- Log off button ---
            let logOffButtonSlot = userWrapper.querySelector('slot[name="log-off-button"]');
            if (!logOffButtonSlot) {
                logOffButtonSlot = document.createElement('slot');
                logOffButtonSlot.name = 'log-off-button';
                userWrapper.appendChild(logOffButtonSlot);
            }
        }
    }

    #addEventListeners() {
        this.shadowRoot.querySelector('slot[name="drawer-button"]')?.addEventListener('slotchange', this.#handleSlotDrawerButtonChange);
        this.shadowRoot.querySelector('slot[name="user"]')?.addEventListener('slotchange', this.#handleSlotUserChange);
        this.shadowRoot.querySelector('slot[name="log-off-button"]')?.addEventListener('slotchange', this.#handleSlotLogOffButtonChange);
    }

    #removeEventListeners() {
        this.shadowRoot.querySelector('slot[name="drawer-button"]')?.removeEventListener('slotchange', this.#handleSlotDrawerButtonChange);
        this.shadowRoot.querySelector('slot[name="user"]')?.removeEventListener('slotchange', this.#handleSlotUserChange);
        this.shadowRoot.querySelector('slot[name="log-off-button"]')?.removeEventListener('slotchange', this.#handleSlotLogOffButtonChange);
    }

    // #endregion

    // #region - CONSTRUCTOR (do not access or add attributes in the constructor) ---------------------------

    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.adoptedStyleSheets = [sheet];
    }

    // #endregion

    // #region - PUBLIC METHODS -----------------------------------------------------------------------------

    init() {
        this.#setupHTML();
        this.#addEventListeners();
        this.#initialized = true;
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
            case 'attr':
                console.log('attr changed to', newValue);
                break;
        }
    }

    // #endregion
}

function registerPortalInfo() {
    if (!customElements.get('fds-portal-info')) {
        customElements.define('fds-portal-info', FDSPortalInfo);
    }
}

export default registerPortalInfo;