'use strict';

const MONTHS = ['januar', 'februar', 'marts', 'april', 'maj', 'juni', 'juli', 'august', 'september', 'oktober', 'november', 'december'];
const DAYS = ['Mandag', 'Tirsdag', 'Onsdag', 'Torsdag', 'Fredag', 'Lørdag', 'Søndag'];
const GRID_ROWS = 6; // To avoid potential height changes when changing month, the calendar grid has a fixed set of rows
const TOTAL_GRIDCELLS = GRID_ROWS * DAYS.length;

function NewDatePicker(newDatePicker) {
    this.datepicker = newDatePicker;
}

NewDatePicker.prototype.init = function () {
    this.createCalendarGrid();
    this.redrawCalendarGrid(new Date());

    this.datepicker.addEventListener('keydown', (e) => {
        let key = e.key;
        if (key === 'ArrowLeft') {
            e.preventDefault();
            let focusedDay = this.datepicker.querySelector('td[data-date][tabindex="0"]');
            let yesterday = getYesterday(new Date(focusedDay.getAttribute('data-date')));
            if (!isDateVisible(yesterday, this.datepicker)) {
                this.redrawCalendarGrid(yesterday);
            }
            this.placeFocusOnDate(yesterday);
        }
    });
}

// TODO: Create complete grid, not just the gridcells
NewDatePicker.prototype.createCalendarGrid = function () {
    let rows = this.datepicker.querySelectorAll('tbody tr');
    for (let i = 0; i < rows.length; i++) {
        rows[i].innerHTML = '<td role="gridcell"></td><td role="gridcell"></td><td role="gridcell"></td><td role="gridcell"></td><td role="gridcell"></td><td role="gridcell"></td><td role="gridcell"></td>';
    }
};

NewDatePicker.prototype.redrawCalendarGrid = function (date) {
    let year = date.getFullYear();
    let month = date.getMonth();
    let gridcells = this.datepicker.querySelectorAll('td');

    // Update displayed year and month
    this.datepicker.querySelector('.current-year').innerHTML = year;
    this.datepicker.querySelector('.current-month').innerHTML = MONTHS[month];

    // Remove existing dates in the grid
    for (let i = 0; i < TOTAL_GRIDCELLS; i++) {
        gridcells[i].innerHTML = '';
    }

    // Add new dates
    let totalDays = daysInMonth(date);
    let offset = getWeekday(new Date(year, month, 1));
    for (let i = 1; i <= totalDays; i++) {
        gridcells[i + offset - 1].setAttribute('tabindex', '-1');
        gridcells[i + offset - 1].setAttribute('data-date', `${getIsoLocalFormat(new Date(year, month, i))}`);
        gridcells[i + offset - 1].setAttribute('aria-label', `${i}. ${MONTHS[month]} ${year}`);
        gridcells[i + offset - 1].innerHTML = `${i}`;
    }

    this.placeFocusOnDate(date);
};

NewDatePicker.prototype.placeFocusOnDate = function (date) {
    if (this.datepicker.querySelector('td[data-date][tabindex="0"]')) {
        this.datepicker.querySelector('td[data-date][tabindex="0"]').setAttribute('tabindex', '-1');
    }
    this.datepicker.querySelector(`[data-date="${getIsoLocalFormat(date)}"]`).focus();
    this.datepicker.querySelector(`[data-date="${getIsoLocalFormat(date)}"]`).setAttribute('tabindex', '0');
}

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

function getIsoLocalFormat(date) {
    let year = String(date.getFullYear()).padStart(4, '0');
    let month = String(date.getMonth() + 1).padStart(2, '0');
    let day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

function getYesterday(date) {
    let yesterday = new Date(date);
    yesterday.setDate(yesterday.getDate() - 1);
    return yesterday;
}

function isDateVisible(date, grid) {
    let isoDate = getIsoLocalFormat(date);
    return grid.querySelector(`[data-date="${isoDate}"]`) ? true : false;
}

export default NewDatePicker;