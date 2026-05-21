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

    button {
        text-transform: none;
        appearance: none;
        font-family: inherit;
        font-size: 100%;
        line-height: 1.5;
        margin: 0;
    }

    button:focus {
        outline: 3px solid #454545;
        outline-offset: 1px;
    }

    :host {
        display: block;
        background-color: #f1f1f1;
        width: 100%;
    }

    .portal-info-inner {
        width: 100%;
        max-width: 1200px;
        min-height: 48px;
        padding-top: 4px;
        padding-bottom: 4px;
        padding-right: 16px;
        padding-left: 16px;
        display: flex;
        align-items: center;
        flex-direction: row;
        margin-right: auto;
        margin-left: auto;
    }

    .logo {
        background-image: url(/assets/img/logo-borgerdk.svg);
        background-size: contain;
        background-repeat: no-repeat;
        background-position: center left;
        display: inline-block;
        height: 24px;
        width: 100%;
        max-width: 30%;
    }

    .portal-user {
        margin-left: auto;
        display: none;
        align-items: center;
        justify-content: flex-end;
        max-width: 70%;

        @media (min-width: 992px) {
            display: flex;
        }
    }
`;