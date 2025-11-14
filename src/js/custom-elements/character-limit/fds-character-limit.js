'use strict';

import { generateAndVerifyUniqueId } from '../../utils/generate-unique-id';

class FDSCharacterLimit extends HTMLElement {

    /* Private instance fields */

    #rendered;
    #limit;
    #charactersUsed;
    #messages;

    #spanSrMaxLimit;
    #spanSrUpdate;
    #spanVisualUpdate;

    #parentWrapper;

    /* Private methods */

    #render() {
        if (this.#rendered) return;

        this.#updateLimit(this.getAttribute('limit'));

        this.innerHTML = '';

        this.#spanSrMaxLimit = document.createElement('span');
        this.#spanSrUpdate = document.createElement('span');
        this.#spanVisualUpdate = document.createElement('span');

        this.#spanSrMaxLimit.classList.add('sr-only');
        this.#spanSrMaxLimit.setAttribute('id', generateAndVerifyUniqueId('lim'));
        this.#spanSrUpdate.classList.add('sr-only');
        this.#spanSrUpdate.setAttribute('aria-live', 'polite');
        this.#spanVisualUpdate.setAttribute('aria-hidden', 'true');

        this.#spanSrMaxLimit.textContent = this.#messages.max_limit.replace(/{value}/, this.#limit);
        this.#spanSrUpdate.textContent = this.#getMessage(this.charactersLeft());
        this.#spanVisualUpdate.textContent = this.#getMessage(this.charactersLeft());

        this.appendChild(this.#spanSrMaxLimit);
        this.appendChild(this.#spanSrUpdate);
        this.appendChild(this.#spanVisualUpdate);

        this.#rendered = true;
    }

    #getMessage(charactersLeft) {
        let msg = '';

        if (charactersLeft === -1) {
            const exceeded = Math.abs(charactersLeft);
            msg = this.#messages.one_character_too_many.replace(/{value}/, exceeded);
        }
        else if (charactersLeft === 1) {
            msg = this.#messages.one_character_remaining.replace(/{value}/, charactersLeft);
        }
        else if (charactersLeft >= 0) {
            msg = this.#messages.several_characters_remaining.replace(/{value}/, charactersLeft);
        }
        else {
            const exceeded = Math.abs(charactersLeft);
            msg = this.#messages.several_characters_too_many.replace(/{value}/, exceeded);
        }

        return msg;
    }

    #updateLimit(value) {
        const parsed = parseInt(value, 10);
        if (!Number.isNaN(parsed)) {
            this.#limit = parsed;
            if (this.#spanSrMaxLimit) {
                this.#spanSrMaxLimit.textContent = this.#messages.max_limit.replace(/{value}/, this.#limit);
            }
            this.silentUpdateMessages();
        }
    }

    /* Attributes which can invoke attributeChangedCallback() */

    static observedAttributes = ['limit'];

    /* --------------------------------------------------
    CUSTOM ELEMENT CONSTRUCTOR (do not access or add attributes in the constructor)
    -------------------------------------------------- */

    constructor() {
        super();

        this.#rendered = false;
        this.#limit = 0;
        this.#charactersUsed = 0;
        this.#messages = {
            'one_character_remaining': "Du har {value} tegn tilbage",
            'several_characters_remaining': "Du har {value} tegn tilbage",
            'one_character_too_many': "Du har {value} tegn for meget",
            'several_characters_too_many': "Du har {value} tegn for meget",
            'max_limit': "Du kan indtaste op til {value} tegn"
        };

        this.#spanSrMaxLimit = null;
        this.#spanSrUpdate = null;
        this.#spanVisualUpdate = null;
        this.#parentWrapper = null;
    }

    /* --------------------------------------------------
    CUSTOM ELEMENT METHODS
    -------------------------------------------------- */

    charactersLeft() {
        return this.#limit - this.#charactersUsed;
    }

    setCharactersUsed(value) {
        const parsed = parseInt(value, 10);
        if (!Number.isNaN(parsed)) {
            this.#charactersUsed = parsed;
        }
    }

    updateVisibleMessage() {
        if (!this.#spanVisualUpdate) return;

        const charsLeft = this.charactersLeft();
        this.#spanVisualUpdate.textContent = this.#getMessage(charsLeft);

        if (charsLeft < 0) {
            this.#spanVisualUpdate.classList.add('limit-exceeded');
        }
        else {
            this.#spanVisualUpdate.classList.remove('limit-exceeded');
        }
    }

    updateScreenReaderMessage() {
        if (!this.#spanSrUpdate) return;

        this.#spanSrUpdate.textContent = this.#getMessage(this.charactersLeft());
    }

    silentUpdateMessages() {
        this.#spanSrUpdate?.removeAttribute('aria-live');
        this.updateVisibleMessage();
        this.updateScreenReaderMessage();
    }

    updateMessages() {
        this.#spanSrUpdate?.setAttribute('aria-live', 'polite');
        this.updateVisibleMessage();
        this.updateScreenReaderMessage();
    }

    /* --------------------------------------------------
    CUSTOM ELEMENT ADDED TO DOCUMENT
    -------------------------------------------------- */

    connectedCallback() {
        if (this.#rendered) return;

        this.#render();

        // During disconnect, the custom element may lose connection to the input-wrapper.
        // Save the input-wrapper and use it to dispatch events - otherwise, the events may be lost.
        this.#parentWrapper = this.closest('fds-input-wrapper');

        this.#parentWrapper?.dispatchEvent(new Event('character-limit-callback'));
        this.#parentWrapper?.dispatchEvent(new Event('character-limit-connection'));
    }

    /* --------------------------------------------------
    CUSTOM ELEMENT REMOVED FROM DOCUMENT
    -------------------------------------------------- */

    disconnectedCallback() {
        this.#parentWrapper?.dispatchEvent(new Event('character-limit-callback'));

        this.#parentWrapper = null;
        this.#rendered = false;
    }

    /* --------------------------------------------------
    CUSTOM ELEMENT'S ATTRIBUTE(S) CHANGED
    -------------------------------------------------- */

    attributeChangedCallback(name, oldValue, newValue) {
        if (!this.#rendered) return;

        if (name === 'limit') {
            this.#updateLimit(newValue);
        }

        this.#parentWrapper?.dispatchEvent(new Event('character-limit-callback'));
    }
}

function registerCharacterLimit() {
    if (customElements.get('fds-character-limit') === undefined) {
        window.customElements.define('fds-character-limit', FDSCharacterLimit);
    }
}

export default registerCharacterLimit;