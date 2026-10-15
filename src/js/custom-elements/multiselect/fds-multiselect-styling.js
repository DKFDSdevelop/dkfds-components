export const styles = `
    *,
    *::before,
    *::after {
        box-sizing: border-box;
    }

    .sr-only {
        position: absolute;
        width: 1px;
        height: 1px;
        margin: -1px;
        padding: 0;
        overflow: hidden;
        clip-path: inset(50%);
        border: 0;
        user-select: none;
        white-space: nowrap;
    }

    :host {
        display: block;
    }

    .opener-label {
        font-size: 1.6rem;
        line-height: 2.4rem;
        font-weight: 600;
        color: #1a1a1a;
        overflow-wrap: break-word;
        display: block;
        max-width: 66ch;
    }

    .opener-wrapper {
        position: relative;
        display: grid;
        max-width: 32rem;
        margin-top: 8px;
    }

    .opener {
        grid-area: 1 / 1;
        z-index: 1;
        appearance: none;
        display: flex;
        align-items: center;
        align-self: stretch;
        font: inherit;
        cursor: pointer;
        color: #1a1a1a;
        font-size: 1.6rem;
        line-height: 2.4rem;
        width: 100%;
        min-width: 0;
        padding: 7px 47px 7px 15px;
        border: 1px solid #8E8E8E;
        border-radius: 8px;
        background-color: transparent;
    }

    .opener:focus {
        outline: 3px solid #454545;
        outline-offset: 1px;
    }

    .opener-text {
        overflow-wrap: break-word;
        max-width: 100%;
        text-align: start;
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

    .tags {
        grid-area: 1 / 1;
        z-index: 2;
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        gap: 8px;
        padding: 8px 48px 8px 16px;
        pointer-events: none;
        max-width: 32rem;
        min-width: 0;
    }

    .tag {
        pointer-events: auto;
        appearance: none;
        display: inline-flex;
        align-items: center;
        border: none;
        border-radius: 1.2rem;
        background-color: var(--color-gray-600);
        color: var(--color-white);
        font: inherit;
        font-size: 1.6rem;
        line-height: 1.5;
        cursor: pointer;
        max-width: 100%;
        font-weight: 500;
        text-align: start;
        padding: 0 0.8rem 0 0.8rem;
    }

    .tag-label {
        display: block;
        overflow-wrap: break-word;
        min-width: 0;
        padding-right: 0.4rem;
    }

    .tag .icon-svg {
        min-height: 1.6rem;
        min-width: 1.6rem;
        max-height: 1.6rem;
        max-width: 1.6rem;
        fill: var(--color-white);
    }

    .popup {
        position: absolute;
        top: 100%;
        left: 0;
        right: 0;
        max-width: 32rem;
        max-height: min(440px, 100vh);
        overflow-y: auto;
        overscroll-behavior: contain;
        z-index: 10;
        background-color: white;
        border: 1px solid #8E8E8E;
        border-radius: 8px;
        margin-top: 4px;
    }

    .listbox {
        display: flex;
        flex-direction: column;
    }

    .option {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: calc(8px - 1px) calc(16px - 1px);
        cursor: pointer;
    }

    .option-checkbox {
        flex: 0 0 auto;
        width: 20px;
        height: 20px;
        border: 1px solid #8E8E8E;
        border-radius: 4px;
        padding: 2px;
        box-sizing: border-box;
    }

    .option-checkbox path {
        display: none;
    }

    .option[aria-selected="true"] .option-checkbox path {
        display: block;
    }

    .option-label {
        min-width: 0;
        overflow-wrap: break-word;
    }

    .option[data-active] {
        outline: 2px solid #454545;
        outline-offset: -2px;
    }
`;