import * as CE from '../custom-element-utils';

class FDSBackToTop extends HTMLElement {

    // #region - ATTRIBUTES (can invoke attributeChangedCallback()) -----------------------------------------

    static observedAttributes = ['button-text', 'sr-text'];

    // #endregion

    // #region - GETTERS AND SETTERS ------------------------------------------------------------------------

    get buttonText() { return this.getAttribute('button-text'); }
    set buttonText(value) { value == null ? this.removeAttribute('button-text') : this.setAttribute('button-text', value); }

    get srText() { return this.getAttribute('sr-text'); }
    set srText(value) { value == null ? this.removeAttribute('sr-text') : this.setAttribute('sr-text', value); }

    // #endregion

    // #region - PRIVATE INSTANCE FIELDS --------------------------------------------------------------------

    #initialized = false;

    // #endregion

    // #region - PRIVATE EVENT HANDLERS ---------------------------------------------------------------------

    #handleClick = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // #endregion

    // #region - PRIVATE METHODS ----------------------------------------------------------------------------

    #setupHTML() {
        // --- Button ---
        const button = this.querySelector(':scope > button') ?? document.createElement('button');
        button.setAttribute('type', 'button');

        // --- Icon ---
        let icon = button.querySelector(':scope > svg.icon-svg');
        if (!icon) {
            icon = CE.createSvgIcon('M440-160v-487L216-423l-56-57 320-320 320 320-56 57-224-224v487h-80Z');
            button.appendChild(icon);
        }

        // --- Screen-reader-only text ---
        let srSpan = button.querySelector(':scope > span.sr-only');
        if (!srSpan) {
            srSpan = document.createElement('span');
            srSpan.className = 'sr-only';
            button.appendChild(srSpan);
        }
        srSpan.textContent = this.srText ?? 'Til toppen af siden';

        // --- Visible text (hidden below md breakpoint) ---
        let textSpan = button.querySelector(':scope > span.d-none');
        if (!textSpan) {
            textSpan = document.createElement('span');
            textSpan.className = 'd-none d-md-inline-block';
            textSpan.setAttribute('aria-hidden', 'true');
            button.appendChild(textSpan);
        }
        textSpan.textContent = this.buttonText ?? 'Til toppen';

        // --- Add the button if not already present ---
        if (!button.isConnected) {
            this.appendChild(button);
        }
    }

    #addEventListeners() {
        const button = this.querySelector(':scope > button');
        button?.addEventListener('click', this.#handleClick);
    }

    #removeEventListeners() {
        const button = this.querySelector(':scope > button');
        button?.removeEventListener('click', this.#handleClick);
    }

    // #endregion

    // #region - PUBLIC METHODS -----------------------------------------------------------------------------

    init() {
        if (this.#initialized) return;

        this.#setupHTML();
        this.#addEventListeners();
        this.#initialized = true;
    }

    // #endregion

    // #region - ADDED TO DOCUMENT --------------------------------------------------------------------------

    connectedCallback() {
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
        if (!this.#initialized) return;
        if (oldValue === newValue) return;

        switch (attribute) {
            case 'button-text':
                const textSpan = this.querySelector(':scope > button span.d-none');
                if (textSpan) { textSpan.textContent = newValue ?? 'Til toppen'; }
                break;

            case 'sr-text':
                const srSpan = this.querySelector(':scope > button span.sr-only');
                if (srSpan) { srSpan.textContent = newValue ?? 'Til toppen af siden'; }
                break;
        }
    }

    // #endregion
}

function registerBackToTop() {
    if (!customElements.get('fds-back-to-top')) {
        customElements.define('fds-back-to-top', FDSBackToTop);
    }
}

export default registerBackToTop;
