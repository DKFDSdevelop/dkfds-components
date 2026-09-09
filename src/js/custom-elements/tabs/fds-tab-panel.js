const styles = `
    :host {
        display: block;
    }
`;

const sheet = new CSSStyleSheet();
sheet.replaceSync(styles);

class FDSTabPanel extends HTMLElement {

    // #region - GETTERS AND SETTERS ------------------------------------------------------------------------

    get tabKey() { return this.getAttribute('tab-key'); }
    set tabKey(value) { value == null ? this.removeAttribute('tab-key') : this.setAttribute('tab-key', value); }

    // #endregion

    // #region - PRIVATE METHODS ----------------------------------------------------------------------------

    #setupHTML() {
        if (!this.shadowRoot.querySelector('slot')) {
            const slot = document.createElement('slot');
            this.shadowRoot.appendChild(slot);
        }
    }

    // #endregion

    // #region - CONSTRUCTOR (do not access or add attributes in the constructor) ---------------------------

    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.adoptedStyleSheets = [sheet];
    }

    // #endregion

    // #region - ADDED TO DOCUMENT --------------------------------------------------------------------------

    connectedCallback() {
        this.#setupHTML();
    }

    // #endregion
}

function registerTabPanel() {
    if (!customElements.get('fds-tab-panel')) {
        customElements.define('fds-tab-panel', FDSTabPanel);
    }
}

export default registerTabPanel;
