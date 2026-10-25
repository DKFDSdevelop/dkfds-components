import { generateAndVerifyUniqueId } from '../../utils/generate-unique-id';
import * as CE from '../custom-element-utils';
import { styles } from './fds-multiselect-dialog-styling';

const sheet = new CSSStyleSheet();
sheet.replaceSync(styles);

const DEFAULT_HEADING = 'Vælg en eller flere muligheder';

class FDSMultiselectDialog extends HTMLElement {

    // #region - ATTRIBUTES (can invoke attributeChangedCallback()) -----------------------------------------

    static observedAttributes = ['sr-heading', 'select-all'];

    // #endregion

    // #region - GETTERS AND SETTERS ------------------------------------------------------------------------

    get srHeading() { return this.getAttribute('sr-heading') ?? DEFAULT_HEADING; }
    set srHeading(value) { value == null ? this.removeAttribute('sr-heading') : this.setAttribute('sr-heading', value); }

    get selectAll() { return this.hasAttribute('select-all'); }
    set selectAll(value) { value ? this.setAttribute('select-all', '') : this.removeAttribute('select-all'); }

    // #endregion

    // #region - PRIVATE INSTANCE FIELDS --------------------------------------------------------------------

    #initialized = false;

    // #endregion

    // #region - PRIVATE EVENT HANDLERS ---------------------------------------------------------------------

    #handleMouseDown = (event) => {
        const dialogHit = event.composedPath()[0] === this;

        const selectAllHit = event.composedPath()[0].closest('.select-all');

        if (dialogHit || selectAllHit) {
            // Prevent closing the dialog when something else inside it is clicked.
            event.preventDefault();
            return;
        }
    };

    #handleKeyDown = (event) => {
        if (event.key === 'ArrowUp') {
            event.preventDefault();
            return;
        }

        const isTabForward = event.key === 'Tab' && !event.shiftKey;
        if (event.key !== 'ArrowDown' && !isTabForward) return;

        event.preventDefault();
        this.#focusOptions();
    };

    #handleSelectAllChange = (event) => {
        const shouldSelectAll = event.target.checked;

        for (const option of this.querySelectorAll('fds-multiselect-option')) {
            if (option.selected !== shouldSelectAll) { option.toggle(); }
        }

        this.#updateSelectAllState();
    };

    #handleOptionSelectedOrDeselected = () => {
        this.#updateSelectAllState();
    };

    // #endregion

    // #region - PRIVATE METHODS ----------------------------------------------------------------------------

    #focusOptions() {
        const options = this.querySelector('fds-multiselect-options');
        if (!options) return;

        options.focus({ preventScroll: true });
        options.querySelector('[data-active]')?.scrollIntoView({ block: 'nearest' });
    }

    #setupHTML() {
        if (this.shadowRoot.querySelector('slot')) return;

        const slot = document.createElement('slot');
        this.shadowRoot.appendChild(slot);
    }

    #updateSelectAllCheckbox() {
        let wrapper = this.shadowRoot.querySelector('.select-all');

        if (!this.selectAll) {
            wrapper?.remove();
            return;
        }

        if (!wrapper) {
            wrapper = document.createElement('div');
            wrapper.classList.add('select-all');

            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.classList.add('select-all-checkbox');
            const checkboxId = generateAndVerifyUniqueId('select-all-checkbox');
            checkbox.id = checkboxId;
            // Attached here so the listener is correctly wired even if the checkbox is (re)created later.
            checkbox.addEventListener('change', this.#handleSelectAllChange);

            const box = document.createElement('span');
            box.classList.add('select-all-box');

            const checkIcon = CE.createSvgIcon('M382-240 154-468l57-57 171 171 367-367 57 57-424 424Z');
            checkIcon.classList.add('check-icon');

            const indeterminateIcon = CE.createSvgIcon('M200-440v-80h560v80H200Z');
            indeterminateIcon.classList.add('indeterminate-icon');

            box.append(checkIcon, indeterminateIcon);

            const label = document.createElement('label');
            label.htmlFor = checkboxId;
            label.classList.add('select-all-label');

            const text = document.createElement('span');
            text.textContent = 'Vælg alle';

            label.append(box, text);
            wrapper.append(checkbox, label);
            // Attached here so the listener is correctly wired even if the checkbox is (re)created later.
            wrapper.addEventListener('keydown', this.#handleKeyDown);

            this.shadowRoot.insertBefore(wrapper, this.shadowRoot.querySelector('slot'));
        }

        this.#updateSelectAllState();
    }

    #updateSelectAllState() {
        const checkbox = this.shadowRoot.querySelector('.select-all-checkbox');
        if (!checkbox) return;

        const options = Array.from(this.querySelectorAll('fds-multiselect-option'));
        const total = options.length;
        const selectedCount = options.filter(option => option.selected).length;

        checkbox.checked = total > 0 && selectedCount === total;
        checkbox.indeterminate = selectedCount > 0 && selectedCount < total;
    }

    #addEventListeners() {
        this.addEventListener('mousedown', this.#handleMouseDown);
        this.addEventListener('fds-multiselect-option-selected', this.#handleOptionSelectedOrDeselected);
        this.addEventListener('fds-multiselect-option-deselected', this.#handleOptionSelectedOrDeselected);
    }

    #removeEventListeners() {
        this.removeEventListener('mousedown', this.#handleMouseDown);
        this.removeEventListener('fds-multiselect-option-selected', this.#handleOptionSelectedOrDeselected);
        this.removeEventListener('fds-multiselect-option-deselected', this.#handleOptionSelectedOrDeselected);
    }

    #init() {
        this.#setupHTML();
        this.#updateSelectAllCheckbox();

        this.setAttribute('role', 'dialog');
        this.setAttribute('aria-label', this.srHeading);
        if (!this.id) { this.id = generateAndVerifyUniqueId('multiselect-dialog'); }
        this.hidden = true;

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

    // #region - PUBLIC METHODS -----------------------------------------------------------------------------

    open() {
        if (!this.hidden) return;
        this.hidden = false;
        this.#updateSelectAllState();
    }

    close() {
        if (this.hidden) return;
        this.hidden = true;
    }

    focusSelectAllCheckbox() {
        const checkbox = this.shadowRoot.querySelector('.select-all-checkbox');
        if (!checkbox) return;

        checkbox.focus({ preventScroll: true });
        checkbox.scrollIntoView({ block: 'nearest' });
    }

    // #endregion

    // #region - ADDED TO DOCUMENT --------------------------------------------------------------------------

    connectedCallback() {
        if (!this.#initialized) { this.#init(); }
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

            case 'sr-heading':
                this.setAttribute('aria-label', this.srHeading);
                break;

            case 'select-all':
                this.#updateSelectAllCheckbox();
                break;
        }
    }

    // #endregion
}

function registerMultiselectDialog() {
    if (!customElements.get('fds-multiselect-dialog')) {
        customElements.define('fds-multiselect-dialog', FDSMultiselectDialog);
    }
}

export default registerMultiselectDialog;