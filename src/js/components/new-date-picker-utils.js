let lastFocusedDatePickerWrapper = null;

export let datePickerDialogs = [];

/**
 * Get weekday index with Monday as 0
 *
 * @param {Date} date - Date to get weekday for
 * @return {number} Weekday index (0=Mon..6=Sun)
 */
export function getWeekday(date) {
    let day = (date.getDay() + 6) % 7; // First day of the week changed from Sunday to Monday
    return day;
}

/**
 * Get the number of days in a month
 *
 * @param {Date} date - Any date in the month, for which you want the total number of days
 * @return {number} The month's total number of days
 */
export function daysInMonth(date) {
    let year = date.getFullYear();
    let month = date.getMonth();
    const LAST_DAY_OF_PREVIOUS_MONTH = 0;
    return new Date(year, month + 1, LAST_DAY_OF_PREVIOUS_MONTH).getDate();
}

export function placeDateWithinMinMax(minDate, maxDate, dateToCorrect) {
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

/* function returnValidDay(year, month, day) {
    let totalDays = daysInMonth(new Date(ISOFormatFromNumbers(year, month, 1)));
    if (newDaysInMonth < day) {
        day = newDaysInMonth;
    }
} */

/**
 * Format date as YYYY-MM-DD
 *
 * @param {Date} date - Date to format
 * @return {string} ISO-like local date (YYYY-MM-DD)
 */
export function ISOFormatFromDate(date) {
    let year = String(date.getFullYear()).padStart(4, '0');
    let month = String(date.getMonth() + 1).padStart(2, '0');
    let day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

export function ISOFormatFromNumbers(year, month, day) {
    let y = String(year).padStart(4, '0');
    let m = String(month+1).padStart(2, '0');
    let d = String(day).padStart(2, '0');
    return `${y}-${m}-${d}`;
}

/**
 * Get the previous day
 *
 * @param {Date} date - Reference date
 * @return {Date} New Date representing yesterday
 */
export function getYesterday(date) {
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
export function getTomorrow(date) {
    let tomorrow = new Date(date);
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow;
}

export function getPrevWeek(date) {
    let prevWeek = new Date(date);
    prevWeek.setDate(prevWeek.getDate() - 7);
    return prevWeek;
}

export function getNextWeek(date) {
    let nextWeek = new Date(date);
    nextWeek.setDate(nextWeek.getDate() + 7);
    return nextWeek;
}

export function getPrevMonth(date) {
    let day = date.getDate();
    let month = date.getMonth();
    let year = date.getFullYear();
    let prevMonth = month - 1;
    if (prevMonth === -1) {
        prevMonth = 11;
        year = year - 1;
    }
    let newDaysInMonth = daysInMonth(new Date(ISOFormatFromNumbers(year, prevMonth, 1)));
    if (newDaysInMonth < day) {
        day = newDaysInMonth;
    }
    return new Date(ISOFormatFromNumbers(year, prevMonth, day));
}

export function getNextMonth(date) {
    let day = date.getDate();
    let month = date.getMonth();
    let year = date.getFullYear();
    let nextMonth = month + 1;
    if (nextMonth === 12) {
        nextMonth = 1;
        year = year + 1;
    }
    let newDaysInMonth = daysInMonth(new Date(ISOFormatFromNumbers(year, nextMonth, 1)));
    if (newDaysInMonth < day) {
        day = newDaysInMonth;
    }
    return new Date(ISOFormatFromNumbers(year, nextMonth, day));
}

export function getPrevYear(date) {
    let day = date.getDate();
    let month = date.getMonth();
    let year = date.getFullYear();
    let prevYear = year - 1;
    let newDaysInMonth = daysInMonth(new Date(ISOFormatFromNumbers(prevYear, month, 1)));
    if (newDaysInMonth < day) {
        day = newDaysInMonth;
    }
    return new Date(ISOFormatFromNumbers(prevYear, month, day));
}

export function getNextYear(date) {
    let day = date.getDate();
    let month = date.getMonth();
    let year = date.getFullYear();
    let nextYear = year + 1;
    let newDaysInMonth = daysInMonth(new Date(ISOFormatFromNumbers(nextYear, month, 1)));
    if (newDaysInMonth < day) {
        day = newDaysInMonth;
    }
    return new Date(ISOFormatFromNumbers(nextYear, month, day));
}

/**
 * Check if a date cell is visible in the grid
 *
 * @param {Date} date - Date to check
 * @param {HTMLDivElement} datePickerWrapper - Wrapper containing the grid
 * @return {boolean} True if the date cell is visible
 */
export function isDateVisible(date, datePickerWrapper) {
    let isoDate = ISOFormatFromDate(date);
    return datePickerWrapper.querySelector(`[data-date="${isoDate}"]`) ? true : false;
}

/**
 * Check if the date picker is placed in a dialog
 *
 * @param {HTMLDivElement} datePickerWrapper - Wrapper containing the grid
 * @return {boolean} True if the date picker is in a dialog
 */
export function isDialog(datePickerWrapper) {
    return datePickerWrapper.getAttribute('role') ? true : false;
}

/**
 * Close all open date pickers
 */
export function closeAllDatePickers() {
    for (let i = 0; i < datePickerDialogs.length; i++) {
        datePickerDialogs[i].close();
    }
}

/**
 * Remove aria-hidden from all body children to prevent browser warnings when focus changes
 *
 * @param {FocusEvent} e - Focus event from body focusin event handler
 */
export function removeHiddenOnFocusMove(e) {
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
export function closeDatePickerDialogsOnKeydown(e) {
    let keydownInDatePickerDialog = e.target.closest('.new-date-picker-wrapper[role="dialog"]');
    if (!keydownInDatePickerDialog) {
        closeAllDatePickers();
    }
}