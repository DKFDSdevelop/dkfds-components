'use strict';

import { generateAndVerifyUniqueId } from '../../utils/generate-unique-id';
import { validateCharacterLimitHTML } from './validateCharacterLimitHTML.js'

class FDSCharacterLimit extends HTMLElement {

    /* Private instance fields */

    #initialized = false;

    #messages = {
        'one_character_remaining': "Du har {value} tegn tilbage",
        'several_characters_remaining': "Du har {value} tegn tilbage",
        'one_character_too_many': "Du har {value} tegn for meget",
        'several_characters_too_many': "Du har {value} tegn for meget",
        'max_limit': "Du kan indtaste op til {value} tegn"
    };

    #spanSrMaxLimit = document.createElement('span');
    #spanSrUpdate = document.createElement('span');
    #spanVisualUpdate = document.createElement('span');

    #parentWrapper = null;
    #input = null;

    #intervalID = null;
    #lastKeyUpTimestamp = null;
    #oldValue = null;
    #forceSRUpdate = false;

    #handleKeyUp = (event) => {
        // Update the visible message immediately
        this.#updateVisibleMessage(this.#charactersLeft());

        // Safe the timestamp so the SR message won't update until the user has stopped typing
        this.#lastKeyUpTimestamp = Date.now();

        // The user typed something so the SR message must be updated
        this.#forceSRUpdate = true;
    }

    #handleFocus = (event) => {
        // Clear any previous timers
        if (this.#intervalID !== null) {
            window.clearInterval(this.#intervalID);
            this.#intervalID = null;
        }

        if (!this.#input) return;

        this.#spanVisualUpdate.setAttribute('aria-hidden', 'true');
        this.#spanSrUpdate.setAttribute('aria-hidden', 'false');

        // Set a timer to prevent SR users from being spammed with audio notifications while typing
        this.#intervalID = window.setInterval(() => {
            if (!this.#lastKeyUpTimestamp || (Date.now() - 500) >= this.#lastKeyUpTimestamp) {
                const inputValueChanged = this.#oldValue !== this.#input.value;
                const messageInconsistency = this.#spanSrUpdate.textContent !== this.#spanVisualUpdate.textContent;

                if (inputValueChanged || messageInconsistency || this.#forceSRUpdate) {
                    this.#forceSRUpdate = false;
                    this.#oldValue = this.#input.value;
                    this.#updateMessages(this.#charactersLeft());
                }
            }
        }, 1000);
    }

    #handleBlur = (event) => {
        // Stop the input timer
        if (this.#intervalID !== null) {
            window.clearInterval(this.#intervalID);
            this.#intervalID = null;
        }

        if (!this.#input) return;

        this.#updateVisibleMessage(this.#charactersLeft());
        this.#spanSrUpdate.textContent = '';
        this.#spanSrUpdate.setAttribute('aria-hidden', 'true');
        this.#spanVisualUpdate.setAttribute('aria-hidden', 'false');
    }

    #handlePageshow = (event) => {
        this.#updateVisibleMessage(this.#charactersLeft());
    }

    /* Private methods */

    #charactersLeft() {
        if (!this.#input) return;

        const parsedLimit = parseInt(this.getAttribute('limit'), 10);
        if (!Number.isNaN(parsedLimit)) {
            return parsedLimit - this.#input.value.length;
        }
        else {
            return null;
        }
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

    #updateVisibleMessage(charactersLeft) {
        this.#spanVisualUpdate.textContent = this.#getMessage(charactersLeft);

        if (charactersLeft < 0) {
            this.#spanVisualUpdate.classList.add('limit-exceeded');
        }
        else {
            this.#spanVisualUpdate.classList.remove('limit-exceeded');
        }
    }

    #updateSRMessage(charactersLeft) {
        this.#spanSrUpdate.textContent = this.#getMessage(charactersLeft);
    }

    #updateMessages(charactersLeft) {
        this.#updateVisibleMessage(charactersLeft);
        this.#updateSRMessage(charactersLeft);
    }

    #updateId(value) {
        if (value) {
            this.#spanSrMaxLimit.id = value;
        }
        else {
            this.#spanSrMaxLimit.id = generateAndVerifyUniqueId('lim');
        }
    }

    /* Attributes which can invoke attributeChangedCallback() */

    static observedAttributes = [
        'limit',
        'one-character-remaining-text',
        'several-characters-remaining-text',
        'one-character-too-many-text',
        'several-characters-too-many-text',
        'max-limit-text',
        'limit-id'
    ];

    /* --------------------------------------------------
    CUSTOM ELEMENT ADDED TO DOCUMENT
    -------------------------------------------------- */

    connectedCallback() {
        this.innerHTML = '';

        if (!this.hasAttribute('limit')) return;

        this.#parentWrapper = this.closest('fds-input');
        this.#input = this.#parentWrapper?.querySelector('input');

        if (!this.#input) return;

        const charactersLeft = this.#charactersLeft();

        // Update the default text used in the component
        if (this.hasAttribute('one-character-remaining-text')) { this.#messages.one_character_remaining = this.getAttribute('one-character-remaining-text'); }
        if (this.hasAttribute('several-characters-remaining-text')) { this.#messages.several_characters_remaining = this.getAttribute('several-characters-remaining-text'); }
        if (this.hasAttribute('one-character-too-many-text')) { this.#messages.one_character_too_many = this.getAttribute('one-character-too-many-text'); }
        if (this.hasAttribute('several-characters-too-many-text')) { this.#messages.several_characters_too_many = this.getAttribute('several-characters-too-many-text'); }
        if (this.hasAttribute('max-limit-text')) { this.#messages.max_limit = this.getAttribute('max-limit-text'); }

        // <span> announcing the max limit to SR users
        this.#spanSrMaxLimit.classList.add('sr-only');
        this.#spanSrMaxLimit.textContent = this.#messages.max_limit.replace(/{value}/, this.getAttribute('limit'));
        if (!this.hasAttribute('limit-id') && this.getAttribute('limit-id') !== '') { this.#spanSrMaxLimit.id = generateAndVerifyUniqueId('lim'); }
        else { this.#spanSrMaxLimit.id = this.getAttribute('limit-id'); }

        // <span> visually showing the characters left
        this.#spanVisualUpdate.classList.add('visual-message');
        this.#spanVisualUpdate.setAttribute('aria-hidden', 'false');
        this.#spanVisualUpdate.textContent = this.#getMessage(charactersLeft);;

        // <span> announcing characters left to SR users (updates are slightly delayed compared to the visual message)
        this.#spanSrUpdate.classList.add('sr-only');
        this.#spanSrUpdate.textContent = '';
        this.#spanSrUpdate.setAttribute('aria-hidden', true);
        this.#spanSrUpdate.setAttribute('aria-live', 'polite');

        this.appendChild(this.#spanSrMaxLimit);
        this.appendChild(this.#spanSrUpdate);
        this.appendChild(this.#spanVisualUpdate);

        // Add event listeners
        this.#input.addEventListener('keyup', this.#handleKeyUp);
        this.#input.addEventListener('focus', this.#handleFocus);
        this.#input.addEventListener('blur', this.#handleBlur);
        if ('onpageshow' in window) {
            window.addEventListener('pageshow', this.#handlePageshow);
        }
        else {
            document.addEventListener('DOMContentLoaded', this.#handlePageshow);
        }

        this.#initialized = true;
    }

    /* --------------------------------------------------
    CUSTOM ELEMENT REMOVED FROM DOCUMENT
    -------------------------------------------------- */

    disconnectedCallback() {
        this.#input?.removeEventListener('keyup', this.#handleKeyUp);
        this.#input?.removeEventListener('focus', this.#handleFocus);
        this.#input?.removeEventListener('blur', this.#handleBlur);
        window.removeEventListener('pageshow', this.#handlePageshow);
        document.removeEventListener('DOMContentLoaded', this.#handlePageshow);

        this.#initialized = false;
    }

    /* --------------------------------------------------
    CUSTOM ELEMENT'S ATTRIBUTE(S) CHANGED
    -------------------------------------------------- */

    attributeChangedCallback(attribute, oldValue, newValue) {
        if (!this.#initialized) return;

        if (attribute === 'limit') {
            this.#updateMessages(this.#charactersLeft());
        }

        if (attribute === 'one-character-remaining-text') {
            console.log('one-character-remaining-text', newValue);
            this.#messages.one_character_remaining = newValue;
            this.#updateMessages(this.#charactersLeft());
        }

        if (attribute === 'several-characters-remaining-text') {
            this.#messages.several_characters_remaining = newValue;
            this.#updateMessages(this.#charactersLeft());
        }

        if (attribute === 'one-character-too-many-text') {
            this.#messages.one_character_too_many = newValue;
            this.#updateMessages(this.#charactersLeft());
        }

        if (attribute === 'several-characters-too-many-text') {
            this.#messages.several_characters_too_many = newValue;
            this.#updateMessages(this.#charactersLeft());
        }

        if (attribute === 'max-limit-text') {
            this.#messages.max_limit = newValue;
            this.#updateMessages(this.#charactersLeft());
        }

        if (attribute === 'limit-id') {
            this.#updateId(newValue);
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