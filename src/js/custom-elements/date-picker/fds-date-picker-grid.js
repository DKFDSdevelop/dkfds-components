import * as Util from './fds-date-picker-utils';

class FDSDatePickerGrid extends HTMLElement {

    /* Private instance fields */

    #initialized;

    #MONTHS;
    #DAYS;
    #GRID_ROWS;
    #TOTAL_GRIDCELLS;

    #handleKeydown;

    /* Private methods */

    #init() {
        if (this.#initialized) return;

        this.#create();

        // Determine which date to place the focus on in the grid
        let dateToFocus = new Date();
        if (this.getAttribute('selected-date')) {
            dateToFocus = Util.stringToDate(this.getAttribute('selected-date'));
        }
        else if (this.getAttribute('default-date')) {
            dateToFocus = Util.stringToDate(this.getAttribute('default-date'));
        }
        this.#redraw(dateToFocus);

        this.#initialized = true;
    }

    #create() {
        const gridContainer = document.createElement('div');
        gridContainer.classList.add('grid-container');
        this.appendChild(gridContainer);

        /* Create the date picker header with previous button, next button, year selection, and month selection */

        const datePickerHeader = document.createElement('div');
        datePickerHeader.classList.add('date-picker-header');

        // Previous button
        const prevButton = document.createElement('button');
        prevButton.classList.add('previous-month');
        prevButton.textContent = 'Forrige';
        datePickerHeader.appendChild(prevButton);

        // Select month
        const monthSelect = document.createElement('select');
        monthSelect.setAttribute('name', 'month');
        monthSelect.setAttribute('aria-label', 'Vis måned');
        monthSelect.classList.add('selected-month');
        for (let i = 0; i < this.#MONTHS.length; i++) {
            monthSelect.innerHTML += `<option value="${i}">${this.#MONTHS[i].charAt(0).toUpperCase() + this.#MONTHS[i].slice(1)}</option>`;
        }
        datePickerHeader.appendChild(monthSelect);

        // Select year
        const yearSelect = document.createElement('select');
        yearSelect.setAttribute('name', 'year');
        yearSelect.setAttribute('aria-label', 'Vis år');
        yearSelect.classList.add('selected-year');
        datePickerHeader.appendChild(yearSelect);

        // Next button
        const nextButton = document.createElement('button');
        nextButton.classList.add('next-month');
        nextButton.textContent = 'Næste';
        datePickerHeader.appendChild(nextButton);

        gridContainer.appendChild(datePickerHeader);

        /* The grid with dates */

        const grid = document.createElement('table');
        grid.setAttribute('role', 'grid');
        grid.classList.add('date-picker-grid');

        const gridHead = document.createElement('thead');
        const gridHeadRow = document.createElement('tr');
        for (let i = 0; i < this.#DAYS.length; i++) {
            const gridHeader = document.createElement('th');
            gridHeader.setAttribute('scope', 'col');
            gridHeader.innerHTML = `<span aria-hidden="true">${this.#DAYS[i].slice(0, 2)}</span><span class="sr-only">${this.#DAYS[i]}</span>`;
            gridHeadRow.appendChild(gridHeader);
        }
        gridHead.appendChild(gridHeadRow);
        grid.appendChild(gridHead);

        const gridBody = document.createElement('tbody');
        for (let i = 0; i < this.#GRID_ROWS; i++) {
            const gridBodyRow = document.createElement('tr');
            for (let j = 0; j < this.#DAYS.length; j++) {
                const gridCell = document.createElement('td');
                gridBodyRow.appendChild(gridCell);
            }
            gridBody.appendChild(gridBodyRow);
        }
        grid.appendChild(gridBody);

        gridContainer.appendChild(grid);
    }

    #redraw(date) {
        const gridContainer = this.querySelector('.grid-container');

        if (!gridContainer) return;

        if (!Util.isValidDate(date)) {
            throw new Error('Cannot create date picker grid with invalid date');
        }

        // Ensure date, min-date, and max-date are Date objects with time 00:00:00
        let minDate = Util.stringToDate(this.getAttribute('min-date'));
        let maxDate = Util.stringToDate(this.getAttribute('max-date'));
        if (minDate > maxDate) {
            maxDate = minDate;
        }
        date = Util.constrainDate(minDate, date, maxDate);

        // Update selectable years and displayed year
        let minYear = 1900;
        let maxYear = 2100;
        const yearSelect = this.querySelector('.selected-year');
        if (Util.isValidDate(minDate)) {
            minYear = minDate.getFullYear();
        }
        if (Util.isValidDate(maxDate)) {
            maxYear = maxDate.getFullYear();
        }
        yearSelect.innerHTML = '';
        for (let i = minYear; i <= maxYear; i++) {
            yearSelect.innerHTML += `<option value="${i}">${i}</option>`;
        }
        const year = date.getFullYear();
        gridContainer.querySelector('.selected-year').value = year;

        // Disable unselectable months
        const monthSelect = this.querySelector('.selected-month');
        const monthOptions = monthSelect.querySelectorAll('option');
        const chosenYear = yearSelect.value;

        for (let i = 0; i < monthOptions.length; i++) {
            monthOptions[i].removeAttribute('disabled'); // Reset disabled status on all options
        }
        if (minDate.getFullYear() === parseInt(chosenYear, 10)) {
            const minMonth = minDate.getMonth();
            for (let i = 0; i < monthOptions.length; i++) {
                if (i < minMonth) {
                    monthOptions[i].setAttribute('disabled', '');
                }
            }
        }
        if (maxDate.getFullYear() === parseInt(chosenYear, 10)) {
            const maxMonth = maxDate.getMonth();
            for (let i = 0; i < monthOptions.length; i++) {
                if (i > maxMonth) {
                    monthOptions[i].setAttribute('disabled', '');
                }
            }
        }
        const month = date.getMonth();
        gridContainer.querySelector('.selected-month').value = month;

        // Remove existing dates in the grid
        const gridcells = gridContainer.querySelectorAll('td');

        for (let i = 0; i < this.#TOTAL_GRIDCELLS; i++) {
            gridcells[i].removeAttribute('tabindex');
            gridcells[i].removeAttribute('data-date');
            gridcells[i].removeAttribute('aria-label');
            gridcells[i].removeAttribute('aria-selected');
            gridcells[i].removeAttribute('aria-disabled');
            gridcells[i].innerHTML = '';
        }

        // Add new dates
        const totalDays = Util.totalDaysInMonth(date);
        const offset = Util.getWeekday(Util.dateFromIntegers(year, month, 1));
        for (let i = 1; i <= totalDays; i++) {
            const gridcellDate = Util.dateFromIntegers(year, month, i);

            gridcells[i + offset - 1].setAttribute('data-date', `${Util.ISOFormatFromDate(gridcellDate)}`);
            gridcells[i + offset - 1].setAttribute('aria-label', `${i}. ${this.#MONTHS[month]} ${year}`);
            gridcells[i + offset - 1].innerHTML = `${i}`;

            const dateIsBetweenMinAndMax = Util.isValidDate(minDate) && Util.isValidDate(maxDate) && minDate <= gridcellDate && gridcellDate <= maxDate;
            const dateIsGreaterThanMinnoMax = Util.isValidDate(minDate) && !Util.isValidDate(maxDate) && minDate <= gridcellDate;
            const dateIsSmallerThanMaxnoMin = !Util.isValidDate(minDate) && Util.isValidDate(maxDate) && gridcellDate <= maxDate;
            const noMinNoMax = !Util.isValidDate(minDate) && !Util.isValidDate(maxDate);

            if (dateIsBetweenMinAndMax || dateIsGreaterThanMinnoMax || dateIsSmallerThanMaxnoMin || noMinNoMax) {
                gridcells[i + offset - 1].setAttribute('aria-selected', `false`);
                gridcells[i + offset - 1].setAttribute('tabindex', '-1');
            }
            else {
                gridcells[i + offset - 1].setAttribute('aria-disabled', `true`);
            }
        }

        // If a date is selected and visible in the grid, ensure it is properly marked
        if (gridContainer.querySelector('td[aria-selected="true"]')) {
            gridContainer.querySelector('td[aria-selected="true"]').setAttribute('aria-selected', 'false');
        }
        const selectedDate = this.getAttribute('selected-date');
        if (this.hasAttribute('selected-date') && Util.isValidDateStr(selectedDate)) {
            gridContainer.querySelector(`[data-date="${selectedDate}"]`)?.setAttribute('aria-selected', 'true');
        }

        // Ensure it is possible to tab to the date which caused the grid to be redrawn
        if (gridContainer.querySelector('td[tabindex="0"]')) {
            gridContainer.querySelector('td[tabindex="0"]').setAttribute('tabindex', '-1');
        }
        gridContainer.querySelector(`[data-date="${Util.ISOFormatFromDate(date)}"]`).setAttribute('tabindex', '0');
    }

    #keyboardNavigation(event) {
        if (event.target.hasAttribute('data-date')) {

            const focusedDay = Util.stringToDate(event.target.getAttribute('data-date'));
            const minDate = Util.stringToDate(this.getAttribute('min-date'));
            const maxDate = Util.stringToDate(this.getAttribute('max-date'));

            switch (event.key) {
                case 'ArrowLeft':
                    event.preventDefault();
                    let yesterday = Util.getYesterday(focusedDay);
                    // Ensure the user can't move the focus below the minimum date
                    if (Util.isValidDate(minDate) && yesterday < minDate) {
                        yesterday = minDate;
                    }
                    // Only redraw if necessary
                    if (!this.querySelector(`[data-date="${Util.ISOFormatFromDate(yesterday)}"]`)) {
                        this.#redraw(yesterday);
                    }
                    this.querySelector(`[data-date="${Util.ISOFormatFromDate(yesterday)}"]`).focus();
                    break;
                case 'ArrowRight':
                    event.preventDefault();
                    let tomorrow = Util.getTomorrow(focusedDay);
                    // Ensure the user can't move the focus above the maximum date
                    if (Util.isValidDate(maxDate) && maxDate < tomorrow) {
                        tomorrow = maxDate;
                    }
                    this.#redraw(tomorrow);
                    this.querySelector(`[data-date="${Util.ISOFormatFromDate(tomorrow)}"]`).focus();
                    break;
                case 'ArrowDown':
                    event.preventDefault();
                    let nextWeek = Util.getNextWeek(focusedDay);
                    // Ensure the user can't move the focus above the maximum date
                    if (Util.isValidDate(maxDate) && maxDate < nextWeek) {
                        nextWeek = maxDate;
                    }
                    this.#redraw(nextWeek);
                    this.querySelector(`[data-date="${Util.ISOFormatFromDate(nextWeek)}"]`).focus();
                    break;
                case 'ArrowUp':
                    event.preventDefault();
                    let prevWeek = Util.getPrevWeek(focusedDay);
                    // Ensure the user can't move the focus below the minimum date
                    if (Util.isValidDate(minDate) && prevWeek < minDate) {
                        prevWeek = minDate;
                    }
                    this.#redraw(prevWeek);
                    this.querySelector(`[data-date="${Util.ISOFormatFromDate(prevWeek)}"]`).focus();
                    break;
                case 'Enter':
                case ' ':
                    event.preventDefault();
                    let selectedDate = focusedDay;
                    this.setAttribute('selected-date', event.target.getAttribute('data-date'));
                    this.querySelector(`[data-date="${Util.ISOFormatFromDate(selectedDate)}"]`).focus();
                    break;
                case 'PageDown':
                    event.preventDefault();
                    if (event.shiftKey) {
                        let nextYear = Util.getNextYear(focusedDay);
                        // Ensure the user can't move the focus above the maximum date
                        if (Util.isValidDate(maxDate) && maxDate < nextYear) {
                            nextYear = maxDate;
                        }
                        this.#redraw(nextYear);
                        this.querySelector(`[data-date="${Util.ISOFormatFromDate(nextYear)}"]`).focus();
                    }
                    else {
                        let nextMonth = Util.getNextMonth(focusedDay);
                        // Ensure the user can't move the focus above the maximum date
                        if (Util.isValidDate(maxDate) && maxDate < nextMonth) {
                            nextMonth = maxDate;
                        }
                        this.#redraw(nextMonth);
                        this.querySelector(`[data-date="${Util.ISOFormatFromDate(nextMonth)}"]`).focus();
                    }
                    break;
                case 'PageUp':
                    event.preventDefault();
                    if (event.shiftKey) {
                        let prevYear = Util.getPrevYear(focusedDay);
                        // Ensure the user can't move the focus below the minimum date
                        if (Util.isValidDate(minDate) && prevYear < minDate) {
                            prevYear = minDate;
                        }
                        this.#redraw(prevYear);
                        this.querySelector(`[data-date="${Util.ISOFormatFromDate(prevYear)}"]`).focus();
                    }
                    else {
                        let prevMonth = Util.getPrevMonth(focusedDay);
                        // Ensure the user can't move the focus below the minimum date
                        if (Util.isValidDate(minDate) && prevMonth < minDate) {
                            prevMonth = minDate;
                        }
                        this.#redraw(prevMonth);
                        this.querySelector(`[data-date="${Util.ISOFormatFromDate(prevMonth)}"]`).focus();
                    }
                    break;
                case 'Home':
                    event.preventDefault();
                    if (event.ctrlKey) {
                        const month = parseInt(this.querySelector('.selected-month').value, 10);
                        const year = parseInt(this.querySelector('.selected-year').value, 10);
                        let firstDay = Util.dateFromIntegers(year, month, 1);
                        // Ensure the user can't move the focus below the minimum date
                        if (Util.isValidDate(minDate) && firstDay < minDate) {
                            firstDay = minDate;
                        }
                        this.#redraw(firstDay);
                        this.querySelector(`[data-date="${Util.ISOFormatFromDate(firstDay)}"]`).focus();
                    }
                    else {
                        const weekDay = Util.getWeekday(focusedDay);
                        if (weekDay !== 0) {
                            let monday = new Date(focusedDay);
                            monday.setDate(focusedDay.getDate() - weekDay);
                            // Ensure the user can't move the focus below the minimum date
                            if (Util.isValidDate(minDate) && monday < minDate) {
                                monday = minDate;
                            }
                            this.#redraw(monday);
                            this.querySelector(`[data-date="${Util.ISOFormatFromDate(monday)}"]`).focus();
                        }
                    }
                    break;
                case 'End':
                    event.preventDefault();
                    if (event.ctrlKey) {
                        const month = parseInt(this.querySelector('.selected-month').value, 10);
                        const year = parseInt(this.querySelector('.selected-year').value, 10);
                        const day = Util.totalDaysInMonth(Util.dateFromIntegers(year, month, 1));
                        let lastDay = Util.dateFromIntegers(year, month, day);
                        // Ensure the user can't move the focus above the maximum date
                        if (Util.isValidDate(maxDate) && maxDate < lastDay) {
                            lastDay = maxDate;
                        }
                        this.#redraw(lastDay);
                        this.querySelector(`[data-date="${Util.ISOFormatFromDate(lastDay)}"]`).focus();
                    }
                    else {
                        const weekDay = Util.getWeekday(focusedDay);
                        if (weekDay !== 6) {
                            let sunday = new Date(focusedDay);
                            sunday.setDate(focusedDay.getDate() + (6 - weekDay));
                            // Ensure the user can't move the focus above the maximum date
                            if (Util.isValidDate(maxDate) && maxDate < sunday) {
                                sunday = maxDate;
                            }
                            this.#redraw(sunday);
                            this.querySelector(`[data-date="${Util.ISOFormatFromDate(sunday)}"]`).focus();
                        }
                    }
                    break;
            }
        }

    }

    /* Attributes which can invoke attributeChangedCallback() */

    static observedAttributes = ['min-date', 'max-date', 'selected-date', 'default-date'];

    /* --------------------------------------------------
    CUSTOM ELEMENT CONSTRUCTOR (do not access or add attributes in the constructor)
    -------------------------------------------------- */

    constructor() {
        super();

        this.#initialized = false;

        this.#MONTHS = ['januar', 'februar', 'marts', 'april', 'maj', 'juni', 'juli', 'august', 'september', 'oktober', 'november', 'december'];
        this.#DAYS = ['Mandag', 'Tirsdag', 'Onsdag', 'Torsdag', 'Fredag', 'Lørdag', 'Søndag'];
        this.#GRID_ROWS = 6; // To avoid potential height changes when changing month, the calendar grid has a fixed set of rows
        this.#TOTAL_GRIDCELLS = this.#GRID_ROWS * this.#DAYS.length;

        this.#handleKeydown = (event) => { this.#keyboardNavigation(event); };
    }

    /* --------------------------------------------------
    CUSTOM ELEMENT ADDED TO DOCUMENT
    -------------------------------------------------- */

    connectedCallback() {
        if (this.#initialized) return;

        this.#init();

        // Add event listeners
        this.querySelector('.grid-container').addEventListener('keydown', this.#handleKeydown, false);
    }

    /* --------------------------------------------------
    CUSTOM ELEMENT REMOVED FROM DOCUMENT
    -------------------------------------------------- */

    disconnectedCallback() {
        this.#initialized = false;

        this.querySelector('.grid-container').removeEventListener('keydown', this.#handleKeydown, false);
        this.querySelector('.grid-container')?.remove();
    }

    /* --------------------------------------------------
    CUSTOM ELEMENT'S ATTRIBUTE(S) CHANGED
    -------------------------------------------------- */

    attributeChangedCallback(attribute, oldValue, newValue) {
        if (!this.#initialized && oldValue !== newValue) return;

        if (attribute === 'selected-date') {
            this.#redraw(Util.stringToDate(this.getAttribute('selected-date')));
        }

        if (attribute === 'min-date' || attribute === 'max-date') {
            const focusableDate = this.querySelector('.grid-container')?.querySelector('td[tabindex="0"]')?.getAttribute('data-date');
            if (focusableDate) {
                this.#redraw(Util.stringToDate(focusableDate));
            }
        }
    }
}

function registerDatePickerGrid() {
    if (customElements.get('fds-date-picker-grid') === undefined) {
        window.customElements.define('fds-date-picker-grid', FDSDatePickerGrid);
    }
}

export default registerDatePickerGrid;