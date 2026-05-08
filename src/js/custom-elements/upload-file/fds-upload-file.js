import { generateAndVerifyUniqueId } from '../../utils/generate-unique-id';
import * as CE from '../custom-element-utils';

class FDSUploadFile extends HTMLElement {

    /**
     * Internal state:
     * - #files holds the canonical list of selected files (source of truth).
     * - UI (dropzone vs file list) is rendered based on #files.length.
     * - DOM is partially cached (#dropzoneEl, #fileListEl) to allow toggling without recreating elements unnecessarily.
     */

    #inputEl = null;
    #initialized = false;
    #files = [];
    #uploadObserver = null;
    #dropzoneEl = null;
    #fileListEl = null;

    #onClick;
    #onInputChange;

    /* Private methods */

    #getDropzonePrefix() {
        return this.getAttribute('dropzone-prefix') ?? 'Træk dine filer herhen eller';
    }

    #getDropzoneLink() {
        return this.getAttribute('dropzone-link') ?? 'vælg filer';
    }

    #getDropzoneSuffix() {
        return this.getAttribute('dropzone-suffix') ?? '';
    }

    #getFileListHeader() {
        return this.getAttribute('file-list-header') ?? 'Valgte filer';
    }

    #getFileListMore() {
        return this.getAttribute('file-list-more') ?? 'Vælg flere filer'
    }

    #getFileListHeadingLevel() {
        const headingLevel = this.getAttribute('heading-level');
        if (!headingLevel || !['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].includes(headingLevel)) {
            return 'h5';
        }
        return headingLevel;
    }

    #setupInput(input) {
        const label = this.querySelector('label');

        if (!label || !input) return;

        label.classList.add('fds-upload-label');
        input.classList.add('fds-upload-input');

        if (!input.id) {
            input.id = generateAndVerifyUniqueId('file-input');
        }

        label.setAttribute('for', input.id);

        input.removeEventListener('change', this.#onInputChange);
        input.addEventListener('change', this.#onInputChange);

        this.#inputEl = input;

        CE.setDisabledClass(label, input);

        if (this.hasAttribute('show-required-status')) {
            this.#updateRequiredStatus();
        }
    }

    #hydrateExistingDropzone() {
        this.#setupInput(this.querySelector('.fds-upload-dropzone input[type="file"]'));
    }

    #setText(selector, value) {
        const element = this.querySelector(selector);
        if (element) {
            element.textContent = value;
        }
    }

    #setFileItemsRemoveText() {
        const fileItems = this.querySelectorAll('fds-file-item');
        const removeText = this.getAttribute('remove-text') || 'Fjern';

        fileItems.forEach(item => {
            item.setAttribute('remove-text', removeText);
        });
    }

    #setDropzoneText(container) {
        container.replaceChildren();

        const prefix = this.#getDropzonePrefix();
        if (prefix) {
            container.append(prefix + ' ');
        }

        const linkText = document.createElement('span');
        linkText.className = 'fds-upload-choose';
        linkText.textContent = this.#getDropzoneLink();
        container.appendChild(linkText);

        const suffix = this.#getDropzoneSuffix();
        if (suffix) {
            container.append(' ' + suffix);
        }
    }

    #syncAddMoreVisibility() {
        const addMore = this.#fileListEl?.querySelector('.fds-upload-add-more');
        if (addMore) {
            addMore.hidden = !this.#inputEl?.multiple;
        }
    }

    #showDropzone() {
        if (!this.#dropzoneEl) {
            const input = this.#inputEl || this.querySelector('input[type="file"]');
            if (!input) return;

            const originalParent = input.parentNode;
            const originalNextSibling = input.nextSibling;

            this.#dropzoneEl = this.#renderDropzone();
            if (!this.#dropzoneEl) return;

            if (originalParent === this) {
                this.insertBefore(this.#dropzoneEl, originalNextSibling);
            }
        }

        this.#fileListEl?.remove();
        this.#fileListEl = null;

        if (!this.contains(this.#dropzoneEl)) {
            const errorMessage = this.querySelector('fds-error-message');

            if (errorMessage) {
                this.insertBefore(this.#dropzoneEl, errorMessage);
            } else {
                this.appendChild(this.#dropzoneEl);
            }
        }
    }

    #showFileList() {
        const dropzoneNextSibling = this.#dropzoneEl?.nextSibling ?? null;

        if (!this.#fileListEl) {
            this.#fileListEl = this.#renderFileList();
        } else {
            this.#updateFileList();
        }

        this.#syncAddMoreVisibility();
        this.#dropzoneEl?.remove();
        this.#dropzoneEl = null;

        if (!this.contains(this.#fileListEl)) {
            const errorMessage = this.querySelector('fds-error-message');

            if (dropzoneNextSibling && this.contains(dropzoneNextSibling)) {
                this.insertBefore(this.#fileListEl, dropzoneNextSibling);
            } else if (errorMessage) {
                this.insertBefore(this.#fileListEl, errorMessage);
            } else {
                this.appendChild(this.#fileListEl);
            }
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

    #updateFileListHeadingLevel() {
        if (!this.#fileListEl) return;

        const currentTitle = this.#fileListEl.querySelector('.fds-upload-title');
        if (!currentTitle) return;

        const newTag = this.#getFileListHeadingLevel();
        const currentTag = currentTitle.tagName.toLowerCase();

        if (currentTag === newTag) return;

        const newTitle = document.createElement(newTag);
        newTitle.className = currentTitle.className;
        newTitle.textContent = currentTitle.textContent;

        currentTitle.replaceWith(newTitle);
    }

    #updateDropzoneContent() {
        const content = this.#dropzoneEl?.querySelector('.fds-upload-dropzone-content p');
        if (!content) return;

        this.#setDropzoneText(content);
    }


    /* Mutation observer */

    #setupObserver() {
        if (this.#uploadObserver) return;

        this.#uploadObserver = new MutationObserver(this.#handleMutations);
        this.#uploadObserver.observe(this, CE.mutationObserverConfig);
    }

    #handleMutations = (records) => {
        let shouldUpdateAccessibility = false;

        for (const { attributeName, target, addedNodes, removedNodes } of records) {

            if (attributeName === 'hidden' && target === this) {
                CE.notifySummaryOnVisibilityChange(this);
            }

            // The input's disabled attribute changed
            if (attributeName === 'disabled' && target?.tagName === 'INPUT') {
                const label = this.querySelector('label');
                CE.setDisabledClass(label, target);
            }

            // The input's required attribute changed
            else if (attributeName === 'required' && target?.tagName === 'INPUT') {
                if (this.hasAttribute('show-required-status')) {
                    this.#updateRequiredStatus();
                }
            }

            if (attributeName === 'id' || attributeName === 'hidden' || attributeName === 'aria-hidden') {
                shouldUpdateAccessibility = true;
                continue;
            }

            const relevantTagNames = ['FDS-ERROR-MESSAGE', 'FDS-HELP-TEXT'];
            const allNodes = [...addedNodes, ...removedNodes];

            if (allNodes.some(node => relevantTagNames.includes(node?.tagName))) {
                shouldUpdateAccessibility = true;
            }
        }

        if (shouldUpdateAccessibility) {
            this.#setupAccessibility();
        }
    }

    #setupAccessibility() {
        const input = this.#inputEl;
        if (!input) return;

        const idsForAriaDescribedby = [];
        let isInvalid = false;

        // Preserve dropzone description for screen reader
        const dropzoneDesc = this.querySelector('.fds-upload-dropzone-content');
        if (dropzoneDesc && dropzoneDesc.id) {
            idsForAriaDescribedby.push(dropzoneDesc.id);
        }

        const errorMessages = this.querySelectorAll('fds-error-message:not([targets])');
        const helpTexts = this.querySelectorAll('fds-help-text');

        const ariaDescribedbyElements = [...errorMessages, ...helpTexts];

        // Build aria-describedby attribute from visible elements
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
            input.setAttribute('aria-describedby', describedBy);
        } else {
            input.removeAttribute('aria-describedby');
        }

        if (input) {
            isInvalid ? input.setAttribute('aria-invalid', 'true') : input.removeAttribute('aria-invalid');
        }
    }

    /* -----------------------------
       Rendering
    ----------------------------- */

    #render() {
        if (this.#files.length === 0) {
            this.#showDropzone();
        } else {
            this.#showFileList();
        }

        this.#setupAccessibility();
    }

    #renderDropzone() {
        const dropzone = document.createElement('div');
        dropzone.className = 'fds-upload-dropzone';

        // Input
        const input = this.#inputEl || this.querySelector('input[type="file"]');
        if (!input) return null;

        this.#setupInput(input);

        // Dropzone content
        const content = document.createElement('div');
        content.className = 'fds-upload-dropzone-content';
        content.id = `dropzone-${input.id}`;;

        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.classList.add('icon-svg');
        svg.setAttribute('aria-hidden', 'true');

        const use = document.createElementNS('http://www.w3.org/2000/svg', 'use');
        use.setAttribute('href', '#plus-circle');
        svg.appendChild(use);

        const p = document.createElement('p');

        // Text content: prefix + link + suffix
        this.#setDropzoneText(p);

        content.append(svg, p);
        dropzone.append(input, content);

        return dropzone;
    }

    #renderFileList() {
        const container = document.createElement('div');
        container.className = 'fds-upload-file-list';

        const header = document.createElement('div');
        header.className = 'fds-upload-header';

        const level = this.#getFileListHeadingLevel();
        const title = document.createElement(level);
        title.className = 'fds-upload-title';
        title.textContent = this.#getFileListHeader();

        const addMore = document.createElement('button');
        addMore.type = 'button';
        addMore.className = 'fds-upload-add-more';
        addMore.textContent = this.#getFileListMore();
        addMore.hidden = !this.#inputEl?.multiple;

        header.append(title, addMore);

        const filesContainer = document.createElement('div');
        filesContainer.setAttribute('role', 'list');
        filesContainer.className = 'fds-upload-files';

        this.#files.forEach(fileObj => {
            filesContainer.appendChild(this.#renderFileItem(fileObj));
        });

        container.append(header, filesContainer);
        return container;
    }

    #renderFileItem(fileObj) {
        const { id, file } = fileObj;

        const fileItem = document.createElement('fds-file-item');

        const removeText = this.getAttribute('remove-text') || 'Fjern';
        fileItem.setAttribute('remove-text', removeText);

        fileItem.setFileData(file, id);

        return fileItem;
    }

    /* -----------------------------
       State updates
    ----------------------------- */

    #addFiles(fileList) {
        const isFirstFile = this.#files.length === 0;

        const incomingFiles = Array.from(fileList);
        const allowedFiles = this.#inputEl?.multiple ? incomingFiles : incomingFiles.slice(0, Math.max(0, 1 - this.#files.length));

        if (allowedFiles.length === 0) return;

        const newFiles = allowedFiles.map(file => ({
            id: generateAndVerifyUniqueId('file'),
            file
        }));

        this.#files.push(...newFiles);

        // Emit event with added files
        this.dispatchEvent(new CustomEvent('files-added', {
            detail: newFiles.map(f => f.file),
            bubbles: true,
            composed: true
        }));

        // If this is the first file, we must re-render to switch from dropzone view to file list view.
        if (isFirstFile) {
            this.#render();
            return;
        }

        const filesContainer = this.querySelector('.fds-upload-files');
        newFiles.forEach(fileObj => {
            filesContainer?.appendChild(this.#renderFileItem(fileObj));
        });
    }


    #removeFileByKey(key) {
        // Find the file to remove before filtering
        const removedFile = this.#files.find(f => f.id === key);

        // Remove it from internal state
        this.#files = this.#files.filter(f => f.id !== key);

        const fileItem = this.querySelector(`fds-file-item[data-file-key="${key}"]`);
        if (fileItem) {
            fileItem.remove();
        }

        // Emit event with removed file
        if (removedFile) {
            this.dispatchEvent(new CustomEvent('files-removed', {
                detail: removedFile.file,
                bubbles: true,
                composed: true
            }));
        }

        // Re-render to show dropzone if all files are removed
        if (this.#files.length === 0) {
            this.#render();
        }
    }

    #updateRequiredStatus() {
        const label = this.querySelector('label');
        const input = this.#inputEl || this.querySelector('input[type="file"]');

        CE.showRequiredStatus(
            label,
            input,
            this.getAttribute('show-required-status')
        );
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

    addError(message, fileId = null) {
        const errorMessage = document.createElement('fds-error-message');
        errorMessage.textContent = message;

        if (fileId) {
            errorMessage.setAttribute('targets', fileId);
        }

        this.appendChild(errorMessage);
        this.#setupAccessibility();
        return errorMessage;
    }

    removeError(errorElement) {
        if (this.contains(errorElement)) {
            errorElement.remove();
            this.#setupAccessibility();
        }
    }


    /* Attributes which can invoke attributeChangedCallback() */

    static observedAttributes = ['dropzone-prefix', 'dropzone-link', 'dropzone-suffix', 'file-list-header', 'file-list-more', 'remove-text', 'heading-level', 'show-required-status'];

    /* --------------------------------------------------
    GETTERS AND SETTERS
    -------------------------------------------------- */

    get showRequiredStatus() { return this.getAttribute('show-required-status'); }
    set showRequiredStatus(value) { value === null ? this.removeAttribute('show-required-status') : this.setAttribute('show-required-status', value); }

    /* --------------------------------------------------
   CUSTOM ELEMENT CONSTRUCTOR (do not access or add attributes in the constructor)
   -------------------------------------------------- */

    constructor() {
        super();

        this.#onInputChange = e => this.#addFiles(e.target.files);

        this.#onClick = e => {
            if (this.#inputEl?.disabled) return;

            const removeBtn = e.target.closest('.fds-upload-remove');
            if (removeBtn) {
                const fileKey = removeBtn.dataset.fileKey;
                if (fileKey) {
                    this.#removeFileByKey(fileKey);
                    return;
                }
            }

            const addMore = e.target.closest('.fds-upload-add-more');
            if (addMore) {
                if (!this.#inputEl?.multiple) return;

                const input = document.createElement('input');
                input.type = 'file';
                input.multiple = true;
                input.style.display = 'none';

                const cleanup = () => {
                    input.remove();
                    window.removeEventListener('focus', cleanup);
                };

                input.addEventListener('change', e => {
                    if (e.target.files?.length) {
                        this.#addFiles(e.target.files);
                    }
                    cleanup();
                }, { once: true });

                window.addEventListener('focus', cleanup, { once: true });
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

        this.#setupObserver();

        const existingDropzone = this.querySelector('.fds-upload-dropzone');
        const existingFileList = this.querySelector('.fds-upload-file-list');

        this.#dropzoneEl = existingDropzone;
        this.#fileListEl = existingFileList;

        if (existingDropzone) {
            this.#hydrateExistingDropzone();
        } else {
            this.#setupInput(this.querySelector('input[type="file"]'));
        }

        if (!existingDropzone && !existingFileList) {
            this.#render();
        }

        this.#setupAccessibility();

        this.#initialized = true;
    }

    /* --------------------------------------------------
    CUSTOM ELEMENT REMOVED FROM DOCUMENT
    -------------------------------------------------- */

    disconnectedCallback() {
        CE.notifySummaryOnDisconnect(this);

        this.#initialized = false;

        this.removeEventListener('click', this.#onClick);
        this.#inputEl?.removeEventListener('change', this.#onInputChange);
        if (this.#uploadObserver) {
            this.#uploadObserver.disconnect();
            this.#uploadObserver = null;
        }
    }

    /* --------------------------------------------------
    CUSTOM ELEMENT'S ATTRIBUTE(S) CHANGED
    -------------------------------------------------- */

    attributeChangedCallback(attribute, oldValue, newValue) {
        if (!this.#initialized) return;

        if (attribute === 'show-required-status' && oldValue !== newValue) {
            this.#updateRequiredStatus();
        }

        if (['dropzone-prefix', 'dropzone-link', 'dropzone-suffix'].includes(attribute) && oldValue !== newValue) {
            if (this.#files.length === 0) {
                this.#updateDropzoneContent();
            }
        }

        if (attribute === 'file-list-header' && oldValue !== newValue) {
            this.#setText('.fds-upload-title', this.#getFileListHeader());
        }

        if (attribute === 'file-list-more' && oldValue !== newValue) {
            this.#setText('.fds-upload-add-more', this.#getFileListMore());
        }

        if (attribute === 'remove-text' && oldValue !== newValue) {
            this.#setFileItemsRemoveText();
        }

        if (attribute === 'heading-level' && oldValue !== newValue) {
            this.#updateFileListHeadingLevel();
        }
    }
}

function registerUploadFile() {
    if (customElements.get('fds-upload-file') === undefined) {
        window.customElements.define('fds-upload-file', FDSUploadFile);
    }
}

export default registerUploadFile;