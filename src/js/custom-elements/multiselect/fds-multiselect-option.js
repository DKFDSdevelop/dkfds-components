const styles = `
    :host {
        display: none;
    }
`;

const sheet = new CSSStyleSheet();
sheet.replaceSync(styles);

class FDSMultiselectOption extends HTMLElement {

    // #region - GETTERS AND SETTERS ------------------------------------------------------------------------

    get value() { return this.getAttribute('value') ?? this.textContent.trim(); }
    set value(value) { value == null ? this.removeAttribute('value') : this.setAttribute('value', value); }

    // #endregion

    // #region - PRIVATE INSTANCE FIELDS --------------------------------------------------------------------

    #selected = false;

    // #endregion

    // #region - PRIVATE METHODS ----------------------------------------------------------------------------

    #isDefaultSelected() {
        const attr = this.getAttribute('default-selected');
        if (attr === null) return false;
        return attr.toLowerCase() !== 'false';
    }

    #updateSelected(isSelected) {
        if (this.#selected === isSelected) return;
        this.#selected = isSelected;
        this.setAttribute('data-selected', isSelected ? 'true' : 'false');
        this.dispatchEvent(new CustomEvent('fds-multiselect-option-change', { bubbles: true, composed: true }));
    }

    #init() {
        this.#selected = this.#isDefaultSelected();
        this.#updateSelected(this.#selected);
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

    select() {
        this.#updateSelected(true);
    }

    deselect() {
        this.#updateSelected(false);
    }

    toggle() {
        this.#updateSelected(!this.#selected);
    }

    // #endregion

    // #region - ADDED TO DOCUMENT --------------------------------------------------------------------------

    connectedCallback() {
        this.#init();
    }

    // #endregion
}

function registerMultiselectOption() {
    if (!customElements.get('fds-multiselect-option')) {
        customElements.define('fds-multiselect-option', FDSMultiselectOption);
    }
}

export default registerMultiselectOption;