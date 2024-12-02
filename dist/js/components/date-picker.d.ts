export default datePicker;
/**
 * The properties and elements within the date picker.
 */
export type DatePickerContext = {
    calendarEl: HTMLDivElement;
    datePickerEl: HTMLElement;
    dialogEl: HTMLDivElement;
    internalInputEl: HTMLInputElement;
    externalInputEl: HTMLInputElement;
    statusEl: HTMLDivElement;
    guideEl: HTMLDivElement;
    firstYearChunkEl: HTMLDivElement;
    calendarDate: Date;
    minDate: Date;
    maxDate: Date;
    selectedDate: Date;
    rangeDate: Date;
    defaultDate: Date;
};
declare const datePicker: receptor.behavior;
//# sourceMappingURL=date-picker.d.ts.map