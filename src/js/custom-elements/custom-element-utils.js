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

/**
 * Creates an SVG icon element with a single path.
 * The SVG is given a fixed viewBox of '0 -960 960 960'.
 *
 * @param {string} pathD - The `d` attribute value defining the shape of the SVG path.
 * @returns {SVGSVGElement} The constructed SVG element containing the specified path.
 */
export function createSvgIcon(pathD) {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
    svg.setAttribute('viewBox', '0 -960 960 960');
    svg.setAttribute('focusable', 'false');
    svg.setAttribute('aria-hidden', 'true');
    svg.classList.add('icon-svg');

    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', pathD);
    svg.appendChild(path);

    return svg;
}

/**
 * Notifies the error summary that error messages have been disconnected/removed.
 * The parent wrapper dispatches 'error-message-callback' events for each error message found.
 *
 * @param {HTMLElement} element - The element to query for error messages.
 */
export function notifySummaryOnDisconnect(element) {
    if (!document.querySelector('fds-error-summary[auto]')) return;

    element.querySelectorAll('fds-error-message[id]').forEach((errorMessage) => {
        document.dispatchEvent(new CustomEvent('error-message-callback', {
            detail: {
                errorId: errorMessage.id,
                isRemoved: true
            }
        }));
    });
}

/**
 * Notifies the error summary of visibility changes in error messages.
 * The parent wrapper dispatches 'error-message-visibility-changed' events for each error message found.
 *
 * @param {HTMLElement} element - The element to query for error messages.
 */
export function notifySummaryOnVisibilityChange(element) {
    if (!document.querySelector('fds-error-summary[auto]')) return;

    element.querySelectorAll('fds-error-message[id]').forEach((errorMessage) => {
        document.dispatchEvent(new CustomEvent('error-message-visibility-changed', {
            detail: {
                errorId: errorMessage.id
            }
        }));
    });
}
