'use strict';

import { generateAndVerifyUniqueId } from '../../utils/generate-unique-id';

class FDSErrorMessage extends HTMLElement {

    /* Private instance fields */

    #rendered;
    #iconText;
    #parentWrapper;

    #render() {
        if (this.#rendered) return;

        const hasElements = this.children.length > 0;
        
        if (!hasElements) {
            const iconText = this.getAttribute('icon-text');
            if (iconText !== null && iconText !== '') {
                this.#iconText = iconText;
            }

            const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
            svg.classList.add('icon-svg', 'alert-icon');
            svg.setAttribute('aria-label', this.#iconText);
            svg.setAttribute('focusable', 'false');

            const use = document.createElementNS('http://www.w3.org/2000/svg', 'use');
            use.setAttribute('href', '#error');
            svg.appendChild(use);

            const visibleMessage = document.createElement('span');
            visibleMessage.classList.add('visible-message');
            visibleMessage.textContent = this.getAttribute('message') || this.textContent;
            this.textContent = '';

            this.appendChild(svg);
            this.appendChild(visibleMessage);
        }

        this.#rendered = true;
    }

    #shouldBeHidden(hiddenValue) {
        return hiddenValue === 'true' || hiddenValue === '';
    }

    #notifyParent() {
        this.#parentWrapper?.dispatchEvent(new CustomEvent('error-message-visibility-changed', {
            bubbles: true,
            detail: {
                errorId: this.id,
                targets: this.getTargets(),
                isHidden: this.#shouldBeHidden(this.getAttribute('hidden'))
            }
        }));
    }

    #dispatchErrorMessageCallback() {
        if (!this.#parentWrapper) return;

        this.#parentWrapper.dispatchEvent(new CustomEvent('error-message-callback', {
            bubbles: true,
            detail: {
                errorId: this.id,
                isHidden: this.#shouldBeHidden(this.getAttribute('hidden')),
                targets: this.getTargets()
            }
        }));
    }

    /* --------------------------------------------------
    CUSTOM ELEMENT METHODS
    -------------------------------------------------- */

    getTargets() {
        const targets = this.getAttribute('targets');
        if (!targets) return [];

        return targets.split(',').map(target => target.trim()).filter(target => target);
    }

    /* Attributes which can invoke attributeChangedCallback() */

    static observedAttributes = ['id', 'icon-text', 'hidden', 'targets', 'message'];

    /* --------------------------------------------------
    CUSTOM ELEMENT CONSTRUCTOR (do not access or add attributes in the constructor)
    -------------------------------------------------- */

    constructor() {
        super();
        this.#rendered = false;
        this.#iconText = 'Fejl';
        this.#parentWrapper = null;
    }

    /* --------------------------------------------------
    CUSTOM ELEMENT ADDED TO DOCUMENT
    -------------------------------------------------- */

    connectedCallback() {
        if (this.#rendered) return;

        this.#render();

        if (!this.id) {
            this.id = generateAndVerifyUniqueId('error');
        }

        // Save reference to parent wrapper
        this.#parentWrapper = this.closest('fds-input-wrapper, fds-checkbox, fds-checkbox-group, fds-radio-button-group, fds-date-input, fds-textarea, fds-select, fds-upload-file, fds-date-picker');
        this.#dispatchErrorMessageCallback();
    }

    /* --------------------------------------------------
    CUSTOM ELEMENT REMOVED FROM DOCUMENT
    -------------------------------------------------- */

    disconnectedCallback() {
        this.#parentWrapper?.dispatchEvent(new CustomEvent('error-message-callback',
            {
                bubbles: true,
                detail: {
                    errorId: this.id,
                    targets: this.getTargets()
                }
            }
        ));

        this.#parentWrapper = null;
        this.#rendered = false;
    }

    /* --------------------------------------------------
    CUSTOM ELEMENT'S ATTRIBUTE(S) CHANGED
    -------------------------------------------------- */

    attributeChangedCallback(name, oldValue, newValue) {
        if (!this.#rendered) return;

        if (name === 'icon-text' && oldValue !== newValue) {
            this.#iconText = newValue;
            this.querySelector(':scope > .alert-icon').setAttribute('aria-label', this.#iconText);
        }

        if (name === 'hidden' && oldValue !== newValue) {
            this.#notifyParent();
        }

        if (name === 'message' && oldValue !== newValue) {
            this.querySelector(':scope > .visible-message').textContent = newValue;
        }


        this.#dispatchErrorMessageCallback();
    }
}

function registerErrorMessage() {
    if (customElements.get('fds-error-message') === undefined) {
        window.customElements.define('fds-error-message', FDSErrorMessage);
    }
}

export default registerErrorMessage;