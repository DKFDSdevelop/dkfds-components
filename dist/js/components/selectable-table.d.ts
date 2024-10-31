export default TableSelectableRows;
/**
 *
 * @param {HTMLTableElement} table Table Element
 */
declare function TableSelectableRows(table: HTMLTableElement): void;
declare class TableSelectableRows {
    /**
     *
     * @param {HTMLTableElement} table Table Element
     */
    constructor(table: HTMLTableElement);
    table: HTMLTableElement;
    /**
     * Initialize eventlisteners for checkboxes in table
     */
    init(): void;
    groupCheckbox: boolean | Element;
    tbodyCheckboxList: HTMLCollectionOf<Element>;
    /**
     * Get group checkbox in table header
     * @returns element on true - false if not found
     */
    getGroupCheckbox(): false | Element;
    /**
     * Get table body checkboxes
     * @returns HTMLCollection
     */
    getCheckboxList(): HTMLCollectionOf<Element>;
}
//# sourceMappingURL=selectable-table.d.ts.map