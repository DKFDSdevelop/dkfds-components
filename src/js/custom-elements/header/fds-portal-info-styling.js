export const styles = `
    *,
    *::before,
    *::after {
        box-sizing: border-box;
    }

    :host {
        display: block;
        background-color: var(--header-portal-background-color, #FFFFFF);
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

    .portal-info-mobile {
        border-top: 1px solid #8e8e8e;
        padding: 24px;
        text-align: left;
        background-color: var(--header-portal-background-color, #FFFFFF);
    }
`;