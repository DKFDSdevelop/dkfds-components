class FDSHelpText extends HTMLElement {

    /* Private instance fields */

    #initialized = false;

    /* Private methods */

    #updateId(newValue) {
        const span = this.querySelector('.form-hint');
        if (span) {
            const val = (newValue || '').trim();
            if (val) {
                span.id = val;
            } else {
                span.removeAttribute('id');
            }
        }
    }

    /* Attributes which can invoke attributeChangedCallback() */

    static observedAttributes = ['id'];


    /* --------------------------------------------------
    CUSTOM ELEMENT ADDED TO DOCUMENT
    -------------------------------------------------- */

    connectedCallback() {
        if (this.#initialized) return;

        let span = this.querySelector('.form-hint');
        if (!span) {
            span = document.createElement('span');
            span.className = 'form-hint';

            // Move existing child nodes into the span (preserves text, links, listeners)
            while (this.firstChild) {
                span.appendChild(this.firstChild);
            }
            this.appendChild(span);
        }

        // Mirror host id to span.id if present
        this.#updateId(this.id);

        this.#initialized = true;
    }

    /* --------------------------------------------------
       CUSTOM ELEMENT'S ATTRIBUTE(S) CHANGED
       -------------------------------------------------- */

    attributeChangedCallback(name, oldVal, newVal) {
        if (name === 'id') {
            this.#updateId(newVal);
        }
    }
}

function registerHelpText() {
    if (customElements.get('fds-help-text') === undefined) {
        window.customElements.define('fds-help-text', FDSHelpText);
    }
}

export default registerHelpText;