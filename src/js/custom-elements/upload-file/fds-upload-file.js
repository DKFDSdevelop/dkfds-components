import { generateAndVerifyUniqueId } from '../../utils/generate-unique-id';

class FDSUploadFile extends HTMLElement {

    /* Private instance fields */

    #initialized;


    /* Private methods */

    #setupUploadDropzone() {
    // Create title
    const title = document.createElement('h5');
    title.className = 'fds-upload-title';
    title.textContent = 'Tilføj filer';

    // Create dropzone container
    const dropzone = document.createElement('div');
    dropzone.className = 'fds-upload-dropzone';

    // Create dropzone content
    const dropzoneContent = document.createElement('div');
    dropzoneContent.className = 'fds-upload-dropzone-content';

    // Create SVG icon
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.classList.add('icon-svg');
    svg.setAttribute('focusable', 'false');
    svg.setAttribute('aria-hidden', 'true');

    const use = document.createElementNS('http://www.w3.org/2000/svg', 'use');
    use.setAttribute('href', '#plus-circle');
    svg.appendChild(use);

    // Create paragraph with text and label
    const paragraph = document.createElement('p');

    const textNode = document.createTextNode('Træk dine filer herhen eller ');
    paragraph.appendChild(textNode);

    // Create label with input
    const label = document.createElement('label');
    label.className = 'fds-upload-choose';
    label.textContent = 'vælg filer';

    const input = document.createElement('input');
    input.type = 'file';
    input.className = 'fds-upload-input';
    input.multiple = true;

    label.appendChild(input);
    paragraph.appendChild(label);

    // Assemble the structure
    dropzoneContent.appendChild(svg);
    dropzoneContent.appendChild(paragraph);
    dropzone.appendChild(dropzoneContent);

    // Create container and add both elements
    const container = document.createDocumentFragment();
    container.appendChild(title);
    container.appendChild(dropzone);

    return container;
}

    /* Attributes which can invoke attributeChangedCallback() */

    static observedAttributes = [];

/* --------------------------------------------------
CUSTOM ELEMENT CONSTRUCTOR (do not access or add attributes in the constructor)
-------------------------------------------------- */

constructor() {
    super();

    this.#initialized = false;
}

/* --------------------------------------------------
CUSTOM ELEMENT ADDED TO DOCUMENT
-------------------------------------------------- */

connectedCallback() {
    if (this.#initialized) return;

    const uploadElements = this.#setupUploadDropzone();
    this.appendChild(uploadElements);
    
    this.#initialized = true;

}

/* --------------------------------------------------
CUSTOM ELEMENT REMOVED FROM DOCUMENT
-------------------------------------------------- */

disconnectedCallback() {
    this.#initialized = false;


}

/* --------------------------------------------------
CUSTOM ELEMENT'S ATTRIBUTE(S) CHANGED
-------------------------------------------------- */

attributeChangedCallback(attribute, oldValue, newValue) {
    if (!this.#initialized) return;


}
}

function registerUploadFile() {
    if (customElements.get('fds-upload-file') === undefined) {
        window.customElements.define('fds-upload-file', FDSUploadFile);
    }
}

export default registerUploadFile;

