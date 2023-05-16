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

function isAlertSyntaxValid(alert) {
    let alertSyntaxValid = false;
    if (alert.firstChild?.classList?.contains('alert')) {
        let children = alert.firstChild.children;
        if (children.length == 2) {
            if (children[0].classList?.contains('alert-heading') && children[1].classList?.contains('alert-body')) {
                alertSyntaxValid = true;
            }
        }
        else if (children.length == 3) {
            if (children[0].classList?.contains('alert-heading') && children[1].classList?.contains('alert-body') && children[2].classList?.contains('alert-close')) {
                alertSyntaxValid = true;
            }
        }
    }
    return alertSyntaxValid;
}

function getAlertContainer(alert) {
    if (alert.nodeName === "FDS-ALERT") {
        return alert.firstChild;
    }
    else if (alert.classList?.contains('alert')) {
        return alert;
    }
    else {
        return null;
    }
}

function getAlertHeading(alert) {
    if (alert.nodeName === "FDS-ALERT") {
        return alert.firstChild.children[0];
    }
    else if (alert.classList?.contains('alert')) {
        return alert.children[0];
    }
    else {
        return null;
    }
}

function getAlertBody(alert) {
    if (alert.nodeName === "FDS-ALERT") {
        return alert.firstChild.children[1];
    }
    else if (alert.classList?.contains('alert')) {
        return alert.children[1];
    }
    else {
        return null;
    }
}

function getAlertCloseButton(alert) {
    if (alert.nodeName === "FDS-ALERT") {
        return alert.firstChild.children[2];
    }
    else if (alert.classList?.contains('alert')) {
        return alert.children[2];
    }
    else {
        return null;
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
        this.removeAttribute('hidden');
        let eventShow = new Event('fdsalertshow');
        this.dispatchEvent(eventShow);
    }

    getContent() {
        if (isAlertSyntaxValid(this)) {
            let body = getAlertBody(this);
            if (body.children.length === 1) {
                if (body.children[0].classList.contains('alert-text')) {
                    return body.children[0].textContent;
                }
                else {
                    return getAlertBody(this).innerHTML;
                }
            }
            else {
                return getAlertBody(this).innerHTML;
            }
        }
        else {
            throw new Error("Couldn't get content. Alert has invalid syntax.");
        }
    }

    setContent(content) {
        if (isAlertSyntaxValid(this)) {
            let contentChecker = document.createElement('div');
            contentChecker.innerHTML = content;
            if (contentChecker.innerHTML === contentChecker.textContent) {
                getAlertBody(this).innerHTML = "<p class='alert-text'>" + content + "</p>";
            }
            else {
                getAlertBody(this).innerHTML = content;
            }
        }
        else {
            throw new Error("Couldn't set content. Alert has invalid syntax.");
        }
    }

    connectedCallback() {

        /* If the alert already has a valid syntax, don't do anything. This check aims to minimize the impact of user errors.  */
        if (!isAlertSyntaxValid(this)) {

            /* Create the base for the alert */
            let constructedContent = document.createElement('div');
            constructedContent.classList.add('alert');

            /* Add variant */
            if (isVariantValid(this.variant)) {
                constructedContent.classList.add("alert-" + this.variant);
            }

            /* Add heading */
            let alertHeading = document.createElement('div');
            if (isHeadingtypeValid(this.headingtype)) {
                alertHeading = document.createElement(this.headingtype);
            }
            alertHeading.textContent = this.heading;
            alertHeading.classList.add('alert-heading');
            constructedContent.appendChild(alertHeading);

            /* Add content */
            let alertBody = document.createElement('div');
            alertBody.classList.add('alert-body');
            if (this.innerHTML === this.textContent) {
                alertBody.innerHTML = "<p class='alert-text'>" + this.innerHTML + "</p>";
            }
            else {
                alertBody.innerHTML = this.innerHTML;
            }
            constructedContent.appendChild(alertBody);

            /* Add close button */
            if (this.closeable) {
                let closeButton = document.createElement('button');
                closeButton.type = 'button';
                closeButton.classList.add('alert-close');
                closeButton.innerHTML = '<svg class="icon-svg" focusable="false" aria-hidden="true" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M0 0h24v24H0V0z" fill="none"></path><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z"></path></svg>Luk';
                constructedContent.appendChild(closeButton);
                getAlertHeading(constructedContent).classList.add('pr-8');
            }

            /* Finish the alert */
            this.innerHTML = constructedContent.outerHTML;

        }

        /* Add event listener to close button, if present */
        if (this.closeable && isAlertSyntaxValid(this)) {
            getAlertCloseButton(this).addEventListener("click", this.#closeClickhandler);
        }

    }

    disconnectedCallback() {
        if (this.closeable && getAlertCloseButton(this) != null) {
            getAlertCloseButton(this).removeEventListener("click", this.#closeClickhandler);
        }
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (isAlertSyntaxValid(this)) {
            if (name === "variant") {
                if (getAlertContainer(this) != null) {
                    let classes = getAlertContainer(this).classList;
                    classes.remove('alert-info');
                    classes.remove('alert-success');
                    classes.remove('alert-warning');
                    classes.remove('alert-error');

                    if (isVariantValid(newValue)) {
                        getAlertContainer(this).classList.add("alert-" + newValue);
                    }
                }
            }
            if (name === "heading") {
                if (getAlertHeading(this) != null) {
                    getAlertHeading(this).textContent = newValue;
                }
            }
            if (name === "headingtype") {
                if (getAlertHeading(this) != null) {
                    if (isHeadingtypeValid(newValue)) {
                        let heading = document.createElement(newValue);
                        heading.textContent = this.heading;
                        heading.classList = getAlertHeading(this).classList;
                        getAlertContainer(this).replaceChild(heading, getAlertHeading(this));
                    }
                }
            }
            if (name === "closeable") {
                /* 'closeable' attribute was removed */
                if (!this.closeable) {
                    getAlertCloseButton(this).removeEventListener("click", this.#closeClickhandler);
                    getAlertCloseButton(this).remove();
                    getAlertHeading(this).classList.remove('pr-8');
                }
                /* 'closeable' attribute was added */
                else if (this.closeable && getAlertCloseButton(this) == null) {
                    let closeButton = document.createElement('button');
                    closeButton.type = 'button';
                    closeButton.classList.add('alert-close');
                    closeButton.innerHTML = '<svg class="icon-svg" focusable="false" aria-hidden="true" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M0 0h24v24H0V0z" fill="none"></path><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z"></path></svg>Luk';
                    this.firstChild.appendChild(closeButton);
                    getAlertCloseButton(this).addEventListener("click", this.#closeClickhandler);
                }
            }
        }
    }
}

export default FDSAlert;