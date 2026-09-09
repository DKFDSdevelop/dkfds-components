import { generateAndVerifyUniqueId } from '../../utils/generate-unique-id';

const styles = `
    :host {
        display: block;
    }
`;

const sheet = new CSSStyleSheet();
sheet.replaceSync(styles);

class FDSTab extends HTMLElement {

    // #region - ATTRIBUTES (can invoke attributeChangedCallback()) -----------------------------------------

    static observedAttributes = ['tab-key'];

    // #endregion

    // #region - GETTERS AND SETTERS ------------------------------------------------------------------------

    get tabKey() { return this.getAttribute('tab-key'); }
    set tabKey(value) { value == null ? this.removeAttribute('tab-key') : this.setAttribute('tab-key', value); }

    // #endregion

    // #region - PRIVATE INSTANCE FIELDS --------------------------------------------------------------------

    #initialized = false;

    // #endregion

    // #region - PRIVATE EVENT HANDLERS ---------------------------------------------------------------------

    #handleClick = () => {
        this.dispatchEvent(new CustomEvent('fds-tab-activate', {
            bubbles: true,
            composed: true,
        }));
    };

    // #endregion

    // #region - PRIVATE METHODS ----------------------------------------------------------------------------

    #setupHTML() {
        if (!this.shadowRoot.querySelector('slot')) {
            const slot = document.createElement('slot');
            this.shadowRoot.appendChild(slot);
        }
    }

    #setupId() {
        if (this.id || !this.tabKey) return;

        this.id = generateAndVerifyUniqueId(`tab-${this.tabKey}-`);
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
        this.#setupId();
        this.setAttribute('role', 'tab');
        this.addEventListener('click', this.#handleClick);
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
        this.removeEventListener('click', this.#handleClick);
        this.#initialized = false;
    }

    // #endregion

    // #region - ATTRIBUTE(S) CHANGED -----------------------------------------------------------------------

    attributeChangedCallback(attribute, oldValue, newValue) {
        if (!this.#initialized) return;
        if (oldValue === newValue) return;

        if (attribute === 'tab-key') {
            this.#setupId();
        }
    }

    // #endregion
}

function registerTab() {
    if (!customElements.get('fds-tab')) {
        customElements.define('fds-tab', FDSTab);
    }
}

export default registerTab;
