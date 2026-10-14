import { generateAndVerifyUniqueId } from '../../utils/generate-unique-id';
import { styles } from './fds-multiselect-styling';

const sheet = new CSSStyleSheet();
sheet.replaceSync(styles);

class FDSMultiselect extends HTMLElement {

    // #region - PRIVATE INSTANCE FIELDS --------------------------------------------------------------------

    #initialized = false;
    #optionElements = new Map();
    #optionTags = new Map();

    // #endregion

    // #region - PRIVATE EVENT HANDLERS ---------------------------------------------------------------------

    #handleOpenerClick = () => {
        this.toggle();
    };

    #handleLabelClick = (event) => {
        event.preventDefault();
        this.shadowRoot.querySelector('.opener').focus();
    };

    #handlePopupMouseDown = (event) => {
        event.preventDefault();
    };

    #handleListboxClick = (event) => {
        const shadowOption = event.target.closest('.option');
        if (!shadowOption) return;

        this.#setActiveShadowOption(shadowOption);

        const sourceOption = this.#findSourceForShadow(shadowOption);
        if (sourceOption) { sourceOption.toggle(); }
    };

    #handleOptionChange = (event) => {
        const sourceOption = event.target;
        const isSelected = sourceOption.getAttribute('data-selected') === 'true';

        isSelected ? this.#addTag(sourceOption) : this.#removeTag(sourceOption);

        const shadowOption = this.#optionElements.get(sourceOption);
        if (shadowOption) {
            shadowOption.setAttribute('aria-selected', isSelected ? 'true' : 'false');
        }

        this.#updateOpenerText();
    };

    #handleTagClick = (event) => {
        const tag = event.target.closest('.tag');
        if (!tag) return;

        const sourceOption = this.#findSourceForTag(tag);
        if (sourceOption) { sourceOption.deselect(); }
    };

    #handleOpenerKeyDown = (event) => {
        const opener = this.shadowRoot.querySelector('.opener');
        const isOpen = opener.getAttribute('aria-expanded') === 'true';
        const shadowOptions = Array.from(this.shadowRoot.querySelectorAll('.option'));

        switch (event.key) {
            case 'ArrowDown':
                event.preventDefault();
                if (!isOpen) {
                    this.open();
                }
                else {
                    const active = this.#getActiveShadowOption();
                    const currentIndex = active ? shadowOptions.indexOf(active) : -1;
                    let index = currentIndex + 1;
                    if (index > shadowOptions.length - 1) { index = shadowOptions.length - 1; }
                    this.#setActiveShadowOption(shadowOptions[index]);
                }
                break;

            case 'ArrowUp':
                event.preventDefault();
                if (!isOpen) {
                    this.open();
                }
                else {
                    const active = this.#getActiveShadowOption();
                    const currentIndex = active ? shadowOptions.indexOf(active) : -1;
                    let index = currentIndex - 1;
                    if (index < 0) { index = 0; }
                    this.#setActiveShadowOption(shadowOptions[index]);
                }
                break;

            case 'Home':
                if (!isOpen) return;
                event.preventDefault();
                this.#setActiveShadowOption(shadowOptions[0]);
                break;

            case 'End':
                if (!isOpen) return;
                event.preventDefault();
                this.#setActiveShadowOption(shadowOptions[shadowOptions.length - 1]);
                break;

            case 'Enter':
            case ' ': {
                if (!isOpen) return;
                event.preventDefault();
                const active = this.#getActiveShadowOption();
                if (active) {
                    const sourceOption = this.#findSourceForShadow(active);
                    if (sourceOption) { sourceOption.toggle(); }
                }
                break;
            }

            case 'Escape':
                if (!isOpen) return;
                event.preventDefault();
                this.close();
                break;
        }
    };

    // #endregion

    // #region - PRIVATE METHODS ----------------------------------------------------------------------------

    #findSourceForShadow(shadowOption) {
        for (const [source, shadow] of this.#optionElements) {
            if (shadow === shadowOption) { return source; }
        }
        return null;
    }

    #findSourceForTag(tag) {
        for (const [source, tagEl] of this.#optionTags) {
            if (tagEl === tag) { return source; }
        }
        return null;
    }

    #getActiveShadowOption() {
        const opener = this.shadowRoot.querySelector('.opener');
        const activeId = opener.getAttribute('aria-activedescendant');
        if (!activeId) return null;
        return this.shadowRoot.getElementById(activeId);
    }

    #setActiveShadowOption(shadowOption) {
        if (!shadowOption) return;

        const opener = this.shadowRoot.querySelector('.opener');
        const previous = this.#getActiveShadowOption();

        if (previous) {
            previous.removeAttribute('data-active');
        }

        shadowOption.setAttribute('data-active', '');
        opener.setAttribute('aria-activedescendant', shadowOption.id);
        shadowOption.scrollIntoView({ block: 'nearest' });
    }

    #addTag(sourceOption) {
        if (this.#optionTags.has(sourceOption)) return;

        const tag = document.createElement('button');
        tag.classList.add('tag');
        tag.setAttribute('type', 'button');
        tag.textContent = sourceOption.textContent.trim();

        const container = this.shadowRoot.querySelector('.tags');
        container.appendChild(tag);

        this.#optionTags.set(sourceOption, tag);
    }

    #removeTag(sourceOption) {
        const tag = this.#optionTags.get(sourceOption);
        if (!tag) return;

        tag.remove();
        this.#optionTags.delete(sourceOption);
    }

    #updateOpenerText() {
        const openerText = this.shadowRoot.querySelector('.opener-text');
        const tags = this.shadowRoot.querySelectorAll('.tag');

        if (tags.length === 0) {
            openerText.textContent = 'Vælg en eller flere';
            return;
        }

        const labels = [];
        for (const tag of tags) {
            labels.push(tag.textContent.trim());
        }
        openerText.textContent = labels.join(', ');
    }

    #buildOptions() {
        const listbox = this.shadowRoot.querySelector('.listbox');
        const optionsToBuild = this.querySelectorAll('fds-multiselect-option');

        for (const sourceOption of optionsToBuild) {
            const shadowOption = document.createElement('div');
            shadowOption.classList.add('option');
            shadowOption.id = generateAndVerifyUniqueId('multiselect-option');
            shadowOption.setAttribute('role', 'option');
            shadowOption.setAttribute('tabindex', '-1');
            shadowOption.setAttribute('aria-selected', sourceOption.getAttribute('data-selected') === 'true' ? 'true' : 'false');
            shadowOption.textContent = sourceOption.textContent.trim();

            listbox.appendChild(shadowOption);
            this.#optionElements.set(sourceOption, shadowOption);

            if (sourceOption.getAttribute('data-selected') === 'true') {
                this.#addTag(sourceOption);
            }
        }
    }

    #setupHTML() {
        if (this.shadowRoot.querySelector('.opener')) return;

        const label = document.createElement('label');
        label.id = generateAndVerifyUniqueId('multiselect-label');
        label.classList.add('opener-label');
        label.textContent = 'Vælg frugter';

        const opener = document.createElement('button');
        opener.id = generateAndVerifyUniqueId('multiselect-opener');
        opener.classList.add('opener');
        opener.setAttribute('type', 'button');
        opener.setAttribute('role', 'combobox');
        opener.setAttribute('aria-haspopup', 'listbox');
        opener.setAttribute('aria-expanded', 'false');
        opener.setAttribute('aria-activedescendant', '');

        label.setAttribute('for', opener.id);

        const openerText = document.createElement('span');
        openerText.classList.add('opener-text');
        openerText.textContent = 'Vælg en eller flere';
        opener.appendChild(openerText);

        const popup = document.createElement('div');
        popup.classList.add('popup');
        popup.hidden = true;

        const listbox = document.createElement('div');
        listbox.id = generateAndVerifyUniqueId('multiselect-listbox');
        listbox.classList.add('listbox');
        listbox.setAttribute('role', 'listbox');
        listbox.setAttribute('aria-multiselectable', 'true');
        listbox.setAttribute('aria-labelledby', label.id);

        opener.setAttribute('aria-controls', listbox.id);

        popup.append(listbox);

        const openerWrapper = document.createElement('div');
        openerWrapper.classList.add('opener-wrapper');
        openerWrapper.append(opener, popup);

        const tags = document.createElement('div');
        tags.classList.add('tags');

        this.shadowRoot.append(label, openerWrapper, tags);
    }

    #addEventListeners() {
        this.shadowRoot.querySelector('.opener').addEventListener('click', this.#handleOpenerClick);
        this.shadowRoot.querySelector('.opener').addEventListener('keydown', this.#handleOpenerKeyDown);
        this.shadowRoot.querySelector('.opener-label').addEventListener('click', this.#handleLabelClick);
        this.shadowRoot.querySelector('.popup').addEventListener('mousedown', this.#handlePopupMouseDown);
        this.shadowRoot.querySelector('.listbox').addEventListener('click', this.#handleListboxClick);
        this.shadowRoot.querySelector('.tags').addEventListener('click', this.#handleTagClick);
        this.addEventListener('fds-multiselect-option-change', this.#handleOptionChange);
    }

    #removeEventListeners() {
        this.shadowRoot.querySelector('.opener').removeEventListener('click', this.#handleOpenerClick);
        this.shadowRoot.querySelector('.opener').removeEventListener('keydown', this.#handleOpenerKeyDown);
        this.shadowRoot.querySelector('.opener-label').removeEventListener('click', this.#handleLabelClick);
        this.shadowRoot.querySelector('.popup').removeEventListener('mousedown', this.#handlePopupMouseDown);
        this.shadowRoot.querySelector('.listbox').removeEventListener('click', this.#handleListboxClick);
        this.shadowRoot.querySelector('.tags').removeEventListener('click', this.#handleTagClick);
        this.removeEventListener('fds-multiselect-option-change', this.#handleOptionChange);
    }

    #init() {
        this.#setupHTML();
        this.#buildOptions();
        this.#addEventListeners();
        this.#updateOpenerText();

        this.#initialized = true;
    }

    // #endregion

    // #region - CONSTRUCTOR (do not access or add attributes in the constructor) ---------------------------

    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.adoptedStyleSheets = [sheet];
    }

    // #endregion

    // #region - PUBLIC METHODS -----------------------------------------------------------------------------

    open() {
        if (!this.#initialized) return;

        const opener = this.shadowRoot.querySelector('.opener');
        const popup = this.shadowRoot.querySelector('.popup');

        opener.setAttribute('aria-expanded', 'true');
        popup.hidden = false;

        if (!this.#getActiveShadowOption()) {
            const shadowOptions = this.shadowRoot.querySelectorAll('.option');
            if (shadowOptions.length > 0) {
                this.#setActiveShadowOption(shadowOptions[0]);
            }
        }
    }

    close() {
        if (!this.#initialized) return;

        const opener = this.shadowRoot.querySelector('.opener');
        const popup = this.shadowRoot.querySelector('.popup');

        opener.setAttribute('aria-expanded', 'false');
        popup.hidden = true;

        const active = this.#getActiveShadowOption();
        if (active) {
            active.removeAttribute('data-active');
        }
        opener.setAttribute('aria-activedescendant', '');
    }

    toggle() {
        if (!this.#initialized) return;

        const opener = this.shadowRoot.querySelector('.opener');
        const isOpen = opener.getAttribute('aria-expanded') === 'true';
        isOpen ? this.close() : this.open();
    }

    // #endregion

    // #region - ADDED TO DOCUMENT --------------------------------------------------------------------------

    connectedCallback() {
        this.#init();
    }

    // #endregion

    // #region - REMOVED FROM DOCUMENT ----------------------------------------------------------------------

    disconnectedCallback() {
        this.#removeEventListeners();
        this.#initialized = false;
    }

    // #endregion
}

function registerMultiselect() {
    if (!customElements.get('fds-multiselect')) {
        customElements.define('fds-multiselect', FDSMultiselect);
    }
}

export default registerMultiselect;