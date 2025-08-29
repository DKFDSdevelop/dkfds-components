let lastFocusedDatePickerWrapper = null;

export let datePickerDialogs = [];

/**
 * Get weekday index with Monday as 0
 *
 * @param {Date} date - Date to get weekday for
 * @return {number} Weekday index (0=Mon..6=Sun)
 */
export function getWeekday(date) {
    const day = (date.getDay() + 6) % 7; // First day of the week changed from Sunday to Monday
    return day;
}

/**
 * Get the number of days in a month
 *
 * @param {Date} date - Any date in the month, for which you want the total number of days
 * @return {number} The month's total number of days
 */
export function daysInMonth(date) {
    const year = date.getFullYear();
    const month = date.getMonth();
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

/**
 * Format date as YYYY-MM-DD
 *
 * @param {Date} date - Date to format
 * @return {string} ISO-like local date (YYYY-MM-DD)
 */
export function ISOFormatFromDate(date) {
    const year = String(date.getFullYear()).padStart(4, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

export function stringToDate(str, isYearFirst) {
    let regex = /^(\d{1,2})[\/\-\. ](\d{1,2})[\/\-\. ](\d{4})$/; // Matches day first, e.g. DD-MM-YYYY
    if (isYearFirst) {
        regex = /^(\d{4})[\/\-\. ](\d{1,2})[\/\-\. ](\d{1,2})$/; // Matches year first, e.g. YYYY-MM-DD
    }

    const match = str.match(regex);
    if (match) {
        let day = 0;
        let month = 0;
        let year = 0;

        if (isYearFirst) {
            year = parseInt(match[1], 10);
            month = parseInt(match[2], 10) - 1;
            day = parseInt(match[3], 10);
        }
        else {
            day = parseInt(match[1], 10);
            month = parseInt(match[2], 10) - 1;
            year = parseInt(match[3], 10);
        }

        return numbersToDate(year, month, day);
    }
    else {
        return new Date('invalid');
    }
}

export function numbersToDate(year, month, day) {
    if (!Number.isInteger(year) || !Number.isInteger(month) || !Number.isInteger(day)) {
        throw new Error('numbersToDate() must receive integers');
    }
    if (0 <= month && month <= 11 && 0 <= year && year <= 9999) {
        const totalMonthDays = daysInMonth(new Date(year, month, 1));
        if (1 <= day && day <= totalMonthDays) {
            const date = new Date(1990, 1, 1); // Don't use new Date() without an argument
            date.setFullYear(year);
            date.setMonth(month);
            date.setDate(day);
            return date;
        }
        else {
            return new Date('invalid');
        }
    }
    else {
        return new Date('invalid');
    }
}

export function isValidDate(date) {
    return (date instanceof Date) && !isNaN(date.getTime());
}

/**
 * Get the previous day
 *
 * @param {Date} date - Reference date
 * @return {Date} New Date representing yesterday
 */
export function getYesterday(date) {
    const yesterday = new Date(date);
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
    const tomorrow = new Date(date);
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow;
}

export function getPrevWeek(date) {
    const prevWeek = new Date(date);
    prevWeek.setDate(prevWeek.getDate() - 7);
    return prevWeek;
}

export function getNextWeek(date) {
    const nextWeek = new Date(date);
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
    const newDaysInMonth = daysInMonth(new Date(year, prevMonth, 1));
    if (newDaysInMonth < day) {
        day = newDaysInMonth;
    }
    return new Date(year, prevMonth, day);
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
    const newDaysInMonth = daysInMonth(new Date(year, nextMonth, 1));
    if (newDaysInMonth < day) {
        day = newDaysInMonth;
    }
    return new Date(year, nextMonth, day);
}

export function getPrevYear(date) {
    let day = date.getDate();
    const month = date.getMonth();
    let year = date.getFullYear();
    let prevYear = year - 1;
    const newDaysInMonth = daysInMonth(new Date(prevYear, month, 1));
    if (newDaysInMonth < day) {
        day = newDaysInMonth;
    }
    return new Date(prevYear, month, day);
}

export function getNextYear(date) {
    let day = date.getDate();
    const month = date.getMonth();
    let year = date.getFullYear();
    let nextYear = year + 1;
    const newDaysInMonth = daysInMonth(new Date(nextYear, month, 1));
    if (newDaysInMonth < day) {
        day = newDaysInMonth;
    }
    return new Date(nextYear, month, day);
}

/**
 * Check if a date cell is visible in the grid
 *
 * @param {Date} date - Date to check
 * @param {HTMLDivElement} datePickerWrapper - Wrapper containing the grid
 * @return {boolean} True if the date cell is visible
 */
export function isDateVisible(date, datePickerWrapper) {
    const isoDate = ISOFormatFromDate(date);
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
    const currentFocusedDatePickerWrapper = e.target.closest('.new-date-picker-wrapper');

    if (!currentFocusedDatePickerWrapper || currentFocusedDatePickerWrapper !== lastFocusedDatePickerWrapper) {
        const bodyChildren = document.querySelectorAll('body > *');
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
    const keydownInDatePickerDialog = e.target.closest('.new-date-picker-wrapper[role="dialog"]');
    if (!keydownInDatePickerDialog) {
        closeAllDatePickers();
    }
}