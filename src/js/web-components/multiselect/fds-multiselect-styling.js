export const styles = `
    :host {
        display: block;
        position: relative;
        max-width: 32rem;
    }

    ::slotted(label) {
        font-size: 1.6rem;
        line-height: 2.4rem;
        font-weight: 600;
        color: #1a1a1a;
        overflow-wrap: break-word;
        display: block;
        max-width: 66ch;
    }

    ::slotted(fds-multiselect-opener) {
        display: block;
        margin-top: 8px;
    }

    .dialog {
        position: absolute;
        top: 100%;
        left: 0;
        right: 0;
        max-width: 32rem;
        max-height: min(440px, 100vh);
        overflow-y: auto;
        overscroll-behavior: contain;
        z-index: 10;
        background-color: var(--color-white);
        border: 1px solid #8E8E8E;
        border-radius: 8px;
        margin-top: 4px;
        padding-top: 7px;
        padding-bottom: 7px;
        box-shadow: 0 4px 12px 0 rgba(0, 0, 0, .2);
    }
`;