'use strict';

class FDSCharacterLimit extends HTMLElement {

    /* Private instance fields */

    #rendered;
    #limit;
    #charactersUsed;
    #messages;

    /* Private methods */

    #render() {
        if (this.#rendered) return;

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
            "one_character_remaining": "Du har {value} tegn tilbage",
            "several_characters_remaining": "Du har {value} tegn tilbage",
            "one_character_too_many": "Du har {value} tegn for meget",
            "several_characters_too_many": "Du har {value} tegn for meget"
        };
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

    /* --------------------------------------------------
    CUSTOM ELEMENT ADDED TO DOCUMENT
    -------------------------------------------------- */

    connectedCallback() {
        if (this.#rendered) return;

        this.#render();
    }

    /* --------------------------------------------------
    CUSTOM ELEMENT REMOVED FROM DOCUMENT
    -------------------------------------------------- */

    disconnectedCallback() {
        this.#rendered = false;
    }

    /* --------------------------------------------------
    CUSTOM ELEMENT'S ATTRIBUTE(S) CHANGED
    -------------------------------------------------- */

    attributeChangedCallback(name, oldValue, newValue) {
        if (!this.#rendered) return;

        if (name === 'limit') {
            const parsed = parseInt(newValue, 10);
            if (!Number.isNaN(parsed)) {
                this.#limit = parsed;
            }
        }
    }
}

function registerCharacterLimit() {
    if (customElements.get('fds-character-limit') === undefined) {
        window.customElements.define('fds-character-limit', FDSCharacterLimit);
    }
}

export default registerCharacterLimit;