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
    #closeClickhandler;

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
        this.#closeClickhandler = () => { this.hide() };
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

        /* Add close button */
        if (this.closeable) {
            let closeButton = document.createElement('button');
            closeButton.type = 'button';
            closeButton.classList.add('alert-close');
            closeButton.innerHTML = '<svg class="icon-svg" focusable="false" aria-hidden="true" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M0 0h24v24H0V0z" fill="none"></path><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z"></path></svg>Luk';
            constructedAlert.appendChild(closeButton);
            constructedAlert.querySelector('.alert-heading').classList.add('pr-8');
        }

        /* Finish the alert */
        this.innerHTML = constructedAlert.outerHTML;

        if (this.closeable) {
            /* In case there's an alert inside an alert, ensure that we find the correct close button */
            if (this.children.length > 0) {
                let alertElements = this.children[0].children;
                for (let i = 0; i < alertElements.length; i++) {
                    if (alertElements[i].classList.contains('alert-close')) {
                        alertElements[i].addEventListener("click", this.#closeClickhandler);
                    }
                }
            }
        }

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
                    heading.classList = this.querySelector('.alert-heading').classList;
                    this.querySelector('.alert').replaceChild(heading, this.querySelector('.alert-heading'));
                }
            }
        }
        if (name === "closeable") {
            if (!this.closeable) {
                /* In case there's an alert inside an alert, ensure that we find the correct close button */
                if (this.children.length > 0) {
                    let alertElements = this.children[0].children;
                    for (let i = 0; i < alertElements.length; i++) {
                        if (alertElements[i].classList.contains('alert-close')) {
                            alertElements[i].removeEventListener("click", this.#closeClickhandler);
                            alertElements[i].remove();
                        }
                        else if (alertElements[i].classList.contains('alert-heading')) {
                            alertElements[i].classList.remove('pr-8');
                        }
                    }
                }
            }
            else {
                let closeButtonExists = false;

                if (this.children.length > 0) {
                    let alertElements = this.children[0].children;
                    for (let i = 0; i < alertElements.length; i++) {
                        if (alertElements[i].classList.contains('alert-close')) {
                            closeButtonExists = true;
                        }
                    }
                }

                if (!closeButtonExists && this.children.length > 0) {
                    let closeButton = document.createElement('button');
                    closeButton.type = 'button';
                    closeButton.classList.add('alert-close');
                    closeButton.innerHTML = '<svg class="icon-svg" focusable="false" aria-hidden="true" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M0 0h24v24H0V0z" fill="none"></path><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z"></path></svg>Luk';
                    this.firstChild.appendChild(closeButton);

                    let alertElements = this.children[0].children;
                    for (let i = 0; i < alertElements.length; i++) {
                        if (alertElements[i].classList.contains('alert-close')) {
                            alertElements[i].addEventListener("click", this.#closeClickhandler);
                        }
                        else if (alertElements[i].classList.contains('alert-heading')) {
                            alertElements[i].classList.add('pr-8');
                        }
                    }
                }
            }
        }
    }
}

export default FDSAlert;