import { generateAndVerifyUniqueId } from '../../utils/generate-unique-id';

class FDSUploadFile extends HTMLElement {

    /* Private instance fields */

    #initialized;
    #files;


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

    #setupFileList() {
        const container = document.createElement('div');
        container.className = 'fds-upload-file-list';

        // Header with title and "add more" button
        const header = document.createElement('div');
        header.className = 'fds-upload-header';

        const title = document.createElement('h5');
        title.className = 'fds-upload-title';
        title.textContent = 'Vedhæft filer';

        const addMoreBtn = document.createElement('button');
        addMoreBtn.className = 'fds-upload-add-more';
        addMoreBtn.textContent = 'Vælg flere filer';
        addMoreBtn.addEventListener('click', () => this.#showFileSelector());

        header.appendChild(title);
        header.appendChild(addMoreBtn);

        // Files container
        const filesContainer = document.createElement('div');
        filesContainer.className = 'fds-upload-files';

        container.appendChild(header);
        container.appendChild(filesContainer);

        return container;
    }

    #setupFileItem(file) {
        const fileItem = document.createElement('div');
        fileItem.className = 'fds-upload-file-item';

        const fileName = document.createElement('span');
        fileName.className = 'fds-upload-file-name';
        fileName.textContent = file.name;

        const removeBtn = document.createElement('button');
        removeBtn.className = 'fds-upload-remove';
        removeBtn.textContent = 'Fjern';
        removeBtn.addEventListener('click', () => this.#removeFile(file.name));

        fileItem.appendChild(fileName);
        fileItem.appendChild(removeBtn);

        return fileItem;
    }

    #showFileSelector() {
        const input = document.createElement('input');
        input.type = 'file';
        input.multiple = true;
        input.style.display = 'none';

        input.addEventListener('change', (e) => {
            this.#handleFiles(e.target.files);
            document.body.removeChild(input);
        });

        document.body.appendChild(input);
        input.click();
    }

    #removeFile(fileName) {
        // Remove from files array
        this.#files = this.#files.filter(file => file.name !== fileName);

        // Remove from DOM
        const fileItems = this.querySelectorAll('.fds-upload-file-item');
        const fileItem = Array.from(fileItems).find(item =>
            item._fileReference && item._fileReference.name === fileName
        );

        if (fileItem) {
            fileItem.remove();
        }

        // If no files left, show dropzone again
        if (this.#files.length === 0) {
            this.#showDropzone();
        }
    }

    #showDropzone() {
        this.innerHTML = '';
        const uploadElements = this.#setupUploadDropzone();
        this.appendChild(uploadElements);

        const dropzone = this.querySelector('.fds-upload-dropzone');
        this.#handleDragAndDrop(dropzone);

        const fileInput = this.querySelector('.fds-upload-input');
        fileInput.addEventListener('change', (e) => {
            this.#handleFiles(e.target.files);
        });
    }

    #showFileList() {
        this.innerHTML = '';
        const fileList = this.#setupFileList();
        this.appendChild(fileList);

        this.#handleDragAndDrop(this);
        console.log(this)
    }

    #handleDragAndDrop(dropzone) {
        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
            dropzone.addEventListener(eventName, this.#preventDefaults, false);
        });

        ['dragenter', 'dragover'].forEach(eventName => {
            this.addEventListener(eventName, this.#preventDefaults, false);
        });

        ['dragenter', 'dragover'].forEach(eventName => {
            dropzone.addEventListener(eventName, () => this.#highlight(dropzone), false);
        });

        ['dragleave', 'drop'].forEach(eventName => {
            dropzone.addEventListener(eventName, () => this.#unhighlight(dropzone), false);
        });

        dropzone.addEventListener('drop', (e) => this.#handleDrop(e), false);
    }

    #preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }

    #highlight(dropzone) {
        dropzone.classList.add('fds-upload-dropzone--highlight');
    }

    #unhighlight(dropzone) {
        dropzone.classList.remove('fds-upload-dropzone--highlight');
    }

    #handleDrop(e) {
        const dt = e.dataTransfer;
        const files = dt.files;
        this.#handleFiles(files);
    }

    #handleFiles(files) {
        Array.from(files).forEach(file => {
            // Avoid duplicates
            if (!this.#files.some(f => f.name === file.name)) {
                this.#files.push(file);
            }
        });

        // Switch to file list view
        this.#showFileList();

        // Add new files to the list
        const filesContainer = this.querySelector('.fds-upload-files');
        this.#files.forEach(file => {
            const fileItem = this.#setupFileItem(file);
            filesContainer.appendChild(fileItem);
        });
    }


    /* Attributes which can invoke attributeChangedCallback() */

    static observedAttributes = [];

    /* --------------------------------------------------
    CUSTOM ELEMENT CONSTRUCTOR (do not access or add attributes in the constructor)
    -------------------------------------------------- */

    constructor() {
        super();

        this.#initialized = false;
        this.#files = [];
    }

    /* --------------------------------------------------
    CUSTOM ELEMENT ADDED TO DOCUMENT
    -------------------------------------------------- */

    connectedCallback() {
        if (this.#initialized) return;

        const uploadElements = this.#setupUploadDropzone();
        this.appendChild(uploadElements);

        const dropzone = this.querySelector('.fds-upload-dropzone');
        this.#handleDragAndDrop(dropzone);

        const fileInput = this.querySelector('.fds-upload-input');
        fileInput.addEventListener('change', (e) => {
            this.#handleFiles(e.target.files);
        });

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

