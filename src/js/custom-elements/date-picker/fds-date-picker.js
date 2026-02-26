import { generateAndVerifyUniqueId } from '../../utils/generate-unique-id';
import * as Util from './fds-date-picker-utils';

class FDSDatePicker extends HTMLElement {

    /* Private instance fields */

    #initialized;
    #datePickerObserver;

    #handleDatePickerButtonClick;
    #handleFocusOut;
    #handleDateSelection;
    #handleDateClick;
    #handleCloseClick;
    #handleInput;
    #handlePageShow;
    #handleKeydown;

    #MONTHS;
    #FORMATS;

    /* Private methods */

    #setupLabel() {
        const label = this.querySelector('label');

        if (!label) return;

        const input = this.querySelector('input');

        if (input) {
            label.htmlFor = input.id;
            label.classList.toggle('disabled', input.hasAttribute('disabled'));
        }
        else {
            label.removeAttribute('for');
        }
    }

    #setupInput() {
        const input = this.querySelector('input');

        if (!input) return;

        /* Set id */

        if (!input.id) {
            input.id = generateAndVerifyUniqueId('inp');
        }

        /* Add or remove aria-describedby */

        input.removeAttribute('aria-describedby');
        const idsForAriaDescribedby = [];
        let isInvalid = false;
        const errorMessages = this.querySelectorAll('fds-error-message');
        const helpTexts = this.querySelectorAll('fds-help-text');

        const ariaDescribedbyElements = [...errorMessages, ...helpTexts];
        for (const element of ariaDescribedbyElements) {
            const notDisplayNone = window.getComputedStyle(element).display !== 'none';
            const notAriaHidden = !element.hasAttribute('aria-hidden') || element.getAttribute('aria-hidden') === 'false';

            const visibleToScreenReaders = notDisplayNone && notAriaHidden;
            if (element.id && visibleToScreenReaders) {
                idsForAriaDescribedby.push(element.id);

                if (element.tagName === 'FDS-ERROR-MESSAGE') {
                    isInvalid = true;
                }
            }
        }

        idsForAriaDescribedby.length > 0 ? input.setAttribute('aria-describedby', idsForAriaDescribedby.join(' ')) : input.removeAttribute('aria-describedby');
        isInvalid ? input.setAttribute('aria-invalid', 'true') : input.removeAttribute('aria-invalid');
    }

    #init() {
        if (this.#initialized) return;

        this.#setupObserver();

        this.#setupInput();
        this.#setupLabel();

        const input = this.querySelector('input');

        /* Add date picker button next to the input */

        if (!input.parentElement.classList.contains('input-wrapper')) {
            const inputWrapper = document.createElement('div');
            inputWrapper.classList.add('input-wrapper');
            this.appendChild(inputWrapper);

            inputWrapper.appendChild(input);

            const dateButton = document.createElement('button');
            dateButton.setAttribute('aria-haspopup', 'dialog');
            dateButton.classList.add('button', 'button-icon-only', 'date-button');
            dateButton.setAttribute('aria-label', 'Åbn datovælger');
            const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
            svg.classList.add('icon-svg');
            svg.setAttribute('focusable', 'false');
            svg.setAttribute('aria-hidden', 'true');
            const use = document.createElementNS('http://www.w3.org/2000/svg', 'use');
            use.setAttributeNS(null, 'href', `#calendar-month`);
            svg.appendChild(use);
            dateButton.appendChild(svg);
            inputWrapper.appendChild(dateButton);
        }

        /* Create child elements for the dialog */

        let grid = null;
        if (this.querySelector('fds-date-picker-grid')) {
            grid = this.querySelector('fds-date-picker-grid');
        }
        else {
            grid = document.createElement('fds-date-picker-grid');
        }
        const closeButtonContainer = document.createElement('div');
        closeButtonContainer.setAttribute('tabindex', '-1');
        const closeButton = document.createElement('button');
        closeButton.textContent = 'Luk';
        closeButton.classList.add('close-button');
        closeButtonContainer.appendChild(closeButton);

        /* Add wrapper for fds-date-picker-grid and close button */

        const datePicker = document.createElement('div');
        datePicker.classList.add('ce-date-picker', 'd-none');
        datePicker.setAttribute('role', 'dialog');
        datePicker.setAttribute('aria-modal', 'false');
        datePicker.appendChild(grid);
        datePicker.appendChild(closeButtonContainer);
        this.appendChild(datePicker);

        this.#initialized = true;
    }

    #showRequiredStatus(value) {
        const label = this.querySelector('label');
        const input = this.querySelector('input');

        if (!label || !input) return;

        let statusIndicator = label.querySelector(':scope > span.weight-normal');

        if (value === null && statusIndicator) {
            statusIndicator.remove();
            return;
        }

        if (!statusIndicator) {
            const span = document.createElement('span');
            span.className = 'weight-normal';
            label.appendChild(span);
            statusIndicator = span;
        }

        const isRequired = input.hasAttribute('required') || (input.hasAttribute('aria-required') && input.getAttribute('aria-required') !== 'false');

        let text = value;
        if (value === '' && isRequired) text = 'skal udfyldes';
        if (value === '' && !isRequired) text = 'frivilligt';

        statusIndicator.textContent = isRequired ? ` (*${text})` : ` (${text})`;
    }

    #setupObserver() {
        this.#datePickerObserver = new MutationObserver(this.#handleMutations);

        const config = {
            subtree: true,
            childList: true,
            attributes: true,
            attributeFilter: ['hidden', 'aria-hidden', 'id', 'class', 'disabled', 'required'],
            attributeOldValue: false,
            characterData: false,
            characterDataOldValue: false
        }

        this.#datePickerObserver.observe(this, config);
    }

    #handleMutations = (records, observer) => {
        //console.log(`${this.tagName} had mutations at ${Date.now()}`, records);

        const shouldUpdate = records.some(record => this.#hasRelevantMutationHappened(record.addedNodes, record.removedNodes, record.target, record.attributeName));

        if (shouldUpdate) {
            this.#setupInput();
            this.#setupLabel();
            if (this.hasAttribute('show-required-status')) this.#showRequiredStatus(this.getAttribute('show-required-status'));
        }
    }

    #hasRelevantMutationHappened(addedNodes, removedNodes, target, attributeName) {
        if (
            attributeName === 'disabled' && target?.tagName === 'INPUT' ||
            attributeName === 'required' && target?.tagName === 'INPUT' ||
            attributeName === 'class' && target?.tagName !== 'LABEL' ||
            attributeName === 'id' ||
            attributeName === 'hidden' ||
            attributeName === 'aria-hidden'
        ) {
            return true;
        }

        const relevantTagNames = ['LABEL', 'INPUT', 'FDS-ERROR-MESSAGE', 'FDS-HELP-TEXT'];
        const allNodes = [...addedNodes, ...removedNodes];
        return allNodes.some(node => relevantTagNames.includes(node?.tagName));
    }

    #updateDateButton(date) {
        if (Util.isValidDate(date)) {
            const day = date.getDate();
            const month = date.getMonth();
            const year = date.getFullYear();
            this.querySelector('.date-button').setAttribute('aria-label', `Åbn datovælger, valgt dato er ${day}. ${this.#MONTHS[month]} ${year}`);
        }
        else {
            this.querySelector('.date-button').setAttribute('aria-label', 'Åbn datovælger');
        }
    }

    #updateSelectedDateAttr(date) {
        if (Util.isValidDate(date)) {
            this.querySelector('fds-date-picker-grid').setAttribute('selected-date', Util.ISOFormatFromDate(date));
        }
        else {
            this.querySelector('fds-date-picker-grid').setAttribute('selected-date', '');
        }
    }

    #closeOnFocusOut(event) {
        if (!this.contains(event.relatedTarget)) {
            // If anything is entered in the input field, the date picker must match
            if (this.querySelector('input').value !== '') {
                const dayMonthYearFormat = true;
                const date = Util.stringToDate(this.querySelector('input').value, dayMonthYearFormat);

                this.#updateDateButton(date);
                this.#updateSelectedDateAttr(date);
            }
            this.close();
        }
    }

    #datePickerButtonClicked() {
        if (this.querySelector('input').value !== '') {
            const dayMonthYearFormat = true;
            const date = Util.stringToDate(this.querySelector('input').value, dayMonthYearFormat);

            this.#updateDateButton(date);
            this.#updateSelectedDateAttr(date);
        }

        this.toggle();

        if (!this.querySelector('.ce-date-picker').classList.contains('d-none')) {
            this.querySelector('td[tabindex="0"]').focus();
        }
    }

    #dateSelected() {
        const selectedDate = Util.stringToDate(this.querySelector('fds-date-picker-grid').getAttribute('selected-date'));

        this.#updateDateButton(selectedDate);

        // Update value in input field unless focus is on the input - otherwise, you risk moving the caret during typing
        if (document.activeElement !== this.querySelector('input')) {
            if (Util.isValidDate(selectedDate)) {
                let format = this.#FORMATS[0];
                if (this.hasAttribute('format') && this.#FORMATS.includes(this.getAttribute('format'))) {
                    format = this.getAttribute('format');
                }

                const dayWithZeros = String(selectedDate.getDate()).padStart(2, '0');
                const monthWithZeros = String(selectedDate.getMonth() + 1).padStart(2, '0');
                const yearWithZeros = String(selectedDate.getFullYear()).padStart(4, '0');

                this.querySelector('input').value = format.replace('DD', dayWithZeros).replace('MM', monthWithZeros).replace('YYYY', yearWithZeros);
            }
        }
    }

    #closeAndFocusButton() {
        this.close();
        this.querySelector('.date-button').focus();
    }

    #inputUpdated(event) {
        const dayMonthYearFormat = true;

        const inputDate = Util.stringToDate(event.target.value, dayMonthYearFormat);
        if (Util.isValidDate(inputDate)) {
            this.querySelector('fds-date-picker-grid').setAttribute('selected-date', Util.ISOFormatFromDate(inputDate));
        }
        else {
            this.querySelector('fds-date-picker-grid').setAttribute('selected-date', '');
        }
    }

    #updateOnPageshow() {
        let date = new Date('invalid');

        if (this.querySelector('input').value !== '') {
            const dayMonthYearFormat = true;
            date = Util.stringToDate(this.querySelector('input').value, dayMonthYearFormat);
            this.#updateDateButton(date);
            this.#updateSelectedDateAttr(date); // The value in the input field supersedes the selected-date attribute
        }
        else if (this.querySelector('fds-date-picker-grid').hasAttribute('selected-date')) {
            date = Util.stringToDate(this.querySelector('fds-date-picker-grid').getAttribute('selected-date'));
            this.#updateDateButton(date);
            this.#dateSelected();
        }
    }

    #keyboardNavigation(event) {
        switch (event.key) {
            case 'Tab':
                if (event.shiftKey) {
                    if (event.target === this.querySelector('.previous-month')) {
                        event.preventDefault();
                        this.querySelector('.close-button').focus();
                    }
                }
                else {
                    if (event.target === this.querySelector('.close-button')) {
                        event.preventDefault();
                        this.querySelector('.previous-month').focus();
                    }
                }
                break;
            case 'Escape':
                this.#closeAndFocusButton();
        }
    }

    /* Attributes which can invoke attributeChangedCallback() */

    static observedAttributes = ['show-required-status', 'format'];

    /* --------------------------------------------------
    CUSTOM ELEMENT CONSTRUCTOR (do not access or add attributes in the constructor)
    -------------------------------------------------- */

    constructor() {
        super();

        this.#initialized = false;
        this.#datePickerObserver = null;

        /* Set up instance fields for event handling */

        this.#handleDatePickerButtonClick = () => { this.#datePickerButtonClicked(); };
        this.#handleFocusOut = (event) => { this.#closeOnFocusOut(event); };
        this.#handleDateSelection = () => { this.#dateSelected() };
        this.#handleDateClick = () => { this.#closeAndFocusButton() };
        this.#handleCloseClick  = () => { this.#closeAndFocusButton() };
        this.#handleInput = (event) => { this.#inputUpdated(event) };
        this.#handlePageShow = () => { this.#updateOnPageshow() };
        this.#handleKeydown = (event) => { this.#keyboardNavigation(event); };

        this.#MONTHS = ['januar', 'februar', 'marts', 'april', 'maj', 'juni', 'juli', 'august', 'september', 'oktober', 'november', 'december'];
        this.#FORMATS = ['DD/MM/YYYY', 'DD-MM-YYYY', 'DD.MM.YYYY', 'DD MM YYYY', 'DD/MM-YYYY'];
    }

    /* --------------------------------------------------
    CUSTOM ELEMENT METHODS
    -------------------------------------------------- */

    open() {
        if (!this.querySelector('.ce-date-picker')) return;

        this.querySelector('.ce-date-picker').classList.remove('d-none');
    }

    close() {
        if (!this.querySelector('.ce-date-picker')) return;

        this.querySelector('.ce-date-picker').classList.add('d-none');
    }

    toggle() {
        if (!this.querySelector('.ce-date-picker')) return;

        this.querySelector('.ce-date-picker').classList.toggle('d-none');
    }

    /* --------------------------------------------------
    CUSTOM ELEMENT ADDED TO DOCUMENT
    -------------------------------------------------- */

    connectedCallback() {
        if (this.#initialized) return;

        this.#init();
        if (this.hasAttribute('show-required-status')) this.#showRequiredStatus(this.getAttribute('show-required-status'));

        // Add event listeners
        this.querySelector('.date-button').addEventListener('click', this.#handleDatePickerButtonClick, false);
        this.addEventListener('focusout', this.#handleFocusOut, false);
        this.querySelector('fds-date-picker-grid').addEventListener('date-selected', this.#handleDateSelection, false);
        this.querySelector('fds-date-picker-grid').addEventListener('date-clicked', this.#handleDateClick, false);
        this.querySelector('.close-button').addEventListener('click', this.#handleCloseClick, false);
        this.querySelector('input').addEventListener('input', this.#handleInput, false);
        this.querySelector('.ce-date-picker').addEventListener('keydown', this.#handleKeydown, false);

        // Handles previously entered input when using the browser's back button
        window.addEventListener('pageshow', this.#handlePageShow, false);
    }

    /* --------------------------------------------------
    CUSTOM ELEMENT REMOVED FROM DOCUMENT
    -------------------------------------------------- */

    disconnectedCallback() {
        this.#initialized = false;

        if (this.#datePickerObserver) {
            this.#datePickerObserver.disconnect();
            this.#datePickerObserver = null;
        }

        if (this.querySelector('.date-button') && this.#handleDatePickerButtonClick) {
            this.querySelector('.date-button').removeEventListener('click', this.#handleDatePickerButtonClick, false);
        }

        if (this.#handleFocusOut) {
            this.removeEventListener('focusout', this.#handleFocusOut, false);
        }
    }

    /* --------------------------------------------------
    CUSTOM ELEMENT'S ATTRIBUTE(S) CHANGED
    -------------------------------------------------- */

    attributeChangedCallback(attribute, oldValue, newValue) {
        if (!this.#initialized) return;

        if (attribute === 'show-required-status' && (oldValue !== newValue)) {
            this.#showRequiredStatus(newValue);
        }

        if (attribute === 'format' && (oldValue !== newValue)) {
            if (document.activeElement !== this.querySelector('input')) {

                // If the new format is valid...
                if (this.hasAttribute('format') && this.#FORMATS.includes(newValue)) {
                    const dayMonthYearFormat = true;
                    const date = Util.stringToDate(this.querySelector('input').value, dayMonthYearFormat);

                    // ...and if the input field contains a valid date...
                    if (Util.isValidDate(date)) {
                        const day = String(date.getDate()).padStart(2, '0');
                        const month = String(date.getMonth() + 1).padStart(2, '0');
                        const year = String(date.getFullYear()).padStart(4, '0');

                        // ...then update the date displayed
                        this.querySelector('input').value = newValue.replace('DD', day).replace('MM', month).replace('YYYY', year);
                    }

                }
            }
        }
    }
}

function registerDatePicker() {
    if (customElements.get('fds-date-picker') === undefined) {
        window.customElements.define('fds-date-picker', FDSDatePicker);
    }
}

export default registerDatePicker;