import * as CE from '../custom-element-utils';

class FDSDrawerOpener extends HTMLElement {

    // #region - ATTRIBUTES (can invoke attributeChangedCallback()) -----------------------------------------

    static observedAttributes = ['drawer', 'button-text'];

    // #endregion

    // #region - PRIVATE INSTANCE FIELDS --------------------------------------------------------------------

    #initialized = false;

    // #endregion

    // #region - PRIVATE EVENT HANDLERS ---------------------------------------------------------------------

    #handleClick = () => {
        document.getElementById(this.getAttribute('drawer'))?.open();
    }

    // #endregion

    // #region - PRIVATE METHODS ----------------------------------------------------------------------------

    #setupHTML() {
        let button = this.querySelector('button');

        if (!button) {
            button = document.createElement('button');
            this.appendChild(button);

            const svg = CE.createSvgIcon("M120-240v-80h720v80H120Zm0-200v-80h720v80H120Zm0-200v-80h720v80H120Z");
            button.appendChild(svg);

            const text = document.createElement('span');
            text.textContent = this.getAttribute('button-text') || 'Menu';
            button.appendChild(text);
        }
        button.setAttribute('type', 'button');
        button.setAttribute('aria-haspopup', 'dialog');
    }

    #init() {
        if (this.#initialized) return;

        this.#setupHTML();
        this.querySelector('button').addEventListener('click', this.#handleClick, false);

        this.#initialized = true;
    }

    // #endregion

    // #region - ADDED TO DOCUMENT --------------------------------------------------------------------------

    connectedCallback() {
        this.#init();
    }

    // #endregion

    // #region - REMOVED FROM DOCUMENT ----------------------------------------------------------------------

    disconnectedCallback() {
        this.#initialized = false;

        this.querySelector('button')?.removeEventListener('click', this.#handleClick, false);
    }

    // #endregion

    // #region - ATTRIBUTE(S) CHANGED -----------------------------------------------------------------------

    attributeChangedCallback(attribute, oldValue, newValue) {
        if (!this.#initialized) return;
        if (oldValue === newValue) return;

        if (attribute === 'button-text') {
            const text = this.querySelector('button > span');
            if (text) { text.textContent = newValue || ''; }
        }
    }

    // #endregion
}

function registerDrawerOpener() {
    if (customElements.get('fds-drawer-opener') === undefined) {
        window.customElements.define('fds-drawer-opener', FDSDrawerOpener);
    }
}

export default registerDrawerOpener;