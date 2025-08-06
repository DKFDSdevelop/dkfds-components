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

    this.datepicker.addEventListener('click', (e) => {
        e.preventDefault();
        if (e.target.getAttribute('data-date')) {
            let clickedDate = new Date(e.target.getAttribute('data-date'));
            this.placeFocusOnDate(clickedDate);
        }
    });

    this.datepicker.addEventListener('keydown', (e) => {
        let key = e.key;
        let focusedDay = this.datepicker.querySelector('td[data-date][tabindex="0"]');

        switch (key) {
            case 'ArrowLeft':
                e.preventDefault();
                let yesterday = getYesterday(new Date(focusedDay.getAttribute('data-date')));
                if (!isDateVisible(yesterday, this.datepicker)) {
                    this.redrawCalendarGrid(yesterday);
                }
                this.placeFocusOnDate(yesterday);
                break;
            case 'ArrowRight':
                e.preventDefault();
                let tomorrow = getTomorrow(new Date(focusedDay.getAttribute('data-date')));
                if (!isDateVisible(tomorrow, this.datepicker)) {
                    this.redrawCalendarGrid(tomorrow);
                }
                this.placeFocusOnDate(tomorrow);
                break;
        }
    });

    this.datepicker.querySelector('.selected-month').addEventListener('change', (e) => {
        let day = 1;
        let month = parseInt(e.target.value) + 1;
        let year = this.datepicker.querySelector('.selected-year').value;
        this.redrawCalendarGrid(new Date(`${year}-${month}-${day}`));
    });

    this.datepicker.querySelector('.selected-year').addEventListener('change', (e) => {
        let day = 1;
        let month = parseInt(this.datepicker.querySelector('.selected-month').value) + 1;
        let year = e.target.value;
        this.redrawCalendarGrid(new Date(`${year}-${month}-${day}`));
    });

    this.placeFocusOnDate(new Date());
}

NewDatePicker.prototype.createCalendarGrid = function () {

    /* The date picker header with navigation options */

    let datePickerHeader = document.createElement('div');
    datePickerHeader.classList.add('datepicker-header');

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

    this.datepicker.appendChild(datePickerHeader);

    /* The date picker grid with dates */

    let grid = document.createElement('table');
    grid.setAttribute('role', 'grid');
    grid.classList.add('new-datepicker-grid');

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
            gridCell.setAttribute('role', 'gridcell');
            gridBodyRow.appendChild(gridCell);
        }
        gridBody.appendChild(gridBodyRow);
    }
    grid.appendChild(gridBody);

    this.datepicker.appendChild(grid);
};

NewDatePicker.prototype.redrawCalendarGrid = function (date) {
    let year = date.getFullYear();
    let month = date.getMonth();
    let gridcells = this.datepicker.querySelectorAll('td');

    // Update displayed year and month
    this.datepicker.querySelector('.selected-month').value = month;
    this.datepicker.querySelector('.selected-year').value = year;

    // Remove existing dates in the grid
    for (let i = 0; i < TOTAL_GRIDCELLS; i++) {
        gridcells[i].removeAttribute('tabindex');
        gridcells[i].removeAttribute('data-date');
        gridcells[i].removeAttribute('aria-label');
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

function getTomorrow(date) {
    let tomorrow = new Date(date);
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow;
}

function isDateVisible(date, grid) {
    let isoDate = getIsoLocalFormat(date);
    return grid.querySelector(`[data-date="${isoDate}"]`) ? true : false;
}

export default NewDatePicker;