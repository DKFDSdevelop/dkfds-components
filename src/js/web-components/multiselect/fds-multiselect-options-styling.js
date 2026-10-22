export const styles = `
    *,
    *::before,
    *::after {
        box-sizing: border-box;
    }

    :host {
        display: flex;
        flex-direction: column;
        overflow-x: hidden;
    }

    :host(:focus) {
        outline: 0;
    }

    ::slotted(fds-multiselect-option) {
        min-width: 0;
    }
`;