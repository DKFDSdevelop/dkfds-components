import { generateAndVerifyUniqueId } from '../../utils/generate-unique-id';
import { styles } from './fds-multiselect-styling';

const sheet = new CSSStyleSheet();
sheet.replaceSync(styles);

const DIALOG_LABEL = 'Vælg en eller flere muligheder';

class FDSMultiselect extends HTMLElement {

    // #region - PRIVATE INSTANCE FIELDS --------------------------------------------------------------------

    #initialized = false;
    #mutationObserver = null;

    // #endregion

    // #region - PRIVATE EVENT HANDLERS ---------------------------------------------------------------------

    #handleOpenerExpanded = () => {
        const dialog = this.shadowRoot.querySelector('.dialog');
        dialog.hidden = false;

        const options = this.querySelector('fds-multiselect-options');
        options?.focus();
    };

    #handleOpenerCollapsed = () => {
        const dialog = this.shadowRoot.querySelector('.dialog');
        dialog.hidden = true;
    };

    #handleFocusOut = (event) => {
        if (event.relatedTarget && this.contains(event.relatedTarget)) return;

        const opener = this.querySelector('fds-multiselect-opener');
        opener?.close();
    };

    #handleDialogMouseDown = (event) => {
        if (event.target.closest('fds-multiselect-option')) return;
        // Prevent closing the dialog when something else inside it than fds-multiselect-option is clicked.
        event.preventDefault(); 
    };

    #handleOptionsClose = () => {
        const opener = this.querySelector('fds-multiselect-opener');
        if (!opener) return;

        opener.close();
        opener.focus();
    };

    #handleMutations = () => {
        this.#wireRelationships();
    };

    // #endregion

    // #region - PRIVATE METHODS ----------------------------------------------------------------------------

    #wireRelationships() {
        const label = this.querySelector('label');
        const opener = this.querySelector('fds-multiselect-opener');
        const options = this.querySelector('fds-multiselect-options');

        if (opener && !opener.id) { opener.id = generateAndVerifyUniqueId('multiselect-opener'); }
        if (options && !options.id) { options.id = generateAndVerifyUniqueId('multiselect-options'); }

        if (label && opener) { label.htmlFor = opener.id; }
        if (opener && options) { opener.setAttribute('aria-controls', options.id); }

        if (options) { options.setAttribute('slot', 'options'); }

        // TODO: fds-help-text / fds-error-message -> opener.aria-describedby (once in scope).
    }

    #setupHTML() {
        if (this.shadowRoot.querySelector('.dialog')) return;

        const slot = document.createElement('slot');

        const dialog = document.createElement('div');
        dialog.classList.add('dialog');
        dialog.setAttribute('role', 'dialog');
        dialog.setAttribute('aria-label', DIALOG_LABEL);
        dialog.hidden = true;

        const optionsSlot = document.createElement('slot');
        optionsSlot.name = 'options';
        dialog.appendChild(optionsSlot);

        this.shadowRoot.append(slot, dialog);
    }

    #connectMutationObserver() {
        if (this.#mutationObserver) return;
        this.#mutationObserver = new MutationObserver(this.#handleMutations);
        this.#mutationObserver.observe(this, { childList: true, subtree: false });
    }

    #disconnectMutationObserver() {
        if (this.#mutationObserver) {
            this.#mutationObserver.disconnect();
            this.#mutationObserver = null;
        }
    }

    #addEventListeners() {
        this.addEventListener('fds-multiselect-opener-expanded', this.#handleOpenerExpanded);
        this.addEventListener('fds-multiselect-opener-collapsed', this.#handleOpenerCollapsed);
        this.addEventListener('fds-multiselect-options-close', this.#handleOptionsClose);
        this.addEventListener('focusout', this.#handleFocusOut);
        this.shadowRoot.querySelector('.dialog').addEventListener('mousedown', this.#handleDialogMouseDown);
    }

    #removeEventListeners() {
        this.removeEventListener('fds-multiselect-opener-expanded', this.#handleOpenerExpanded);
        this.removeEventListener('fds-multiselect-opener-collapsed', this.#handleOpenerCollapsed);
        this.removeEventListener('fds-multiselect-options-close', this.#handleOptionsClose);
        this.removeEventListener('focusout', this.#handleFocusOut);
        this.shadowRoot.querySelector('.dialog').removeEventListener('mousedown', this.#handleDialogMouseDown);
    }

    #init() {
        customElements.upgrade(this);

        this.#setupHTML();
        this.#wireRelationships();
        this.#addEventListeners();
        this.#connectMutationObserver();

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
        if (!this.#initialized) { this.#init(); }
    }

    // #endregion

    // #region - REMOVED FROM DOCUMENT ----------------------------------------------------------------------

    disconnectedCallback() {
        this.#removeEventListeners();
        this.#disconnectMutationObserver();
        this.#initialized = false;
    }

    // #endregion
}

function registerMultiselect() {
    if (!customElements.get('fds-multiselect')) {
        customElements.define('fds-multiselect', FDSMultiselect);
    }
}

export default registerMultiselect;