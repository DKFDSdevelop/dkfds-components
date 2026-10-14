export const styles = `
    :host {
        display: block;
    }

    .opener-label {
        font-size: 1.6rem;
        line-height: 2.4rem;
        font-weight: 600;
        color: #1a1a1a;
    }

    .opener-wrapper {
        position: relative;
        display: grid;
        max-width: 32rem;
        background-color: white;
        border: 1px solid #8E8E8E;
        border-radius: 8px;
        margin-top: 8px;
    }

    .opener-wrapper:has(.opener:focus) {
        outline: 3px solid #454545;
        outline-offset: 1px;
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
        border: none;
        background: transparent;
        color: #1a1a1a;
        font-size: 1.6rem;
        line-height: 2.4rem;
        width: 100%;
        padding: 4px;
    }

    .tags {
        grid-area: 1 / 1;
        z-index: 2;
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        gap: 4px;
        padding: 4px;
        pointer-events: none;
        max-width: 32rem;
    }

    .tag {
        pointer-events: auto;
        appearance: none;
        display: inline-flex;
        align-items: center;
        border: none;
        border-radius: 16px;
        background-color: #E6E6E6;
        color: #1a1a1a;
        font: inherit;
        font-size: 1.4rem;
        line-height: 2rem;
        padding: 2px 10px;
        cursor: pointer;
        max-width: 100%;
    }

    .tag-label {
        display: block;
        overflow-wrap: break-word;
        min-width: 0;
    }

    .tag .icon-svg {
        min-height: 2.4rem;
        min-width: 2.4rem;
        max-height: 2.4rem;
        max-width: 2.4rem;
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
        padding: calc(8px - 1px) calc(16px - 1px);
        cursor: pointer;
        overflow-wrap: break-word;
    }

    .option[aria-selected="true"] {
        background-color: #C6DBEF;
    }

    .option[data-active] {
        outline: 2px solid #454545;
        outline-offset: -2px;
    }
`;