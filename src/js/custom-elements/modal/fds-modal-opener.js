import * as CE from '../custom-element-utils';

class FDSModalOpener extends HTMLElement {

    // #region - ATTRIBUTES (can invoke attributeChangedCallback()) -----------------------------------------

    static observedAttributes = ['dialog-id', 'ready'];

    // #endregion

    // #region - GETTERS AND SETTERS ------------------------------------------------------------------------

    get dialogId() { return this.getAttribute('dialog-id'); }
    set dialogId(value) { value == null ? this.removeAttribute('dialog-id') : this.setAttribute('dialog-id', value); }

    get ready() { return this.getAttribute('ready') !== 'false'; }
    set ready(value) { this.setAttribute('ready', value ? 'true' : 'false'); }

    // #endregion

    // #region - PRIVATE INSTANCE FIELDS --------------------------------------------------------------------

    #initialized = false;

    // #endregion

    // #region - PRIVATE EVENT HANDLERS ---------------------------------------------------------------------

    #handleClick = () => {
        const dialog = document.getElementById(this.dialogId);
        if (!dialog) return;

        dialog.showModal();
        this.dispatchEvent(new CustomEvent('fds-modal-open', {
            bubbles: true,
            detail: { dialogId: this.dialogId },
        }));
    };

    // #endregion

    // #region - PRIVATE METHODS ----------------------------------------------------------------------------

    #setupHTML() {
        const opener = this.firstElementChild;
        if (opener?.tagName === 'BUTTON' || (opener?.tagName === 'INPUT' && opener.type === 'button')) {
            opener.setAttribute('aria-haspopup', 'dialog');
        }
    }

    #addEventListeners() {
        this.firstElementChild?.addEventListener('click', this.#handleClick);
    }

    #removeEventListeners() {
        this.firstElementChild?.removeEventListener('click', this.#handleClick);
    }

    // #endregion

    // #region - PUBLIC METHODS -----------------------------------------------------------------------------

    init() {
        this.#setupHTML();
        this.#addEventListeners();
        this.#initialized = true;
    }

    // #endregion

    // #region - ADDED TO DOCUMENT --------------------------------------------------------------------------

    connectedCallback() {
        if (this.getAttribute('ready') === 'false') return;
        this.init();
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
        if (attribute === 'ready') {
            if (!this.#initialized && this.isConnected && newValue !== 'false') {
                this.init();
            }
            return;
        }
    }

    // #endregion
}

function registerModalOpener() {
    if (!customElements.get('fds-modal-opener')) {
        customElements.define('fds-modal-opener', FDSModalOpener);
    }
}

export default registerModalOpener;
