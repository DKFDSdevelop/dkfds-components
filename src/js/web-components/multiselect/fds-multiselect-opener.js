import { generateAndVerifyUniqueId } from '../../utils/generate-unique-id';
import * as CE from '../custom-element-utils';
import { styles } from './fds-multiselect-opener-styling';

const sheet = new CSSStyleSheet();
sheet.replaceSync(styles);

const CHEVRON_CLOSED_PATH = 'M480-344 240-584l56-56 184 184 184-184 56 56-240 240Z';
const CHEVRON_OPEN_PATH = 'M480-528 296-344l-56-56 240-240 240 240-56 56-184-184Z';

class FDSMultiselectOpener extends HTMLElement {

    // #region - ATTRIBUTES (can invoke attributeChangedCallback()) -----------------------------------------

    static formAssociated = true;

    // #endregion

    // #region - PRIVATE INSTANCE FIELDS --------------------------------------------------------------------

    #initialized = false;

    // #endregion

    // #region - PRIVATE EVENT HANDLERS ---------------------------------------------------------------------

    #handleClick = () => {
        this.toggle();
    };

    #handleKeyDown = (event) => {
        switch (event.key) {
            case 'Enter':
            case ' ':
                event.preventDefault();
                this.toggle();
                break;

            case 'ArrowDown':
            case 'ArrowUp':
                event.preventDefault();
                this.open();
                break;
        }
    };

    // #endregion

    // #region - PRIVATE METHODS ----------------------------------------------------------------------------

    #setChevronPath(path) {
        const chevronPath = this.shadowRoot.querySelector('.chevron-icon path');
        if (chevronPath) { chevronPath.setAttribute('d', path); }
    }

    #setupHTML() {
        if (this.shadowRoot.querySelector('slot')) return;

        const openerText = document.createElement('span');
        openerText.classList.add('opener-text');

        // Create unnamed slot for the "placeholder" text in fds-multiselect-opener
        const slot = document.createElement('slot');
        openerText.appendChild(slot);

        this.shadowRoot.appendChild(openerText);

        // Create a screen reader message announcing selected options
        const selectedOptionsText = document.createElement('span');
        selectedOptionsText.classList.add('selected-options-text', 'sr-only');
        this.shadowRoot.appendChild(selectedOptionsText);

        const chevronIcon = CE.createSvgIcon(CHEVRON_CLOSED_PATH);
        chevronIcon.classList.add('chevron-icon');
        this.shadowRoot.appendChild(chevronIcon);
    }

    #addEventListeners() {
        this.addEventListener('click', this.#handleClick);
        this.addEventListener('keydown', this.#handleKeyDown);
    }

    #removeEventListeners() {
        this.removeEventListener('click', this.#handleClick);
        this.removeEventListener('keydown', this.#handleKeyDown);
    }

    #init() {
        this.#setupHTML();

        this.setAttribute('role', 'combobox');
        this.setAttribute('aria-haspopup', 'dialog');
        this.setAttribute('aria-expanded', 'false');
        this.tabIndex = 0;
        if (!this.id) { this.id = generateAndVerifyUniqueId('multiselect-opener'); }

        this.#addEventListeners();
        this.refreshOpener();
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

    get expanded() { return this.getAttribute('aria-expanded') === 'true'; }

    open() {
        if (this.expanded) return;
        this.setAttribute('aria-expanded', 'true');
        this.#setChevronPath(CHEVRON_OPEN_PATH);
        this.dispatchEvent(new CustomEvent('fds-multiselect-opener-expanded', { bubbles: true }));
    }

    close() {
        if (!this.expanded) return;
        this.setAttribute('aria-expanded', 'false');
        this.#setChevronPath(CHEVRON_CLOSED_PATH);
        this.dispatchEvent(new CustomEvent('fds-multiselect-opener-collapsed', { bubbles: true }));
    }

    toggle() {
        this.expanded ? this.close() : this.open();
    }

    refreshOpener() {
        const multiselect = this.closest('fds-multiselect');
        const tags = multiselect?.shadowRoot?.querySelectorAll('.tags .tag') ?? [];

        // Extract label text from each tag
        const selectedLabels = [];
        for (const tag of tags) {
            const labelText = tag.querySelector('.tag-label')?.textContent.trim();

            if (labelText) {
                selectedLabels.push(labelText);
            }
        }

        // Update the selected options text for screen readers
        const selectedOptionsText = this.shadowRoot.querySelector('.selected-options-text');
        selectedOptionsText.textContent = selectedLabels.join(', ');

        // Hide the opener's placeholder text from screen readers when options have been selected
        const openerText = this.shadowRoot.querySelector('.opener-text');
        if (selectedLabels.length > 0) {
            openerText.setAttribute('aria-hidden', 'true');
        }
        else {
            openerText.removeAttribute('aria-hidden');
        }
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
}

function registerMultiselectOpener() {
    if (!customElements.get('fds-multiselect-opener')) {
        customElements.define('fds-multiselect-opener', FDSMultiselectOpener);
    }
}

export default registerMultiselectOpener;