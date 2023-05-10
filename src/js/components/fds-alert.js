'use strict';

function isVariantValid(variant) {
    const VARIANTS = ["info", "success", "warning", "error"];
    if (VARIANTS.includes(variant)) {
        return true;
    }
    else {
        return false;
    }
}

function isHeadingtypeValid(headingtype) {
    const HEADINGTYPES = ["h1", "h2", "h3", "h4", "h5", "h6", "strong"];
    if (HEADINGTYPES.includes(headingtype)) {
        return true;
    }
    else {
        return false;
    }
}

class FDSAlert extends HTMLElement {
    static get observedAttributes() {
        return ['variant', 'heading', 'headingtype', 'closeable'];
    }

    get variant() {
        if (this.hasAttribute('variant')) {
            return this.getAttribute('variant');
        }
        else {
            return "";
        }
    }

    set variant(val) {
        if (isVariantValid(val)) {
            this.setAttribute('variant', val);
        }
        else {
            throw new Error("Invalid variant: '" + val + "'. Variant must be 'info', 'success', 'warning' or 'error'.");
        }
    }

    get heading() {
        if (this.hasAttribute('heading')) {
            return this.getAttribute('heading');
        }
        else {
            return "";
        }
    }

    set heading(val) {
        this.setAttribute('heading', val);
    }

    get headingtype() {
        if (this.hasAttribute('headingtype')) {
            return this.getAttribute('headingtype');
        }
        else {
            return "";
        }
    }

    set headingtype(val) {
        if (isHeadingtypeValid(val)) {
            this.setAttribute('headingtype', val);
        }
        else {
            throw new Error("Invalid heading type: '" + val + "'. Valid values are 'h1', 'h2, 'h3', 'h4', 'h5', 'h6' and 'strong'.");
        }
    }

    get closeable() {
        return this.hasAttribute('closeable');
    }

    set closeable(val) {
        if (val) {
            this.setAttribute('closeable', '');
        }
    }

    constructor() {
        super();
    }

    hide() {
        this.setAttribute("hidden", '');
        let eventHide = new Event('fdsalerthide');
        this.dispatchEvent(eventHide);
    }

    show() {
        // To do
    }

    connectedCallback() {

        /* Create the base for the alert */
        let constructedAlert = document.createElement('div');
        constructedAlert.classList.add('alert');
        
        /* Add variant */
        if (isVariantValid(this.variant)) {
            constructedAlert.classList.add("alert-" + this.variant);
        }

        /* Add heading */
        if (isHeadingtypeValid(this.headingtype)) {
            let alertHeading = document.createElement(this.headingtype);
            alertHeading.textContent = this.heading;
            alertHeading.classList.add('alert-heading');
            constructedAlert.appendChild(alertHeading);
        }        
        else {
            let alertHeading = document.createElement('div');
            alertHeading.textContent = this.heading;
            alertHeading.classList.add('alert-heading');
            constructedAlert.appendChild(alertHeading);
        }

        /* Add content */
        let alertBody = document.createElement('div');
        alertBody.classList.add('alert-body');
        if (this.innerHTML === this.textContent) {
            alertBody.innerHTML = "<p class='mt-0 mb-0'>" + this.innerHTML + "</p>";
        }
        else {
            alertBody.innerHTML = this.innerHTML;
        }
        constructedAlert.appendChild(alertBody);
        
        /* Finish the alert */
        this.innerHTML = constructedAlert.outerHTML;

    }

    disconnectedCallback() {
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (name === "variant") {
            if (this.querySelector('.alert')) {

                let classes = this.querySelector('.alert').classList;
                classes.remove('alert-info');
                classes.remove('alert-success');
                classes.remove('alert-warning');
                classes.remove('alert-error');

                if (isVariantValid(newValue)) {
                    this.querySelector('.alert').classList.add("alert-" + newValue);
                }
                else {
                    throw new Error("Invalid variant at attribute change: '" + newValue + "'. Variant must be 'info', 'success', 'warning' or 'error'.");
                }

            }
        }
        if (name === "heading") {
            if (this.querySelector('.alert-heading')) {
                let heading = this.querySelector('.alert-heading');
                heading.textContent = newValue;
            }
        }
        if (name === "headingtype") {
            if (this.querySelector('.alert') && this.querySelector('.alert-heading')) {
                if (isHeadingtypeValid(newValue)) {
                    let heading = document.createElement(newValue);
                    heading.textContent = this.heading;
                    heading.classList.add('alert-heading');
                    this.querySelector('.alert').replaceChild(heading, this.querySelector('.alert-heading'));
                }
                else if (!isHeadingtypeValid(newValue)) {
                    throw new Error("Invalid heading type at attribute change: '" + val + "'. Valid values are 'h1', 'h2, 'h3', 'h4', 'h5', 'h6' and 'strong'.");
                }
            }
        }
    }
}

export default FDSAlert;