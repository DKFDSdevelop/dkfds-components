import { generateAndVerifyUniqueId } from '../../utils/generate-unique-id';
import * as CE from '../custom-element-utils';
import { styles } from './fds-multiselect-select-all-styling';

const sheet = new CSSStyleSheet();
sheet.replaceSync(styles);

class FDSMultiselectSelectAll extends HTMLElement {

    // #region - PRIVATE INSTANCE FIELDS --------------------------------------------------------------------

    #initialized = false;

    // #endregion

    // #region - PRIVATE METHODS ----------------------------------------------------------------------------

    #setupHTML() {
        if (this.shadowRoot.querySelector('.select-all-wrapper')) return;

        const wrapper = document.createElement('div');
        wrapper.classList.add('select-all-wrapper');

        const box = document.createElement('span');
        box.classList.add('select-all-box');

        const checkIcon = CE.createSvgIcon('M382-240 154-468l57-57 171 171 367-367 57 57-424 424Z');
        checkIcon.classList.add('check-icon');

        const indeterminateIcon = CE.createSvgIcon('M200-440v-80h560v80H200Z');
        indeterminateIcon.classList.add('indeterminate-icon');

        box.append(checkIcon, indeterminateIcon);

        const labelWrapper = document.createElement('span');
        labelWrapper.classList.add('select-all-label');

        const slot = document.createElement('slot');
        labelWrapper.appendChild(slot);

        wrapper.append(box, labelWrapper);
        this.shadowRoot.appendChild(wrapper);
    }

    #init() {
        this.#setupHTML();
        this.#warnIfMultipleSelectAll();

        this.setAttribute('role', 'option');
        if (!this.id) { this.id = generateAndVerifyUniqueId('multiselect-select-all'); }
        if (!this.hasAttribute('aria-checked')) {
            this.setAttribute('aria-checked', 'false');
        }

        this.#initialized = true;
    }

    #warnIfMultipleSelectAll() {
        const selectAllElements = this.parentElement?.querySelectorAll('fds-multiselect-select-all');
        if (selectAllElements.length > 1) {
            console.warn(`<fds-multiselect-options> found ${selectAllElements.length} <fds-multiselect-select-all> elements. Only one is supported; extras will still render but may cause unexpected keyboard/selection behavior.`);
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

    // #region - PUBLIC METHODS -----------------------------------------------------------------------------

    get checked() { return this.getAttribute('aria-checked') === 'true'; }

    toggle() {
        const willBeChecked = this.getAttribute('aria-checked') !== 'true';
        this.setAttribute('aria-checked', willBeChecked ? 'true' : 'false');
        this.dispatchEvent(new CustomEvent('fds-multiselect-select-all-toggled', { bubbles: true, detail: { checked: willBeChecked } }));
    }

    // Called by fds-multiselect-options
    reflectState(state) {
        this.setAttribute('aria-checked', state);
    }

    // #endregion

    // #region - ADDED TO DOCUMENT --------------------------------------------------------------------------

    connectedCallback() {
        if (!this.#initialized) { this.#init(); }
    }

    // #endregion

    // #region - REMOVED FROM DOCUMENT ----------------------------------------------------------------------

    disconnectedCallback() {
        this.#initialized = false;
    }

    // #endregion
}

function registerMultiselectSelectAll() {
    if (!customElements.get('fds-multiselect-select-all')) {
        customElements.define('fds-multiselect-select-all', FDSMultiselectSelectAll);
    }
}

export default registerMultiselectSelectAll;