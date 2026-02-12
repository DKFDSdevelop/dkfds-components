import { generateAndVerifyUniqueId } from '../../utils/generate-unique-id';

class FDSUploadFile extends HTMLElement {

    #initialized = false;
    #files = [];
    #uploadObserver = null;
    #dropzoneEl = null;
    #fileListEl = null;

    #onClick;
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

    #showDropzone() {
        if (!this.#dropzoneEl) {
            this.#dropzoneEl = this.#renderDropzone();
        }

        this.#fileListEl?.remove();
        this.#fileListEl = null;

        if (!this.contains(this.#dropzoneEl)) {
            this.appendChild(this.#dropzoneEl);
        }
    }

    #showFileList() {
        if (!this.#fileListEl) {
            this.#fileListEl = this.#renderFileList();
        } else {
            this.#updateFileList();
        }

        this.#dropzoneEl?.remove();
        this.#dropzoneEl = null;

        if (!this.contains(this.#fileListEl)) {
            this.appendChild(this.#fileListEl);
        }
    }

    #updateFileList() {
        const filesContainer = this.#fileListEl.querySelector('.fds-upload-files');
        if (!filesContainer) return;

        filesContainer.replaceChildren();

        this.#files.forEach(fileObj => {
            filesContainer.appendChild(this.#renderFileItem(fileObj));
        });
    }


    #init() {
        if (this.#initialized) return;

        this.#setupObserver();

        this.#initialized = true;
    }

    /* Mutation observer */

    #setupObserver() {
        this.#uploadObserver = new MutationObserver(this.#handleMutations);

        const config = {
            subtree: true,
            childList: true,
            attributes: true,
            attributeFilter: ['hidden', 'aria-hidden', 'id'],
            attributeOldValue: false,
            characterData: false,
            characterDataOldValue: false
        };

        this.#uploadObserver.observe(this, config);
    }

    #handleMutations = (records, observer) => {
        const shouldUpdate = records.some(record =>
            this.#hasRelevantMutationHappened(record.addedNodes, record.removedNodes, record.target, record.attributeName)
        );

        if (shouldUpdate) {
            this.#setupAccessibility();
        }
    }

    #hasRelevantMutationHappened(addedNodes, removedNodes, target, attributeName) {
        if (attributeName === 'id' || attributeName === 'hidden' || attributeName === 'aria-hidden') {
            return true;
        }

        const relevantTagNames = ['FDS-ERROR-MESSAGE', 'FDS-HELP-TEXT'];
        const allNodes = [...addedNodes, ...removedNodes];
        return allNodes.some(node => relevantTagNames.includes(node?.tagName));
    }

    #setupAccessibility() {
        const input = this.querySelector('.fds-upload-input');
        if (!input) return;

        input?.removeAttribute('aria-describedby');

        const idsForAriaDescribedby = [];
        let isInvalid = false;

        const errorMessages = this.querySelectorAll('fds-error-message');
        const helpTexts = this.querySelectorAll('fds-help-text');

        const ariaDescribedbyElements = [...errorMessages, ...helpTexts];

        for (const element of ariaDescribedbyElements) {
            const isHidden = element.hasAttribute('hidden');
            const isAriaHidden = element.getAttribute('aria-hidden') === 'true';

            if (element.id && !isHidden && !isAriaHidden) {
                idsForAriaDescribedby.push(element.id);

                if (element.tagName === 'FDS-ERROR-MESSAGE') {
                    isInvalid = true;
                }
            }
        }

        if (idsForAriaDescribedby.length > 0) {
            const describedBy = idsForAriaDescribedby.join(' ');
            input?.setAttribute('aria-describedby', describedBy);
        }

        if (input) {
            isInvalid ? input.setAttribute('aria-invalid', 'true') : input.removeAttribute('aria-invalid');
        }
    }

    /* Disabled */

    #shouldHaveDisabled(value) {
        return value !== null && value !== 'false' && value !== false;
    }

    #setDisabled() {
        this.classList.add('fds-upload-file-disabled');

        const input = this.querySelector('.fds-upload-input');
        if (input) {
            input.disabled = true;
        }
    }

    #removeDisabled() {
        this.classList.remove('fds-upload-file-disabled');

        const input = this.querySelector('.fds-upload-input');
        if (input) {
            input.disabled = false;
        }
    }

    #moveErrorsToBottom() {
        const errors = this.querySelectorAll('fds-error-message');
        if (errors.length === 0) return;

        this.append(...errors);
    }

    /* -----------------------------
       Rendering
    ----------------------------- */

    #render() {
        this.#setUploadLabel();

        if (this.#files.length === 0) {
            this.#showDropzone();
        } else {
            this.#showFileList();
        }

        this.#setupAccessibility();
        this.#moveErrorsToBottom();
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

        const isDisabled = this.#shouldHaveDisabled(this.getAttribute('upload-disabled'));
        if (isDisabled) {
            input.disabled = true;
        }

        const mainLabel = this.querySelector('.fds-upload-label');
        if (mainLabel) {
            mainLabel.setAttribute('for', input.id);
        }

        // Dropzone content
        const content = document.createElement('div');
        content.className = 'fds-upload-dropzone-content';
        content.id = generateAndVerifyUniqueId('dropzone-desc');

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

        this.#files.forEach(fileObj  => {
            filesContainer.appendChild(this.#renderFileItem(fileObj ));
        });

        container.append(header, filesContainer);
        return container;
    }

    #renderFileItem(fileObj) {
        const { id, file } = fileObj;

        const item = document.createElement('div');
        item.className = 'fds-upload-file-item';
        item.dataset.fileKey = id;
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

        item.append(fileIcon, name, remove);
        return item;
    }

    /* -----------------------------
       State updates
    ----------------------------- */

    #addFiles(fileList) {
    Array.from(fileList).forEach(file => {
        this.#files.push({
            id: generateAndVerifyUniqueId('file'),
            file
        });
    });

    this.#render();
}

    #removeFileByKey(key) {
        this.#files = this.#files.filter(f => f.id !== key);
        this.#render();
    }

    /* --------------------------------------------------
    CUSTOM ELEMENT METHODS
    -------------------------------------------------- */

    getFiles() {
        return this.#files.map(fileObj => ({
            id: fileObj.id,
            file: fileObj.file
        }));
    }


    /* Attributes which can invoke attributeChangedCallback() */

    static observedAttributes = ['upload-label', 'dropzone-prefix', 'dropzone-link', 'dropzone-suffix', 'upload-disabled'];

    /* --------------------------------------------------
   CUSTOM ELEMENT CONSTRUCTOR (do not access or add attributes in the constructor)
   -------------------------------------------------- */

    constructor() {
        super();

        this.#onInputChange = e => this.#addFiles(e.target.files);

        this.#onClick = e => {
            if (this.#shouldHaveDisabled(this.getAttribute('upload-disabled'))) return;

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
    }

    /* --------------------------------------------------
    CUSTOM ELEMENT ADDED TO DOCUMENT
    -------------------------------------------------- */

    connectedCallback() {
        if (this.#initialized) return;

        this.addEventListener('click', this.#onClick);
        this.addEventListener('change', this.#onInputChange);

        this.#init();

        const existingDropzone = this.querySelector('.fds-upload-dropzone');
        const existingFileList = this.querySelector('.fds-upload-file-list');

        // Caching existing elements so show/hide logic works
        if (existingDropzone || existingFileList) {
            this.#dropzoneEl = existingDropzone;
            this.#fileListEl = existingFileList;
        } else {
            this.#render();
        }

        if (this.#shouldHaveDisabled(this.getAttribute('upload-disabled'))) {
            this.#setDisabled();
        }
    }

    /* --------------------------------------------------
    CUSTOM ELEMENT REMOVED FROM DOCUMENT
    -------------------------------------------------- */

    disconnectedCallback() {
        this.#initialized = false;

        this.removeEventListener('click', this.#onClick);
        this.removeEventListener('change', this.#onInputChange);

        if (this.#uploadObserver) {
            this.#uploadObserver.disconnect();
            this.#uploadObserver = null;
        }
    }

    /* --------------------------------------------------
    CUSTOM ELEMENT'S ATTRIBUTE(S) CHANGED
    -------------------------------------------------- */

    attributeChangedCallback(name, oldValue, newValue) {
        if (!this.#initialized) return;

        if (name === 'upload-label' && oldValue !== newValue) {
            this.#setUploadLabel();
        }

        if (name === 'upload-disabled' && oldValue !== newValue) {
            this.#shouldHaveDisabled(newValue) ? this.#setDisabled() : this.#removeDisabled();
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