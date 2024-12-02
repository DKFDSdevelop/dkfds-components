export default Dropdown;
/**
 * Add functionality to overflow menu component
 * @param {HTMLButtonElement} buttonElement Overflow menu button
 */
declare function Dropdown(buttonElement: HTMLButtonElement): void;
declare class Dropdown {
    /**
     * Add functionality to overflow menu component
     * @param {HTMLButtonElement} buttonElement Overflow menu button
     */
    constructor(buttonElement: HTMLButtonElement);
    buttonElement: HTMLButtonElement;
    targetEl: HTMLElement;
    responsiveListCollapseEnabled: boolean;
    /**
     * Set click events
     */
    init(): void;
    /**
     * Hide overflow menu
     */
    hide(): void;
    /**
     * Show overflow menu
     */
    show(): void;
}
//# sourceMappingURL=dropdown.d.ts.map