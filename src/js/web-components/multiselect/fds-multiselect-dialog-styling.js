export const styles = `
    *,
    *::before,
    *::after {
        box-sizing: border-box;
    }

    :host {
        display: block;
        position: absolute;
        top: 100%;
        left: 0;
        right: 0;
        max-width: 32rem;
        max-height: min(440px, 100vh);
        overflow-y: auto;
        overflow-x: hidden;
        z-index: 10;
        background-color: var(--color-white);
        border: 1px solid #8E8E8E;
        border-radius: 8px;
        margin-top: 4px;
        padding-top: 7px;
        padding-bottom: 7px;
        box-shadow: 0 4px 12px 0 rgba(0, 0, 0, .2);
    }

    :host([hidden]) {
        display: none;
    }

    .select-all {
        border-bottom: 1px solid var(--color-gray-200);
        padding-bottom: 7px;
        margin-bottom: 8px;
    }

    .select-all-checkbox {
        position: absolute;
        opacity: 0;
        width: 2.4rem;
        height: 2.4rem;
        margin: 0;
        cursor: pointer;
    }

    .select-all-label {
        display: flex;
        align-items: flex-start;
        gap: 8px;
        cursor: pointer;
        padding: 8px 15px;
    }

    .select-all-box {
        flex: 0 0 auto;
        width: 2.4rem;
        height: 2.4rem;
        border: 2px solid var(--color-black);
        border-radius: 4px;
        background-color: var(--color-white);
    }

    .select-all-box .check-icon,
    .select-all-box .indeterminate-icon {
        display: none;
    }

    .select-all-checkbox:focus + .select-all-label {
        outline: 3px solid #454545;
        outline-offset: -3px;
    }

    .select-all-checkbox:checked + .select-all-label .select-all-box,
    .select-all-checkbox:indeterminate + .select-all-label .select-all-box {
        background-color: var(--color-black);
        border: 0;
    }

    .select-all-checkbox:checked + .select-all-label .select-all-box .check-icon {
        display: block;
        fill: var(--color-white);
    }

    .select-all-checkbox:indeterminate + .select-all-label .select-all-box .indeterminate-icon {
        display: block;
        fill: var(--color-white);
    }
`;