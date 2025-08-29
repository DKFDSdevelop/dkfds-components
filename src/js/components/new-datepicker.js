'use strict';

import * as Util from './new-date-picker-utils';

const MONTHS = ['januar', 'februar', 'marts', 'april', 'maj', 'juni', 'juli', 'august', 'september', 'oktober', 'november', 'december'];
const DAYS = ['Mandag', 'Tirsdag', 'Onsdag', 'Torsdag', 'Fredag', 'Lørdag', 'Søndag'];
const GRID_ROWS = 6; // To avoid potential height changes when changing month, the calendar grid has a fixed set of rows
const TOTAL_GRIDCELLS = GRID_ROWS * DAYS.length;
const FORMATS = ['DD/MM/YYYY', 'DD-MM-YYYY', 'DD.MM.YYYY', 'DD MM YYYY', 'DD/MM-YYYY'];

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
        Util.datePickerDialogs.push(this);
    }
}

/**
 * Initialize the date picker
 */
NewDatePicker.prototype.init = function () {
    this.createCalendarGrid();

    let initialDate = new Date();

    if (this.datePickerInput && this.datePickerInput.value !== '') {
        const inputDate = Util.stringToDate(this.datePickerInput.value, false);
        if (Util.isValidDate(inputDate)) {
            initialDate = inputDate;
            this.datePicker.setAttribute('data-selected-date', Util.ISOFormatFromDate(initialDate));
        }
    }
    else if (this.datePicker.getAttribute('data-selected-date')) {
        initialDate = Util.stringToDate(this.datePicker.getAttribute('data-selected-date'), true);
    }
    else if (this.datePicker.getAttribute('data-default-date')) {
        initialDate = Util.stringToDate(this.datePicker.getAttribute('data-default-date'), true);
    }

    this.redrawCalendarGrid(initialDate);

    document.body.addEventListener('click', Util.closeAllDatePickers);
    document.body.addEventListener('focusin', Util.removeHiddenOnFocusMove);
    document.addEventListener('keydown', Util.closeDatePickerDialogsOnKeydown);

    if (this.datePickerButton) {
        this.datePickerWrapper.classList.add('d-none');

        this.datePickerButton.addEventListener('click', (e) => {
            if (this.datePickerWrapper.classList.contains('d-none')) {
                e.stopPropagation(); // Prevent the body click event listener from triggering
                Util.closeAllDatePickers(); // Ensure no other date picker dialogs are open
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
        if (Util.isDialog(this.datePickerWrapper)) {
            e.stopPropagation(); // Prevent the body click event listener from triggering
        }
        e.preventDefault();
        if (e.target.getAttribute('data-date')) {
            const clickedDate = Util.stringToDate(e.target.getAttribute('data-date'), true);
            const dateSelectable = e.target.getAttribute('aria-selected');

            if (dateSelectable) {
                this.selectDate(clickedDate);

                if (Util.isDialog(this.datePickerWrapper)) {
                    const day = this.datePickerWrapper.querySelector('td[aria-selected="true"]').textContent;
                    const month = this.datePickerWrapper.querySelector('.selected-month').value;
                    const year = this.datePickerWrapper.querySelector('.selected-year').value;
                    this.datePickerButton.querySelector('.sr-only').textContent = `Åbn datovælger, valgt dato er ${day}. ${MONTHS[month]} ${year}`;
                    this.close();
                    this.datePickerButton.focus();
                }
                else {
                    this.placeFocusOnDate(clickedDate);
                }

                if (this.datePickerInput) {
                    const day = String(clickedDate.getDate()).padStart(2, '0');
                    const month = String(clickedDate.getMonth() + 1).padStart(2, '0');
                    const year = String(clickedDate.getFullYear()).padStart(4, '0');
                    this.datePickerInput.value = this.dateFormat().replace('DD', day).replace('MM', month).replace('YYYY', year);
                }
            }
        }
    });

    if (this.datePickerInput) {
        this.datePickerInput.addEventListener('input', (e) => {
            const inputDate = Util.stringToDate(e.target.value, false);
            if (Util.isValidDate(inputDate)) {
                this.selectDate(inputDate);
            }
            else {
                this.deselectDate();
            }
        });
    }

    /* Add keyboard functionality */
    this.datePickerWrapper.addEventListener('keydown', (e) => {
        const key = e.key;
        const focusedDay = this.datePickerWrapper.querySelector('td[data-date][tabindex="0"]');
        const focusedDayAsDate = Util.stringToDate(focusedDay.getAttribute('data-date'), true);
        const focusOnDate = e.target.getAttribute('data-date');

        switch (key) {
            case 'ArrowLeft':
                if (focusOnDate) {
                    e.preventDefault();
                    const yesterday = Util.getYesterday(focusedDayAsDate);
                    if (!Util.isDateVisible(yesterday, this.datePickerWrapper)) {
                        this.redrawCalendarGrid(yesterday);
                    }
                    this.placeFocusOnDate(yesterday);
                }
                break;
            case 'ArrowRight':
                if (focusOnDate) {
                    e.preventDefault();
                    const tomorrow = Util.getTomorrow(focusedDayAsDate);
                    if (!Util.isDateVisible(tomorrow, this.datePickerWrapper)) {
                        this.redrawCalendarGrid(tomorrow);
                    }
                    this.placeFocusOnDate(tomorrow);
                }
                break;
            case 'ArrowDown':
                if (focusOnDate) {
                    e.preventDefault();
                    const nextWeek = Util.getNextWeek(focusedDayAsDate);
                    if (!Util.isDateVisible(nextWeek, this.datePickerWrapper)) {
                        this.redrawCalendarGrid(nextWeek);
                    }
                    this.placeFocusOnDate(nextWeek);
                }
                break;
            case 'ArrowUp':
                if (focusOnDate) {
                    e.preventDefault();
                    const prevWeek = Util.getPrevWeek(focusedDayAsDate);
                    if (!Util.isDateVisible(prevWeek, this.datePickerWrapper)) {
                        this.redrawCalendarGrid(prevWeek);
                    }
                    this.placeFocusOnDate(prevWeek);
                }
                break;
            case 'Enter':
            case ' ':
                if (focusOnDate) {
                    e.preventDefault();

                    const selectedDate = Util.stringToDate(e.target.getAttribute('data-date'), true);
                    this.selectDate(selectedDate);

                    if (Util.isDialog(this.datePickerWrapper)) {
                        const day = this.datePickerWrapper.querySelector('td[aria-selected="true"]').textContent;
                        const month = this.datePickerWrapper.querySelector('.selected-month').value;
                        const year = this.datePickerWrapper.querySelector('.selected-year').value;
                        this.datePickerButton.querySelector('.sr-only').textContent = `Åbn datovælger, valgt dato er ${day}. ${MONTHS[month]} ${year}`;
                        this.close();
                        this.datePickerButton.focus();
                    }
                    else {
                        this.placeFocusOnDate(selectedDate);
                    }

                    if (this.datePickerInput) {
                        const day = String(selectedDate.getDate()).padStart(2, '0');
                        const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
                        const year = String(selectedDate.getFullYear()).padStart(4, '0');
                        this.datePickerInput.value = this.dateFormat().replace('DD', day).replace('MM', month).replace('YYYY', year);
                    }
                }
                break;
            case 'Escape':
                if (Util.isDialog(this.datePickerWrapper)) {
                    e.preventDefault();
                    this.close();
                    this.datePickerButton.focus();
                }
                break;
            case 'PageDown':
                if (focusOnDate) {
                    e.preventDefault();
                    if (e.shiftKey) {
                        const nextYear = Util.getNextYear(focusedDayAsDate);
                        this.redrawCalendarGrid(nextYear);
                        this.placeFocusOnDate(nextYear);
                    }
                    else {
                        const nextMonth = Util.getNextMonth(focusedDayAsDate);
                        this.redrawCalendarGrid(nextMonth);
                        this.placeFocusOnDate(nextMonth);
                    }
                }
                break;
            case 'PageUp':
                if (focusOnDate) {
                    e.preventDefault();
                    if (e.shiftKey) {
                        const prevYear = Util.getPrevYear(focusedDayAsDate);
                        this.redrawCalendarGrid(prevYear);
                        this.placeFocusOnDate(prevYear);
                    }
                    else {
                        const prevMonth = Util.getPrevMonth(focusedDayAsDate);
                        this.redrawCalendarGrid(prevMonth);
                        this.placeFocusOnDate(prevMonth);
                    }
                }
                break;
            case 'Home':
                if (focusOnDate) {
                    e.preventDefault();
                    if (e.ctrlKey) {
                        const month = parseInt(this.datePickerWrapper.querySelector('.selected-month').value, 10);
                        const year = parseInt(this.datePickerWrapper.querySelector('.selected-year').value, 10);
                        const firstDay = Util.numbersToDate(year, month, 1);
                        this.redrawCalendarGrid(firstDay);
                        this.placeFocusOnDate(firstDay);
                    }
                    else {
                        const weekDay = Util.getWeekday(focusedDayAsDate);
                        if (weekDay !== 0) {
                            const monday = new Date(focusedDayAsDate);
                            monday.setDate(focusedDayAsDate.getDate() - weekDay);
                            this.redrawCalendarGrid(monday);
                            this.placeFocusOnDate(monday);
                        }
                    }
                }
                break;
            case 'End':
                if (focusOnDate) {
                    e.preventDefault();
                    if (e.ctrlKey) {
                        const month = parseInt(this.datePickerWrapper.querySelector('.selected-month').value, 10);
                        const year = parseInt(this.datePickerWrapper.querySelector('.selected-year').value, 10);
                        const day = Util.daysInMonth(Util.numbersToDate(year, month, 1));
                        const lastDay = Util.numbersToDate(year, month, day);
                        this.redrawCalendarGrid(lastDay);
                        this.placeFocusOnDate(lastDay);
                    }
                    else {
                        const weekDay = Util.getWeekday(focusedDayAsDate);
                        if (weekDay !== 6) {
                            const sunday = new Date(focusedDayAsDate);
                            sunday.setDate(focusedDayAsDate.getDate() + (6 - weekDay));
                            this.redrawCalendarGrid(sunday);
                            this.placeFocusOnDate(sunday);
                        }
                    }
                }
                break;
            case 'Tab':
                const focusLeftDate = e.target.getAttribute('data-date');
                const firstFocusableElement = this.datePickerWrapper.querySelector('.date-picker-header button:not(:disabled), .date-picker-header select:not(:disabled)');

                if (focusLeftDate && !e.shiftKey && Util.isDialog(this.datePickerWrapper)) {
                    e.preventDefault();
                    if (firstFocusableElement) {
                        firstFocusableElement.focus();
                    }
                }
                else if (e.target === firstFocusableElement && e.shiftKey && Util.isDialog(this.datePickerWrapper)) {
                    e.preventDefault();
                    this.datePickerWrapper.querySelector('td[tabindex="0"]').focus();
                }
                break;
        }
    });

    /* Update grid when month is changed */
    this.datePickerWrapper.querySelector('.selected-month').addEventListener('change', (e) => {
        const focusedDay = this.datePickerWrapper.querySelector('td[data-date][tabindex="0"]');
        const focusedDayAsDate = Util.stringToDate(focusedDay.getAttribute('data-date'), true);

        let day = focusedDayAsDate.getDate();
        const month = parseInt(e.target.value, 10);
        const year = parseInt(this.datePickerWrapper.querySelector('.selected-year').value, 10);

        const newDaysInMonth = Util.daysInMonth(Util.numbersToDate(year, month, 1));
        if (newDaysInMonth < day) {
            day = newDaysInMonth;
        }

        const newDate = Util.numbersToDate(year, month, day);
        this.redrawCalendarGrid(newDate);
    });

    /* Update grid when year is changed */
    this.datePickerWrapper.querySelector('.selected-year').addEventListener('change', (e) => {
        const focusedDay = this.datePickerWrapper.querySelector('td[data-date][tabindex="0"]');
        const focusedDayAsDate = Util.stringToDate(focusedDay.getAttribute('data-date'), true);

        let day = focusedDayAsDate.getDate();
        const month = parseInt(this.datePickerWrapper.querySelector('.selected-month').value, 10);
        const year = parseInt(e.target.value, 10);

        const newDaysInMonth = Util.daysInMonth(Util.numbersToDate(year, month, 1));
        if (newDaysInMonth < day) {
            day = newDaysInMonth;
        }

        const newDate = Util.numbersToDate(year, month, day);
        this.redrawCalendarGrid(newDate);
    });

    this.datePickerWrapper.querySelector('.previous-month').addEventListener('click', (e) => {
        const prevMonth = Util.getPrevMonth(Util.stringToDate(this.datePickerWrapper.querySelector('td[data-date][tabindex="0"]').getAttribute('data-date'), true));
        if (!Util.isDateVisible(prevMonth, this.datePickerWrapper)) {
            this.redrawCalendarGrid(prevMonth);
        }
    });

    this.datePickerWrapper.querySelector('.next-month').addEventListener('click', (e) => {
        const nextMonth = Util.getNextMonth(Util.stringToDate(this.datePickerWrapper.querySelector('td[data-date][tabindex="0"]').getAttribute('data-date'), true));
        if (!Util.isDateVisible(nextMonth, this.datePickerWrapper)) {
            this.redrawCalendarGrid(nextMonth);
        }
    });
}

/**
 * Build the calendar header and grid
 */
NewDatePicker.prototype.createCalendarGrid = function () {

    /* The date picker header with navigation options */

    const datePickerHeader = document.createElement('div');
    datePickerHeader.classList.add('date-picker-header');

    const prevButton = document.createElement('button');
    prevButton.classList.add('previous-month');
    prevButton.textContent = 'Forrige';
    datePickerHeader.appendChild(prevButton);

    const monthSelect = document.createElement('select');
    monthSelect.setAttribute('name', 'month');
    monthSelect.setAttribute('aria-label', 'Vis måned');
    monthSelect.classList.add('selected-month');
    for (let i = 0; i < MONTHS.length; i++) {
        monthSelect.innerHTML += `<option value="${i}">${MONTHS[i].charAt(0).toUpperCase() + MONTHS[i].slice(1)}</option>`;
    }
    datePickerHeader.appendChild(monthSelect);

    const yearSelect = document.createElement('select');
    yearSelect.setAttribute('name', 'year');
    yearSelect.setAttribute('aria-label', 'Vis år');
    yearSelect.classList.add('selected-year');
    let minYear = 1900;
    let maxYear = 2100;
    if (this.datePicker.getAttribute('data-min-date')) {
        minYear = Util.stringToDate(this.datePicker.getAttribute('data-min-date'), true).getFullYear();
    }
    else {
        this.datePicker.setAttribute('data-min-date', `${minYear}-01-01`);
    }
    if (this.datePicker.getAttribute('data-max-date')) {
        maxYear = Util.stringToDate(this.datePicker.getAttribute('data-max-date'), true).getFullYear();
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

    const nextButton = document.createElement('button');
    nextButton.classList.add('next-month');
    nextButton.textContent = 'Næste';
    datePickerHeader.appendChild(nextButton);

    this.datePickerWrapper.appendChild(datePickerHeader);

    /* The date picker grid with dates */

    const grid = document.createElement('table');
    grid.setAttribute('role', 'grid');
    grid.classList.add('new-date-picker-grid');

    const gridHead = document.createElement('thead');
    const gridHeadRow = document.createElement('tr');
    for (let i = 0; i < DAYS.length; i++) {
        const gridHeader = document.createElement('th');
        gridHeader.setAttribute('scope', 'col');
        gridHeader.innerHTML = `<span aria-hidden="true">${DAYS[i].slice(0, 2)}</span><span class="sr-only">${DAYS[i]}</span>`;
        gridHeadRow.appendChild(gridHeader);
    }
    gridHead.appendChild(gridHeadRow);
    grid.appendChild(gridHead);

    const gridBody = document.createElement('tbody');
    for (let i = 0; i < GRID_ROWS; i++) {
        const gridBodyRow = document.createElement('tr');
        for (let j = 0; j < DAYS.length; j++) {
            const gridCell = document.createElement('td');
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
    if (!Util.isValidDate(date)) {
        throw new Error('Cannot create date picker grid with invalid date');
    }

    date = Util.placeDateWithinMinMax(this.minDate(), this.maxDate(), date);

    const year = date.getFullYear();
    const month = date.getMonth();
    const gridcells = this.datePickerWrapper.querySelectorAll('td');

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
    const totalDays = Util.daysInMonth(date);
    const offset = Util.getWeekday(Util.numbersToDate(year, month, 1));
    for (let i = 1; i <= totalDays; i++) {
        const gridcellDate = Util.numbersToDate(year, month, i);
        gridcells[i + offset - 1].setAttribute('data-date', `${Util.ISOFormatFromDate(gridcellDate)}`);
        gridcells[i + offset - 1].setAttribute('aria-label', `${i}. ${MONTHS[month]} ${year}`);
        gridcells[i + offset - 1].innerHTML = `${i}`;
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
        const selectedDate = this.datePicker.getAttribute('data-selected-date');
        this.selectDate(new Date(selectedDate));
    }

    // The grid must always have a focusable element
    if (!this.datePickerWrapper.querySelector('td[data-date][tabindex="0"]')) {
        this.datePickerWrapper.querySelector(`[data-date="${Util.ISOFormatFromDate(date)}"]`).setAttribute('tabindex', '0');
    }

    // Disable unselectable months
    const monthSelect = this.datePickerWrapper.querySelector('.selected-month');
    const yearSelect = this.datePickerWrapper.querySelector('.selected-year');
    const monthOptions = monthSelect.querySelectorAll('option');
    const chosenYear = yearSelect.value;

    for (let i = 0; i < monthOptions.length; i++) {
        monthOptions[i].removeAttribute('disabled'); // Reset disabled status on all options
    }
    if (this.minDate().getFullYear() === parseInt(chosenYear, 10)) {
        const minMonth = this.minDate().getMonth();
        for (let i = 0; i < monthOptions.length; i++) {
            if (i < minMonth) {
                monthOptions[i].setAttribute('disabled', '');
            }
        }
    }
    if (this.maxDate().getFullYear() === parseInt(chosenYear, 10)) {
        const maxMonth = this.maxDate().getMonth();
        for (let i = 0; i < monthOptions.length; i++) {
            if (i > maxMonth) {
                monthOptions[i].setAttribute('disabled', '');
            }
        }
    }

    // Ensure previous and next month buttons have the proper status
    const prevMonthButton = this.datePickerWrapper.querySelector('.previous-month');
    Util.isDateVisible(this.minDate(), this.datePickerWrapper) ? prevMonthButton.setAttribute('disabled', '') : prevMonthButton.removeAttribute('disabled');
    const nextMonthButton = this.datePickerWrapper.querySelector('.next-month');
    Util.isDateVisible(this.maxDate(), this.datePickerWrapper) ? nextMonthButton.setAttribute('disabled', '') : nextMonthButton.removeAttribute('disabled');
};

/**
 * Open the date picker dialog
 */
NewDatePicker.prototype.open = function () {
    if (Util.isDialog(this.datePickerWrapper)) {
        this.datePickerWrapper.style.top = (this.datePickerButton.getBoundingClientRect().bottom + window.scrollY) + 'px';
        this.datePickerWrapper.style.left = (this.datePickerInput.getBoundingClientRect().left) + 'px';

        this.datePickerWrapper.classList.remove('d-none');

        let openDate = new Date();

        if (this.datePicker.getAttribute('data-selected-date')) {
            openDate = Util.stringToDate(this.datePicker.getAttribute('data-selected-date'), true);
        }
        else if (this.datePicker.getAttribute('data-default-date')) {
            openDate = Util.stringToDate(this.datePicker.getAttribute('data-default-date'), true);
        }

        this.redrawCalendarGrid(openDate);
        this.placeFocusOnDate(openDate);

        /* Hide all other elements from screen readers */
        const bodyChildren = document.querySelectorAll('body > *');
        for (let c = 0; c < bodyChildren.length; c++) {
            const child = bodyChildren[c];
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
    if (Util.isDialog(this.datePickerWrapper)) {
        this.datePickerWrapper.classList.add('d-none');

        const bodyChildren = document.querySelectorAll('body > *');
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
    date = Util.placeDateWithinMinMax(this.minDate(), this.maxDate(), date);
    if (this.datePickerWrapper.querySelector('td[data-date][tabindex="0"]')) {
        this.datePickerWrapper.querySelector('td[data-date][tabindex="0"]').setAttribute('tabindex', '-1');
    }
    this.datePickerWrapper.querySelector(`[data-date="${Util.ISOFormatFromDate(date)}"]`).focus();
    this.datePickerWrapper.querySelector(`[data-date="${Util.ISOFormatFromDate(date)}"]`).setAttribute('tabindex', '0');
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
    if (Util.isDateVisible(date, this.datePickerWrapper)) {
        this.datePickerWrapper.querySelector(`[data-date="${Util.ISOFormatFromDate(date)}"]`).setAttribute('aria-selected', 'true');
    }
    // Store the selected date in a date picker attribute
    this.datePicker.setAttribute('data-selected-date', Util.ISOFormatFromDate(date));
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
    return Util.stringToDate(this.datePicker.getAttribute('data-min-date'), true);
}

NewDatePicker.prototype.maxDate = function () {
    return Util.stringToDate(this.datePicker.getAttribute('data-max-date'), true);
}

NewDatePicker.prototype.dateFormat = function () {
    if (this.datePicker.getAttribute('data-dateformat')) {
        if (FORMATS.includes(this.datePicker.getAttribute('data-dateformat'))) {
            return this.datePicker.getAttribute('data-dateformat');
        }
        else {
            return FORMATS[0];
        }
    }
    else {
        return FORMATS[0];
    }
}

export default NewDatePicker;