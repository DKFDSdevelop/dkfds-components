export default RadioToggleGroup;
/**
 * Adds click functionality to radiobutton collapse list
 * @param {HTMLElement} containerElement
 */
declare function RadioToggleGroup(containerElement: HTMLElement): void;
declare class RadioToggleGroup {
    /**
     * Adds click functionality to radiobutton collapse list
     * @param {HTMLElement} containerElement
     */
    constructor(containerElement: HTMLElement);
    radioGroup: HTMLElement;
    radioEls: NodeListOf<Element>;
    targetEl: any;
    /**
     * Set events
     */
    init(): void;
    /**
     * Toggle radiobutton content
     * @param {HTMLInputElement} radioInputElement
     */
    toggle(radioInputElement: HTMLInputElement): void;
    /**
     * Expand radio button content
     * @param {} radioInputElement Radio Input element
     * @param {*} contentElement Content element
     */
    expand(radioInputElement: any, contentElement: any): void;
    /**
     * Collapse radio button content
     * @param {} radioInputElement Radio Input element
     * @param {*} contentElement Content element
     */
    collapse(radioInputElement: any, contentElement: any): void;
}
//# sourceMappingURL=radio-toggle-content.d.ts.map