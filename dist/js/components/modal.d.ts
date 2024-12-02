export default Modal;
/**
 * Adds click functionality to modal
 * @param {HTMLElement} $modal Modal element
 */
declare function Modal($modal: HTMLElement): void;
declare class Modal {
    /**
     * Adds click functionality to modal
     * @param {HTMLElement} $modal Modal element
     */
    constructor($modal: HTMLElement);
    $modal: HTMLElement;
    triggers: NodeListOf<Element>;
    /**
     * Set events
     */
    init(): void;
    /**
     * Hide modal
     */
    hide(): void;
    /**
     * Show modal
     */
    show(e?: any): void;
}
//# sourceMappingURL=modal.d.ts.map