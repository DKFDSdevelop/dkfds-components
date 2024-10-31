export default MenuDropdown;
/**
 * Add functionality to overflow buttons in mobile menu
 * @param {HTMLButtonElement} buttonElement Mobile menu button
 */
declare function MenuDropdown(buttonElement: HTMLButtonElement): void;
declare class MenuDropdown {
    /**
     * Add functionality to overflow buttons in mobile menu
     * @param {HTMLButtonElement} buttonElement Mobile menu button
     */
    constructor(buttonElement: HTMLButtonElement);
    buttonElement: HTMLButtonElement;
    targetEl: HTMLElement;
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
//# sourceMappingURL=navigation-drawer-overflow.d.ts.map