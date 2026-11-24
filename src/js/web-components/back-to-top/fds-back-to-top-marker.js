class FDSBackToTopMarker extends HTMLElement {
}

function registerBackToTopMarker() {
    if (!customElements.get('fds-back-to-top-marker')) {
        customElements.define('fds-back-to-top-marker', FDSBackToTopMarker);
    }
}

export default registerBackToTopMarker;
