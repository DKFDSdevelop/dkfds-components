import * as CE from '../custom-element-utils';
import { generateAndVerifyUniqueId } from '../../utils/generate-unique-id';

class FDSTooltipIcon extends HTMLElement {

    // #region - PRIVATE STATIC FIELDS ----------------------------------------------------------------------

    static #ARROW_HEIGHT = 8;
    static #ARROW_DIST_TO_TARGET = 4;
    static #MIN_MARGIN = 8;
    static #MAX_WIDTH = 330;

    // #endregion

    // #region - ATTRIBUTES (can invoke attributeChangedCallback()) -----------------------------------------

    static observedAttributes = ['tooltip-text', 'sr-label', 'placement'];

    // #endregion

    // #region - GETTERS AND SETTERS ------------------------------------------------------------------------

    get tooltipText() { return this.getAttribute('tooltip-text'); }
    set tooltipText(value) { value == null ? this.removeAttribute('tooltip-text') : this.setAttribute('tooltip-text', value); }

    get srLabel() { return this.getAttribute('sr-label'); }
    set srLabel(value) { value == null ? this.removeAttribute('sr-label') : this.setAttribute('sr-label', value); }

    // #endregion

    // #region - PRIVATE INSTANCE FIELDS --------------------------------------------------------------------

    #initialized = false;
    #intersectionObserver = null;

    // #endregion

    // #region - PRIVATE EVENT HANDLERS ---------------------------------------------------------------------

    #handleClick = (event) => {
        this.toggle();
    };

    #handleFocusOut = (event) => {
        const focusLeftTooltip = !this.contains(event.relatedTarget);
        if (focusLeftTooltip) {
            this.close();
        }
    };

    #handleKeydown = (event) => {
        switch (event.key) {
            case 'Escape':
                if (this.querySelector('button').getAttribute('aria-expanded') !== 'false') {
                    this.close();
                    this.querySelector('button').focus();
                    event.stopImmediatePropagation();
                }
                break;
        }
    };

    #handleResize = () => {
        this.#updatePosition();
    };

    #handleScroll = () => {
        this.#updatePosition();
    };

    #handleIntersection = (entries) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) {
                this.close();
            }
        });
    };

    // #endregion

    // #region - PRIVATE METHODS ----------------------------------------------------------------------------

    #setupHTML() {
        if (!this.hasAttribute('tooltip-text') || !this.hasAttribute('sr-label')) return;

        const uniqueId = generateAndVerifyUniqueId('tooltip-');

        const button = document.createElement('button');
        button.classList.add('button', 'button-unstyled');
        button.setAttribute('type', 'button');
        button.setAttribute('aria-label', this.getAttribute('sr-label'));
        button.setAttribute('aria-controls', uniqueId);
        button.setAttribute('aria-expanded', 'false');
        this.appendChild(button);

        const helpIcon = CE.createSvgIcon('M478-240q21 0 35.5-14.5T528-290q0-21-14.5-35.5T478-340q-21 0-35.5 14.5T428-290q0 21 14.5 35.5T478-240Zm-36-154h74q0-33 7.5-52t42.5-52q26-26 41-49.5t15-56.5q0-56-41-86t-97-30q-57 0-92.5 30T342-618l66 26q5-18 22.5-39t53.5-21q32 0 48 17.5t16 38.5q0 20-12 37.5T506-526q-44 39-54 59t-10 73Zm38 314q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z');
        button.appendChild(helpIcon);

        const ariaLive = document.createElement('span');
        this.appendChild(ariaLive);

        const tooltip = document.createElement('span');
        tooltip.setAttribute('id', uniqueId);
        tooltip.setAttribute('tabindex', '-1');
        tooltip.classList.add('tooltip');
        tooltip.style.display = 'none';
        ariaLive.appendChild(tooltip);

        ariaLive.setAttribute('aria-atomic', 'true');
        ariaLive.setAttribute('aria-live', 'assertive');

        const tooltipArrow = document.createElement('span');
        tooltipArrow.setAttribute('aria-hidden', 'true');
        tooltipArrow.classList.add('tooltip-arrow');
        tooltipArrow.style.display = 'none';
        this.appendChild(tooltipArrow);
    }

    #setTooltipWidth() {
        const tooltip = this.querySelector('.tooltip');

        // Start with natural width
        tooltip.style.width = 'max-content';

        // Cap at max width
        if (tooltip.offsetWidth > FDSTooltipIcon.#MAX_WIDTH) { tooltip.style.width = `${FDSTooltipIcon.#MAX_WIDTH}px`; }

        // Further cap if viewport is narrower than max width
        const viewportMaxWidth = document.documentElement.clientWidth - (FDSTooltipIcon.#MIN_MARGIN * 2);
        if (tooltip.offsetWidth > viewportMaxWidth) { tooltip.style.width = `${viewportMaxWidth}px`; }
    }

    #setTooltipLeft() {
        const tooltip = this.querySelector('.tooltip');
        const buttonRect = this.querySelector('button').getBoundingClientRect();

        // Center tooltip on button
        let left = buttonRect.left + (buttonRect.width / 2) - (tooltip.offsetWidth / 2);

        // If tooltip exceeds right edge, shift left
        if (left + tooltip.offsetWidth > document.documentElement.clientWidth - FDSTooltipIcon.#MIN_MARGIN) {
            left = document.documentElement.clientWidth - FDSTooltipIcon.#MIN_MARGIN - tooltip.offsetWidth;
        }

        // If tooltip exceeds left edge (including full-width scenario), clamp to MIN_MARGIN
        if (left < FDSTooltipIcon.#MIN_MARGIN) { left = FDSTooltipIcon.#MIN_MARGIN; }

        tooltip.style.left = `${Math.round(left)}px`;
    }

    #setVerticalPlacement() {
        const tooltip = this.querySelector('.tooltip');
        const arrow = this.querySelector('.tooltip-arrow');
        const buttonRect = this.querySelector('button').getBoundingClientRect();

        // Calculate space available above and below the button
        const spaceNeeded = tooltip.offsetHeight + FDSTooltipIcon.#ARROW_HEIGHT + FDSTooltipIcon.#ARROW_DIST_TO_TARGET;
        const spaceAbove = buttonRect.top;
        const spaceBelow = window.innerHeight - buttonRect.bottom;

        // Determine placement based on preferred placement and available space
        const preferredPlacement = this.getAttribute('placement') ?? 'above';
        let actualPlacement = preferredPlacement;

        if (preferredPlacement === 'above' && spaceAbove < spaceNeeded) {
            actualPlacement = 'below';
        } else if (preferredPlacement === 'below' && spaceBelow < spaceNeeded) {
            actualPlacement = 'above';
        }

        // Position tooltip bubble and arrow based on actual placement
        if (actualPlacement === 'above') {
            tooltip.style.top = `${Math.round(buttonRect.top - tooltip.offsetHeight - FDSTooltipIcon.#ARROW_HEIGHT - FDSTooltipIcon.#ARROW_DIST_TO_TARGET + 1)}px`;
            arrow.style.left = `${Math.round(buttonRect.left + (buttonRect.width / 2))}px`;
            arrow.style.top = `${Math.round(buttonRect.top - FDSTooltipIcon.#ARROW_HEIGHT - FDSTooltipIcon.#ARROW_DIST_TO_TARGET)}px`;
            arrow.classList.add('place-above');
            arrow.classList.remove('place-below');
        } else {
            tooltip.style.top = `${Math.round(buttonRect.bottom + FDSTooltipIcon.#ARROW_HEIGHT + FDSTooltipIcon.#ARROW_DIST_TO_TARGET - 1)}px`;
            arrow.style.left = `${Math.round(buttonRect.left + (buttonRect.width / 2))}px`;
            arrow.style.top = `${Math.round(buttonRect.bottom + FDSTooltipIcon.#ARROW_DIST_TO_TARGET)}px`;
            arrow.classList.add('place-below');
            arrow.classList.remove('place-above');
        }
    }

    #updatePosition() {
        // Width must be set before left, as left depends on tooltip width
        this.#setTooltipWidth();
        this.#setTooltipLeft();
        this.#setVerticalPlacement();
    }

    #addEventListeners() {
        this.querySelector('button').addEventListener('click', this.#handleClick, false);
        this.addEventListener('focusout', this.#handleFocusOut, false);
        this.addEventListener('keydown', this.#handleKeydown, false);
    }

    #removeEventListeners() {
        this.querySelector('button').removeEventListener('click', this.#handleClick, false);
        this.removeEventListener('focusout', this.#handleFocusOut, false);
        this.removeEventListener('keydown', this.#handleKeydown, false);
    }

    #connectIntersectionObserver() {
        if (this.#intersectionObserver) return;

        this.#intersectionObserver = new IntersectionObserver(this.#handleIntersection, { threshold: 0 });
        this.#intersectionObserver.observe(this.querySelector('button'));
    }

    #disconnectIntersectionObserver() {
        if (this.#intersectionObserver) {
            this.#intersectionObserver.disconnect();
            this.#intersectionObserver = null;
        }
    }

    // #endregion

    // #region - PUBLIC METHODS -----------------------------------------------------------------------------

    init() {
        this.#setupHTML();
        this.#addEventListeners();
        this.#initialized = true;
    }

    open() {
        this.querySelector('button').setAttribute('aria-expanded', 'true');
        this.querySelector('.tooltip-arrow').style.display = 'block';
        this.querySelector('.tooltip').style.display = 'block';
        this.querySelector('.tooltip').textContent = this.getAttribute('tooltip-text');
        this.#updatePosition();

        window.addEventListener('resize', this.#handleResize, false);
        document.addEventListener('scroll', this.#handleScroll, true);
        this.#connectIntersectionObserver();
    }

    close() {
        this.querySelector('button').setAttribute('aria-expanded', 'false');
        this.querySelector('.tooltip').style.display = 'none';
        this.querySelector('.tooltip-arrow').style.display = 'none';
        this.querySelector('.tooltip').textContent = '';
        
        window.removeEventListener('resize', this.#handleResize, false);
        document.removeEventListener('scroll', this.#handleScroll, true);
        this.#disconnectIntersectionObserver();
    }

    toggle() {
        this.querySelector('button').getAttribute('aria-expanded') === 'false' ? this.open() : this.close();
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

function registerTooltipIcon() {
    if (!customElements.get('fds-tooltip-icon')) {
        customElements.define('fds-tooltip-icon', FDSTooltipIcon);
    }
}

export default registerTooltipIcon;