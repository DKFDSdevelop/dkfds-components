const template = document.createElement('template');
template.innerHTML = `<slot></slot>`;

const styles = `
    :host {
        display: block;
        padding: calc(8px - 1px) calc(16px - 1px);
        cursor: pointer;
    }

    :host([selected]) {
        background-color: #cfe3fc;
    }
`;

const sheet = new CSSStyleSheet();
sheet.replaceSync(styles);

class FDSMultiselectOption extends HTMLElement {

    // #region - ATTRIBUTES (can invoke attributeChangedCallback()) -----------------------------------------

    static observedAttributes = ['value', 'selected'];

    // #endregion

    // #region - GETTERS AND SETTERS ------------------------------------------------------------------------

    get value() { return this.getAttribute('value') ?? this.textContent.trim(); }
    set value(value) { value == null ? this.removeAttribute('value') : this.setAttribute('value', value); }

    get selected() { return this.hasAttribute('selected'); }
    set selected(value) { value ? this.setAttribute('selected', '') : this.removeAttribute('selected'); }

    // #endregion

    // #region - PRIVATE INSTANCE FIELDS --------------------------------------------------------------------

    #initialized = false;

    // #endregion

    // #region - PRIVATE EVENT HANDLERS ---------------------------------------------------------------------

    #handleClick = () => {
        this.selected = !this.selected;
    };

    #handleKeyDown = (event) => {
        if (event.key !== ' ' && event.key !== 'Enter') return;

        event.preventDefault(); // Space might cause page scroll. Prevent that.
    };

    #handleKeyUp = (event) => {
        if (event.key !== ' ' && event.key !== 'Enter') return; // Prefer key up instead of key down due to WCAG SC 2.5.2

        this.selected = !this.selected;
    };

    // #endregion

    // #region - PRIVATE METHODS ----------------------------------------------------------------------------

    #setupHTML() {
        if (this.shadowRoot.querySelector('slot')) return;
        this.shadowRoot.appendChild(template.content.cloneNode(true));
    }

    #updateSelected(isSelected) {
        this.setAttribute('aria-selected', isSelected ? 'true' : 'false');
        this.dispatchEvent(new CustomEvent('fds-multiselect-option-change', { bubbles: true, composed: true }));
    }

    #addEventListeners() {
        this.addEventListener('click', this.#handleClick);
        this.addEventListener('keydown', this.#handleKeyDown);
        this.addEventListener('keyup', this.#handleKeyUp);
    }

    #removeEventListeners() {
        this.removeEventListener('click', this.#handleClick);
        this.removeEventListener('keydown', this.#handleKeyDown);
        this.removeEventListener('keyup', this.#handleKeyUp);
    }

    #init() {
        this.#setupHTML();

        this.setAttribute('role', 'option');
        this.setAttribute('aria-selected', this.selected ? 'true' : 'false');

        this.#addEventListeners();

        this.#initialized = true;
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
        this.#init();
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
        if (!this.#initialized) return;
        if (oldValue === newValue) return;

        switch (attribute) {
            case 'selected':
                this.#updateSelected(this.selected);
                break;
        }
    }

    // #endregion
}

function registerMultiselectOption() {
    if (!customElements.get('fds-multiselect-option')) {
        customElements.define('fds-multiselect-option', FDSMultiselectOption);
    }
}

export default registerMultiselectOption;