import { styles } from './fds-multiselect-styling';

const sheet = new CSSStyleSheet();
sheet.replaceSync(styles);

class FDSMultiselect extends HTMLElement {

    // #region - PRIVATE INSTANCE FIELDS --------------------------------------------------------------------

    #initialized = false;

    // #endregion

    // #region - PRIVATE EVENT HANDLERS ---------------------------------------------------------------------

    #handleOpenerClick = () => {
        this.toggle();
    };

    #handleLabelClick = (event) => {
        event.preventDefault();
        this.shadowRoot.querySelector('.opener').focus();
    };

    #handleOptionChange = () => {
        this.#updateOpenerText();
    };

    // #endregion

    // #region - PRIVATE METHODS ----------------------------------------------------------------------------

    #updateOpenerText() {
        const opener = this.shadowRoot.querySelector('.opener');
        const selectedOptions = this.querySelectorAll('fds-multiselect-option[selected]');

        if (selectedOptions.length === 0) {
            opener.textContent = 'Vælg en eller flere';
            return;
        }

        const labels = Array.from(selectedOptions).map((option) => option.textContent.trim());
        opener.textContent = labels.join(', ');
    }

    #setupHTML() {
        if (this.shadowRoot.querySelector('.opener')) return;

        const label = document.createElement('label');
        label.classList.add('opener-label');
        label.setAttribute('for', 'opener');
        label.textContent = 'Vælg frugter';

        const opener = document.createElement('button');
        opener.id = 'opener';
        opener.classList.add('opener');
        opener.setAttribute('type', 'button');
        opener.setAttribute('role', 'combobox');
        opener.setAttribute('aria-haspopup', 'listbox');
        opener.setAttribute('aria-expanded', 'false');
        opener.setAttribute('aria-controls', 'listbox');
        opener.textContent = 'Vælg en eller flere';

        const popup = document.createElement('div');
        popup.classList.add('popup');
        popup.hidden = true;

        const listbox = document.createElement('div');
        listbox.id = 'listbox';
        listbox.classList.add('listbox');
        listbox.setAttribute('role', 'listbox');
        listbox.setAttribute('aria-multiselectable', 'true');
        listbox.appendChild(document.createElement('slot'));

        popup.append(listbox);

        const field = document.createElement('div');
        field.classList.add('field');
        field.append(opener, popup);

        this.shadowRoot.append(label, field);
    }

    #addEventListeners() {
        this.shadowRoot.querySelector('.opener').addEventListener('click', this.#handleOpenerClick);
        this.shadowRoot.querySelector('.opener-label').addEventListener('click', this.#handleLabelClick);
        this.addEventListener('fds-multiselect-option-change', this.#handleOptionChange);
    }

    #removeEventListeners() {
        this.shadowRoot.querySelector('.opener').removeEventListener('click', this.#handleOpenerClick);
        this.shadowRoot.querySelector('.opener-label').removeEventListener('click', this.#handleLabelClick);
        this.removeEventListener('fds-multiselect-option-change', this.#handleOptionChange);
    }

    #init() {
        this.#setupHTML();
        this.#addEventListeners();
        this.#updateOpenerText();

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

    // #region - PUBLIC METHODS -----------------------------------------------------------------------------

    open() {
        if (!this.#initialized) return;

        const opener = this.shadowRoot.querySelector('.opener');
        const popup = this.shadowRoot.querySelector('.popup');

        opener.setAttribute('aria-expanded', 'true');
        popup.hidden = false;
    }

    close() {
        if (!this.#initialized) return;

        const opener = this.shadowRoot.querySelector('.opener');
        const popup = this.shadowRoot.querySelector('.popup');

        opener.setAttribute('aria-expanded', 'false');
        popup.hidden = true;
    }

    toggle() {
        if (!this.#initialized) return;

        const opener = this.shadowRoot.querySelector('.opener');
        const isOpen = opener.getAttribute('aria-expanded') === 'true';

        isOpen ? this.close() : this.open();
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
    }

    // #endregion
}

function registerMultiselect() {
    if (!customElements.get('fds-multiselect')) {
        customElements.define('fds-multiselect', FDSMultiselect);
    }
}

export default registerMultiselect;