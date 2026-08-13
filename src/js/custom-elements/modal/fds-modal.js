import * as CE from '../custom-element-utils';

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
    #savedTransitionHandler = null;

    // #endregion

    // #region - PRIVATE EVENT HANDLERS ---------------------------------------------------------------------

    #handleClose = () => {
        this.dialog.classList.remove('bottom-sheet-open');

        // Clean up in case the dialog closed some other way before the exit
        // transition finished (e.g. Escape interrupting a bottom sheet's animation)
        if (this.#savedTransitionHandler) {
            this.dialog.removeEventListener('transitionend', this.#savedTransitionHandler);
            this.#savedTransitionHandler = null;
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
        if (event.target !== this.dialog) return; // Ignore clicks on elements inside the dialog

        const rect = this.dialog.getBoundingClientRect();
        const clickedBackdrop = (
            event.clientX < rect.left || event.clientX > rect.right ||
            event.clientY < rect.top || event.clientY > rect.bottom
        );

        if (!clickedBackdrop) return;

        if (this.bottomSheet) {
            this.#animateClose();
        }
        else {
            this.dialog.close();
        }
    };

    #handleCloserClick = (event) => {
        if (!this.bottomSheet) return;

        event.preventDefault();
        this.#animateClose(event.detail?.returnValue);
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
        if (this.#savedTransitionHandler) return; // Already closing, ignore duplicate requests

        this.dialog.classList.remove('bottom-sheet-open');

        const handleTransitionEnd = (event) => {
            if (event.propertyName !== 'translate' || event.target !== this.dialog) return;

            this.dialog.removeEventListener('transitionend', handleTransitionEnd);
            this.#savedTransitionHandler = null;
            this.dialog.close(returnValue);
        };

        this.#savedTransitionHandler = handleTransitionEnd;
        this.dialog.addEventListener('transitionend', handleTransitionEnd);
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

        if (attribute === 'bottom-sheet') {
            if (this.#initialized && this.dialog?.open) {
                this.dialog.classList.add('bottom-sheet-open');
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
