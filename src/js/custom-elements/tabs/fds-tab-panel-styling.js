export const styles = `
    *,
    *::before,
    *::after {
        box-sizing: border-box;
    }

    :host {
        display: block;
        border: 1px solid #8E8E8E;
        width: 100%;
        padding: 24px;
        overflow: auto hidden;
    }

    :host(:focus) {
        outline: 3px solid #454545;
        outline-offset: 1px;
    }
`;