import { generateAndVerifyUniqueId } from '../../utils/generate-unique-id';

class FDSTooltip extends HTMLElement {

    // #region - PRIVATE STATIC FIELDS ----------------------------------------------------------------------

    static #MIN_MARGIN = 8;
    static #MAX_WIDTH = 330;

    // #endregion

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

    #getArrowDimensions() {
        const style = getComputedStyle(this);
        return {
            arrowHeight: parseInt(style.getPropertyValue('--tooltip-arrow-height')),
            arrowDistanceToTarget: parseInt(style.getPropertyValue('--tooltip-arrow-distance-to-target'))
        };
    }

    #setTooltipWidth() {
        const tooltip = this.querySelector('.tooltip');

        tooltip.style.width = 'max-content';

        if (tooltip.offsetWidth > FDSTooltip.#MAX_WIDTH) { tooltip.style.width = `${FDSTooltip.#MAX_WIDTH}px`; }

        const viewportMaxWidth = document.documentElement.clientWidth - (FDSTooltip.#MIN_MARGIN * 2);
        if (tooltip.offsetWidth > viewportMaxWidth) { tooltip.style.width = `${viewportMaxWidth}px`; }
    }

    #setTooltipLeft() {
        const tooltip = this.querySelector('.tooltip');
        const triggerRect = this.firstElementChild.getBoundingClientRect();

        // Center tooltip on trigger
        let left = triggerRect.left + (triggerRect.width / 2) - (tooltip.offsetWidth / 2);

        // If tooltip exceeds right edge, shift left
        if (left + tooltip.offsetWidth > document.documentElement.clientWidth - FDSTooltip.#MIN_MARGIN) {
            left = document.documentElement.clientWidth - FDSTooltip.#MIN_MARGIN - tooltip.offsetWidth;
        }

        // If tooltip exceeds left edge, clamp to MIN_MARGIN
        if (left < FDSTooltip.#MIN_MARGIN) { left = FDSTooltip.#MIN_MARGIN; }

        tooltip.style.left = `${Math.round(left)}px`;
    }

    #setVerticalPlacement() {
        const tooltip = this.querySelector('.tooltip');
        const arrow = this.querySelector('.tooltip-arrow');
        const triggerRect = this.firstElementChild.getBoundingClientRect();
        const { arrowHeight, arrowDistanceToTarget } = this.#getArrowDimensions();

        tooltip.style.top = `${Math.round(triggerRect.top - tooltip.offsetHeight - arrowHeight - arrowDistanceToTarget + 1)}px`;
        arrow.style.left = `${Math.round(triggerRect.left + (triggerRect.width / 2))}px`;
        arrow.style.top = `${Math.round(triggerRect.top - arrowHeight - arrowDistanceToTarget)}px`;
    }

    #updatePosition() {
        this.#setTooltipWidth();
        this.#setTooltipLeft();
        this.#setVerticalPlacement();
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