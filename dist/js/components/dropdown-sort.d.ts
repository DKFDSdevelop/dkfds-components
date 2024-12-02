export default DropdownSort;
/**
 * Add functionality to sorting variant of Overflow menu component
 * @param {HTMLElement} container .overflow-menu element
 */
declare function DropdownSort(container: HTMLElement): void;
declare class DropdownSort {
    /**
     * Add functionality to sorting variant of Overflow menu component
     * @param {HTMLElement} container .overflow-menu element
     */
    constructor(container: HTMLElement);
    container: HTMLElement;
    button: Element;
    overflowMenu: Dropdown;
    /**
     * Add click events on overflow menu and options in menu
     */
    init(): void;
    /**
     * Update button text to selected value
     */
    updateSelectedValue(): void;
    /**
     * Triggers when choosing option in menu
     * @param {PointerEvent} e
     */
    onOptionClick(e: PointerEvent): void;
}
import Dropdown from './dropdown';
//# sourceMappingURL=dropdown-sort.d.ts.map