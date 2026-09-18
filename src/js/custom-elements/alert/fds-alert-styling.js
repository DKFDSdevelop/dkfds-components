export const styles = `
    *,
    *::before,
    *::after {
        box-sizing: border-box;
    }

    :host {
        display: block;
    }

    .alert {
        position: relative;
        margin-top: 16px;
        margin-bottom: 16px;
        border-radius: 8px;
        padding: 1.6rem;
        padding-left: 5.2rem;
        background-repeat: no-repeat;
        background-color: var(--alert-background-color);
        background-image: linear-gradient(to right, var(--alert-border-color) 4px, transparent 4px);
    }

    .alert-info {
        --alert-background-color: #e2f2fb;
        --alert-border-color: #1B86C3;
    }

    .alert-success {
        --alert-background-color: #ddf7ce;
        --alert-border-color: #358000;
    }

    .alert-warning {
        --alert-background-color: #FFEECC;
        --alert-border-color: #febb30;
    }

    .alert-error {
        --alert-background-color: #FFE0E0;
        --alert-border-color: #CC0000;
    }

    slot[name="heading"]::slotted(*) {
        margin-top: var(--alert-heading-margin-top) !important;
        margin-bottom: var(--alert-heading-margin-bottom) !important;
        font-size: 1.6rem !important;
        line-height: 1.5 !important;
        font-weight: 600 !important;
        color: #1a1a1a !important;
        overflow-wrap: break-word !important;
    }

    slot[name="content"]::slotted(*) {
        margin-top: var(--alert-content-margin-top) !important;
        margin-bottom: var(--alert-content-margin-bottom) !important;
    }

    .alert-icon,
    slot[name="icon"]::slotted(*) {
        height: 2.4rem;
        width: 2.4rem;
        vertical-align: middle;
        fill: currentColor;
        position: absolute;
        left: 2rem;
    }
`;