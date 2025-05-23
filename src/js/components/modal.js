'use strict';
/**
 * Adds click functionality to modal
 * @param {HTMLElement} $modal Modal element
 */
function Modal($modal) {
    this.$modal = $modal;
    let id = this.$modal.getAttribute('id');
    this.triggers = document.querySelectorAll('[data-module="modal"][data-target="' + id + '"]');
    this.hideOnResize = () => {
        if (window.getComputedStyle(document.querySelector('.step-indicator-button')).display === 'none') {
            this.hide();
        }
    };
    this.focusAfterTransition = () => {
        if (this.$modal.querySelector('.modal-header .modal-close') && window.getComputedStyle(this.$modal).visibility === 'visible') {
            this.$modal.querySelector('.modal-header .modal-close').focus();
        }
    }
}

/**
 * Set events
 */
Modal.prototype.init = function () {
    let triggers = this.triggers;
    for (let i = 0; i < triggers.length; i++) {
        let trigger = triggers[i];
        trigger.addEventListener('click', this.show.bind(this));
    }
    let closers = this.$modal.querySelectorAll('[data-modal-close]');
    for (let c = 0; c < closers.length; c++) {
        let closer = closers[c];
        closer.addEventListener('click', this.hide.bind(this));
    }
};

/**
 * Hide modal
 */
Modal.prototype.hide = function () {
    let modalElement = this.$modal;
    if (modalElement !== null) {
        modalElement.setAttribute('aria-hidden', 'true');

        let eventClose = new Event('fds.modal.hidden');
        modalElement.dispatchEvent(eventClose);

        let $backdrop = document.querySelector('#modal-backdrop');
        if ($backdrop) {
            $backdrop.classList.remove('show');
        }

        document.getElementsByTagName('body')[0].classList.remove('modal-open');
        modalElement.querySelector('.modal-content').classList.remove('show-modal-content');

        window.removeEventListener('resize', this.hideOnResize, false);
        modalElement.addEventListener('transitionend', this.focusAfterTransition, false);

        if (!hasForcedAction(modalElement)) {
            document.removeEventListener('keyup', handleEscape);
        }

        /* Release the focus from the modal */
        let bodyChildren = document.querySelectorAll('body > *');
        for (let c = 0; c < bodyChildren.length; c++) {
            if (bodyChildren[c].classList.contains('fds-modal-inert')) {
                bodyChildren[c].removeAttribute('inert');
                bodyChildren[c].classList.remove('fds-modal-inert');
            }
        }

        /* Place focus on the element which opened the modal */
        let dataModalOpener = document.querySelector('[data-modal-opener]');
        if (dataModalOpener !== null) {
            let opener = document.getElementById(dataModalOpener.getAttribute('data-modal-opener'));
            if (opener !== null) {
                opener.focus();
            }
            modalElement.removeAttribute('data-modal-opener');
        }
    }
};

/**
 * Show modal
 */
Modal.prototype.show = function (e = null) {
    let modalElement = this.$modal;
    let stepIndicatorModal = false;
    if (modalElement !== null) {
        if (e !== null) {
            if (e.target.classList.contains('step-indicator-button')) {
                stepIndicatorModal = true;
            }
            let openerId = e.target.getAttribute('id');
            if (openerId === null) {
                openerId = 'modal-opener-' + Math.floor(Math.random() * (9999 - 1000 + 1) + 1000);
                e.target.setAttribute('id', openerId);
            }
            modalElement.setAttribute('data-modal-opener', openerId);
        }

        // Hide open modals - FDS do not recommend more than one open modal at a time
        let activeModals = document.querySelectorAll('.fds-modal[aria-hidden=false]');
        for (let i = 0; i < activeModals.length; i++) {
            new Modal(activeModals[i]).hide();
        }

        modalElement.setAttribute('aria-hidden', 'false');

        let eventOpen = new Event('fds.modal.shown');
        modalElement.dispatchEvent(eventOpen);

        if (document.getElementById('modal-backdrop')) {
            document.getElementById('modal-backdrop').remove();
        }
        let $backdrop = document.createElement('div');
        $backdrop.classList.add('modal-backdrop');
        $backdrop.setAttribute('id', "modal-backdrop");
        document.getElementsByTagName('body')[0].appendChild($backdrop);

        if (stepIndicatorModal) {
            $backdrop.classList.add('step-indicator');
            modalElement.querySelector('.modal-content').classList.add('has-transition-effect');
            modalElement.querySelector('.modal-content').classList.add('show-modal-content');
            window.addEventListener('resize', this.hideOnResize, false);
            modalElement.addEventListener('transitionend', this.focusAfterTransition, false);
        }
        
        $backdrop.offsetHeight; // Force browser reflow to ensure the backdrop transition works
        $backdrop.classList.add('show');
        document.getElementsByTagName('body')[0].classList.add('modal-open');

        /* Focus should be on the close button or the heading in the modal. If neither exist,
           focus is placed on the modal itself. */
        if (modalElement.querySelector('.modal-header .modal-close')) {
            modalElement.querySelector('.modal-header .modal-close').focus();
        }
        else if (modalElement.querySelector('.modal-header .modal-title')) {
            modalElement.querySelector('.modal-header .modal-title').setAttribute('tabindex', '-1');
            modalElement.querySelector('.modal-header .modal-title').focus();
        }
        else {
            modalElement.setAttribute('tabindex', '-1');
            modalElement.focus();
        }
        
        if (!hasForcedAction(modalElement)) {
            document.addEventListener('keyup', handleEscape);
            $backdrop.addEventListener('click', () => {
                this.hide();
            }, false);
        }

        /* Trap the focus inside the modal */
        let bodyChildren = document.querySelectorAll('body > *');
        for (let c = 0; c < bodyChildren.length; c++) {
            let child = bodyChildren[c];
            if (child.tagName !== 'SCRIPT' && !child.classList.contains('fds-modal-container') && !child.hasAttribute('inert') && child.id !== 'modal-backdrop') {
                child.setAttribute('inert', '');
                child.classList.add('fds-modal-inert');
            }
        }
    }
};

/**
 * Close modal when hitting ESC
 * @param {KeyboardEvent} event 
 */
let handleEscape = function (event) {
    let key = event.key;
    let modalElement = document.querySelector('.fds-modal[aria-hidden=false]');
    let currentModal = new Modal(document.querySelector('.fds-modal[aria-hidden=false]'));
    if (key === 'Escape') {
        let possibleOverflowMenus = modalElement.querySelectorAll('.button-overflow-menu[aria-expanded="true"]');
        let openTooltips = modalElement.querySelectorAll('.tooltip-wrapper:not(.hide-tooltip)');
        if (possibleOverflowMenus.length === 0 && openTooltips.length === 0) {
            currentModal.hide();
        }
    }
};

function hasForcedAction(modal) {
    if (modal.getAttribute('data-modal-forced-action') === null) {
        return false;
    }
    return true;
}

export default Modal;
