'use strict';

const MONTHS = ['januar', 'februar', 'marts', 'april', 'maj', 'juni', 'juli', 'august', 'september', 'oktober', 'november', 'december'];
const DAYS = ['Mandag', 'Tirsdag', 'Onsdag', 'Torsdag', 'Fredag', 'Lørdag', 'Søndag'];
const GRID_ROWS = 6; // To avoid potential height changes when changing month, the calendar grid has a fixed set of rows
const TOTAL_GRIDCELLS = GRID_ROWS * DAYS.length;

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
    }
}

/**
 * Initialize the date picker
 */
NewDatePicker.prototype.init = function () {
    this.createCalendarGrid();
    this.redrawCalendarGrid(new Date());

    document.body.addEventListener('click', (e) => {
        let clickInDatePicker = e.target.closest('.new-date-picker-wrapper');
        let clickedDatePickerButton = e.target.closest('.new-date-picker .button-icon-only[aria-haspopup="dialog"]');
        if (!clickInDatePicker && !clickedDatePickerButton) {
            closeAllDatePickers();
        }
    });

    /* If focus somehow escapes a date picker's keyboard trap, ensure all date picker dialogs 
       are closed when something else is focused on the page. */
    document.body.addEventListener('focusin', (e) => {
        let focusInDatePicker = e.target.closest('.new-date-picker-wrapper');
        if (!focusInDatePicker) {
            closeAllDatePickers();
        }
    });

    if (this.datePickerButton) {
        this.datePickerWrapper.classList.add('d-none');

        this.datePickerButton.addEventListener('click', () => {
            if (this.datePickerWrapper.classList.contains('d-none')) {
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
            }
            else {
                this.datePickerWrapper.classList.add('d-none');
            }
        });

        this.datePickerWrapper.setAttribute('role', 'dialog');
        this.datePickerWrapper.setAttribute('aria-modal', 'true');
        this.datePickerWrapper.setAttribute('aria-label', 'Vælg en dato');
    }

    /* Make dates selectable with click */
    this.datePickerWrapper.addEventListener('click', (e) => {
        e.preventDefault();
        if (e.target.getAttribute('data-date')) {
            let clickedDate = new Date(e.target.getAttribute('data-date'));
            this.selectDate(clickedDate);

            if (isDialog(this.datePickerWrapper)) {
                let day = this.datePickerWrapper.querySelector('td[aria-selected="true"]').textContent;
                let month = this.datePickerWrapper.querySelector('.selected-month').value;
                let year = this.datePickerWrapper.querySelector('.selected-year').value;
                this.datePickerButton.querySelector('.sr-only').textContent = `Åbn datovælger, valgt dato er ${day}. ${MONTHS[month]} ${year}`;
                this.close();
            }
            else {
                this.placeFocusOnDate(clickedDate);
            }
        }
    });

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
                    }
                    else {
                        this.placeFocusOnDate(selectedDate);
                    }
                }
                break;
            case 'Escape':
                e.preventDefault();
                this.close();
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
        let newDate = new Date(`${year}-${month}-${day}`);
        this.redrawCalendarGrid(newDate);
    });

    /* Update grid when year is changed */
    this.datePickerWrapper.querySelector('.selected-year').addEventListener('change', (e) => {
        let day = 1;
        let month = parseInt(this.datePickerWrapper.querySelector('.selected-month').value) + 1;
        let year = e.target.value;
        let newDate = new Date(`${year}-${month}-${day}`);
        this.redrawCalendarGrid(newDate);
    });

    /* Make it possible to tab to a date in the grid */
    this.datePickerWrapper.querySelector(`[data-date="${getIsoLocalFormat(new Date())}"]`).setAttribute('tabindex', '0');
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
    yearSelect.innerHTML = `<option value="2024">2024</option><option value="2025">2025</option><option value="2026">2026</option>`;
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
        gridcells[i].innerHTML = '';
    }

    // Add new dates
    let totalDays = daysInMonth(date);
    let offset = getWeekday(new Date(year, month, 1));
    for (let i = 1; i <= totalDays; i++) {
        gridcells[i + offset - 1].setAttribute('tabindex', '-1');
        gridcells[i + offset - 1].setAttribute('data-date', `${getIsoLocalFormat(new Date(year, month, i))}`);
        gridcells[i + offset - 1].setAttribute('aria-label', `${i}. ${MONTHS[month]} ${year}`);
        gridcells[i + offset - 1].setAttribute('aria-selected', `false`);
        gridcells[i + offset - 1].innerHTML = `${i}`;
    }

    if (this.datePicker.getAttribute('data-selected-date')) {
        let selectedDate = this.datePicker.getAttribute('data-selected-date');
        this.selectDate(new Date(selectedDate));
    }

    // The grid must always have a focusable element
    if (!this.datePickerWrapper.querySelector('td[data-date][tabindex="0"]')) {
        this.datePickerWrapper.querySelector(`[data-date="${getIsoLocalFormat(date)}"]`).setAttribute('tabindex', '0');
    }
};

/**
 * Close the date picker dialog
 */
NewDatePicker.prototype.close = function () {
    if (isDialog(this.datePickerWrapper)) {
        this.datePickerWrapper.classList.add('d-none');
        this.datePickerButton.focus();
    }
}

/**
 * Move focus to a specific date cell
 *
 * @param {Date} date - Date to focus
 */
NewDatePicker.prototype.placeFocusOnDate = function (date) {
    if (this.datePickerWrapper.querySelector('td[data-date][tabindex="0"]')) {
        this.datePickerWrapper.querySelector('td[data-date][tabindex="0"]').setAttribute('tabindex', '-1');
    }
    this.datePickerWrapper.querySelector(`[data-date="${getIsoLocalFormat(date)}"]`).focus();
    this.datePickerWrapper.querySelector(`[data-date="${getIsoLocalFormat(date)}"]`).setAttribute('tabindex', '0');
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
        this.datePickerWrapper.querySelector(`[data-date="${getIsoLocalFormat(date)}"]`).setAttribute('aria-selected', 'true');
    }
    // Store the selected date in a date picker attribute
    this.datePicker.setAttribute('data-selected-date', getIsoLocalFormat(date));
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

/**
 * Format date as YYYY-MM-DD
 *
 * @param {Date} date - Date to format
 * @return {string} ISO-like local date (YYYY-MM-DD)
 */
function getIsoLocalFormat(date) {
    let year = String(date.getFullYear()).padStart(4, '0');
    let month = String(date.getMonth() + 1).padStart(2, '0');
    let day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
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
    let isoDate = getIsoLocalFormat(date);
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
function closeAllDatePickers(e) {
    let datePickers = document.querySelectorAll('.new-date-picker-wrapper[role="dialog"]');
    for (let i = 0; i < datePickers.length; i++) {
        datePickers[i].classList.add('d-none');
    }
}

export default NewDatePicker;