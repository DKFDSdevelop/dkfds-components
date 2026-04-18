import { generateAndVerifyUniqueId } from '../utils/generate-unique-id';

/**
 * Associates a label element with an (input) element.
 * If the element lacks an ID, a unique one is generated using the given prefix.
 * If no element is provided, the `for` attribute is removed from the label.
 *
 * @param {HTMLLabelElement} label - The label element to associate.
 * @param {HTMLElement} element - The element to associate the label with.
 * @param {string} prefix - The prefix used when generating a unique ID for the element.
 */
export function associateLabelWithElement(label, element, prefix) {
    if (!label) return;

    if (element) {
        if (!element.id) {
            element.id = generateAndVerifyUniqueId(prefix);
        }
        label.htmlFor = element.id;
    }
    else {
        label.removeAttribute('for');
    }
}