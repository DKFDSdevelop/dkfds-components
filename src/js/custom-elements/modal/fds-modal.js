import * as CE from '../custom-element-utils';

class FDSModal extends HTMLElement {

    // #region - ATTRIBUTES (can invoke attributeChangedCallback()) -----------------------------------------

    static observedAttributes = ['ready', 'dismissible'];

    // #endregion

    // #region - GETTERS AND SETTERS ------------------------------------------------------------------------

    get ready() { return this.getAttribute('ready') !== 'false'; }
    set ready(value) { this.setAttribute('ready', value ? 'true' : 'false'); }

    get dismissible() { return this.getAttribute('dismissible') !== 'false'; }
    set dismissible(value) { this.setAttribute('dismissible', value ? 'true' : 'false'); }

    get dialog() { return this.querySelector('dialog'); }

    // #endregion

    // #region - PRIVATE INSTANCE FIELDS --------------------------------------------------------------------

    #initialized = false;

    // #endregion

    // #region - PRIVATE EVENT HANDLERS ---------------------------------------------------------------------

    #handleClose = () => {
        this.dispatchEvent(new CustomEvent('fds-modal-close', {
            bubbles: true,
            detail: { returnValue: this.dialog.returnValue },
        }));
    };

    // Blocks Escape/back button/requestClose() when not dismissible (Safari)
    #handleCancel = (event) => {
        if (!this.dismissible) {
            event.preventDefault();
        }
    };

    #handleBackdropClick = (event) => {
        if (!this.dismissible) return;
        if (event.target !== this.dialog) return;

        const rect = this.dialog.getBoundingClientRect();
        const clickedOutside = (
            event.clientX < rect.left || event.clientX > rect.right ||
            event.clientY < rect.top || event.clientY > rect.bottom
        );

        if (clickedOutside) {
            this.dialog.close();
        }
    };

    // #endregion

    // #region - PRIVATE METHODS ----------------------------------------------------------------------------

    // Sets closedby="none" when not dismissible (Chrome/Firefox). Not supported in Safari.
    #updateClosedBy() {
        if (!this.dialog) return;

        if (this.dismissible) {
            this.dialog.removeAttribute('closedby');
        }
        else {
            this.dialog.setAttribute('closedby', 'none');
        }
    }

    #addEventListeners() {
        this.dialog?.addEventListener('close', this.#handleClose);
        this.dialog?.addEventListener('cancel', this.#handleCancel);
        this.dialog?.addEventListener('click', this.#handleBackdropClick);
    }

    #removeEventListeners() {
        this.dialog?.removeEventListener('close', this.#handleClose);
        this.dialog?.removeEventListener('cancel', this.#handleCancel);
        this.dialog?.removeEventListener('click', this.#handleBackdropClick);
    }

    // #endregion

    // #region - PUBLIC METHODS -----------------------------------------------------------------------------

    init() {
        this.#updateClosedBy();
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

        if (attribute === 'dismissible') {
            if (this.#initialized) {
                this.#updateClosedBy();
            }
            return;
        }
    }

    // #endregion
}

function registerModal() {
    if (!customElements.get('fds-modal')) {
        customElements.define('fds-modal', FDSModal);
    }
}

export default registerModal;
