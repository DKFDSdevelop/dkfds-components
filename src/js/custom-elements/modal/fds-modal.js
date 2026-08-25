class FDSModal extends HTMLElement {

    // #region - ATTRIBUTES (can invoke attributeChangedCallback()) -----------------------------------------

    static observedAttributes = ['ready', 'dismissible', 'variant'];

    // #endregion

    // #region - GETTERS AND SETTERS ------------------------------------------------------------------------

    get ready() { return this.getAttribute('ready') !== 'false'; }
    set ready(value) { this.setAttribute('ready', value ? 'true' : 'false'); }

    get dismissible() { return this.getAttribute('dismissible') !== 'false'; }
    set dismissible(value) { this.setAttribute('dismissible', value ? 'true' : 'false'); }

    get variant() { return this.getAttribute('variant') ?? 'default'; }
    set variant(value) { value == null ? this.removeAttribute('variant') : this.setAttribute('variant', value); }

    get dialog() { return this.querySelector('dialog'); }

    // #endregion

    // #region - PRIVATE INSTANCE FIELDS --------------------------------------------------------------------

    #initialized = false;
    #closing = false;
    #storedReturnValue = undefined;
    #resizeObserver = null;

    // #endregion

    // #region - PRIVATE EVENT HANDLERS ---------------------------------------------------------------------

    #handleClose = () => {
        if (this.#isAnimatedVariant()) {
            this.dialog.classList.remove(`${this.variant}-open`);
        }

        // Clean up in case the dialog closed some other way before the exit
        // transition finished (e.g. Escape interrupting a bottom sheet's/drawer's animation)
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

        if (this.#isAnimatedVariant()) {
            this.#animateClose('');
        }
        else {
            this.dialog.close('');
        }
    };

    #handleCloserClick = (event) => {
        if (!this.#isAnimatedVariant()) return;

        event.preventDefault();
        this.#animateClose(event.detail?.returnValue);
    };

    // Close the modal when a nested fds-modal-opener is clicked
    #handleNestedOpenerClick = () => {
        if (this.#isAnimatedVariant()) {
            this.#animateClose('');
        }
        else {
            this.dialog.close('');
        }
    };

    #handleTransitionEnd = (event) => {
        if (event.propertyName !== 'translate' || event.target !== this.dialog) return;

        this.dialog.removeEventListener('transitionend', this.#handleTransitionEnd);
        this.#closing = false;
        this.dialog.close(this.#storedReturnValue);
        this.#storedReturnValue = undefined;
    };

    #handleBottomFade = () => {
        const scrollableArea = this.dialog?.querySelector('.scrollable-area.has-fade');
        if (!scrollableArea) return;

        const distanceFromBottom = scrollableArea.scrollHeight - scrollableArea.scrollTop - scrollableArea.clientHeight;
        const atBottom = distanceFromBottom <= 1; // 1 used instead of 0 for a small tolerance margin

        atBottom ? scrollableArea.setAttribute('data-at-bottom', '') : scrollableArea.removeAttribute('data-at-bottom');
    };

    #handleResize = (entries) => {
        for (const entry of entries) {
            // Close the modal if a resize caused it to get hidden
            if (entry.target === this) {
                const style = window.getComputedStyle(entry.target);
                const isVisible = style.display !== 'none';
                if (!isVisible) {
                    this.#forceClose();
                }
            }
            // Scrollable areas with a fade effect might need an attribute update on resize
            else {
                this.#handleBottomFade();
            }
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

    #isAnimatedVariant() {
        return this.variant === 'bottom-sheet' || this.variant === 'drawer';
    }

    #animateClose(returnValue) {
        if (this.#closing) return; // Already closing, ignore duplicate requests

        this.dialog.classList.remove(`${this.variant}-open`);
        this.#closing = true;
        this.#storedReturnValue = returnValue;
        this.dialog.addEventListener('transitionend', this.#handleTransitionEnd);
    }

    // Closes the dialog immediately, bypassing dismissible and skipping any exit transition
    #forceClose() {
        if (!this.dialog?.open) return;

        if (this.#closing) {
            this.dialog.removeEventListener('transitionend', this.#handleTransitionEnd);
            this.#closing = false;
            this.#storedReturnValue = undefined;
        }

        if (this.#isAnimatedVariant()) {
            this.dialog.classList.remove(`${this.variant}-open`);
        }

        this.dialog.close();
    }

    #addEventListeners() {
        this.dialog?.addEventListener('close', this.#handleClose);
        this.dialog?.addEventListener('cancel', this.#handleCancel);
        this.dialog?.addEventListener('click', this.#handleBackdropClick);
        this.dialog?.querySelector('.scrollable-area.has-fade')?.addEventListener('scroll', this.#handleBottomFade);
        this.addEventListener('fds-modal-closer-click', this.#handleCloserClick);
        this.addEventListener('fds-modal-opener-click', this.#handleNestedOpenerClick);
    }

    #removeEventListeners() {
        this.dialog?.removeEventListener('close', this.#handleClose);
        this.dialog?.removeEventListener('cancel', this.#handleCancel);
        this.dialog?.removeEventListener('click', this.#handleBackdropClick);
        this.dialog?.querySelector('.scrollable-area.has-fade')?.removeEventListener('scroll', this.#handleBottomFade);
        this.removeEventListener('fds-modal-closer-click', this.#handleCloserClick);
        this.removeEventListener('fds-modal-opener-click', this.#handleNestedOpenerClick);
    }

    #connectResizeObserver() {
        if (this.#resizeObserver) return;

        this.#resizeObserver = new ResizeObserver(this.#handleResize);
        this.#resizeObserver.observe(this);

        const scrollableArea = this.dialog?.querySelector('.scrollable-area.has-fade');
        if (scrollableArea) {
            this.#resizeObserver.observe(scrollableArea);
        }
    }

    #disconnectResizeObserver() {
        if (this.#resizeObserver) {
            this.#resizeObserver.disconnect();
            this.#resizeObserver = null;
        }
    }

    // #endregion

    // #region - PUBLIC METHODS -----------------------------------------------------------------------------

    init() {
        this.#updateClosedBy();
        this.#addEventListeners();
        this.#connectResizeObserver();
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
        this.#disconnectResizeObserver();

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

            case 'variant':
                this.dialog?.classList.remove('bottom-sheet-open', 'drawer-open');
                if (this.dialog?.open && this.#isAnimatedVariant()) {
                    this.dialog.classList.add(`${this.variant}-open`);
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
