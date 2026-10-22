export const styles = `
    :host {
        position: relative;
        display: flex;
        align-items: center;
        cursor: pointer;
        color: #1a1a1a;
        font-size: 1.6rem;
        line-height: 2.4rem;
        width: 100%;
        min-width: 0;
        padding: 7px 47px 7px 15px;
        border: 1px solid #8E8E8E;
        border-radius: 8px;
        background-color: var(--color-white);
    }

    :host(:focus-visible) {
        outline: 3px solid #454545;
        outline-offset: 1px;
    }

    .chevron-icon {
        position: absolute;
        top: 50%;
        right: 16px;
        transform: translateY(-50%);
        width: 2.4rem;
        height: 2.4rem;
        pointer-events: none;
    }
`;