export default Toast;
/**
 * Show/hide toast component
 * @param {HTMLElement} element
 */
declare function Toast(element: HTMLElement): void;
declare class Toast {
    /**
     * Show/hide toast component
     * @param {HTMLElement} element
     */
    constructor(element: HTMLElement);
    element: HTMLElement;
    /**
     * Show toast
     */
    show(): void;
    /**
     * Hide toast
     */
    hide(): void;
}
//# sourceMappingURL=toast.d.ts.map