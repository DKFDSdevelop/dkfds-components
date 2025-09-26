'use strict';

class FDSAccordion extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.innerHTML = `<h2>
            <button class="accordion-button" aria-expanded="true" aria-controls="a1">
                <span class="accordion-title">Lorem ipsum dolor sit amet</span>
            </button>
        </h2>
        <div id="a1" aria-hidden="false" class="accordion-content">
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
                incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis
                nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
            </p>
        </div>`;
    }
}

export default FDSAccordion;