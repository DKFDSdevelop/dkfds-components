import { styles } from './fds-solution-info-styling';

const sheet = new CSSStyleSheet();
sheet.replaceSync(styles);

class FDSSolutionInfo extends HTMLElement {

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

    // #endregion

    // #region - Private methods ----------------------------------------------------------------------------

    #setupHTML() {
        if (this.closest('fds-drawer')) {
            // --- Section ---
            let section = this.shadowRoot.querySelector('.solution-info-mobile');
            if (!section) {
                section = document.createElement('section');
                section.classList.add('solution-info-mobile');
                this.shadowRoot.appendChild(section);
            }

            // --- Additional info ---
            let additionalInfo = section.querySelector('slot[name="additional-info"]');
            if (!additionalInfo) {
                additionalInfo = document.createElement('slot');
                additionalInfo.name = 'additional-info';
                section.appendChild(additionalInfo);
            }
        }
        else {
            // --- Inner wrapper ---
            let divWrapper = this.shadowRoot.querySelector('.solution-info-inner');
            if (!divWrapper) {
                divWrapper = document.createElement('div');
                divWrapper.classList.add('solution-info-inner');
                this.shadowRoot.appendChild(divWrapper);
            }

            // --- Solution heading ---
            let solutionHeading = divWrapper.querySelector('slot[name="solution-heading"]');
            if (!solutionHeading) {
                solutionHeading = document.createElement('slot');
                solutionHeading.name = 'solution-heading';
                divWrapper.appendChild(solutionHeading);
            }

            // --- Additional info ---
            let additionalInfo = divWrapper.querySelector('slot[name="additional-info"]');
            if (!additionalInfo) {
                additionalInfo = document.createElement('slot');
                additionalInfo.name = 'additional-info';
                divWrapper.appendChild(additionalInfo);
            }

            // --- Drawer button ---
            let drawerButtonSlot = divWrapper.querySelector('slot[name="drawer-button"]');
            if (!drawerButtonSlot) {
                drawerButtonSlot = document.createElement('slot');
                drawerButtonSlot.name = 'drawer-button';
                divWrapper.appendChild(drawerButtonSlot);
            }
        }
    }

    #addEventListeners() {
        this.shadowRoot.querySelector('slot[name="drawer-button"]')?.addEventListener('slotchange', this.#handleSlotDrawerButtonChange);
    }

    #removeEventListeners() {
        this.shadowRoot.querySelector('slot[name="drawer-button"]')?.removeEventListener('slotchange', this.#handleSlotDrawerButtonChange);
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
        // The 'ready' attribute can be used to defer initialization.
        // Omit the attribute or set it to anything other than 'false' to initialize immediately.
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

function registerSolutionInfo() {
    if (!customElements.get('fds-solution-info')) {
        customElements.define('fds-solution-info', FDSSolutionInfo);
    }
}

export default registerSolutionInfo;