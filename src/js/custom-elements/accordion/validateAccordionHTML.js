export function validateAccordionHTML(children) {
    if (children.length !== 2) return false;

    const [heading, content] = children;

    // Heading tag
    if (!['H1', 'H2', 'H3', 'H4', 'H5', 'H6'].includes(heading.tagName)) return false;

    // Button
    const button = heading.querySelector(':scope > button.accordion-button[aria-expanded][aria-controls]');
    if (!button) return false;

    // Title
    if (!button.querySelector(':scope > .accordion-title')) return false;

    // Variant icon and text (optional)
    const variant = button.querySelector(':scope > .accordion-title + .accordion-icon');
    if (variant) {
        if (
            !variant.querySelector(':scope > .icon_text') ||
            !variant.querySelector(':scope > .icon-svg')
        ) return false;
    }

    // Content
    if (
        !content.classList.contains('accordion-content') ||
        !content.hasAttribute('id') ||
        !content.hasAttribute('aria-hidden')
    ) return false;

    return true;
}
