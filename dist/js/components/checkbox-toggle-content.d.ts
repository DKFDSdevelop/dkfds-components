export default CheckboxToggleContent;
/**
 * Adds click functionality to checkbox collapse component
 * @param {HTMLInputElement} checkboxElement
 */
declare function CheckboxToggleContent(checkboxElement: HTMLInputElement): void;
declare class CheckboxToggleContent {
    /**
     * Adds click functionality to checkbox collapse component
     * @param {HTMLInputElement} checkboxElement
     */
    constructor(checkboxElement: HTMLInputElement);
    checkboxElement: HTMLInputElement;
    targetElement: any;
    /**
     * Set events on checkbox state change
     */
    init(): void;
    /**
     * Toggle checkbox content
     */
    toggle(): void;
    /**
     * Expand content
     * @param {HTMLInputElement} checkboxElement Checkbox input element
     * @param {HTMLElement} contentElement Content container element
     */
    expand(checkboxElement: HTMLInputElement, contentElement: HTMLElement): void;
    /**
     * Collapse content
     * @param {HTMLInputElement} checkboxElement Checkbox input element
     * @param {HTMLElement} contentElement Content container element
     */
    collapse(triggerEl: any, targetEl: any): void;
}
//# sourceMappingURL=checkbox-toggle-content.d.ts.map