export default Tabs;
/**
 * Adds functionality to tab container component without URL change
 * @param {HTMLElement} tabContainer Tab container
 */
declare function Tabs(tabContainer: HTMLElement): void;
declare class Tabs {
    /**
     * Adds functionality to tab container component without URL change
     * @param {HTMLElement} tabContainer Tab container
     */
    constructor(tabContainer: HTMLElement);
    tabContainer: HTMLElement;
    tabs: NodeListOf<Element>;
    /**
     * Set event on component
     */
    init(): void;
    /***
     * Show tab and hide others
     * @param {HTMLButtonElement} tab button element
     * @param {boolean} setFocus True if tab button should be focused
     */
    activateTab(tab: HTMLButtonElement, setFocus: boolean): void;
}
//# sourceMappingURL=tabs.d.ts.map