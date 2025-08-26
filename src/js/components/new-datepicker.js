'use strict';

const MONTHS = ['januar', 'februar', 'marts', 'april', 'maj', 'juni', 'juli', 'august', 'september', 'oktober', 'november', 'december'];
const DAYS = ['Mandag', 'Tirsdag', 'Onsdag', 'Torsdag', 'Fredag', 'Lørdag', 'Søndag'];
const GRID_ROWS = 6; // To avoid potential height changes when changing month, the calendar grid has a fixed set of rows
const TOTAL_GRIDCELLS = GRID_ROWS * DAYS.length;

let datePickerDialogs = [];
let lastFocusedDatePickerWrapper = null;

/**
 * Add functionality to date picker component
 *
 * @param {HTMLDivElement} newDatePicker - HTML element with the class "new-date-picker"
 * @constructor
 */
function NewDatePicker(newDatePicker) {
    this.datePicker = newDatePicker;
    this.datePickerWrapper = newDatePicker.querySelector('.new-date-picker-wrapper');
    this.datePickerInput = newDatePicker.querySelector('.form-input');
    this.datePickerButton = newDatePicker.querySelector('.button-icon-only');
    if (this.datePickerButton) {
        this.datePickerWrapper = document.createElement('div');
        this.datePickerWrapper.classList.add('new-date-picker-wrapper');
        document.body.appendChild(this.datePickerWrapper);
        datePickerDialogs.push(this);
    }
}

/**
 * Initialize the date picker
 */
NewDatePicker.prototype.init = function () {
    this.createCalendarGrid();
    this.redrawCalendarGrid(new Date());

    document.body.addEventListener('click', closeAllDatePickers);
    document.body.addEventListener('focusin', removeHiddenOnFocusMove);
    document.addEventListener('keydown', closeDatePickerDialogsOnKeydown);

    if (this.datePickerButton) {
        this.datePickerWrapper.classList.add('d-none');

        this.datePickerButton.addEventListener('click', (e) => {
            if (this.datePickerWrapper.classList.contains('d-none')) {
                e.stopPropagation(); // Prevent the body click event listener from triggering
                closeAllDatePickers(); // Ensure no other date picker dialogs are open
                this.open();
            }
        });

        this.datePickerWrapper.setAttribute('role', 'dialog');
        this.datePickerWrapper.setAttribute('aria-modal', 'true');
        this.datePickerWrapper.setAttribute('aria-label', 'Vælg en dato');
        this.datePickerWrapper.setAttribute('tabindex', '-1'); // Ensure focus stays in the date picker when non-clickable element is clicked
    }

    /* Make dates selectable with click */
    this.datePickerWrapper.addEventListener('click', (e) => {
        if (isDialog(this.datePickerWrapper)) {
            e.stopPropagation(); // Prevent the body click event listener from triggering
        }
        e.preventDefault();
        if (e.target.getAttribute('data-date')) {
            let clickedDate = new Date(e.target.getAttribute('data-date'));
            let dateSelectable = e.target.getAttribute('aria-selected');

            if (dateSelectable) {
                this.selectDate(clickedDate);

                if (isDialog(this.datePickerWrapper)) {
                    let day = this.datePickerWrapper.querySelector('td[aria-selected="true"]').textContent;
                    let month = this.datePickerWrapper.querySelector('.selected-month').value;
                    let year = this.datePickerWrapper.querySelector('.selected-year').value;
                    this.datePickerButton.querySelector('.sr-only').textContent = `Åbn datovælger, valgt dato er ${day}. ${MONTHS[month]} ${year}`;
                    this.close();
                    this.datePickerButton.focus();
                }
                else {
                    this.placeFocusOnDate(clickedDate);
                }

                if (this.datePickerInput) {
                    let day = String(clickedDate.getDate()).padStart(2, '0');
                    let month = String(clickedDate.getMonth() + 1).padStart(2, '0');
                    let year = String(clickedDate.getFullYear()).padStart(2, '0');
                    this.datePickerInput.value = `${day}/${month}/${year}`;
                }
            }
        }
    });

    if (this.datePickerInput) {
        this.datePickerInput.addEventListener('input', (e) => {
            const input = e.target.value;
            const regex = /(\d{1,2})[\/\-\. ](\d{1,2})[\/\-\. ](\d{1,4})/;

            const match = input.match(regex);
            if (match) {
                const day = match[1];
                const month = match[2];
                const year = match[3];
                const date = new Date(ISOFormatFromNumbers(year, month, day));

                let monthRange = daysInMonth(new Date(ISOFormatFromNumbers(year, month, 1)));

                let invalidDateFormat = isNaN(date.getTime());
                let dayInMonthRange = (parseInt(day, 10) < monthRange);

                if (!invalidDateFormat && dayInMonthRange) {
                    this.selectDate(date);
                }
                else {
                    this.deselectDate();
                }
            }
        });
    }

    /* Add keyboard functionality */
    this.datePickerWrapper.addEventListener('keydown', (e) => {
        let key = e.key;
        let focusedDay = this.datePickerWrapper.querySelector('td[data-date][tabindex="0"]');
        let focusOnDate = e.target.getAttribute('data-date');

        switch (key) {
            case 'ArrowLeft':
                if (focusOnDate) {
                    e.preventDefault();
                    let yesterday = getYesterday(new Date(focusedDay.getAttribute('data-date')));
                    if (!isDateVisible(yesterday, this.datePickerWrapper)) {
                        this.redrawCalendarGrid(yesterday);
                    }
                    this.placeFocusOnDate(yesterday);
                }
                break;
            case 'ArrowRight':
                if (focusOnDate) {
                    e.preventDefault();
                    let tomorrow = getTomorrow(new Date(focusedDay.getAttribute('data-date')));
                    if (!isDateVisible(tomorrow, this.datePickerWrapper)) {
                        this.redrawCalendarGrid(tomorrow);
                    }
                    this.placeFocusOnDate(tomorrow);
                }
                break;
            case 'ArrowDown':
                break;
            case 'ArrowUp':
                break;
            case 'Enter':
            case ' ':
                if (focusOnDate) {
                    e.preventDefault();

                    let selectedDate = new Date(e.target.getAttribute('data-date'));
                    this.selectDate(selectedDate);

                    if (isDialog(this.datePickerWrapper)) {
                        let day = this.datePickerWrapper.querySelector('td[aria-selected="true"]').textContent;
                        let month = this.datePickerWrapper.querySelector('.selected-month').value;
                        let year = this.datePickerWrapper.querySelector('.selected-year').value;
                        this.datePickerButton.querySelector('.sr-only').textContent = `Åbn datovælger, valgt dato er ${day}. ${MONTHS[month]} ${year}`;
                        this.close();
                        this.datePickerButton.focus();
                    }
                    else {
                        this.placeFocusOnDate(selectedDate);
                    }

                    if (this.datePickerInput) {
                        let day = String(selectedDate.getDate()).padStart(2, '0');
                        let month = String(selectedDate.getMonth() + 1).padStart(2, '0');
                        let year = String(selectedDate.getFullYear()).padStart(2, '0');
                        this.datePickerInput.value = `${day}/${month}/${year}`;
                    }
                }
                break;
            case 'Escape':
                e.preventDefault();
                this.close();
                this.datePickerButton.focus();
                break;
            case 'PageDown':
                break;
            case 'PageUp':
                break;
            case 'Home':
                if (e.ctrlKey) { }
                break;
            case 'End':
                if (e.ctrlKey) { }
                break;
            case 'Tab':
                let focusLeftDate = e.target.getAttribute('data-date');
                let focusLeftPreviousButton = e.target.classList.contains('previous-month');

                if (focusLeftDate && !e.shiftKey && isDialog(this.datePickerWrapper)) {
                    e.preventDefault();
                    this.datePickerWrapper.querySelector('.previous-month').focus();
                }
                else if (focusLeftPreviousButton && e.shiftKey && isDialog(this.datePickerWrapper)) {
                    e.preventDefault();
                    this.datePickerWrapper.querySelector('td[tabindex="0"]').focus();
                }
                break;
        }
    });

    /* Update grid when month is changed */
    this.datePickerWrapper.querySelector('.selected-month').addEventListener('change', (e) => {
        let day = 1;
        let month = parseInt(e.target.value) + 1;
        let year = this.datePickerWrapper.querySelector('.selected-year').value;
        let newDate = new Date(ISOFormatFromNumbers(year, month, day));
        this.redrawCalendarGrid(newDate);
    });

    /* Update grid when year is changed */
    this.datePickerWrapper.querySelector('.selected-year').addEventListener('change', (e) => {
        let day = 1;
        let month = parseInt(this.datePickerWrapper.querySelector('.selected-month').value) + 1;
        let year = e.target.value;
        let newDate = new Date(ISOFormatFromNumbers(year, month, day));
        this.redrawCalendarGrid(newDate);
    });
}

/**
 * Build the calendar header and grid
 */
NewDatePicker.prototype.createCalendarGrid = function () {

    /* The date picker header with navigation options */

    let datePickerHeader = document.createElement('div');
    datePickerHeader.classList.add('date-picker-header');

    let previousButton = document.createElement('button');
    previousButton.classList.add('previous-month');
    previousButton.textContent = 'Forrige';
    datePickerHeader.appendChild(previousButton);

    let monthSelect = document.createElement('select');
    monthSelect.setAttribute('name', 'month');
    monthSelect.setAttribute('aria-label', 'Vis måned');
    monthSelect.classList.add('selected-month');
    for (let i = 0; i < MONTHS.length; i++) {
        monthSelect.innerHTML += `<option value="${i}">${MONTHS[i].charAt(0).toUpperCase() + MONTHS[i].slice(1)}</option>`;
    }
    datePickerHeader.appendChild(monthSelect);

    let yearSelect = document.createElement('select');
    yearSelect.setAttribute('name', 'year');
    yearSelect.setAttribute('aria-label', 'Vis år');
    yearSelect.classList.add('selected-year');
    let minYear = 1900;
    let maxYear = 2100;
    if (this.datePicker.getAttribute('data-min-date')) {
        minYear = parseInt(new Date(this.datePicker.getAttribute('data-min-date')).getFullYear(), 10);
    }
    else {
        this.datePicker.setAttribute('data-min-date', `${minYear}-01-01`);
    }
    if (this.datePicker.getAttribute('data-max-date')) {
        maxYear = parseInt(new Date(this.datePicker.getAttribute('data-max-date')).getFullYear(), 10);
    }
    else {
        this.datePicker.setAttribute('data-max-date', `${maxYear}-12-31`);
    }
    if (maxYear < minYear) {
        throw new Error(`max-date must be greater than min-date`);
    }
    for (let i = minYear; i <= maxYear; i++) {
        yearSelect.innerHTML += `<option value="${i}">${i}</option>`;
    }
    datePickerHeader.appendChild(yearSelect);

    let nextButton = document.createElement('button');
    nextButton.classList.add('next-month');
    nextButton.textContent = 'Næste';
    datePickerHeader.appendChild(nextButton);

    this.datePickerWrapper.appendChild(datePickerHeader);

    /* The date picker grid with dates */

    let grid = document.createElement('table');
    grid.setAttribute('role', 'grid');
    grid.classList.add('new-date-picker-grid');

    let gridHead = document.createElement('thead');
    let gridHeadRow = document.createElement('tr');
    for (let i = 0; i < DAYS.length; i++) {
        let gridHeader = document.createElement('th');
        gridHeader.setAttribute('scope', 'col');
        gridHeader.innerHTML = `<span aria-hidden="true">${DAYS[i].slice(0, 2)}</span><span class="sr-only">${DAYS[i]}</span>`;
        gridHeadRow.appendChild(gridHeader);
    }
    gridHead.appendChild(gridHeadRow);
    grid.appendChild(gridHead);

    let gridBody = document.createElement('tbody');
    for (let i = 0; i < GRID_ROWS; i++) {
        let gridBodyRow = document.createElement('tr');
        for (let j = 0; j < DAYS.length; j++) {
            let gridCell = document.createElement('td');
            gridBodyRow.appendChild(gridCell);
        }
        gridBody.appendChild(gridBodyRow);
    }
    grid.appendChild(gridBody);

    this.datePickerWrapper.appendChild(grid);
};

/**
 * Render the grid for a given month
 *
 * @param {Date} date - Any date in the month to render
 */
NewDatePicker.prototype.redrawCalendarGrid = function (date) {
    date = correctDate(this.minDate(), this.maxDate(), date);

    let year = date.getFullYear();
    let month = date.getMonth();
    let gridcells = this.datePickerWrapper.querySelectorAll('td');

    // Update displayed year and month
    this.datePickerWrapper.querySelector('.selected-month').value = month;
    this.datePickerWrapper.querySelector('.selected-year').value = year;

    // Remove existing dates in the grid
    for (let i = 0; i < TOTAL_GRIDCELLS; i++) {
        gridcells[i].removeAttribute('tabindex');
        gridcells[i].removeAttribute('data-date');
        gridcells[i].removeAttribute('aria-label');
        gridcells[i].removeAttribute('aria-selected');
        gridcells[i].removeAttribute('aria-disabled');
        gridcells[i].innerHTML = '';
    }

    // Add new dates
    let totalDays = daysInMonth(date);
    let offset = getWeekday(new Date(ISOFormatFromNumbers(year, month + 1, 1)));
    for (let i = 1; i <= totalDays; i++) {
        let gridcellDate = new Date(ISOFormatFromNumbers(year, month + 1, i));
        gridcells[i + offset - 1].setAttribute('data-date', `${ISOFormatFromDate(gridcellDate)}`);
        gridcells[i + offset - 1].setAttribute('aria-label', `${i}. ${MONTHS[month]} ${year}`);
        gridcells[i + offset - 1].innerHTML = `${i}`; // TODO: aria-hide the value and move aria-label as sr-only content. Several screen readers read both value and aria-label
        if (this.minDate().getTime() <= gridcellDate.getTime() && gridcellDate.getTime() <= this.maxDate().getTime()) {
            gridcells[i + offset - 1].setAttribute('aria-selected', `false`);
            gridcells[i + offset - 1].setAttribute('tabindex', '-1');
        }
        else {
            gridcells[i + offset - 1].setAttribute('aria-disabled', `true`);
        }
    }

    // If a date has been selected, apply correct styling and attributes
    if (this.datePicker.getAttribute('data-selected-date')) {
        let selectedDate = this.datePicker.getAttribute('data-selected-date');
        this.selectDate(new Date(selectedDate));
    }

    // The grid must always have a focusable element
    if (!this.datePickerWrapper.querySelector('td[data-date][tabindex="0"]')) {
        this.datePickerWrapper.querySelector(`[data-date="${ISOFormatFromDate(date)}"]`).setAttribute('tabindex', '0');
    }

    // Disable unselectable months
    let monthSelect = this.datePickerWrapper.querySelector('.selected-month');
    let yearSelect = this.datePickerWrapper.querySelector('.selected-year');
    let monthOptions = monthSelect.querySelectorAll('option');
    let chosenYear = yearSelect.value;

    for (let i = 0; i < monthOptions.length; i++) {
        monthOptions[i].removeAttribute('disabled'); // Reset disabled status on all options
    }
    if (this.minDate().getFullYear() === parseInt(chosenYear)) {
        let minMonth = this.minDate().getMonth();
        for (let i = 0; i < monthOptions.length; i++) {
            if (i < minMonth) {
                monthOptions[i].setAttribute('disabled', '');
            }
        }
    }
    if (this.maxDate().getFullYear() === parseInt(chosenYear)) {
        let maxMonth = this.maxDate().getMonth();
        for (let i = 0; i < monthOptions.length; i++) {
            if (i > maxMonth) {
                monthOptions[i].setAttribute('disabled', '');
            }
        }
    }
};

/**
 * Open the date picker dialog
 */
NewDatePicker.prototype.open = function () {
    if (isDialog(this.datePickerWrapper)) {
        this.datePickerWrapper.classList.remove('d-none');

        if (this.datePicker.getAttribute('data-selected-date')) {
            let selectedDate = this.datePicker.getAttribute('data-selected-date');
            this.redrawCalendarGrid(new Date(selectedDate));
            this.placeFocusOnDate(new Date(selectedDate));
        }
        else {
            this.redrawCalendarGrid(new Date());
            this.placeFocusOnDate(new Date());
        }

        /* Hide all other elements from screen readers */
        let bodyChildren = document.querySelectorAll('body > *');
        for (let c = 0; c < bodyChildren.length; c++) {
            let child = bodyChildren[c];
            if (child.tagName !== 'SCRIPT' && !child.classList.contains('new-date-picker-wrapper')) {
                child.setAttribute('aria-hidden', 'true');
                child.classList.add('fds-date-picker-aria-hidden');
            }
        }
    }
}

/**
 * Close the date picker dialog
 */
NewDatePicker.prototype.close = function () {
    if (isDialog(this.datePickerWrapper)) {
        this.datePickerWrapper.classList.add('d-none');

        let bodyChildren = document.querySelectorAll('body > *');
        for (let c = 0; c < bodyChildren.length; c++) {
            if (bodyChildren[c].classList.contains('fds-date-picker-aria-hidden')) {
                bodyChildren[c].removeAttribute('aria-hidden');
                bodyChildren[c].classList.remove('fds-date-picker-aria-hidden');
            }
        }
    }
}

/**
 * Move focus to a specific date cell
 *
 * @param {Date} date - Date to focus
 */
NewDatePicker.prototype.placeFocusOnDate = function (date) {
    date = correctDate(this.minDate(), this.maxDate(), date);
    if (this.datePickerWrapper.querySelector('td[data-date][tabindex="0"]')) {
        this.datePickerWrapper.querySelector('td[data-date][tabindex="0"]').setAttribute('tabindex', '-1');
    }
    this.datePickerWrapper.querySelector(`[data-date="${ISOFormatFromDate(date)}"]`).focus();
    this.datePickerWrapper.querySelector(`[data-date="${ISOFormatFromDate(date)}"]`).setAttribute('tabindex', '0');
}

/**
 * Select a date in the grid
 *
 * @param {Date} date - Date to select
 */
NewDatePicker.prototype.selectDate = function (date) {
    // Remove previous selection (if selected date is visible)
    if (this.datePickerWrapper.querySelector('td[aria-selected="true"]')) {
        this.datePickerWrapper.querySelector('td[aria-selected="true"]').setAttribute('aria-selected', 'false');
    }
    // Select new date in grid (if date is visible)
    if (isDateVisible(date, this.datePickerWrapper)) {
        this.datePickerWrapper.querySelector(`[data-date="${ISOFormatFromDate(date)}"]`).setAttribute('aria-selected', 'true');
    }
    // Store the selected date in a date picker attribute
    this.datePicker.setAttribute('data-selected-date', ISOFormatFromDate(date));
}

/**
 * Deselect a date so no dates are selected
 */
NewDatePicker.prototype.deselectDate = function () {
    this.datePicker.removeAttribute('data-selected-date');
    if (this.datePickerWrapper.querySelector('td[aria-selected="true"]')) {
        this.datePickerWrapper.querySelector('td[aria-selected="true"]').setAttribute('aria-selected', 'false');
    }
}

NewDatePicker.prototype.minDate = function () {
    return new Date(this.datePicker.getAttribute('data-min-date'));
}

NewDatePicker.prototype.maxDate = function () {
    return new Date(this.datePicker.getAttribute('data-max-date'));
}

/**
 * Get weekday index with Monday as 0
 *
 * @param {Date} date - Date to get weekday for
 * @return {number} Weekday index (0=Mon..6=Sun)
 */
function getWeekday(date) {
    let day = (date.getDay() + 6) % 7; // First day of the week changed from Sunday to Monday
    return day;
}

/**
 * Get the number of days in a month
 *
 * @param {Date} date - Any date in the month, for which you want the total number of days
 * @return {number} The month's total number of days
 */
function daysInMonth(date) {
    let year = date.getFullYear();
    let month = date.getMonth();
    const LAST_DAY_OF_PREVIOUS_MONTH = 0;
    return new Date(year, month + 1, LAST_DAY_OF_PREVIOUS_MONTH).getDate();
}

function correctDate(minDate, maxDate, dateToCorrect) {
    if (dateToCorrect < minDate.getTime()) {
        return minDate;
    }
    else if (maxDate.getTime() < dateToCorrect) {
        return maxDate;
    }
    else {
        return dateToCorrect;
    }
}

/**
 * Format date as YYYY-MM-DD
 *
 * @param {Date} date - Date to format
 * @return {string} ISO-like local date (YYYY-MM-DD)
 */
function ISOFormatFromDate(date) {
    let year = String(date.getFullYear()).padStart(4, '0');
    let month = String(date.getMonth() + 1).padStart(2, '0');
    let day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

function ISOFormatFromNumbers(year, month, day) {
    let y = String(year).padStart(4, '0');
    let m = String(month).padStart(2, '0');
    let d = String(day).padStart(2, '0');
    return `${y}-${m}-${d}`;
}

/**
 * Get the previous day
 *
 * @param {Date} date - Reference date
 * @return {Date} New Date representing yesterday
 */
function getYesterday(date) {
    let yesterday = new Date(date);
    yesterday.setDate(yesterday.getDate() - 1);
    return yesterday;
}

/**
 * Get the next day
 *
 * @param {Date} date - Reference date
 * @return {Date} New Date representing tomorrow
 */
function getTomorrow(date) {
    let tomorrow = new Date(date);
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow;
}

/**
 * Check if a date cell is visible in the grid
 *
 * @param {Date} date - Date to check
 * @param {HTMLDivElement} datePickerWrapper - Wrapper containing the grid
 * @return {boolean} True if the date cell is visible
 */
function isDateVisible(date, datePickerWrapper) {
    let isoDate = ISOFormatFromDate(date);
    return datePickerWrapper.querySelector(`[data-date="${isoDate}"]`) ? true : false;
}

/**
 * Check if the date picker is placed in a dialog
 *
 * @param {HTMLDivElement} datePickerWrapper - Wrapper containing the grid
 * @return {boolean} True if the date picker is in a dialog
 */
function isDialog(datePickerWrapper) {
    return datePickerWrapper.getAttribute('role') ? true : false;
}

/**
 * Close all open date pickers
 */
function closeAllDatePickers() {
    for (let i = 0; i < datePickerDialogs.length; i++) {
        datePickerDialogs[i].close();
    }
}

/**
 * Remove aria-hidden from all body children to prevent browser warnings when focus changes
 *
 * @param {FocusEvent} e - Focus event from body focusin event handler
 */
function removeHiddenOnFocusMove(e) {
    let currentFocusedDatePickerWrapper = e.target.closest('.new-date-picker-wrapper');

    if (!currentFocusedDatePickerWrapper || currentFocusedDatePickerWrapper !== lastFocusedDatePickerWrapper) {
        let bodyChildren = document.querySelectorAll('body > *');
        for (let c = 0; c < bodyChildren.length; c++) {
            if (bodyChildren[c].classList.contains('fds-date-picker-aria-hidden')) {
                bodyChildren[c].removeAttribute('aria-hidden');
                bodyChildren[c].classList.remove('fds-date-picker-aria-hidden');
            }
        }
    }

    lastFocusedDatePickerWrapper = currentFocusedDatePickerWrapper;
}

/**
 * If the focus somehow escapes the keyboard trap in a date picker dialog, close all dialogs
 *
 * @param {KeyboardEvent} e - Keyboard event from body keydown event handler
 */
function closeDatePickerDialogsOnKeydown(e) {
    let keydownInDatePickerDialog = e.target.closest('.new-date-picker-wrapper[role="dialog"]');
    if (!keydownInDatePickerDialog) {
        closeAllDatePickers();
    }
}

export default NewDatePicker;