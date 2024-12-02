/**
 * fds-input attributes
 *
 * @typedef {Object} FdsInputAttributes
 * @property {string} label
 * @property {string} [value]
 * @property {string} [error]
 * @property {boolean} [editbutton]
 * @property {boolean} [readonly]
 * @property {(event: { target: FDSInput }) => void} [onfds-edit-clicked]
 * @property {(event: { target: FDSInput }) => void} [onchange]
 */
export class FDSInput extends HTMLElement {
    static observedAttributes: string[];
    set autocomplete(val: string);
    get autocomplete(): string;
    set disabled(val: string);
    get disabled(): string;
    set editbutton(val: string);
    get editbutton(): string;
    set error(val: string);
    get error(): string;
    set helptext(val: string);
    get helptext(): string;
    set inputid(val: string);
    get inputid(): string;
    set label(val: string);
    get label(): string;
    set maxchar(val: string);
    get maxchar(): string;
    set maxwidth(val: string);
    get maxwidth(): string;
    set name(val: string);
    get name(): string;
    set prefix(val: string);
    get prefix(): string;
    set readonly(val: string);
    get readonly(): string;
    set required(val: string);
    get required(): string;
    set showoptional(val: string);
    get showoptional(): string;
    set showrequired(val: string);
    get showrequired(): string;
    set suffix(val: string);
    get suffix(): string;
    set tooltip(val: string);
    get tooltip(): string;
    set type(val: string);
    get type(): string;
    set value(val: any);
    get value(): any;
    getLabelElement(): any;
    getInputElement(): any;
    /**
     * @param {object} newGlossary
     * @param {string} newGlossary.errorText
     * @param {string} newGlossary.editText
     * @param {string} newGlossary.requiredText
     * @param {string} [newGlossary.osv] And a whole lot of other stuf... @todo
     */
    updateGlossary(newGlossary: {
        errorText: string;
        editText: string;
        requiredText: string;
        osv?: string;
    }): void;
    charactersLeft(): number;
    updateMessages(): void;
    connectedCallback(): void;
    disconnectedCallback(): void;
    attributeChangedCallback(attribute: any, oldValue: any, newValue: any): void;
    #private;
}
/**
 * fds-input attributes
 */
export type FdsInputAttributes = {
    label: string;
    value?: string;
    error?: string;
    editbutton?: boolean;
    readonly?: boolean;
    "onfds-edit-clicked"?: (event: {
        target: FDSInput;
    }) => void;
    onchange?: (event: {
        target: FDSInput;
    }) => void;
};
//# sourceMappingURL=fds-input.d.ts.map