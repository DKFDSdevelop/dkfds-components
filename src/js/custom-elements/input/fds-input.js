'use strict';

import { generateUniqueIdWithPrefix } from '../../utils/generate-unique-id';

class FDSInput extends HTMLElement {

    /* --------------------------------------------------
    CUSTOM ELEMENT ADDED TO DOCUMENT
    -------------------------------------------------- */

    connectedCallback() {
        const label = this.querySelector('label');
        const input = this.querySelector('input');

        if (!label || !input) return;

        const inputId = input.getAttribute('id');
        const labelFor = label.getAttribute('for');

        const hasInputId = inputId !== null && inputId.trim() !== '';
        const hasLabelFor = labelFor !== null && labelFor.trim() !== '';

        if (hasInputId && hasLabelFor) {
            if (labelFor !== inputId) {
                label.setAttribute('for', inputId);
            }
        } else if (hasInputId && !hasLabelFor) {
            label.setAttribute('for', inputId);
        } else if (!hasInputId && hasLabelFor) {
            input.setAttribute('id', labelFor);
        } else {
            // Neither provided: generate an id
            const autoId = generateUniqueIdWithPrefix('inp');
            input.setAttribute('id', autoId);
            label.setAttribute('for', autoId);
        }


        const helpEl = this.querySelector('fds-help-text, .form-hint');
        if (helpEl) {
            const helpId = `${input.id}-hint`;

            helpEl.id = helpId;

            input.setAttribute('aria-describedby', helpId);
        }

    }
}

export default FDSInput;