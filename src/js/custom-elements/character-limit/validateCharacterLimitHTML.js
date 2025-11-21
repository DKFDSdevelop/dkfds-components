export function validateCharacterLimitHTML(children) {
    if (children.length !== 3) return false;

    const [spanSrMaxLimit, spanSrUpdate, spanVisualUpdate] = children;

    if (
        !spanSrMaxLimit.classList.contains('sr-only') ||
        !spanSrMaxLimit.hasAttribute('id')
    ) return false;

    if (
        !spanSrUpdate.classList.contains('sr-only') ||
        !spanSrUpdate.hasAttribute('aria-live')
    ) return false;

    if (
        !spanVisualUpdate.classList.contains('visual-message')
    ) return false;

    return true;
}
