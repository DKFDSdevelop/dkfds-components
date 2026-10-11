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

    .field {
        position: relative;
    }

    .opener {
        appearance: none;
        display: flex;
        align-items: center;
        font: inherit;
        cursor: pointer;
        border-radius: 8px;
        width: 100%;
        max-width: 32rem;
        background-color: white;
        border:1px solid #8E8E8E;
        color: #1a1a1a;
        font-size: 1.6rem;
        line-height: 2.4rem;
        height: calc(2.4rem + 16px);
        padding: calc(8px - 1px) calc(16px - 1px);
        padding-right: 32px;
        margin-top: 8px;
    }

    .opener:focus {
        outline: 3px solid #454545;
        outline-offset: 1px;
    }

    .popup {
        position: absolute;
        top: 100%;
        left: 0;
        right: 0;
        max-width: 32rem;
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
    }
`;