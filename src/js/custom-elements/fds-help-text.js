import { generateUniqueIdWithPrefix } from '../utils/generate-unique-id';

class FDSHelpText extends HTMLElement {

    /* Private instance fields */

    #initialized = false;

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
        if (this.id && this.id.trim() !== '') {
            span.id = this.id.trim();
        }

        this.#initialized = true;
    }

    /* --------------------------------------------------
       CUSTOM ELEMENT'S ATTRIBUTE(S) CHANGED
       -------------------------------------------------- */

    attributeChangedCallback(name, oldVal, newVal) {
        if (name === 'id') {
            const span = this.querySelector('.form-hint');
            if (span) {
                const val = (newVal || '').trim();
                if (val) {
                    span.id = val;
                } else {
                    span.removeAttribute('id');
                }
            }
        }
    }
}

export default FDSHelpText;