export default ErrorSummary;
/**
 * Handle focus on input elements upon clicking link in error message
 * @param {HTMLElement} element Error summary element
 */
declare function ErrorSummary(element: HTMLElement): void;
declare class ErrorSummary {
    /**
     * Handle focus on input elements upon clicking link in error message
     * @param {HTMLElement} element Error summary element
     */
    constructor(element: HTMLElement);
    element: HTMLElement;
    /**
     * Set events on links in error summary
     */
    init(): void;
    /**
    * Click event handler
    *
    * @param {MouseEvent} event - Click event
    */
    handleClick(event: MouseEvent): void;
    /**
     * Focus the target element
     *
     * By default, the browser will scroll the target into view. Because our labels
     * or legends appear above the input, this means the user will be presented with
     * an input without any context, as the label or legend will be off the top of
     * the screen.
     *
     * Manually handling the click event, scrolling the question into view and then
     * focussing the element solves this.
     *
     * This also results in the label and/or legend being announced correctly in
     * NVDA (as tested in 2018.3.2) - without this only the field type is announced
     * (e.g. "Edit, has autocomplete").
     *
     * @param {HTMLElement} $target - Event target
     * @returns {boolean} True if the target was able to be focussed
     */
    focusTarget($target: HTMLElement): boolean;
    /**
     * Get fragment from URL
     *
     * Extract the fragment (everything after the hash) from a URL, but not including
     * the hash.
     *
     * @param {string} url - URL
     * @returns {string} Fragment from URL, without the hash
     */
    getFragmentFromUrl(url: string): string;
    /**
     * Get associated legend or label
     *
     * Returns the first element that exists from this list:
     *
     * - The `<legend>` associated with the closest `<fieldset>` ancestor, as long
     *   as the top of it is no more than half a viewport height away from the
     *   bottom of the input
     * - The first `<label>` that is associated with the input using for="inputId"
     * - The closest parent `<label>`
     *
     * @param {HTMLElement} $input - The input
     * @returns {HTMLElement} Associated legend or label, or null if no associated
     *                        legend or label can be found
     */
    getAssociatedLegendOrLabel($input: HTMLElement): HTMLElement;
}
//# sourceMappingURL=error-summary.d.ts.map