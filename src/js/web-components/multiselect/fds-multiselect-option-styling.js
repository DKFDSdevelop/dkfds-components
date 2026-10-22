export const styles = `
    :host {
        display: flex;
        align-items: flex-start;
        gap: 8px;
        padding: 8px 15px;
        cursor: pointer;
        color: var(--color-black);
        font-size: 1.6rem;
        line-height: 1.5;
    }

    :host(:hover) {
        background-color: var(--color-gray-100);
    }

    :host(:active) {
        background-color: var(--color-gray-200);
    }

    :host([data-active]) {
        outline: 3px solid #454545;
        outline-offset: -3px;
    }

    :host([aria-selected="true"]) {
        background-color: var(--color-gray-100);
        font-weight: 600;
    }
`;
