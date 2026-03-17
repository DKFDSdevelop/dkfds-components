import { generateAndVerifyUniqueId } from '../../utils/generate-unique-id';

/**
 * Associates a label element with a select element.
 *
 * @param {HTMLLabelElement} label - The label element to associate.
 * @param {HTMLSelectElement} select - The select element to associate the label with.
 * @returns {void}
 */
export function associateLabelWithSelect(label, select) {
    if (!label) return;

    if (select) {
        if (!select.id) {
            select.id = generateAndVerifyUniqueId('sel');
        }

        label.htmlFor = select.id;
    }
    else {
        label.removeAttribute('for');
    }
}

/**
 * Matches the disabled class of a label element to the disabled attribute of a select element.
 *
 * @param {HTMLLabelElement} label - The label element to update.
 * @param {HTMLSelectElement} select - The select element to match the disabled state from.
 * @returns {void}
 */
export function setDisabledClass(label, select) {
    if (!label || !select) return;

    label.classList.toggle('disabled', select.hasAttribute('disabled'));
}

/**
 * Sets the `aria-describedby` attribute on a select element based on
 * the IDs of visible error messages and help texts.
 *
 * @param {HTMLSelectElement} select - The select element to update.
 * @param {NodeList} errorMessages - Error message elements to consider.
 * @param {NodeList} helpTexts - Help text elements to consider.
 * @returns {void}
 */
export function setAriaDescribedBy(select, errorMessages, helpTexts) {
    if (!select) return;
  
    const ids = [...Array.from(errorMessages), ...Array.from(helpTexts)]
        // Only include elements that are visible to screen readers and have an ID
        .filter(element => {
            const notDisplayNone = window.getComputedStyle(element).display !== 'none';
            const notAriaHidden = !element.hasAttribute('aria-hidden') || element.getAttribute('aria-hidden') === 'false';
            return element.id && notDisplayNone && notAriaHidden;
        })
        // Extract the ID from each element
        .map(element => element.id);
  
    ids.length > 0 ? select.setAttribute('aria-describedby', ids.join(' ')) : select.removeAttribute('aria-describedby');
}


/**
 * Sets or removes the `aria-invalid` attribute on a select element
 * based on whether any error messages are visible to screen readers.
 *
 * @param {HTMLSelectElement} select - The select element to update.
 * @param {NodeList} errorMessages - Error message elements to evaluate.
 * @returns {void}
 */
export function setInvalid(select, errorMessages) {
    if (!select) return;

    const invalid = Array.from(errorMessages).some(element => {
        const notDisplayNone = window.getComputedStyle(element).display !== 'none';
        const notAriaHidden = !element.hasAttribute('aria-hidden') || element.getAttribute('aria-hidden') === 'false';
        return notDisplayNone && notAriaHidden;
    });

    invalid ? select.setAttribute('aria-invalid', 'true') : select.removeAttribute('aria-invalid');
}