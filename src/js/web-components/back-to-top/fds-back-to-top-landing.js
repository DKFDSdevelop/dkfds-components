const DEFAULT_ANNOUNCEMENT = 'Viser toppen af siden';

class FDSBackToTopLanding extends HTMLElement {

    // #region - PRIVATE INSTANCE FIELDS --------------------------------------------------------------------

    #initialized = false;
    #liveRegion = null;

    // #endregion

    // #region - PRIVATE EVENT HANDLERS ---------------------------------------------------------------------

    #handleFocus = () => {
        if (this.#liveRegion) {
            this.#liveRegion.textContent = DEFAULT_ANNOUNCEMENT;
        }
    };

    #handleBlur = () => {
        if (this.#liveRegion) {
            this.#liveRegion.textContent = '';
        }
    };

    // #endregion

    // #region - PRIVATE METHODS ----------------------------------------------------------------------------

    #setupHTML() {
        let liveRegion = this.querySelector(':scope > span.sr-only[aria-live="polite"]');
        if (!liveRegion) {
            liveRegion = document.createElement('span');
            liveRegion.className = 'sr-only';
            liveRegion.setAttribute('aria-live', 'polite');
            this.appendChild(liveRegion);
        }
        liveRegion.textContent = '';
        this.#liveRegion = liveRegion;
    }

    // #endregion

    // #region - ADDED TO DOCUMENT --------------------------------------------------------------------------

    connectedCallback() {
        if (this.#initialized) return;

        if (!this.hasAttribute('tabindex')) {
            this.setAttribute('tabindex', '-1');
        }

        this.#setupHTML();
        this.addEventListener('focus', this.#handleFocus);
        this.addEventListener('blur', this.#handleBlur);

        this.#initialized = true;
    }

    // #endregion

    // #region - REMOVED FROM DOCUMENT ----------------------------------------------------------------------

    disconnectedCallback() {
        this.removeEventListener('focus', this.#handleFocus);
        this.removeEventListener('blur', this.#handleBlur);
        this.#liveRegion = null;
        this.#initialized = false;
    }

    // #endregion
}

function registerBackToTopLanding() {
    if (!customElements.get('fds-back-to-top-landing')) {
        customElements.define('fds-back-to-top-landing', FDSBackToTopLanding);
    }
}

export default registerBackToTopLanding;
