export default Accordion;
/**
 * Adds click functionality to accordion list
 * @param {HTMLElement} $accordion the accordion ul element
 * @param {JSON} strings Translate labels: {"open_all": "Åbn alle", "close_all": "Luk alle"}
 */
declare function Accordion($accordion: HTMLElement, strings?: JSON): void;
declare class Accordion {
    /**
     * Adds click functionality to accordion list
     * @param {HTMLElement} $accordion the accordion ul element
     * @param {JSON} strings Translate labels: {"open_all": "Åbn alle", "close_all": "Luk alle"}
     */
    constructor($accordion: HTMLElement, strings?: JSON);
    accordion: HTMLElement;
    text: JSON;
    /**
     * Set eventlisteners on click elements in accordion list
     */
    init(): void;
    buttons: NodeListOf<Element>;
    bulkFunctionButton: Element;
    /**
     * Bulk event handler: Triggered when clicking on .accordion-bulk-button
     */
    bulkEvent(): void;
    /**
     * Accordion button event handler: Toggles accordion
     * @param {HTMLButtonElement} $button
     * @param {PointerEvent} e
     */
    eventOnClick($button: HTMLButtonElement, e: PointerEvent): void;
    /**
     * Toggle a button's "pressed" state, optionally providing a target
     * state.
     *
     * @param {HTMLButtonElement} button
     * @param {boolean?} expanded If no state is provided, the current
     * state will be toggled (from false to true, and vice-versa).
     * @return {boolean} the resulting state
     */
    toggleButton(button: HTMLButtonElement, expanded: boolean | null, bulk?: boolean): boolean;
}
//# sourceMappingURL=accordion.d.ts.map