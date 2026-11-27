import * as CE from '../custom-element-utils';

let warnedAboutMultipleInstances = false;
let warnedAboutMissingLandingElement = false;

const SCROLL_ANIMATION_DURATION_MS = 200;

class FDSBackToTop extends HTMLElement {

    // #region - ATTRIBUTES (can invoke attributeChangedCallback()) -----------------------------------------

    static observedAttributes = ['button-text', 'sr-text'];

    // #endregion

    // #region - GETTERS AND SETTERS ------------------------------------------------------------------------

    get buttonText() { return this.getAttribute('button-text'); }
    set buttonText(value) { value == null ? this.removeAttribute('button-text') : this.setAttribute('button-text', value); }

    get srText() { return this.getAttribute('sr-text'); }
    set srText(value) { value == null ? this.removeAttribute('sr-text') : this.setAttribute('sr-text', value); }

    // #endregion

    // #region - PRIVATE INSTANCE FIELDS --------------------------------------------------------------------

    #initialized = false;
    #markerPassed = false;
    #markerIntersectionObserver = null;
    #scrollThreshold = 0;
    #dockingReferenceTop = null;
    #scrollAnimationFrameId = null;
    #scrollFromTime = null;
    #scrollFromY = null;

    // #endregion

    // #region - PRIVATE EVENT HANDLERS ---------------------------------------------------------------------

    #handleClick = () => {
        this.#startScrollAnimation();
    };

    #handleScrollComplete = () => {
        const landingElement = this.#findLandingElement();
        if (landingElement) {
            landingElement.focus();
        }
        else if (!warnedAboutMissingLandingElement) {
            warnedAboutMissingLandingElement = true;
            console.warn('fds-back-to-top: No <fds-back-to-top-landing> element found on the page.');
        }
    };

    #handleScrollAnimationInterruptAttempt = (event) => {
        const trigger = this.querySelector(':scope > button');
        if (event.type === 'click' && trigger && trigger.contains(event.target)) {
            this.#startScrollAnimation();
            return;
        }
        this.#cancelScrollAnimation();
    };

    #handleMarkerIntersection = (entries) => {
        entries.forEach(entry => {
            this.#markerPassed = !entry.isIntersecting && entry.boundingClientRect.bottom <= 0;
            this.#updateState();
        });
    };

    #handleScroll = () => {
        this.#updateState();
    };

    #handleResize = () => {
        this.#scrollThreshold = this.#computeScrollThreshold();
        this.#measureDockingReferenceTop();
        this.#updateState();
    };

    #handleLoad = () => {
        // When the page has fully loaded, re-measure to get the correct value of #dockingReferenceTop.
        this.#measureDockingReferenceTop();
        this.#updateState();
    };

    // #endregion

    // #region - PRIVATE METHODS ----------------------------------------------------------------------------

    #setupHTML() {
        const triggers = this.querySelectorAll(':scope > a, :scope > button');
        if (triggers.length > 1) {
            console.warn('fds-back-to-top: More than one trigger was found. Only the first one will be used.');
        }
        const trigger = triggers[0] ?? document.createElement('button');

        // Ensure type="button" on buttons
        if (trigger instanceof HTMLButtonElement) {
            trigger.setAttribute('type', 'button');
        }

        // Icon
        let icon = trigger.querySelector(':scope > svg.icon-svg');
        if (!icon) {
            icon = CE.createSvgIcon('M440-160v-487L216-423l-56-57 320-320 320 320-56 57-224-224v487h-80Z');
            trigger.appendChild(icon);
        }

        // Screen-reader-only text
        let srSpan = trigger.querySelector(':scope > span.sr-only');
        if (!srSpan) {
            srSpan = document.createElement('span');
            srSpan.className = 'sr-only';
            trigger.appendChild(srSpan);
        }
        srSpan.textContent = this.srText ?? 'Til toppen af siden';

        // Visible text (hidden below md breakpoint)
        let textSpan = trigger.querySelector(':scope > span.d-none');
        if (!textSpan) {
            textSpan = document.createElement('span');
            textSpan.className = 'd-none d-md-inline-block';
            textSpan.setAttribute('aria-hidden', 'true');
            trigger.appendChild(textSpan);
        }
        textSpan.textContent = this.buttonText ?? 'Til toppen';

        // Add the trigger if not already present
        if (!trigger.isConnected) {
            this.appendChild(trigger);
        }
    }

    #addEventListeners() {
        const trigger = this.querySelector(':scope > a, :scope > button');
        if (trigger instanceof HTMLButtonElement) {
            trigger.addEventListener('click', this.#handleClick);
        }

        this.addEventListener('fds-back-to-top-scroll-complete', this.#handleScrollComplete);

        window.addEventListener('scroll', this.#handleScroll, { passive: true });
        window.addEventListener('resize', this.#handleResize, { passive: true });

        if (document.readyState !== 'complete') {
            // The page (including fonts/images) may not be fully loaded yet, which
            // can make the measurement above unreliable. Re-measure once it is.
            window.addEventListener('load', this.#handleLoad, { once: true });
        }
    }

    #removeEventListeners() {
        const trigger = this.querySelector(':scope > a, :scope > button');
        if (trigger instanceof HTMLButtonElement) {
            trigger.removeEventListener('click', this.#handleClick);
        }

        this.removeEventListener('fds-back-to-top-scroll-complete', this.#handleScrollComplete);

        window.removeEventListener('scroll', this.#handleScroll);
        window.removeEventListener('resize', this.#handleResize);
        window.removeEventListener('load', this.#handleLoad);
    }

    #findFirstMarker() {
        return document.querySelector('fds-back-to-top-marker');
    }

    #findLandingElement() {
        return document.querySelector('fds-back-to-top-landing');
    }

    #easeOutQuad(t) {
        return 1 - (1 - t) * (1 - t);
    }

    #startScrollAnimation() {
        if (this.#scrollAnimationFrameId !== null) {
            cancelAnimationFrame(this.#scrollAnimationFrameId);
        }

        this.#scrollFromTime = performance.now();
        this.#scrollFromY = window.scrollY;

        document.addEventListener('click', this.#handleScrollAnimationInterruptAttempt);
        document.addEventListener('keydown', this.#handleScrollAnimationInterruptAttempt);

        this.#scrollAnimationFrameId = requestAnimationFrame(() => this.#stepScrollAnimation());
    }

    #stepScrollAnimation() {
        const elapsed = performance.now() - this.#scrollFromTime;
        // t is the animation progress (0-1), clamped so it never exceeds 1 after the duration has elapsed.
        const t = Math.min(elapsed / SCROLL_ANIMATION_DURATION_MS, 1);
        const y = this.#scrollFromY * (1 - this.#easeOutQuad(t));

        window.scrollTo(0, y);

        if (t < 1) {
            this.#scrollAnimationFrameId = requestAnimationFrame(() => this.#stepScrollAnimation());
        }
        else {
            this.#finishScrollAnimation();
        }
    }

    #finishScrollAnimation() {
        window.scrollTo(0, 0);

        document.removeEventListener('click', this.#handleScrollAnimationInterruptAttempt);
        document.removeEventListener('keydown', this.#handleScrollAnimationInterruptAttempt);

        this.#scrollAnimationFrameId = null;
        this.#scrollFromTime = null;
        this.#scrollFromY = null;

        this.dispatchEvent(new Event('fds-back-to-top-scroll-complete'));
    }

    #cancelScrollAnimation() {
        if (this.#scrollAnimationFrameId !== null) {
            cancelAnimationFrame(this.#scrollAnimationFrameId);
        }

        document.removeEventListener('click', this.#handleScrollAnimationInterruptAttempt);
        document.removeEventListener('keydown', this.#handleScrollAnimationInterruptAttempt);

        this.#scrollAnimationFrameId = null;
        this.#scrollFromTime = null;
        this.#scrollFromY = null;
    }

    #computeScrollThreshold() {
        const heightOfViewport = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0);
        return heightOfViewport * 2;
    }

    #isThresholdPassed() {
        return window.scrollY >= this.#scrollThreshold;
    }

    #measureTriggerHeight(trigger) {
        const height = trigger.getBoundingClientRect().height;
        if (height > 0) return height;

        // If the trigger's height is 0, The trigger is most likely hidden and 
        // therefore has no measurable height. 
        // Temporarily change display and visibility so its height can be measured.
        const originalDisplay = trigger.style.display;
        const originalVisibility = trigger.style.visibility;
        trigger.style.display = 'inline-block';
        trigger.style.visibility = 'hidden';
        const measuredHeight = trigger.getBoundingClientRect().height;
        trigger.style.display = originalDisplay;
        trigger.style.visibility = originalVisibility;

        return measuredHeight;
    }

    /**
     * When scrolling on the web page, the button changes state from 'floating' to 'docked'
     * once the actual button placement on the page is reached. To ensure a smooth visual
     * transition between the states, set the value of #dockingReferenceTop so it is known
     * exactly when the button state should switch, taking spacing such as margin into account.
     */
    #measureDockingReferenceTop() {
        const trigger = this.querySelector(':scope > a, :scope > button');
        if (!trigger) return;

        const triggerHeight = this.#measureTriggerHeight(trigger);
        if (triggerHeight <= 0) return;

        const hostStyle = getComputedStyle(this);
        const floatingBottomOffset = parseFloat(hostStyle.getPropertyValue('--fds-back-to-top-floating-offset-bottom')) || 0;
        const dockedTopGap = parseFloat(hostStyle.getPropertyValue('--fds-back-to-top-docked-margin-top')) || 0;

        const floatingTriggerTop = window.innerHeight - floatingBottomOffset - triggerHeight;

        this.#dockingReferenceTop = floatingTriggerTop - dockedTopGap;
    }

    #isPastDockingPoint() {
        return this.#dockingReferenceTop !== null && this.getBoundingClientRect().top <= this.#dockingReferenceTop;
    }

    #connectMarkerIntersectionObserver() {
        if (this.#markerIntersectionObserver) return;

        const marker = this.#findFirstMarker();
        if (!marker) return;

        this.#markerIntersectionObserver = new IntersectionObserver(this.#handleMarkerIntersection);
        this.#markerIntersectionObserver.observe(marker);
    }

    #disconnectMarkerIntersectionObserver() {
        if (this.#markerIntersectionObserver) {
            this.#markerIntersectionObserver.disconnect();
            this.#markerIntersectionObserver = null;
        }
    }

    #updateState() {
        const previousState = this.getAttribute('data-state');
        const wasHidden = previousState === null || previousState === 'hidden';

        const pastDockingPoint = this.#isPastDockingPoint();
        const thresholdPassed = this.#isThresholdPassed();
        const shouldShow = this.#markerPassed || thresholdPassed;

        let newState;
        if (!shouldShow) {
            newState = 'hidden';
        }
        else if (pastDockingPoint) {
            // Avoid having the button suddenly appear in the docked location.
            // Mostly relevant on short pages using an fds-back-to-top-marker.
            newState = (wasHidden && !thresholdPassed) ? 'hidden' : 'docked';
        }
        else {
            newState = 'floating';
        }

        if (newState !== previousState) {
            this.setAttribute('data-state', newState);
        }
    }

    // #endregion

    // #region - PUBLIC METHODS -----------------------------------------------------------------------------

    init() {
        if (this.#initialized) return;

        if (!warnedAboutMultipleInstances && document.querySelectorAll('fds-back-to-top').length > 1) {
            warnedAboutMultipleInstances = true;
            console.warn('fds-back-to-top: Multiple instances found. Only one is supported.');
        }

        this.#setupHTML();
        this.#addEventListeners();
        this.#scrollThreshold = this.#computeScrollThreshold();
        this.#measureDockingReferenceTop();
        this.#updateState();
        this.#connectMarkerIntersectionObserver();
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
        this.#cancelScrollAnimation();
        this.#removeEventListeners();
        this.#disconnectMarkerIntersectionObserver();
        this.#markerPassed = false;
        this.#dockingReferenceTop = null;
        this.#initialized = false;
        if (document.querySelectorAll('fds-back-to-top').length === 0) {
            warnedAboutMultipleInstances = false;
        }
    }

    // #endregion

    // #region - ATTRIBUTE(S) CHANGED -----------------------------------------------------------------------

    attributeChangedCallback(attribute, oldValue, newValue) {
        if (!this.#initialized) return;
        if (oldValue === newValue) return;

        switch (attribute) {
            case 'button-text':
                const textSpan = this.querySelector(':scope > a span.d-none, :scope > button span.d-none');
                if (textSpan) { textSpan.textContent = newValue ?? 'Til toppen'; }
                this.#measureDockingReferenceTop();
                this.#updateState();
                break;

            case 'sr-text':
                const srSpan = this.querySelector(':scope > a span.sr-only, :scope > button span.sr-only');
                if (srSpan) { srSpan.textContent = newValue ?? 'Til toppen af siden'; }
                this.#measureDockingReferenceTop();
                this.#updateState();
                break;
        }
    }

    // #endregion
}

function registerBackToTop() {
    if (!customElements.get('fds-back-to-top')) {
        customElements.define('fds-back-to-top', FDSBackToTop);
    }
}

export default registerBackToTop;
