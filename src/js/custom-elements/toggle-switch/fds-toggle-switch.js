import * as CE from '../custom-element-utils';

const styles = `
    :host {
        display: block;
    }
`;

const sheet = new CSSStyleSheet();
sheet.replaceSync(styles);

class FDSToggleSwitch extends HTMLElement {

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
        // --- Slot ---
        if (!this.shadowRoot.querySelector('slot[name="element-slot"]')) {
            const slot = document.createElement('slot');
            slot.name = 'element-slot';
            this.shadowRoot.appendChild(slot);
        }

        // --- Button ---
        let button = this.shadowRoot.querySelector('button');
        if (!button) {
            button = document.createElement('button');
            this.shadowRoot.appendChild(button);
        }
        button.textContent = 'Click me';
    }

    #addEventListeners() {
        this.shadowRoot.querySelector('button').addEventListener('click', this.#handleClick);
        this.shadowRoot.querySelector('button').addEventListener('keydown', this.#handleKeyDown);
    }

    #removeEventListeners() {
        this.shadowRoot.querySelector('button').removeEventListener('click', this.#handleClick);
        this.shadowRoot.querySelector('button').removeEventListener('keydown', this.#handleKeyDown);
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

    // #region - CONSTRUCTOR (do not access or add attributes in the constructor) ---------------------------

    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.adoptedStyleSheets = [sheet];
    }

    // #endregion

    // #region - PUBLIC METHODS -----------------------------------------------------------------------------

    init() {
        this.#setupHTML();
        this.#addEventListeners();
        this.#connectMutationObserver();
        this.#initialized = true;
    }

    // #endregion

    // #region - ADDED TO DOCUMENT --------------------------------------------------------------------------

    connectedCallback() {
        // The 'ready' attribute can be used to defer initialization.
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

function registerToggleSwitch() {
    if (!customElements.get('fds-toggle-switch')) {
        customElements.define('fds-toggle-switch', FDSToggleSwitch);
    }
}

export default registerToggleSwitch;