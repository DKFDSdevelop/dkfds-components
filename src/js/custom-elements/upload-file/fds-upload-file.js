import { generateAndVerifyUniqueId } from '../../utils/generate-unique-id';

class FDSUploadFile extends HTMLElement {

    #initialized = false;
    #files = [];

    #onClick;
    #onKeydown;
    #onDragOver;
    #onDragLeave;
    #onDrop;
    #onInputChange;

    /* Private methods */

    #getLabel() {
        return this.getAttribute('upload-label') ?? 'Vedhæft filer';
    }

    #getDropzonePrefix() {
        return this.getAttribute('dropzone-prefix') ?? 'Træk dine filer herhen eller';
    }

    #getDropzoneLink() {
        return this.getAttribute('dropzone-link') ?? 'vælg filer';
    }

    #getDropzoneSuffix() {
        return this.getAttribute('dropzone-suffix') ?? '';
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
        let label = this.querySelector('.fds-upload-label');

        if (!label) {
            label = document.createElement('label');
            label.className = 'fds-upload-label';
            label.id = generateAndVerifyUniqueId('upl');
            this.prepend(label);
        }

        label.textContent = this.#getLabel();
        return label;
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

        // Input
        const input = document.createElement('input');
        input.type = 'file';
        input.multiple = true;
        input.id = generateAndVerifyUniqueId('file-input');
        input.className = 'fds-upload-input';
        input.setAttribute('tabindex', '-1');

        const mainLabel = this.querySelector('.fds-upload-label');
        if (mainLabel) {
            mainLabel.setAttribute('for', input.id);
        }

        // Dropzone content
        const content = document.createElement('div');
        content.className = 'fds-upload-dropzone-content';
        content.id = generateAndVerifyUniqueId('dropzone-desc');
        content.setAttribute('role', 'button');
        content.setAttribute('tabindex', '0');
        content.setAttribute('aria-labelledby', mainLabel.id); 
        content.setAttribute('aria-describedby', content.id)

        // Connect the input to the dropzone description
        input.setAttribute('aria-describedby', content.id);

        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.classList.add('icon-svg');
        svg.setAttribute('aria-hidden', 'true');

        const use = document.createElementNS('http://www.w3.org/2000/svg', 'use');
        use.setAttribute('href', '#plus-circle');
        svg.appendChild(use);

        const p = document.createElement('p');

        // Text content
        const prefix = this.#getDropzonePrefix();
        if (prefix) {
            p.append(prefix + ' ');
        }

        const linkText = document.createElement('span');
        linkText.className = 'fds-upload-choose';
        linkText.textContent = this.#getDropzoneLink();
        p.appendChild(linkText);

        const suffix = this.#getDropzoneSuffix();
        if (suffix) {
            p.append(' ' + suffix);
        }

        content.append(svg, p);
        dropzone.append(input, content);

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

        header.append(title, addMore);

        const filesContainer = document.createElement('div');
        filesContainer.setAttribute('role', 'list');
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
        item.setAttribute('role', 'listitem');

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
        remove.setAttribute('aria-label', `Fjern ${file.name}`);

        remove.addEventListener('click', () => this.#removeFileByKey(file));

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

    #removeFileByKey(key) {
        this.#files = this.#files.filter(f => this.#fileKey(f) !== key);
        this.#render();
    }

    /* Attributes which can invoke attributeChangedCallback() */

    static observedAttributes = ['upload-label', 'dropzone-prefix', 'dropzone-link', 'dropzone-suffix'];

    /* --------------------------------------------------
   CUSTOM ELEMENT CONSTRUCTOR (do not access or add attributes in the constructor)
   -------------------------------------------------- */

    constructor() {
        super();

        this.#onInputChange = e => this.#addFiles(e.target.files);

        this.#onClick = e => {
            const dropzoneContent = e.target.closest('.fds-upload-dropzone-content');
            if (dropzoneContent) {
                this.querySelector('.fds-upload-input')?.click();
                return;
            }

            const removeBtn = e.target.closest('.fds-upload-remove');
            if (removeBtn) {
                const item = removeBtn.closest('.fds-upload-file-item');
                if (item) this.#removeFileByKey(item.dataset.fileKey);
                return;
            }

            const addMore = e.target.closest('.fds-upload-add-more');
            if (addMore) {
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
            }
        };

        this.#onKeydown = e => {
            const dropzoneContent = e.target.closest('.fds-upload-dropzone-content');
            const label = e.target.closest('.fds-upload-label');

            if ((e.key === 'Enter' || e.key === ' ') && (dropzoneContent || label)) {
                e.preventDefault();
                this.querySelector('.fds-upload-input')?.click();
            }
        };

        this.#onDragOver = e => {
            if (!e.target.closest('.fds-upload-dropzone')) return;
            e.preventDefault();
            e.target.closest('.fds-upload-dropzone').classList.add('fds-upload-dropzone--highlight');
        };

        this.#onDragLeave = e => {
            const dz = e.target.closest('.fds-upload-dropzone');
            if (dz) dz.classList.remove('fds-upload-dropzone--highlight');
        };

        this.#onDrop = e => {
            const dz = e.target.closest('.fds-upload-dropzone');
            if (!dz) return;
            e.preventDefault();
            dz.classList.remove('fds-upload-dropzone--highlight');
            this.#addFiles(e.dataTransfer.files);
        };
    }

    /* --------------------------------------------------
    CUSTOM ELEMENT ADDED TO DOCUMENT
    -------------------------------------------------- */

    connectedCallback() {
        if (this.#initialized) return;

        this.addEventListener('click', this.#onClick);
        this.addEventListener('keydown', this.#onKeydown);
        this.addEventListener('dragover', this.#onDragOver);
        this.addEventListener('dragleave', this.#onDragLeave);
        this.addEventListener('drop', this.#onDrop);
        this.addEventListener('change', this.#onInputChange);

        this.#render();
        this.#initialized = true;
    }

    /* --------------------------------------------------
    CUSTOM ELEMENT REMOVED FROM DOCUMENT
    -------------------------------------------------- */

    disconnectedCallback() {
        this.#initialized = false;

        this.removeEventListener('click', this.#onClick);
        this.removeEventListener('keydown', this.#onKeydown);
        this.removeEventListener('dragover', this.#onDragOver);
        this.removeEventListener('dragleave', this.#onDragLeave);
        this.removeEventListener('drop', this.#onDrop);
        this.removeEventListener('change', this.#onInputChange);
    }

    /* --------------------------------------------------
    CUSTOM ELEMENT'S ATTRIBUTE(S) CHANGED
    -------------------------------------------------- */

    attributeChangedCallback(name, oldValue, newValue) {
        if (!this.#initialized) return;

        if (name === 'upload-label' && oldValue !== newValue) {
            this.#setUploadLabel();
        }

        if (['dropzone-prefix', 'dropzone-link', 'dropzone-suffix'].includes(name) && oldValue !== newValue) {
            if (this.#files.length === 0) {
                this.#render();
            }
        }
    }
}

function registerUploadFile() {
    if (customElements.get('fds-upload-file') === undefined) {
        window.customElements.define('fds-upload-file', FDSUploadFile);
    }
}

export default registerUploadFile;

