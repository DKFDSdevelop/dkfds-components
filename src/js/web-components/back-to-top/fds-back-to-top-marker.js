import * as CE from '../custom-element-utils';

class FDSBackToTopMarker extends HTMLElement {

    // #region - ATTRIBUTES (can invoke attributeChangedCallback()) -----------------------------------------

    static observedAttributes = ['attr', 'ready'];

    // #endregion

    // #region - GETTERS AND SETTERS ------------------------------------------------------------------------

    get attr() { return this.getAttribute('attr'); }
    set attr(value) { value == null ? this.removeAttribute('attr') : this.setAttribute('attr', value); }

    get ready() { return this.getAttribute('ready') !== 'false'; }
    set ready(value) { this.setAttribute('ready', value ? 'true' : 'false'); }

    // #endregion

    // #region - PRIVATE INSTANCE FIELDS --------------------------------------------------------------------

    #initialized = false;
    #mutationObserver = null;

    // #endregion

    // #region - PRIVATE EVENT HANDLERS ---------------------------------------------------------------------

    #handleClick = (event) => {
        console.log('Click event:', event);
    };

    #handleKeyDown = (event) => {
        console.log('KeyDown event:', event);
    };

    #handleMutations = (records) => {
        for (const { attributeName, target, addedNodes, removedNodes } of records) {
            console.log('attributeName', attributeName);
            console.log('target', target);
            console.log('addedNodes', addedNodes);
            console.log('removedNodes', removedNodes);
        }
    };

    // #endregion

    // #region - PRIVATE METHODS ----------------------------------------------------------------------------

    #setupHTML() {
        // --- Button ---
        let button = this.querySelector(':scope > button');
        if (!button) {
            button = document.createElement('button');
            this.appendChild(button);
        }
        button.textContent = 'Click me';
    }

    #addEventListeners() {
        const button = this.querySelector(':scope > button');
        button?.addEventListener('click', this.#handleClick);
        button?.addEventListener('keydown', this.#handleKeyDown);
    }

    #removeEventListeners() {
        const button = this.querySelector(':scope > button');
        button?.removeEventListener('click', this.#handleClick);
        button?.removeEventListener('keydown', this.#handleKeyDown);
    }

    #connectMutationObserver(config = CE.mutationObserverConfig) {
        if (this.#mutationObserver) return;
        this.#mutationObserver = new MutationObserver(this.#handleMutations);
        this.#mutationObserver.observe(this, config);
    }

    #disconnectMutationObserver() {
        if (this.#mutationObserver) {
            this.#mutationObserver.disconnect();
            this.#mutationObserver = null;
        }
    }

    // #endregion

    // #region - PUBLIC METHODS -----------------------------------------------------------------------------

    init() {
        if (this.#initialized) return;

        this.#setupHTML();
        this.#addEventListeners();
        this.#connectMutationObserver(); // Connected after setup so our own DOM changes aren't observed
        this.#initialized = true;
    }

    // #endregion

    // #region - ADDED TO DOCUMENT --------------------------------------------------------------------------

    connectedCallback() {
        // The 'ready' attribute can be used to defer initialization, e.g. until child content is available.
        // Omit the attribute or set it to anything other than 'false' to initialize immediately.
        if (this.getAttribute('ready') === 'false') return;

        this.init();
    }

    // #endregion

    // #region - REMOVED FROM DOCUMENT ----------------------------------------------------------------------

    disconnectedCallback() {
        this.#removeEventListeners();
        this.#disconnectMutationObserver();
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
            case 'attr':
                console.log('attr changed to', newValue);
                break;
        }
    }

    // #endregion
}

function registerBackToTopMarker() {
    if (!customElements.get('fds-back-to-top-marker')) {
        customElements.define('fds-back-to-top-marker', FDSBackToTopMarker);
    }
}

export default registerBackToTopMarker;
