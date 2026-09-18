import { styles } from './fds-alert-styling';

const sheet = new CSSStyleSheet();
sheet.replaceSync(styles);

const DEFAULT_VARIANT = 'info';

class FDSAlert extends HTMLElement {

    // #region - ATTRIBUTES (can invoke attributeChangedCallback()) -----------------------------------------

    static observedAttributes = ['variant'];

    // #endregion

    // #region - GETTERS AND SETTERS ------------------------------------------------------------------------

    get variant() {
        return this.getAttribute('variant') || DEFAULT_VARIANT;
    }
    set variant(value) { this.setAttribute('variant', value); }

    // #endregion

    // #region - PRIVATE INSTANCE FIELDS --------------------------------------------------------------------

    #initialized = false;

    // #endregion

    // #region - PRIVATE METHODS ----------------------------------------------------------------------------

    #setupHTML() {
        // --- Wrapper ---
        let alert = this.shadowRoot.querySelector('.alert');
        if (!alert) {
            alert = document.createElement('div');
            alert.classList.add('alert');
            this.shadowRoot.appendChild(alert);
        }

        // --- Icon slot ---
        if (!alert.querySelector('slot[name="icon"]')) {
            const iconSlot = document.createElement('slot');
            iconSlot.name = 'icon';
            alert.appendChild(iconSlot);
        }

        // --- Alert body ---
        let alertBody = alert.querySelector('.alert-body');
        if (!alertBody) {
            alertBody = document.createElement('div');
            alertBody.classList.add('alert-body');
            alert.appendChild(alertBody);
        }

        // --- Heading slot ---
        if (!alertBody.querySelector('slot[name="heading"]')) {
            const headingSlot = document.createElement('slot');
            headingSlot.name = 'heading';
            alertBody.appendChild(headingSlot);
        }

        // --- Content slot ---
        if (!alertBody.querySelector('slot[name="content"]')) {
            const contentSlot = document.createElement('slot');
            contentSlot.name = 'content';
            alertBody.appendChild(contentSlot);
        }

        this.#applyVariant();
    }

    #applyVariant() {
        const alert = this.shadowRoot.querySelector('.alert');
        alert.className = 'alert';
        alert.classList.add(`alert-${this.variant}`);
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
        this.#initialized = true;
    }

    // #endregion

    // #region - ADDED TO DOCUMENT --------------------------------------------------------------------------

    connectedCallback() {
        this.init();
    }

    // #endregion

    // #region - REMOVED FROM DOCUMENT ----------------------------------------------------------------------

    disconnectedCallback() {
        this.#initialized = false;
    }

    // #endregion

    // #region - ATTRIBUTE(S) CHANGED -----------------------------------------------------------------------

    attributeChangedCallback(attribute, oldValue, newValue) {
        if (!this.#initialized) return;
        if (oldValue === newValue) return;

        switch (attribute) {
            case 'variant':
                this.#applyVariant();
                break;
        }
    }

    // #endregion
}

function registerAlert() {
    if (!customElements.get('fds-alert')) {
        customElements.define('fds-alert', FDSAlert);
    }
}

export default registerAlert;
