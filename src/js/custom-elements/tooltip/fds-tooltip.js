import * as TooltipUtils from './fds-tooltip-utils';
import { generateAndVerifyUniqueId } from '../../utils/generate-unique-id';

class FDSTooltip extends HTMLElement {

    // #region - ATTRIBUTES (can invoke attributeChangedCallback()) -----------------------------------------

    static observedAttributes = ['tooltip-text', 'placement', 'purpose'];

    // #endregion

    // #region - GETTERS AND SETTERS ------------------------------------------------------------------------

    get tooltipText() { return this.getAttribute('tooltip-text'); }
    set tooltipText(value) { value == null ? this.removeAttribute('tooltip-text') : this.setAttribute('tooltip-text', value); }

    get placement() { return this.getAttribute('placement') ?? 'above'; }
    set placement(value) { value == null ? this.removeAttribute('placement') : this.setAttribute('placement', value); }

    get purpose() { return this.getAttribute('purpose') ?? 'hint'; }
    set purpose(value) { value == null ? this.removeAttribute('purpose') : this.setAttribute('purpose', value); }

    // #endregion

    // #region - PRIVATE INSTANCE FIELDS --------------------------------------------------------------------

    #initialized = false;

    // #endregion

    // #region - PRIVATE EVENT HANDLERS ---------------------------------------------------------------------

    #handlePointerEnter = (event) => {
        if (event.pointerType === 'mouse') {
            this.firstElementChild.classList.add('js-hover');
            setTimeout(() => {
                if (this.firstElementChild.classList.contains('js-hover')) {
                    this.open();
                }
            }, 300);
        }
    };

    #handlePointerLeave = (event) => {
        if (event.pointerType === 'mouse') {
            this.firstElementChild.classList.remove('js-hover');
            this.close();
        }
    };

    // #endregion

    // #region - PRIVATE METHODS ----------------------------------------------------------------------------

    #setupHTML() {
        if (!this.hasAttribute('tooltip-text')) return;

        const uniqueId = generateAndVerifyUniqueId('tooltip-');

        let tooltip = this.querySelector('.tooltip');
        if (tooltip === null) {
            tooltip = document.createElement('span');
            tooltip.setAttribute('id', uniqueId);
            tooltip.setAttribute('role', 'tooltip');
            tooltip.classList.add('tooltip');
            tooltip.textContent = this.getAttribute('tooltip-text');
            tooltip.style.display = 'none';
            this.appendChild(tooltip);
        }

        let tooltipArrow = this.querySelector('.tooltip-arrow');
        if (tooltipArrow === null) {
            tooltipArrow = document.createElement('span');
            tooltipArrow.classList.add('tooltip-arrow');
            tooltipArrow.setAttribute('aria-hidden', 'true');
            tooltipArrow.style.display = 'none';
            this.appendChild(tooltipArrow);
        }
    }

    #addEventListeners() {
        this.firstElementChild.addEventListener('pointerenter', this.#handlePointerEnter, false);
        this.addEventListener('pointerleave', this.#handlePointerLeave, false);
    }

    #removeEventListeners() {
        this.firstElementChild.removeEventListener('pointerenter', this.#handlePointerEnter, false);
        this.removeEventListener('pointerleave', this.#handlePointerLeave, false);
    }

    #updatePosition() {
        TooltipUtils.setTooltipWidth(this.querySelector('.tooltip'));
        TooltipUtils.setTooltipLeft(this.querySelector('.tooltip'), this.firstElementChild);
        TooltipUtils.setVerticalPlacement(this.querySelector('.tooltip'), this.querySelector('.tooltip-arrow'), this.firstElementChild, this.placement);
    }

    // #endregion

    // #region - PUBLIC METHODS -----------------------------------------------------------------------------

    init() {
        this.#setupHTML();
        this.#addEventListeners();
        this.#initialized = true;
    }

    open() {
        this.querySelector('.tooltip').style.display = 'block';
        this.querySelector('.tooltip-arrow').style.display = 'block';
        this.querySelector('.tooltip').textContent = this.getAttribute('tooltip-text');
        this.#updatePosition();
    }

    close() {
        this.querySelector('.tooltip').style.display = 'none';
        this.querySelector('.tooltip-arrow').style.display = 'none';
    }

    // #endregion

    // #region - ADDED TO DOCUMENT --------------------------------------------------------------------------

    connectedCallback() {
        this.init();
    }

    // #endregion

    // #region - REMOVED FROM DOCUMENT ----------------------------------------------------------------------

    disconnectedCallback() {
        this.#removeEventListeners();
        this.#initialized = false;
    }

    // #endregion

    // #region - ATTRIBUTE(S) CHANGED -----------------------------------------------------------------------

    attributeChangedCallback(attribute, oldValue, newValue) {
        if (!this.#initialized) return;
        if (oldValue === newValue) return;

        switch (attribute) {
            case 'tooltip-text':
                console.log('tooltip-text changed to', newValue);
                break;
        }
    }

    // #endregion
}

function registerTooltip() {
    if (!customElements.get('fds-tooltip')) {
        customElements.define('fds-tooltip', FDSTooltip);
    }
}

export default registerTooltip;