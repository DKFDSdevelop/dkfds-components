'use strict';

import { generateUniqueIdWithPrefix } from '../../utils/generate-unique-id';
import { validateInputHTML } from './validateInputHTML'

class FDSInput extends HTMLElement {

    /* --------------------------------------------------
    CUSTOM ELEMENT ADDED TO DOCUMENT
    -------------------------------------------------- */

    connectedCallback() {
        //Validate structure
        if (!validateInputHTML(this.children)) {
            console.error('fds-input: Must contain exactly one <label> and one <input> element');
            return;
        }

        const label = this.querySelector('label');
        const input = this.querySelector('input');

        // if (!label || !input) return;

        label.classList.add('form-label')
        input.classList.add('form-input')

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

        //Required attribute
        if (this.hasAttribute('required') && this.getAttribute('required') !== 'false') {
            const requiredValue = this.getAttribute('required');
            const requiredSpan = document.createElement('span');
            requiredSpan.className = 'weight-normal';

            if (requiredValue && requiredValue !== 'true' && requiredValue !== '') {
                requiredSpan.textContent = ` (${requiredValue})`;
            } else {
                requiredSpan.textContent = ' (*skal udfyldes)';
            }

            label.appendChild(requiredSpan);
        }


        const helpEl = this.querySelector('fds-help-text, .form-hint');
        if (helpEl) {
            const helpId = `${input.id}-hint`;

            helpEl.id = helpId;

            input.setAttribute('aria-describedby', helpId);
        }

    }
}

function registerInput() {
    if (customElements.get('fds-input') === undefined) {
        window.customElements.define('fds-input', FDSInput);
    }
}

export default registerInput;