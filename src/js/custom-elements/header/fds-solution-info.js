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

    #handleClick = (event) => {
        console.log('Click event:', event);
    };

    // #endregion

    // #region - Private methods ----------------------------------------------------------------------------

    #setupHTML() {
        // --- Slot ---
        if (!this.shadowRoot.querySelector('slot[name="element-slot"]')) {
            const slot = document.createElement('slot');
            slot.name = 'element-slot';
            this.shadowRoot.appendChild(slot);
        }

        // --- Button ---
        let button = this.shadowRoot.querySelector('button');
        if (!button) {
            button = document.createElement('button');
            this.shadowRoot.appendChild(button);
        }
        button.textContent = 'Click me';
    }

    #addEventListeners() {
        this.addEventListener('click', this.#handleClick);
    }

    #removeEventListeners() {
        this.removeEventListener('click', this.#handleClick);
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