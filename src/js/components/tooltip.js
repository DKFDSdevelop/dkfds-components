'use strict';

const ARROW_DISTANCE_TO_TARGET = 4; // Must match '$-arrow-dist-to-target' in 'src\stylesheets\components\_tooltip.scss'
const ARROW_HEIGHT = 8;             // Must match '$-arrow-height' in 'src\stylesheets\components\_tooltip.scss'
const MIN_MARGIN = 8;               // Minimum margin to the edge of the window

let createdTooltips = [];

function Tooltip(wrapper) {
    if ((wrapper.getElementsByClassName('tooltip-target')).length === 0) {
        throw new Error(`Missing tooltip target. Add class 'tooltip-target' to element inside tooltip wrapper.`);
    }
    else if (!wrapper.hasAttribute('data-tooltip') || wrapper.dataset.tooltip === '') {
        throw new Error(`Missing tooltip text. Wrapper must have data attribute 'data-tooltip'.`);
    }
    else if (wrapper.dataset.trigger !== 'hover' && wrapper.dataset.trigger !== 'click') {
        throw new Error(`Missing trigger. Tooltip wrapper must have data attribute 'data-trigger="hover"' or 'data-trigger="click"'.`);
    }
    else if (!wrapper.hasAttribute('data-tooltip-id') || wrapper.dataset.tooltipId === '') {
        throw new Error(`Missing ID. Tooltip wrapper must have data attribute 'data-tooltip-id'.`);
    }
    else {
        this.wrapper = wrapper;
        this.target = wrapper.getElementsByClassName('tooltip-target')[0];

        this.tooltip = document.createElement('span');
        this.tooltip.classList.add('tooltip');

        this.wrapperParents = [];

        let arrow = document.createElement('span');
        arrow.classList.add('tooltip-arrow');
        arrow.setAttribute('aria-hidden', true);

        createdTooltips.push(this);
    }
}

Tooltip.prototype.init = function () {
    let wrapper = this.wrapper;
    let tooltipTarget = this.target;
    let tooltipEl = this.tooltip;
    this.updateTooltip = () => { this.updateTooltipPosition(); };

    this.hideTooltip();

    document.body.addEventListener('click', closeAllTooltips);
    document.body.addEventListener('keyup', closeOnKey);
    window.addEventListener('beforeprint', closeAllTooltips);

    /* A "true" tooltip describes the element which triggered it and is triggered on hover */
    let trueTooltip = (wrapper.dataset.trigger === 'hover');
    tooltipEl.id = wrapper.dataset.tooltipId;

    if (trueTooltip) {
        wrapper.append(tooltipEl);
        appendArrow(wrapper);
        if (tooltipTarget.classList.contains('tooltip-is-label')) {
            tooltipTarget.setAttribute('aria-labelledby', wrapper.dataset.tooltipId);
        }
        else {
            tooltipTarget.setAttribute('aria-describedby', wrapper.dataset.tooltipId);
        }
        tooltipEl.setAttribute('role', 'tooltip');
        tooltipEl.innerText = wrapper.dataset.tooltip;

        tooltipTarget.addEventListener('pointerover', (e) => {
            if (e.pointerType === 'mouse') {
                /* The tooltip should not appear if the user just briefly moves the cursor 
                   across the component. Use the 'js-hover' class as a flag to check, if
                   the hover action is persistant. */
               tooltipTarget.classList.add('js-hover');
               setTimeout(() => {
                   if (tooltipTarget.classList.contains('js-hover')) {
                       this.showTooltip();
                   }
               }, 300);
            }
        });

        tooltipTarget.addEventListener('pointerdown', (e) => {
            if (e.pointerType === 'touch') {
                tooltipTarget.classList.remove('js-pressed');
                tooltipTarget.releasePointerCapture(e.pointerId);
                tooltipTarget.classList.add('js-pressing');
                setTimeout(() => {
                    if (tooltipTarget.classList.contains('js-pressing')) {
                        tooltipTarget.classList.add('js-pressed');
                        tooltipTarget.classList.remove('js-pressing');
                    }
                }, 600);
            }
        });

        tooltipTarget.addEventListener('pointerup', (e) => {
            if (e.pointerType === 'touch') {
                if (tooltipTarget.classList.contains('js-pressed')) {
                    e.preventDefault();
                    this.showTooltip();
                }
            }
        });

        tooltipTarget.addEventListener('click', () => {
            if (document.activeElement !== tooltipTarget && !tooltipTarget.classList.contains('js-pressed')) {
                /* The tooltip target was just clicked but is not the element with focus. That 
                   means it probably shouldn't show the tooltip, for example due to an opened 
                   modal. */
                tooltipTarget.classList.remove('js-hover');
                this.hideTooltip();
            }
        });

        tooltipTarget.addEventListener('focus', () => {
            this.showTooltip();
        });

        tooltipTarget.addEventListener('pointerleave', (e) => {
            if (e.pointerType === 'mouse') {
                tooltipTarget.classList.remove('js-hover');
                let center = (tooltipTarget.getBoundingClientRect().top + tooltipTarget.getBoundingClientRect().bottom) / 2; // Use center of target due to rounding errors
                let onTooltip = false;
                if (wrapper.classList.contains('place-above')) {
                    onTooltip = tooltipTarget.getBoundingClientRect().left <= e.clientX && e.clientX <= tooltipTarget.getBoundingClientRect().right && e.clientY <= center;
                }
                else if (wrapper.classList.contains('place-below')) {
                    onTooltip = tooltipTarget.getBoundingClientRect().left <= e.clientX && e.clientX <= tooltipTarget.getBoundingClientRect().right && e.clientY >= center;
                }
                /* WCAG 1.4.13: It must be possible to hover over the tooltip.
                   Only hide the tooltip when the cursor is not hovering over it. */
                if (!onTooltip) {
                    this.hideTooltip();
                }
            }
            else if (e.pointerType === 'touch') {
                tooltipTarget.classList.remove('js-pressing');
                tooltipTarget.classList.remove('js-pressed');
            }
        });

        tooltipEl.addEventListener('pointerleave', (e) => {
            if (e.pointerType === 'mouse') {
                tooltipTarget.classList.remove('js-hover');
                let center = (tooltipEl.getBoundingClientRect().top + tooltipEl.getBoundingClientRect().bottom) / 2; // Use center of tooltip due to rounding errors
                let onTarget = false;
                if (wrapper.classList.contains('place-above')) {
                    onTarget = tooltipEl.getBoundingClientRect().left <= e.clientX && e.clientX <= tooltipEl.getBoundingClientRect().right && e.clientY >= center;
                }
                else if (wrapper.classList.contains('place-below')) {
                    onTarget = tooltipEl.getBoundingClientRect().left <= e.clientX && e.clientX <= tooltipEl.getBoundingClientRect().right && e.clientY <= center;
                }
                /* Don't remove tooltip if hover returns to the target which triggered the tooltip */
                if (!onTarget) {
                    this.hideTooltip();
                }
            }
        });

        /* If the mouse leaves while in the gap between the target and the tooltip,
           ensure that the tooltip closes */
        wrapper.addEventListener('pointerleave', (e) => {
            if (e.pointerType === 'mouse') {
                tooltipTarget.classList.remove('js-hover');
                this.hideTooltip();
            }
        });
    }
    /* The "tooltip" is actually a "toggletip", i.e. a button which turns a message on or off */
    else {
        let liveRegion = document.createElement('span');
        liveRegion.setAttribute('aria-live', 'assertive');
        liveRegion.setAttribute('aria-atomic', 'true');
        wrapper.append(liveRegion);
        liveRegion.append(tooltipEl);
        appendArrow(wrapper);
        tooltipTarget.setAttribute('aria-expanded', 'false');
        tooltipTarget.setAttribute('aria-controls', wrapper.dataset.tooltipId);

        tooltipTarget.addEventListener('click', () => {
            if (wrapper.classList.contains('hide-tooltip')) {
                this.showTooltip();
            }
            else {
                this.hideTooltip();
            }
        });
    }
};

Tooltip.prototype.hideTooltip = function() {
    window.removeEventListener('resize', this.updateTooltip, false);
    if (this.wrapper.dataset.forceVisible === 'true') {
        document.removeEventListener('scroll', this.updateTooltip, false);
        for (let p = 0; p < this.wrapperParents.length; p++) {
            this.wrapperParents[p].removeEventListener('scroll', this.updateTooltip, false);
        }
        this.wrapperParents = [];
    }
    this.wrapper.classList.add('hide-tooltip');
    if (this.target.hasAttribute('aria-expanded')) {
        this.target.setAttribute('aria-expanded', 'false');
        this.tooltip.innerText = '';
    }
    this.target.classList.remove('js-pressing');
    this.target.classList.remove('js-pressed');
}

Tooltip.prototype.showTooltip = function() {
    window.addEventListener('resize', this.updateTooltip, false);
    if (this.wrapper.dataset.forceVisible === 'true') {
        document.addEventListener('scroll', this.updateTooltip, false);
        /* The tooltip might be inside a scrollable container. The position
           must also be updated when scrolling in such a container. */
        this.wrapperParents = getParents(this.wrapper);
        for (let p = 0; p < this.wrapperParents.length; p++) {
            if (isScrollable(this.wrapperParents[p]) || hasOverflow(this.wrapperParents[p])) {
                this.wrapperParents[p].addEventListener('scroll', this.updateTooltip, false);
            }
        }
    }
    this.wrapper.classList.remove('hide-tooltip');
    if (this.target.hasAttribute('aria-expanded')) {
        this.target.setAttribute('aria-expanded', 'true');
        this.tooltip.innerText = this.wrapper.dataset.tooltip;
    }
    this.updateTooltipPosition();

    /* When a tooltip opens, all other open tooltips must close */
    for (let t = 0; t < createdTooltips.length; t++) {
        let tooltipTarget = createdTooltips[t].target;
        if (tooltipTarget !== this.target) {
            createdTooltips[t].hideTooltip();
        }
    }
}

Tooltip.prototype.isShowing = function() {
    return !(this.wrapper.classList.contains('hide-tooltip'));
}

Tooltip.prototype.updateTooltipPosition = function() {
    /* Order is important - width must always be calculated first */
    setWidth(this.tooltip);
    placeAboveOrBelow(this.wrapper, this.target, this.tooltip);
    setLeft(this.wrapper, this.target, this.tooltip);
    setTop(this.wrapper, this.target, this.tooltip);

    /* If tooltip wrapper is no longer visible, hide the tooltip */
    if (!isVisibleOnScreen(this.wrapper, this.wrapperParents)) {
        this.hideTooltip();
    }
}

function appendArrow(tooltipWrapper) {
    let arrow = document.createElement('span');
    arrow.classList.add('tooltip-arrow');
    arrow.setAttribute('aria-hidden', true);
    tooltipWrapper.append(arrow);
}

function isVisibleOnScreen(tooltipWrapper, tooltipWrapperParents) {
    let wrapperRect = tooltipWrapper.getBoundingClientRect();
    if (wrapperRect.bottom < 0 || 
        wrapperRect.right < 0 || 
        wrapperRect.left > document.documentElement.clientWidth || 
        wrapperRect.top > document.documentElement.clientHeight) {
        return false;
    }
    else if (tooltipWrapperParents.length > 0) {
        let visibleInAllParents = true;
        for (let p = 0; p < tooltipWrapperParents.length; p++) {
            if (isScrollable(tooltipWrapperParents[p]) || hasOverflow(tooltipWrapperParents[p])) {
                let parentRect = tooltipWrapperParents[p].getBoundingClientRect();
                let wrapperIsVisible = 
                    wrapperRect.bottom > parentRect.top && 
                    wrapperRect.right > parentRect.left && 
                    wrapperRect.left < parentRect.right && 
                    wrapperRect.top < parentRect.bottom;
                if (!wrapperIsVisible) {
                    visibleInAllParents = false;
                    break;
                }
            }
        }
        return visibleInAllParents;
    }
    else {
        return true;
    }
}

function isScrollable(element) {
    return element.scrollHeight > element.clientHeight || element.scrollWidth > element.clientWidth;
}

function hasOverflow(element) {
    /* Element has overflow and might need or add scrollbars, if either 
       overflow-x or overflow-y has any other value than 'visible' */
    const computedStyle = window.getComputedStyle(element);
    return computedStyle.overflowX !== 'visible' || computedStyle.overflowY !== 'visible';
}

function getParents(tooltipWrapper) {
    let currentElement = tooltipWrapper;
    var parents = [];
    while (currentElement && currentElement.parentNode) {
        currentElement = currentElement.parentNode;
        if (currentElement !== document.body && currentElement !== document) {
            parents.unshift(currentElement);
        }
        else {
            break;
        }
    }
    return parents;
}

function setWidth(tooltipEl) {
    tooltipEl.style.width = 'max-content';
    let WCAGReflowCriterion = 320; // Width of 320 px defined in WCAG 2.1, Criterion 1.4.10 "Reflow"
    let accessibleMaxWidth = WCAGReflowCriterion - (MIN_MARGIN * 2);
    if (parseInt(window.getComputedStyle(tooltipEl).width) > accessibleMaxWidth) {
        tooltipEl.style.width = accessibleMaxWidth + 'px';
    }
    /* Adjust tooltip according to the document body */
    let screenMaxWidth = document.body.getBoundingClientRect().width - (MIN_MARGIN * 2);
    if (parseInt(window.getComputedStyle(tooltipEl).width) > screenMaxWidth) {
        tooltipEl.style.width = screenMaxWidth + 'px';
    }
}

function placeAboveOrBelow(tooltipWrapper, tooltipTarget, tooltipEl) {
    /* Calculate where to place tooltip */
    let spaceAbove = tooltipTarget.getBoundingClientRect().top;
    if (document.body.getBoundingClientRect().top > 0) {
        spaceAbove = tooltipTarget.getBoundingClientRect().top - document.body.getBoundingClientRect().top;
    }
    let spaceBelow = window.innerHeight - tooltipTarget.getBoundingClientRect().bottom;
    if (document.body.getBoundingClientRect().bottom < window.innerHeight) {
        spaceBelow = document.body.getBoundingClientRect().bottom - tooltipTarget.getBoundingClientRect().bottom;
    }
    let height = tooltipEl.getBoundingClientRect().height + ARROW_DISTANCE_TO_TARGET + ARROW_HEIGHT;
    let placement = 'above'; // Default
    if (tooltipWrapper.dataset.position === 'below' && spaceBelow >= height || (height > spaceAbove)) {
        placement = 'below';
    }
    
    /* Place tooltip */
    if (placement === 'above') {
        tooltipWrapper.classList.add('place-above');
        tooltipWrapper.classList.remove('place-below');
    }
    else if (placement === 'below') {
        tooltipWrapper.classList.add('place-below');
        tooltipWrapper.classList.remove('place-above');
    }
}

function setLeft(tooltipWrapper, tooltipTarget, tooltipEl) {
    
    let tooltipTargetRect = tooltipTarget.getBoundingClientRect();
    let tooltipRect = tooltipEl.getBoundingClientRect();

    /* Tooltip adjusted based on 'position: fixed' */
    if (tooltipWrapper.dataset.forceVisible === 'true') {

        /* Center the tooltip on the tooltip arrow */
        let left = tooltipTargetRect.left + ((tooltipTargetRect.width - tooltipRect.width) / 2);
        tooltipEl.style.left = Math.round(left) + 'px';

        /* If the tooltip exceeds the left side of the screen, adjust it */
        tooltipEl.classList.remove('open-right');
        tooltipEl.classList.remove('open-left');
        const ARROW_BORDER_DISTANCE = 21; // Distance in px from the arrow tip to the border of the tooltip when 'open-right' or 'open-left' is added
        if (left < MIN_MARGIN) {
            let adjustedLeft = tooltipTargetRect.left - ARROW_BORDER_DISTANCE + (tooltipTargetRect.width / 2);
            tooltipEl.style.left = adjustedLeft + 'px';
            tooltipEl.classList.add('open-right');
            if (document.body.clientWidth - tooltipEl.getBoundingClientRect().right - MIN_MARGIN < 0) {
                let newWidth = document.body.clientWidth - tooltipEl.getBoundingClientRect().left - MIN_MARGIN;
                tooltipEl.style.width = newWidth + 'px';
            }
        }
        /* If the tooltip exceeds the right side of the screen, adjust it */
        else if (tooltipTargetRect.left + (tooltipTargetRect.width / 2) + (tooltipRect.width / 2) > (document.body.clientWidth - MIN_MARGIN)) {
            let adjustedLeft = tooltipTargetRect.right + ARROW_BORDER_DISTANCE - tooltipRect.width - (tooltipTargetRect.width / 2);
            tooltipEl.style.left = adjustedLeft + 'px';
            tooltipEl.classList.add('open-left');
            if (tooltipEl.getBoundingClientRect().left < MIN_MARGIN) {
                let newWidth = tooltipEl.getBoundingClientRect().right - MIN_MARGIN;
                tooltipEl.style.width = newWidth + 'px';
                tooltipEl.style.left = MIN_MARGIN + 'px';
            }
        }
    }

    /* Tooltip adjusted based on 'position: absolute' */
    else {

        /* Center the tooltip on the tooltip arrow */
        let left = (tooltipTargetRect.width - tooltipRect.width)/2;
        tooltipEl.style.left = Math.round(left) + 'px';

        /* If the tooltip exceeds the left side of the screen, adjust it */
        if (tooltipEl.getBoundingClientRect().left < document.body.getBoundingClientRect().left + MIN_MARGIN) {
            let pixelsExceeded = document.body.getBoundingClientRect().left + MIN_MARGIN - tooltipEl.getBoundingClientRect().left;
            let adjustedLeft = pixelsExceeded + left;
            tooltipEl.style.left = Math.round(adjustedLeft) + 'px';
        }
        /* If the tooltip exceeds the right side of the screen, adjust it */
        else if (tooltipEl.getBoundingClientRect().right > document.body.getBoundingClientRect().right - MIN_MARGIN) {
            let pixelsExceeded = document.body.getBoundingClientRect().right - MIN_MARGIN - tooltipEl.getBoundingClientRect().right;
            let adjustedLeft = pixelsExceeded + left;
            tooltipEl.style.left = Math.round(adjustedLeft) + 'px';
        }
    }
}

function setTop(tooltipWrapper, tooltipTarget, tooltipEl) {
    let arrowAdjustment = 1; // Must be between 0 and ARROW_HEIGHT - determines how much of the arrow is visible
    let spaceNeededForEntireTooltip = tooltipEl.getBoundingClientRect().height + ARROW_HEIGHT + ARROW_DISTANCE_TO_TARGET - arrowAdjustment;
    let spaceNeededForTooltipArrow = ARROW_HEIGHT + ARROW_DISTANCE_TO_TARGET - arrowAdjustment;

    let aboveTopValue = 0 - spaceNeededForEntireTooltip;
    let belowTopValue = tooltipTarget.getBoundingClientRect().height + spaceNeededForTooltipArrow;

    if (tooltipWrapper.dataset.forceVisible === 'true') {
        aboveTopValue = tooltipTarget.getBoundingClientRect().top - spaceNeededForEntireTooltip;;
        belowTopValue = tooltipTarget.getBoundingClientRect().bottom + spaceNeededForTooltipArrow;
    }

    if (tooltipWrapper.classList.contains('place-above')) {
        tooltipEl.style.top = aboveTopValue + 'px';
    }
    else if (tooltipWrapper.classList.contains('place-below')) {
        tooltipEl.style.top = belowTopValue + 'px';
    }
}

function closeAllTooltips(event) {
    for (let t = 0; t < createdTooltips.length; t++) {
        let target = createdTooltips[t].target;
        let tooltip = createdTooltips[t].tooltip;
        let clickedOnTarget = target.getBoundingClientRect().left <= event.clientX && 
                              event.clientX <= target.getBoundingClientRect().right && 
                              target.getBoundingClientRect().top <= event.clientY && 
                              event.clientY <= target.getBoundingClientRect().bottom;
        let clickedOnTooltip = window.getComputedStyle(tooltip).display !== 'none' &&
                               tooltip.getBoundingClientRect().left <= event.clientX && 
                               event.clientX <= tooltip.getBoundingClientRect().right && 
                               tooltip.getBoundingClientRect().top <= event.clientY && 
                               event.clientY <= tooltip.getBoundingClientRect().bottom;
        if (!clickedOnTarget && target !== document.activeElement && !clickedOnTooltip) {
            createdTooltips[t].hideTooltip();
        }
        else if (event.type === 'beforeprint') {
            createdTooltips[t].hideTooltip();
        }
    }
}

function closeOnKey(e) {
    let key = e.key;
    if (key === 'Tab') {
        for (let t = 0; t < createdTooltips.length; t++) {
            let target = createdTooltips[t].target;
            /* If the user is tabbing to an element, where a tooltip already is open,
               keep it open */
            if (document.activeElement !== target && createdTooltips[t].isShowing()) {
                createdTooltips[t].hideTooltip();
            }
        }
    }
    else if (key === 'Escape') {
        let tooltipClosed = false;
        for (let t = 0; t < createdTooltips.length; t++) {
            if (createdTooltips[t].isShowing()) {
                createdTooltips[t].hideTooltip();
                tooltipClosed = true;
            }
        }
        /* If Escape closed a tooltip, ensure that this is the only thing happening 
           on the key press. Otherwise, the Escape key might close a tooltip in a modal
           AND the modal itself in a single key press. */
        if (tooltipClosed) {
            e.stopImmediatePropagation();
        }
    }
}

export default Tooltip;
