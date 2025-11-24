'use strict';

import { generateAndVerifyUniqueId } from '../../utils/generate-unique-id';
import { validateCharacterLimitHTML } from './validateCharacterLimitHTML.js'

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

        const characterLimitRendered = validateCharacterLimitHTML(this.children);

        if (!characterLimitRendered) {
            this.innerHTML = '';

            this.#spanSrMaxLimit = document.createElement('span');
            this.#spanSrMaxLimit.classList.add('sr-only');
            this.#spanSrMaxLimit.setAttribute('id', generateAndVerifyUniqueId('lim'));
            this.#spanSrMaxLimit.textContent = this.#messages.max_limit.replace(/{value}/, this.#limit);

            this.#spanSrUpdate = document.createElement('span');
            this.#spanSrUpdate.classList.add('sr-only');
            this.#spanSrUpdate.setAttribute('aria-live', 'polite');

            this.#spanVisualUpdate = document.createElement('span');
            this.#spanVisualUpdate.classList.add('visual-message');
            this.#spanVisualUpdate.textContent = this.#getMessage(this.charactersLeft());

            this.appendChild(this.#spanSrMaxLimit);
            this.appendChild(this.#spanSrUpdate);
            this.appendChild(this.#spanVisualUpdate);
        }
        else {
            this.#spanSrMaxLimit = this.children[0];
            this.#spanSrUpdate = this.children[1];
            this.#spanVisualUpdate = this.children[2];
        }

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
            this.updateVisibleMessage();
        }
    }

    /* Attributes which can invoke attributeChangedCallback() */

    static observedAttributes = [
        'limit', 
        'one-character-remaining-text', 
        'several-characters-remaining-text', 
        'one-character-too-many-text', 
        'several-characters-too-many-text', 
        'max-limit-text'
    ];

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

    hasMatchingMessages() {
        return this.#spanSrUpdate.textContent === this.#spanVisualUpdate.textContent;
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

    updateMessages() {
        this.updateVisibleMessage();
        this.updateScreenReaderMessage();
    }

    silenceSrMessage() {
        this.#spanSrUpdate.textContent = '';
        this.#spanVisualUpdate.removeAttribute('aria-hidden');
    }

    silenceVisibleMessage() {
        this.#spanVisualUpdate.setAttribute('aria-hidden', 'true');
    }

    /* --------------------------------------------------
    CUSTOM ELEMENT ADDED TO DOCUMENT
    -------------------------------------------------- */

    connectedCallback() {
        if (this.#rendered) return;

        this.#render();

        if (this.hasAttribute('one-character-remaining-text')) {
            this.#messages.one_character_remaining = this.getAttribute('one-character-remaining-text');
        }

        if (this.hasAttribute('several-characters-remaining-text')) {
            this.#messages.several_characters_remaining = this.getAttribute('several-characters-remaining-text');
        }

        if (this.hasAttribute('one-character-too-many-text')) {
            this.#messages.one_character_too_many = this.getAttribute('one-character-too-many-text');
        }

        if (this.hasAttribute('several-characters-too-many-text')) {
            this.#messages.several_characters_too_many = this.getAttribute('several-characters-too-many-text');
        }

        if (this.hasAttribute('max-limit-text')) {
            this.#messages.max_limit = this.getAttribute('max-limit-text');
        }

        this.updateVisibleMessage();

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

        if (name === 'one-character-remaining-text') {
            console.log('one-character-remaining-text', newValue);
            this.#messages.one_character_remaining = newValue;
            this.updateMessages();
        }

        if (name === 'several-characters-remaining-text') {
            this.#messages.several_characters_remaining = newValue;
            this.updateMessages();
        }

        if (name === 'one-character-too-many-text') {
            this.#messages.one_character_too_many = newValue;
            this.updateMessages();
        }

        if (name === 'several-characters-too-many-text') {
            this.#messages.several_characters_too_many = newValue;
            this.updateMessages();
        }

        if (name === 'max-limit-text') {
            this.#messages.max_limit = newValue;
            this.updateMessages();
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