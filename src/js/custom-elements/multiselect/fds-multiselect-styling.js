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
        display: inline-block;
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
        background-color: var(--color-white);
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

    .tag:focus-visible {
        outline: 3px solid #454545;
        outline-offset: 1px;
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
        z-index: 10;
        background-color: white;
        border: 1px solid #8E8E8E;
        border-radius: 8px;
        margin-top: 4px;
        padding-top: 7px;
        padding-bottom: 7px;
        box-shadow: 0 4px 12px 0 rgba(0, 0, 0, .2);
    }

    .listbox {
        display: flex;
        flex-direction: column;
    }

    .option {
        display: flex;
        align-items: flex-start;
        gap: 8px;
        padding: 8px calc(16px - 1px);
        cursor: pointer;
    }

    .option:hover {
        background-color: var(--color-gray-100);
    }

    .option:active {
        background-color: var(--color-gray-200);
    }

    .option-checkbox {
        flex: 0 0 auto;
        width: 2.4rem;
        height: 2.4rem;
        border: 2px solid var(--color-black);
        border-radius: 4px;
        background-color: var(--color-white);
    }

    .option-checkbox path {
        display: none;
    }

    .option[aria-selected="true"] .option-checkbox {
        background-color: var(--color-black);
        border: 0;
    }

    .option[aria-selected="true"] .option-checkbox path {
        display: block;
        fill: var(--color-white);
    }

    .option-label {
        min-width: 0;
        overflow-wrap: break-word;
        line-height: 1.5;
        color: var(--color-black);
    }

    .option[data-active] {
        outline: 3px solid #454545;
        outline-offset: -3px;
    }
`;