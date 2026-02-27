import * as Util from './fds-date-picker-utils';

class FDSDatePickerGrid extends HTMLElement {

    /* Private instance fields */

    #initialized;

    #previousMinDate;
    #previousMaxDate;
    #correctedMinDate;
    #correctedMaxDate;

    #MONTHS;
    #DAYS;
    #GRID_ROWS;
    #TOTAL_GRIDCELLS;
    #CELL_DATE_FORMAT;

    #DEFAULT_MIN_DATE;
    #DEFAULT_MAX_DATE;

    #handleKeydown;
    #handleChangeMonth;
    #handleChangeYear;
    #handlePrevMonth;
    #handleNextMonth;
    #handleDateClick;

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
        this.#redraw(dateToFocus, false);

        this.#initialized = true;
    }

    #create() {
        const gridContainer = document.createElement('div');
        gridContainer.classList.add('grid-container');
        gridContainer.setAttribute('tabindex', '-1'); // Used to prevent focus from escaping when non-clickable items are clicked
        this.appendChild(gridContainer);

        /* Create the date picker header with previous button, next button, year selection, and month selection */

        const datePickerHeader = document.createElement('div');
        datePickerHeader.classList.add('date-picker-header');

        // sr messages
        const srMessage = document.createElement('span');
        srMessage.classList.add('sr-only');
        srMessage.setAttribute('aria-live', 'polite');
        datePickerHeader.appendChild(srMessage);

        // Previous button
        const prevButton = document.createElement('button');
        prevButton.classList.add('previous-month');
        prevButton.textContent = 'Forrige';
        datePickerHeader.appendChild(prevButton);

        // Select month
        const monthSelect = document.createElement('select');
        monthSelect.setAttribute('name', 'month');
        monthSelect.setAttribute('aria-label', 'Måned');
        monthSelect.classList.add('selected-month');
        for (let i = 0; i < this.#MONTHS.length; i++) {
            monthSelect.innerHTML += `<option value="${i}">${this.#MONTHS[i].charAt(0).toUpperCase() + this.#MONTHS[i].slice(1)}</option>`;
        }
        datePickerHeader.appendChild(monthSelect);

        // Select year
        const yearSelect = document.createElement('select');
        yearSelect.setAttribute('name', 'year');
        yearSelect.setAttribute('aria-label', 'År');
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

    #redraw(date, setFocus = false) {
        const gridContainer = this.querySelector('.grid-container');

        if (!gridContainer) return;

        if (!Util.isValidDate(date)) {
            date = new Date();
        }

        /* Check if any changes were made to minimum date or maximum date */

        let updatedMinMaxDates = false;

        if (this.#previousMinDate !== this.getAttribute('min-date') ||
            this.#previousMaxDate !== this.getAttribute('max-date') ||
            !Util.isValidDate(this.#correctedMinDate) ||
            !Util.isValidDate(this.#correctedMaxDate) ||
            this.#correctedMinDate > this.#correctedMaxDate) {

            this.#previousMinDate = this.getAttribute('min-date');
            this.#previousMaxDate = this.getAttribute('max-date');
            this.#correctedMinDate = Util.stringToDate(this.getAttribute('min-date'));
            this.#correctedMaxDate = Util.stringToDate(this.getAttribute('max-date'));

            if (!Util.isValidDate(this.#correctedMinDate)) { this.#correctedMinDate = this.#DEFAULT_MIN_DATE; }
            if (!Util.isValidDate(this.#correctedMaxDate)) { this.#correctedMaxDate = this.#DEFAULT_MAX_DATE; }

            if (this.#correctedMinDate > this.#correctedMaxDate) {
                this.#correctedMinDate = this.#correctedMaxDate;
            }

            updatedMinMaxDates = true;
        }

        /* Constrain the date to always be between the minimum date and maximum date */
        date = Util.constrainDate(this.#correctedMinDate, date, this.#correctedMaxDate);

        /* Changes to minimum date or maximum date can affect the selectable years
           and requires the select to be updated */

        if (updatedMinMaxDates) {
            let minYear = this.#correctedMinDate.getFullYear();
            let maxYear = this.#correctedMaxDate.getFullYear();
            const yearSelect = this.querySelector('.selected-year');
            yearSelect.innerHTML = '';
            for (let i = minYear; i <= maxYear; i++) {
                yearSelect.innerHTML += `<option value="${i}">${i}</option>`;
            }
        }
        const year = date.getFullYear();
        gridContainer.querySelector('.selected-year').value = date.getFullYear();

        /* Disable unselectable months */

        const monthSelect = this.querySelector('.selected-month');
        const monthOptions = monthSelect.querySelectorAll('option');
        const chosenYear = this.querySelector('.selected-year').value;

        for (let i = 0; i < monthOptions.length; i++) {
            monthOptions[i].removeAttribute('disabled'); // Reset disabled status on all options
        }
        if (this.#correctedMinDate.getFullYear() === parseInt(chosenYear, 10)) {
            const minMonth = this.#correctedMinDate.getMonth();
            for (let i = 0; i < monthOptions.length; i++) {
                if (i < minMonth) {
                    monthOptions[i].setAttribute('disabled', '');
                }
            }
        }
        if (this.#correctedMaxDate.getFullYear() === parseInt(chosenYear, 10)) {
            const maxMonth = this.#correctedMaxDate.getMonth();
            for (let i = 0; i < monthOptions.length; i++) {
                if (i > maxMonth) {
                    monthOptions[i].setAttribute('disabled', '');
                }
            }
        }
        const month = date.getMonth();
        gridContainer.querySelector('.selected-month').value = month;

        /* Remove existing dates in the grid */

        // Prevent focusout event to trigger in fds-date-picker when tabindex is updated
        const activeElement = document.activeElement;
        const isDateCellFocused = activeElement && activeElement.tagName === 'TD' && activeElement.hasAttribute('data-date') && gridContainer.contains(activeElement);
        if (isDateCellFocused) {
            gridContainer.focus();
        }

        const gridcells = gridContainer.querySelectorAll('td');

        for (let i = 0; i < this.#TOTAL_GRIDCELLS; i++) {
            gridcells[i].removeAttribute('tabindex');
            gridcells[i].removeAttribute('data-date');
            gridcells[i].removeAttribute('aria-label');
            gridcells[i].removeAttribute('aria-selected');
            gridcells[i].removeAttribute('aria-disabled');
            gridcells[i].innerHTML = '';
        }

        /* Add new dates */

        const totalDays = Util.totalDaysInMonth(date);
        const offset = Util.getWeekday(Util.dateFromIntegers(year, month, 1));
        for (let i = 1; i <= totalDays; i++) {
            const gridcellDate = Util.dateFromIntegers(year, month, i);

            // Set the data-date attribute for each date cell
            gridcells[i + offset - 1].setAttribute('data-date', `${Util.ISOFormatFromDate(gridcellDate)}`);

            // Set the aria-label for each cell
            const ariaLabel = this.#CELL_DATE_FORMAT
                .replace('DAY', i)
                .replace('MONTH', this.#MONTHS[month])
                .replace('YEAR', year);
            gridcells[i + offset - 1].setAttribute('aria-label', ariaLabel);

            // If the cell is the minimum or maximum date, add additional info in the aria-label
            if (Util.datesAreEqual(gridcellDate, this.#correctedMinDate)) {
                const minAriaLabel = `${ariaLabel}, tidligste valgbare dato`;
                gridcells[i + offset - 1].setAttribute('aria-label', minAriaLabel);
            }
            else if (Util.datesAreEqual(gridcellDate, this.#correctedMaxDate)) {
                const maxAriaLabel = `${ariaLabel}, seneste valgbare dato`;
                gridcells[i + offset - 1].setAttribute('aria-label', maxAriaLabel);
            }

            // Set the content of each cell (a number from 1-31)
            gridcells[i + offset - 1].innerHTML = `${i}`;

            const dateIsBetweenMinAndMax = Util.isValidDate(this.#correctedMinDate) && Util.isValidDate(this.#correctedMaxDate) && this.#correctedMinDate <= gridcellDate && gridcellDate <= this.#correctedMaxDate;
            const dateIsGreaterThanMinNoMax = Util.isValidDate(this.#correctedMinDate) && !Util.isValidDate(this.#correctedMaxDate) && this.#correctedMinDate <= gridcellDate;
            const dateIsSmallerThanMaxNoMin = !Util.isValidDate(this.#correctedMinDate) && Util.isValidDate(this.#correctedMaxDate) && gridcellDate <= this.#correctedMaxDate;
            const noMinNoMax = !Util.isValidDate(this.#correctedMinDate) && !Util.isValidDate(this.#correctedMaxDate);

            if (dateIsBetweenMinAndMax || dateIsGreaterThanMinNoMax || dateIsSmallerThanMaxNoMin || noMinNoMax) {
                gridcells[i + offset - 1].setAttribute('aria-selected', `false`);
                gridcells[i + offset - 1].setAttribute('tabindex', '-1');
            }
            else {
                gridcells[i + offset - 1].setAttribute('aria-disabled', `true`);
            }
        }

        // If a date is selected and visible in the grid, ensure it is properly marked
        const selectedDate = this.getAttribute('selected-date');
        if (this.hasAttribute('selected-date') && Util.isValidDateStr(selectedDate)) {
            const selectedDateCell = gridContainer.querySelector(`[data-date="${selectedDate}"]`);
            // Disabled dates can not be selected
            if (selectedDateCell && !selectedDateCell.hasAttribute('aria-disabled')) {
                selectedDateCell?.setAttribute('aria-selected', 'true');
            }
        }

        // Ensure it is possible to tab to the date which caused the grid to be redrawn
        gridContainer.querySelector(`[data-date="${Util.ISOFormatFromDate(date)}"]`).setAttribute('tabindex', '0');

        // Ensure previous and next month buttons have the proper disabled state
        const prevMonthButton = this.querySelector('.previous-month');
        const nextMonthButton = this.querySelector('.next-month');

        const visibleMinDate = this.querySelector(`[data-date="${Util.ISOFormatFromDate(this.#correctedMinDate)}"]`);
        const visibleMaxDate = this.querySelector(`[data-date="${Util.ISOFormatFromDate(this.#correctedMaxDate)}"]`);

        visibleMinDate ? prevMonthButton.setAttribute('aria-disabled', 'true') : prevMonthButton.removeAttribute('aria-disabled');
        visibleMaxDate ? nextMonthButton.setAttribute('aria-disabled', 'true') : nextMonthButton.removeAttribute('aria-disabled');

        // If wanted, set focus on the date causing the redraw unless the grid is hidden or the focus is on the date input field
        const isDisplayed = this.offsetParent;
        if (setFocus && isDisplayed && document.activeElement.tagName !== 'INPUT') {
            this.querySelector('td[tabindex="0"]').focus();
        }
    }

    #keyboardNavigation(event) {
        if (event.target.hasAttribute('data-date')) {

            const focusedDay = Util.stringToDate(event.target.getAttribute('data-date'));
            const minDate = this.#correctedMinDate;
            const maxDate = this.#correctedMaxDate;

            switch (event.key) {
                case 'ArrowLeft':
                    event.preventDefault();
                    let yesterday = Util.getYesterday(focusedDay);
                    if (yesterday < minDate) { yesterday = minDate; }
                    this.#redraw(yesterday, true);
                    break;
                case 'ArrowRight':
                    event.preventDefault();
                    let tomorrow = Util.getTomorrow(focusedDay);
                    if (maxDate < tomorrow) { tomorrow = maxDate; }
                    this.#redraw(tomorrow, true);
                    break;
                case 'ArrowUp':
                    event.preventDefault();
                    let prevWeek = Util.getPrevWeek(focusedDay);
                    if (prevWeek < minDate) { prevWeek = minDate; }
                    this.#redraw(prevWeek, true);
                    break;
                case 'ArrowDown':
                    event.preventDefault();
                    let nextWeek = Util.getNextWeek(focusedDay);
                    if (maxDate < nextWeek) { nextWeek = maxDate; }
                    this.#redraw(nextWeek, true);
                    break;
                case 'Enter':
                case ' ':
                    event.preventDefault();
                    this.setAttribute('selected-date', event.target.getAttribute('data-date'));
                    this.dispatchEvent(new Event('date-clicked'));
                    break;
                case 'PageDown':
                    event.preventDefault();
                    if (event.shiftKey) {
                        let nextYear = Util.getNextYear(focusedDay);
                        if (maxDate < nextYear) { nextYear = maxDate; }
                        this.#redraw(nextYear, true);
                    }
                    else {
                        let nextMonth = Util.getNextMonth(focusedDay);
                        if (maxDate < nextMonth) { nextMonth = maxDate; }
                        this.#redraw(nextMonth, true);
                    }
                    break;
                case 'PageUp':
                    event.preventDefault();
                    if (event.shiftKey) {
                        let prevYear = Util.getPrevYear(focusedDay);
                        if (prevYear < minDate) { prevYear = minDate; }
                        this.#redraw(prevYear, true);
                    }
                    else {
                        let prevMonth = Util.getPrevMonth(focusedDay);
                        if (prevMonth < minDate) { prevMonth = minDate; }
                        this.#redraw(prevMonth, true);
                    }
                    break;
                case 'Home':
                    event.preventDefault();
                    // Go to first day of the month
                    if (event.ctrlKey) {
                        const month = parseInt(this.querySelector('.selected-month').value, 10);
                        const year = parseInt(this.querySelector('.selected-year').value, 10);
                        let firstDay = Util.dateFromIntegers(year, month, 1);
                        if (firstDay < minDate) { firstDay = minDate; }
                        this.#redraw(firstDay, true);
                    }
                    // Go to first day of the week (Monday)
                    else {
                        const weekDay = Util.getWeekday(focusedDay);
                        if (weekDay !== 0) {
                            let monday = new Date(focusedDay);
                            monday.setDate(focusedDay.getDate() - weekDay);
                            if (monday < minDate) { monday = minDate; }
                            this.#redraw(monday, true);
                        }
                    }
                    break;
                case 'End':
                    event.preventDefault();
                    // Go to last day of the month
                    if (event.ctrlKey) {
                        const month = parseInt(this.querySelector('.selected-month').value, 10);
                        const year = parseInt(this.querySelector('.selected-year').value, 10);
                        const day = Util.totalDaysInMonth(Util.dateFromIntegers(year, month, 1));
                        let lastDay = Util.dateFromIntegers(year, month, day);
                        if (maxDate < lastDay) { lastDay = maxDate; }
                        this.#redraw(lastDay, true);
                    }
                    // Go to last day of the week (Sunday)
                    else {
                        const weekDay = Util.getWeekday(focusedDay);
                        if (weekDay !== 6) {
                            let sunday = new Date(focusedDay);
                            sunday.setDate(focusedDay.getDate() + (6 - weekDay));
                            if (maxDate < sunday) { sunday = maxDate; }
                            this.#redraw(sunday, true);
                        }
                    }
                    break;
            }
        }
    }

    #selectChange(event) {
        const focusedDay = this.querySelector('td[data-date][tabindex="0"]');
        const focusedDayAsDate = Util.stringToDate(focusedDay.getAttribute('data-date'));

        let day = focusedDayAsDate.getDate();
        let month = parseInt(this.querySelector('.selected-month').value, 10);
        let year = parseInt(this.querySelector('.selected-year').value, 10);

        if (event.target === this.querySelector('.selected-month')) {
            month = parseInt(event.target.value, 10);
        }
        else if (event.target === this.querySelector('.selected-year')) {
            year = parseInt(event.target.value, 10);
        }

        const daysInNewMonth = Util.totalDaysInMonth(Util.dateFromIntegers(year, month, 1));
        if (daysInNewMonth < day) {
            day = daysInNewMonth;
        }

        const newDate = Util.dateFromIntegers(year, month, day);
        this.#redraw(newDate, false);
        event.target.focus();
    }

    #monthButtonClicked(event) {
        if (event.target.hasAttribute('aria-disabled')) return;

        const focusedDay = this.querySelector('td[data-date][tabindex="0"]');
        const focusedDayAsDate = Util.stringToDate(focusedDay.getAttribute('data-date'));
        let prevMonth = Util.getPrevMonth(focusedDayAsDate);
        let nextMonth = Util.getNextMonth(focusedDayAsDate);

        if (event.target === this.querySelector('.previous-month')) {
            if (prevMonth < this.#correctedMinDate) { prevMonth = this.#correctedMinDate; }
            this.#redraw(prevMonth, false);
        }
        else if (event.target === this.querySelector('.next-month')) {
            if (this.#correctedMaxDate < nextMonth) { nextMonth = this.#correctedMaxDate; }
            this.#redraw(nextMonth, false);
        }

        event.target.focus();

        const visibleMinDate = this.querySelector(`[data-date="${Util.ISOFormatFromDate(this.#correctedMinDate)}"]`);
        const visibleMaxDate = this.querySelector(`[data-date="${Util.ISOFormatFromDate(this.#correctedMaxDate)}"]`);
        const month = this.#MONTHS[parseInt(this.querySelector('.selected-month').value, 10)];
        const year = parseInt(this.querySelector('.selected-year').value, 10);

        if (event.target === this.querySelector('.previous-month') && visibleMinDate) {
            this.querySelector('.sr-only').textContent = `${month} ${year}, tidligste måned nået`;
        }
        else if (event.target === this.querySelector('.next-month') && visibleMaxDate) {
            this.querySelector('.sr-only').textContent = `${month} ${year}, seneste måned nået`;
        }
        else {
            this.querySelector('.sr-only').textContent = `${month} ${year}`;
        }
    }

    #dateClicked(event) {
        if (event.target.hasAttribute('data-date') && !event.target.hasAttribute('aria-disabled')) {
            this.setAttribute('selected-date', event.target.getAttribute('data-date'));
            this.dispatchEvent(new Event('date-clicked'));
        }
    }

    #updateTextDays(str) {
        const newDays = str.split(" ");
        if (newDays.length === 7) {
            this.#DAYS = newDays;
            const tableHeaders = this.querySelectorAll('th');
            for (let i = 0; i < tableHeaders.length; i++) {
                tableHeaders[i].innerHTML = `<span aria-hidden="true">${this.#DAYS[i].slice(0, 2)}</span><span class="sr-only">${this.#DAYS[i]}</span>`;
            }
        }
    }

    #updateTextMonths(str) {
        const newMonths = str.split(" ");
        if (newMonths.length === 12) {
            this.#MONTHS = newMonths;

            const header = this.querySelector('.date-picker-header');
            if (header && header.querySelector('.sr-only')) {
                header.querySelector('.sr-only').textContent = '';
            }

            const monthOptions = this.querySelectorAll('.selected-month option');
            for (let i = 0; i < monthOptions.length; i++) {
                monthOptions[i].textContent = this.#MONTHS[i].charAt(0).toUpperCase() + this.#MONTHS[i].slice(1);
            }
        }
    }

    #updateTextPrevButton(str) {
        if (this.querySelector('.previous-month')) {
            this.querySelector('.previous-month').textContent = str;
        }
    }

    #updateTextNextButton(str) {
        if (this.querySelector('.next-month')) {
            this.querySelector('.next-month').textContent = str;
        }
    }

    #updateTextDateAnnouncement(str) {
        // Check that string contains exactly one "DAY", one "MONTH", and one "YEAR" substring
        const dayCount = (str.match(/DAY/g) || []).length;
        const monthCount = (str.match(/MONTH/g) || []).length;
        const yearCount = (str.match(/YEAR/g) || []).length;

        if (dayCount === 1 && monthCount === 1 && yearCount === 1) {
            this.#CELL_DATE_FORMAT = str;
        }
    }

    /* Attributes which can invoke attributeChangedCallback() */

    static observedAttributes = ['min-date', 'max-date', 'selected-date', 'default-date', 'text-months', 'text-days', 'text-prevbutton', 'text-nextbutton', 'text-date-announcement'];

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
        this.#CELL_DATE_FORMAT = 'DAY. MONTH YEAR';

        this.#DEFAULT_MIN_DATE = new Date();
        this.#DEFAULT_MIN_DATE.setHours(0, 0, 0, 0);
        this.#DEFAULT_MAX_DATE = new Date(this.#DEFAULT_MIN_DATE);
        this.#DEFAULT_MAX_DATE.setFullYear(this.#DEFAULT_MIN_DATE.getFullYear() + 10);

        this.#previousMinDate = 0;
        this.#previousMaxDate = 0;
        this.#correctedMinDate = null;
        this.#correctedMaxDate = null;

        this.#handleKeydown = (event) => { this.#keyboardNavigation(event); };
        this.#handleChangeMonth = (event) => { this.#selectChange(event); };
        this.#handleChangeYear = (event) => { this.#selectChange(event); };
        this.#handlePrevMonth = (event) => { this.#monthButtonClicked(event); };
        this.#handleNextMonth = (event) => { this.#monthButtonClicked(event); };
        this.#handleDateClick = (event) => { this.#dateClicked(event) };
    }

    /* --------------------------------------------------
    CUSTOM ELEMENT ADDED TO DOCUMENT
    -------------------------------------------------- */

    connectedCallback() {
        if (this.#initialized) return;

        if (this.hasAttribute('text-days')) { this.#updateTextDays(this.getAttribute('text-days')); }
        if (this.hasAttribute('text-months')) { this.#updateTextMonths(this.getAttribute('text-months')); }
        if (this.hasAttribute('text-date-announcement')) { this.#updateTextDateAnnouncement(this.getAttribute('text-date-announcement')) }

        this.#init();

        if (this.hasAttribute('text-prevbutton')) { this.#updateTextPrevButton(this.getAttribute('text-prevbutton')); }
        if (this.hasAttribute('text-nextbutton')) { this.#updateTextNextButton(this.getAttribute('text-nextbutton')); }

        // Add event listeners
        this.querySelector('.grid-container').addEventListener('keydown', this.#handleKeydown, false);
        this.querySelector('.selected-month').addEventListener('change', this.#handleChangeMonth, false);
        this.querySelector('.selected-year').addEventListener('change', this.#handleChangeYear, false);
        this.querySelector('.previous-month').addEventListener('click', this.#handlePrevMonth, false);
        this.querySelector('.next-month').addEventListener('click', this.#handleNextMonth, false);
        this.querySelector('.date-picker-grid').addEventListener('click', this.#handleDateClick, false);
    }

    /* --------------------------------------------------
    CUSTOM ELEMENT REMOVED FROM DOCUMENT
    -------------------------------------------------- */

    disconnectedCallback() {
        this.#initialized = false;

        this.querySelector('.grid-container')?.removeEventListener('keydown', this.#handleKeydown, false);
        this.querySelector('.selected-month')?.removeEventListener('change', this.#handleChangeMonth, false);
        this.querySelector('.selected-year')?.removeEventListener('change', this.#handleChangeYear, false);
        this.querySelector('.previous-month')?.removeEventListener('click', this.#handlePrevMonth, false);
        this.querySelector('.next-month')?.removeEventListener('click', this.#handleNextMonth, false);
        this.querySelector('.date-picker-grid')?.removeEventListener('click', this.#handleDateClick, false);
        this.querySelector('.grid-container')?.remove();
    }

    /* --------------------------------------------------
    CUSTOM ELEMENT'S ATTRIBUTE(S) CHANGED
    -------------------------------------------------- */

    attributeChangedCallback(attribute, oldValue, newValue) {
        if (!this.#initialized && oldValue !== newValue) return;

        if (attribute === 'selected-date') {
            const date = Util.stringToDate(newValue);
            const setFocusOnDate = true;
            if (Util.isValidDate(date)) {
                this.#redraw(date, setFocusOnDate);
            }
            else {
                // An invalid date might be temporary while the user enters a date in the fds-date-picker's input field
                // Keep displaying the previous dates to give a more "steady" experience with no rapid updates
                const dateWithCurrentFocus = this.querySelector('td[tabindex="0"]')?.getAttribute('data-date');
                this.#redraw(Util.stringToDate(dateWithCurrentFocus), setFocusOnDate);
            }
            this.dispatchEvent(new Event('date-selected'));
        }

        if (attribute === 'min-date' || attribute === 'max-date') {
            const dateWithCurrentFocus = this.querySelector('td[tabindex="0"]')?.getAttribute('data-date');
            let placeFocusOnDate = Util.stringToDate(dateWithCurrentFocus);
            if (!Util.isValidDate(placeFocusOnDate)) {
                placeFocusOnDate = new Date();
            }
            this.#redraw(placeFocusOnDate, true);
        }

        if (attribute === 'text-days') { this.#updateTextDays(newValue); }

        if (attribute === 'text-months') { this.#updateTextMonths(newValue); }

        if (attribute === 'text-prevbutton') { this.#updateTextPrevButton(newValue); }

        if (attribute === 'text-nextbutton') { this.#updateTextNextButton(newValue); }

        if (attribute === 'text-date-announcement') { this.#updateTextDateAnnouncement(newValue); }
    }
}

function registerDatePickerGrid() {
    if (customElements.get('fds-date-picker-grid') === undefined) {
        window.customElements.define('fds-date-picker-grid', FDSDatePickerGrid);
    }
}

export default registerDatePickerGrid;