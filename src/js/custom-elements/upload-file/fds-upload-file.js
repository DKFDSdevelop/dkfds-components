class FDSUploadFile extends HTMLElement {

    #initialized = false;
    #files = [];

    // Bound listeners (so we can remove them)
    #onInputChange;
    #onDrop;
    #onDragOver;
    #onDragLeave;
    #onAddMoreClick;

    /* Private methods */

    #getLabel() {
        return this.getAttribute('upload-label') ?? 'Vedhæft filer';
    }

    #fileKey(file) {
        return `${file.name}-${file.size}-${file.lastModified}`;
    }

    #getFileTypeIcon(file) {
        const mimeType = file.type;

        if (mimeType.startsWith('image/')) return 'file-image';
        if (mimeType === 'application/pdf') return 'file-pdf';
        if (mimeType.includes('word')) return 'file-word';
        if (mimeType.includes('excel') || mimeType.includes('spreadsheet')) return 'file-excel';

        return 'file';
    }

    #createFileIcon(file) {
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.classList.add('icon-svg', 'fds-upload-file-icon');
        svg.setAttribute('aria-hidden', 'true');

        const use = document.createElementNS('http://www.w3.org/2000/svg', 'use');
        use.setAttribute('href', `#${this.#getFileTypeIcon(file)}`);
        svg.appendChild(use);

        return svg;
    }

    #setUploadLabel() {
        let title = this.querySelector('.fds-upload-title');

        if (title) {
            title.textContent = this.#getLabel();
        } else {
            title = document.createElement('h5');
            title.className = 'fds-upload-title';
            title.textContent = this.#getLabel();
            this.prepend(title);
        }
    }


    /* -----------------------------
       Rendering
    ----------------------------- */

    #render() {
        this.replaceChildren();
        this.#setUploadLabel();

        if (this.#files.length === 0) {
            this.appendChild(this.#renderDropzone());
        } else {
            this.appendChild(this.#renderFileList());
        }
    }

    #renderDropzone() {
        const dropzone = document.createElement('div');
        dropzone.className = 'fds-upload-dropzone';

        const content = document.createElement('div');
        content.className = 'fds-upload-dropzone-content';

        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.classList.add('icon-svg');
        svg.setAttribute('aria-hidden', 'true');

        const use = document.createElementNS('http://www.w3.org/2000/svg', 'use');
        use.setAttribute('href', '#plus-circle');
        svg.appendChild(use);

        const p = document.createElement('p');
        p.append('Træk dine filer herhen eller ');

        const label = document.createElement('label');
        label.className = 'fds-upload-choose';
        label.textContent = 'vælg filer';

        const input = document.createElement('input');
        input.type = 'file';
        input.multiple = true;
        input.className = 'fds-upload-input';
        input.addEventListener('change', this.#onInputChange);

        label.appendChild(input);
        p.appendChild(label);

        content.append(svg, p);
        dropzone.appendChild(content);

        // Drag events
        dropzone.addEventListener('dragover', this.#onDragOver);
        dropzone.addEventListener('dragleave', this.#onDragLeave);
        dropzone.addEventListener('drop', this.#onDrop);

        return dropzone;
    }

    #renderFileList() {
        const container = document.createElement('div');
        container.className = 'fds-upload-file-list';

        const header = document.createElement('div');
        header.className = 'fds-upload-header';

        const title = document.createElement('h5');
        title.className = 'fds-upload-title';
        title.textContent = 'Valgte filer';

        const addMore = document.createElement('button');
        addMore.type = 'button';
        addMore.className = 'fds-upload-add-more';
        addMore.textContent = 'Vælg flere filer';
        addMore.addEventListener('click', this.#onAddMoreClick);

        header.append(title, addMore);

        const filesContainer = document.createElement('div');
        filesContainer.className = 'fds-upload-files';

        this.#files.forEach(file => {
            filesContainer.appendChild(this.#renderFileItem(file));
        });

        container.append(header, filesContainer);
        return container;
    }

    #renderFileItem(file) {
        const item = document.createElement('div');
        item.className = 'fds-upload-file-item';
        item.dataset.fileKey = this.#fileKey(file);

        const name = document.createElement('span');
        name.className = 'fds-upload-file-name';
        name.textContent = file.name;

        const remove = document.createElement('button');
        remove.type = 'button';
        remove.className = 'fds-upload-remove';

        const fileIcon = this.#createFileIcon(file);

        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.classList.add('icon-svg');
        svg.setAttribute('aria-hidden', 'true');

        const use = document.createElementNS('http://www.w3.org/2000/svg', 'use');
        use.setAttribute('href', '#close');
        svg.appendChild(use);

        remove.appendChild(svg);
        remove.appendChild(document.createTextNode(' Fjern'));

        remove.addEventListener('click', () => this.#removeFile(file));

        item.append(fileIcon, name, remove);
        return item;
    }

    /* -----------------------------
       State updates
    ----------------------------- */

    #addFiles(fileList) {
        Array.from(fileList).forEach(file => {
            const key = this.#fileKey(file);
            if (!this.#files.some(f => this.#fileKey(f) === key)) {
                this.#files.push(file);
            }
        });

        this.#render();
    }

    #removeFile(file) {
        const key = this.#fileKey(file);
        this.#files = this.#files.filter(f => this.#fileKey(f) !== key);
        this.#render();
    }

    /* Attributes which can invoke attributeChangedCallback() */

    static observedAttributes = ['upload-label'];

    /* --------------------------------------------------
   CUSTOM ELEMENT CONSTRUCTOR (do not access or add attributes in the constructor)
   -------------------------------------------------- */

    constructor() {
        super();

        this.#onInputChange = e => this.#addFiles(e.target.files);

        this.#onAddMoreClick = () => {
            const input = document.createElement('input');
            input.type = 'file';
            input.multiple = true;
            input.style.display = 'none';
            input.addEventListener('change', e => {
                this.#addFiles(e.target.files);
                input.remove();
            });
            document.body.appendChild(input);
            input.click();
        };

        this.#onDragOver = e => {
            e.preventDefault();
            e.currentTarget.classList.add('fds-upload-dropzone--highlight');
        };

        this.#onDragLeave = e => {
            e.currentTarget.classList.remove('fds-upload-dropzone--highlight');
        };

        this.#onDrop = e => {
            e.preventDefault();
            e.currentTarget.classList.remove('fds-upload-dropzone--highlight');
            this.#addFiles(e.dataTransfer.files);
        };
    }

    /* --------------------------------------------------
    CUSTOM ELEMENT ADDED TO DOCUMENT
    -------------------------------------------------- */

    connectedCallback() {
        if (this.#initialized) return;
        this.#render();
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

    attributeChangedCallback(name, oldValue, newValue) {
        if (!this.#initialized) return;

        if (name === 'upload-label' && oldValue !== newValue) {
            this.#setUploadLabel();
        }
    }
}

function registerUploadFile() {
    if (customElements.get('fds-upload-file') === undefined) {
        window.customElements.define('fds-upload-file', FDSUploadFile);
    }
}

export default registerUploadFile;

