'use strict';

class FDSCharacterLimit extends HTMLElement {

    /* Private instance fields */

    /* Private methods */

    /* Attributes which can invoke attributeChangedCallback() */

    static observedAttributes = [];

    /* --------------------------------------------------
    CUSTOM ELEMENT CONSTRUCTOR (do not access or add attributes in the constructor)
    -------------------------------------------------- */

    constructor() {
        super();
    }

    /* --------------------------------------------------
    CUSTOM ELEMENT ADDED TO DOCUMENT
    -------------------------------------------------- */

    connectedCallback() {
    }

    /* --------------------------------------------------
    CUSTOM ELEMENT REMOVED FROM DOCUMENT
    -------------------------------------------------- */

    disconnectedCallback() {
    }

    /* --------------------------------------------------
    CUSTOM ELEMENT'S ATTRIBUTE(S) CHANGED
    -------------------------------------------------- */

    attributeChangedCallback(name, oldValue, newValue) {
    }
}

function registerCharacterLimit() {
    if (customElements.get('fds-character-limit') === undefined) {
        window.customElements.define('fds-character-limit', FDSCharacterLimit);
    }
}

export default registerCharacterLimit;