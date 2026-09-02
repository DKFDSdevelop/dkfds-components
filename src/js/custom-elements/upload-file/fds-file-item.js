import { generateAndVerifyUniqueId } from '../../utils/generate-unique-id';

class FDSFileItem extends HTMLElement {

    // #region - ATTRIBUTES (can invoke attributeChangedCallback()) -----------------------------------------

    static observedAttributes = ['remove-text'];

    // #endregion

    // #region - PRIVATE INSTANCE FIELDS --------------------------------------------------------------------

    #initialized = false;
    #file = null;
    #fileId = null;
    #observer = null;

    // #endregion

    // #region - PRIVATE METHODS ----------------------------------------------------------------------------

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

    #getRemoveText() {
        return this.getAttribute('remove-text') ?? 'Fjern';
    }

    #updateRemoveButtonText() {
        const removeTextSpan = this.querySelector('.fds-upload-remove-text');
        const removeButton = this.querySelector('.fds-upload-remove');

        if (!removeTextSpan || !removeButton || !this.#file) return;

        const removeText = this.#getRemoveText();

        removeTextSpan.textContent = ` ${removeText}`;

        removeButton.setAttribute('aria-label', `${removeText} ${this.#file.name}`);
    }

    #setupErrorObserver() {
        if (this.#observer) {
            this.#observer.disconnect();
        }

        this.#observer = new MutationObserver(() => {
            this.#updateErrorState();
        });

        const uploadParent = this.closest('fds-upload-file');
        if (uploadParent) {
            const config = {
                subtree: true,
                childList: true,
                attributes: true,
                attributeFilter: ['hidden', 'aria-hidden', 'targets']
            };
            this.#observer.observe(uploadParent, config);
        }

        this.#updateErrorState();
    }

    #updateErrorState() {
        if (!this.#fileId) return;

        const uploadParent = this.closest('fds-upload-file');
        if (!uploadParent) return;

        const allErrors = uploadParent.querySelectorAll('fds-error-message[targets]');

        const matchingErrors = Array.from(allErrors).filter(errorEl => {
            const targetsAttr = errorEl.getAttribute('targets');
            if (!targetsAttr) return false;

            const targets = targetsAttr.split(',').map(t => t.trim());
            return targets.includes(this.#fileId);
        });

        this.classList.remove('fds-upload-file-item-error');
        this.removeAttribute('aria-invalid');
        this.removeAttribute('aria-describedby');

        matchingErrors.forEach(errorEl => {
            if (errorEl.parentElement !== this) {
                this.appendChild(errorEl);
            }
        });

        if (matchingErrors.length > 0) {
            this.classList.add('fds-upload-file-item-error');
            this.setAttribute('aria-invalid', 'true');

            const errorIds = matchingErrors
                .map(error => error.id)
                .filter(Boolean);

            if (errorIds.length > 0) {
                this.setAttribute('aria-describedby', errorIds.join(' '));
            }
        }
    }

    #render() {
        if (!this.#file || !this.#fileId) return;

        this.innerHTML = '';

        this.className = 'fds-upload-file-item';
        this.dataset.fileKey = this.#fileId;
        this.setAttribute('role', 'listitem');

        const row = document.createElement('div');
        row.className = 'fds-upload-file-row';

        const fileIcon = this.#createFileIcon(this.#file);

        const name = document.createElement('span');
        name.className = 'fds-upload-file-name';
        name.textContent = this.#file.name;

        const remove = document.createElement('button');
        remove.type = 'button';
        remove.className = 'fds-upload-remove';
        remove.dataset.fileKey = this.#fileId;

        const removeTextSpan = document.createElement('span');
        removeTextSpan.className = 'fds-upload-remove-text';
        removeTextSpan.textContent = ` ${this.#getRemoveText()}`;

        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.classList.add('icon-svg');
        svg.setAttribute('aria-hidden', 'true');

        const use = document.createElementNS('http://www.w3.org/2000/svg', 'use');
        use.setAttribute('href', '#close');
        svg.appendChild(use);

        remove.appendChild(svg);
        remove.appendChild(removeTextSpan);
        remove.setAttribute('aria-label', `${this.#getRemoveText()} ${this.#file.name}`);
        row.append(fileIcon, name, remove);

        this.appendChild(row);

        this.#setupErrorObserver();
    }

    // #endregion

    // #region - PUBLIC METHODS -----------------------------------------------------------------------------

    setFileData(file, fileId) {
        this.#file = file;
        this.#fileId = fileId;

        if (this.isConnected) {
            this.#render();
        }
    }

    // #endregion

    // #region - ADDED TO DOCUMENT --------------------------------------------------------------------------

    connectedCallback() {
        if (this.#initialized) return;

        if (this.#file && this.#fileId && !this.innerHTML) {
            this.#render();
        }

        this.#initialized = true;
    }

    // #endregion

    // #region - REMOVED FROM DOCUMENT ----------------------------------------------------------------------

    disconnectedCallback() {
        this.#initialized = false;

        if (this.#observer) {
            this.#observer.disconnect();
            this.#observer = null;
        }
    }

    // #endregion
    
    // #region - ATTRIBUTE(S) CHANGED -----------------------------------------------------------------------

    attributeChangedCallback(attribute, oldValue, newValue) {
        if (!this.#initialized) return;

        if (attribute === 'remove-text' && oldValue !== newValue) {
            if (this.#file && this.#fileId) {
                this.#updateRemoveButtonText();
            }
        }
    }

    // #endregion
}

function registerFileItem() {
    if (customElements.get('fds-file-item') === undefined) {
        window.customElements.define('fds-file-item', FDSFileItem);
    }
}

export default registerFileItem;
