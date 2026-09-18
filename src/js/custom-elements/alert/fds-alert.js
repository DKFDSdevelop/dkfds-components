import * as CE from '../custom-element-utils';
import { styles } from './fds-alert-styling';

const sheet = new CSSStyleSheet();
sheet.replaceSync(styles);

const DEFAULT_VARIANT = 'info';

const ICONS = {
    info: 'M440-280h80v-240h-80v240Zm40-320q17 0 28.5-11.5T520-640q0-17-11.5-28.5T480-680q-17 0-28.5 11.5T440-640q0 17 11.5 28.5T480-600Zm0 520q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z',
    success: 'm424-296 282-282-56-56-226 226-114-114-56 56 170 170Zm56 216q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z',
    warning: 'm40-120 440-760 440 760H40Zm138-80h604L480-720 178-200Zm302-40q17 0 28.5-11.5T520-280q0-17-11.5-28.5T480-320q-17 0-28.5 11.5T440-280q0 17 11.5 28.5T480-240Zm-40-120h80v-200h-80v200Zm40-100Z',
    error: 'M480-280q17 0 28.5-11.5T520-320q0-17-11.5-28.5T480-360q-17 0-28.5 11.5T440-320q0 17 11.5 28.5T480-280Zm-40-160h80v-240h-80v240Zm40 360q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z',
};

const ICON_LABELS = {
    info: 'Information',
    success: 'Succes',
    warning: 'Advarsel',
    error: 'Fejl',
};

class FDSAlert extends HTMLElement {

    // #region - ATTRIBUTES (can invoke attributeChangedCallback()) -----------------------------------------

    static observedAttributes = ['variant', 'icon-label'];

    // #endregion

    // #region - GETTERS AND SETTERS ------------------------------------------------------------------------

    get variant() { return this.getAttribute('variant') || DEFAULT_VARIANT; }
    set variant(value) { this.setAttribute('variant', value); }

    get iconLabel() { return this.getAttribute('icon-label') || ICON_LABELS[this.variant] || ICON_LABELS[DEFAULT_VARIANT]; }
    set iconLabel(value) { value == null ? this.removeAttribute('icon-label') : this.setAttribute('icon-label', value); }

    // #endregion

    // #region - PRIVATE INSTANCE FIELDS --------------------------------------------------------------------

    #initialized = false;

    // #endregion

    // #region - PRIVATE METHODS ----------------------------------------------------------------------------

    #setupHTML() {
        // --- Wrapper ---
        let alert = this.shadowRoot.querySelector('.alert');
        if (!alert) {
            alert = document.createElement('div');
            alert.classList.add('alert');
            this.shadowRoot.appendChild(alert);
        }

        // --- Icon slot ---
        if (!alert.querySelector('slot[name="icon"]')) {
            const iconSlot = document.createElement('slot');
            iconSlot.name = 'icon';
            alert.appendChild(iconSlot);
        }

        // --- Alert body ---
        let alertBody = alert.querySelector('.alert-body');
        if (!alertBody) {
            alertBody = document.createElement('div');
            alertBody.classList.add('alert-body');
            alert.appendChild(alertBody);
        }

        // --- Heading slot ---
        if (!alertBody.querySelector('slot[name="heading"]')) {
            const headingSlot = document.createElement('slot');
            headingSlot.name = 'heading';
            alertBody.appendChild(headingSlot);
        }

        // --- Content slot ---
        if (!alertBody.querySelector('slot[name="content"]')) {
            const contentSlot = document.createElement('slot');
            contentSlot.name = 'content';
            alertBody.appendChild(contentSlot);
        }

        this.#applyVariant();
        this.#applyIcon();
    }

    #applyVariant() {
        const alert = this.shadowRoot.querySelector('.alert');
        alert.className = 'alert';
        alert.classList.add(`alert-${this.variant}`);
    }

    #applyIcon() {
        const iconSlot = this.shadowRoot.querySelector('slot[name="icon"]');
        if (iconSlot.assignedNodes().length > 0) return;

        // If no icon was slotted, generate a default icon instead
        iconSlot.innerHTML = '';

        const pathD = ICONS[this.variant] || ICONS[DEFAULT_VARIANT];
        const icon = CE.createSvgIcon(pathD);
        icon.classList.add('alert-icon');
        icon.removeAttribute('aria-hidden');
        icon.setAttribute('aria-label', this.iconLabel);

        iconSlot.appendChild(icon);
    }


    // #endregion

    // #region - CONSTRUCTOR (do not access or add attributes in the constructor) ---------------------------

    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.adoptedStyleSheets = [sheet];
    }

    // #endregion

    // #region - PUBLIC METHODS -----------------------------------------------------------------------------

    init() {
        this.#setupHTML();
        this.#initialized = true;
    }

    // #endregion

    // #region - ADDED TO DOCUMENT --------------------------------------------------------------------------

    connectedCallback() {
        this.init();
    }

    // #endregion

    // #region - REMOVED FROM DOCUMENT ----------------------------------------------------------------------

    disconnectedCallback() {
        this.#initialized = false;
    }

    // #endregion

    // #region - ATTRIBUTE(S) CHANGED -----------------------------------------------------------------------

    attributeChangedCallback(attribute, oldValue, newValue) {
        if (!this.#initialized) return;
        if (oldValue === newValue) return;

        switch (attribute) {
            case 'variant':
                this.#applyVariant();
                this.#applyIcon();
                break;
            case 'icon-label':
                this.#applyIcon();
                break;
        }
    }

    // #endregion
}

function registerAlert() {
    if (!customElements.get('fds-alert')) {
        customElements.define('fds-alert', FDSAlert);
    }
}

export default registerAlert;
