class FDSModal extends HTMLElement {

    // #region - ATTRIBUTES (can invoke attributeChangedCallback()) -----------------------------------------

    static observedAttributes = ['ready', 'dismissible', 'bottom-sheet'];

    // #endregion

    // #region - GETTERS AND SETTERS ------------------------------------------------------------------------

    get ready() { return this.getAttribute('ready') !== 'false'; }
    set ready(value) { this.setAttribute('ready', value ? 'true' : 'false'); }

    get dismissible() { return this.getAttribute('dismissible') !== 'false'; }
    set dismissible(value) { this.setAttribute('dismissible', value ? 'true' : 'false'); }

    get bottomSheet() { return this.hasAttribute('bottom-sheet'); }
    set bottomSheet(value) { value ? this.setAttribute('bottom-sheet', '') : this.removeAttribute('bottom-sheet'); }

    get dialog() { return this.querySelector('dialog'); }

    // #endregion

    // #region - PRIVATE INSTANCE FIELDS --------------------------------------------------------------------

    #initialized = false;
    #closing = false;
    #storedReturnValue = undefined;

    // #endregion

    // #region - PRIVATE EVENT HANDLERS ---------------------------------------------------------------------

    #handleClose = () => {
        this.dialog.classList.remove('bottom-sheet-open');

        // Clean up in case the dialog closed some other way before the exit
        // transition finished (e.g. Escape interrupting a bottom sheet's animation)
        if (this.#closing) {
            this.dialog.removeEventListener('transitionend', this.#handleTransitionEnd);
            this.#closing = false;
            this.#storedReturnValue = undefined;
        }

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

        // Using the keyboard to interact with modal content can register as clicks outside the dialog.
        // Ignore these events by ensuring the event target is the dialog.
        if (event.target !== this.dialog) return;

        const rect = this.dialog.getBoundingClientRect();
        const clickedBackdrop = (
            event.clientX < rect.left || event.clientX > rect.right ||
            event.clientY < rect.top || event.clientY > rect.bottom
        );

        if (!clickedBackdrop) return;

        if (this.bottomSheet) {
            this.#animateClose('');
        }
        else {
            this.dialog.close('');
        }
    };

    #handleCloserClick = (event) => {
        if (!this.bottomSheet) return;

        event.preventDefault();
        this.#animateClose(event.detail?.returnValue);
    };

    #handleTransitionEnd = (event) => {
        if (event.propertyName !== 'translate' || event.target !== this.dialog) return;

        this.dialog.removeEventListener('transitionend', this.#handleTransitionEnd);
        this.#closing = false;
        this.dialog.close(this.#storedReturnValue);
        this.#storedReturnValue = undefined;
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

    #animateClose(returnValue) {
        if (this.#closing) return; // Already closing, ignore duplicate requests

        this.dialog.classList.remove('bottom-sheet-open');
        this.#closing = true;
        this.#storedReturnValue = returnValue;
        this.dialog.addEventListener('transitionend', this.#handleTransitionEnd);
    }

    #addEventListeners() {
        this.dialog?.addEventListener('close', this.#handleClose);
        this.dialog?.addEventListener('cancel', this.#handleCancel);
        this.dialog?.addEventListener('click', this.#handleBackdropClick);
        this.addEventListener('fds-modal-closer-click', this.#handleCloserClick);
    }

    #removeEventListeners() {
        this.dialog?.removeEventListener('close', this.#handleClose);
        this.dialog?.removeEventListener('cancel', this.#handleCancel);
        this.dialog?.removeEventListener('click', this.#handleBackdropClick);
        this.removeEventListener('fds-modal-closer-click', this.#handleCloserClick);
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

        if (this.#closing) {
            this.dialog?.removeEventListener('transitionend', this.#handleTransitionEnd);
            this.#closing = false;
            this.#storedReturnValue = undefined;
        }

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

        if (!this.#initialized) return;
        if (oldValue === newValue) return;

        switch (attribute) {
            case 'dismissible':
                this.#updateClosedBy();
                break;

            case 'bottom-sheet':
                if (this.dialog?.open) {
                    this.dialog.classList.add('bottom-sheet-open');
                }
                break;
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
