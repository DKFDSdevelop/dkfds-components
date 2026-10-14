import { generateAndVerifyUniqueId } from '../../utils/generate-unique-id';
import * as CE from '../custom-element-utils';
import { styles } from './fds-multiselect-styling';

const sheet = new CSSStyleSheet();
sheet.replaceSync(styles);

const CHEVRON_CLOSED_PATH = 'M480-344 240-584l56-56 184 184 184-184 56 56-240 240Z';
const CHEVRON_OPEN_PATH = 'M480-528 296-344l-56-56 240-240 240 240-56 56-184-184Z';

class FDSMultiselect extends HTMLElement {

    // #region - ATTRIBUTES (can invoke attributeChangedCallback()) -----------------------------------------

    static observedAttributes = ['label', 'placeholder', 'sr-group-text'];

    // #endregion

    // #region - GETTERS AND SETTERS ------------------------------------------------------------------------

    get label() { return this.getAttribute('label'); }
    set label(value) { value == null ? this.removeAttribute('label') : this.setAttribute('label', value); }

    get placeholder() { return this.getAttribute('placeholder') ?? 'Vælg en eller flere'; }
    set placeholder(value) { value == null ? this.removeAttribute('placeholder') : this.setAttribute('placeholder', value); }

    get srGroupText() { return this.getAttribute('sr-group-text'); }
    set srGroupText(value) { value == null ? this.removeAttribute('sr-group-text') : this.setAttribute('sr-group-text', value); }

    // #endregion

    // #region - PRIVATE INSTANCE FIELDS --------------------------------------------------------------------

    #initialized = false;
    #optionElements = new Map();
    #optionTags = new Map();

    // #endregion

    // #region - PRIVATE EVENT HANDLERS ---------------------------------------------------------------------

    #handleOpenerClick = () => {
        this.toggle();
        this.shadowRoot.querySelector('.opener').focus();
    };

    #handleLabelClick = (event) => {
        event.preventDefault();
        this.shadowRoot.querySelector('.opener').focus();
    };

    #handleFocusOut = () => {
        this.close();
    };

    #handlePopupMouseDown = (event) => {
        event.preventDefault();
    };

    // Removing a tag with the mouse while the popup is open should not close the popup
    #handleTagsMouseDown = (event) => {
        const tag = event.target.closest('.tag');
        if (!tag) return;
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
        // Only react when the click originated from an actual tag (handler may receive
        // clicks delegated from anywhere in the shadow tree).
        const tag = event.target.closest('.tag');
        if (!tag) return;

        // Do nothing if the tag clicked somehow doesn't have a matching <fds-multiselect-option>.
        const sourceOption = this.#findSourceForTag(tag);
        if (!sourceOption) return;

        const opener = this.shadowRoot.querySelector('.opener');
        const isOpen = opener.getAttribute('aria-expanded') === 'true';

        // If the popup is open, always keep focus on the opener when a tag is clicked.
        if (isOpen) {
            opener.focus();
            sourceOption.deselect();
            return;
        }

        const tags = Array.from(this.shadowRoot.querySelectorAll('.tag'));
        const index = tags.indexOf(tag);

        // Place focus on either the next tag, the previous tag if no next tag, or on the
        // opener if no tags are left at all.
        const focusTarget = tags[index + 1] ?? tags[index - 1] ?? opener;

        sourceOption.deselect();
        focusTarget.focus();
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

        const label = sourceOption.textContent.trim();

        const tag = document.createElement('button');
        tag.classList.add('tag');
        tag.setAttribute('type', 'button');
        tag.setAttribute('aria-label', `Fjern ${label}`);

        const tagLabel = document.createElement('span');
        tagLabel.classList.add('tag-label');
        tagLabel.textContent = label;
        tag.appendChild(tagLabel);

        const closeIcon = CE.createSvgIcon("m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z");
        tag.appendChild(closeIcon);

        const container = this.shadowRoot.querySelector('.tags');
        container.appendChild(tag);

        this.#optionTags.set(sourceOption, tag);
        this.#updateTagsGroup();
    }

    #removeTag(sourceOption) {
        const tag = this.#optionTags.get(sourceOption);
        if (!tag) return;

        tag.remove();
        this.#optionTags.delete(sourceOption);
        this.#updateTagsGroup();
    }

    #updateOpenerText() {
        const openerText = this.shadowRoot.querySelector('.opener-text');
        const tags = this.shadowRoot.querySelectorAll('.tag');

        if (tags.length === 0) {
            openerText.textContent = this.placeholder;
            openerText.classList.remove('sr-only');
            return;
        }

        const labels = [];
        for (const tag of tags) {
            labels.push(tag.textContent.trim());
        }
        openerText.textContent = labels.join(', ');
        openerText.classList.add('sr-only');
    }

    #buildOptions() {
        const listbox = this.shadowRoot.querySelector('.listbox');
        const optionsToBuild = this.querySelectorAll('fds-multiselect-option');

        for (const sourceOption of optionsToBuild) {
            if (this.#optionElements.has(sourceOption)) continue;

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

    #setChevronPath(path) {
        const chevronPath = this.shadowRoot.querySelector('.chevron-icon path');
        if (chevronPath) { chevronPath.setAttribute('d', path); }
    }

    #setupHTML() {
        if (this.shadowRoot.querySelector('.opener')) return;

        const opener = document.createElement('button');
        opener.id = generateAndVerifyUniqueId('multiselect-opener');
        opener.classList.add('opener');
        opener.setAttribute('type', 'button');
        opener.setAttribute('role', 'combobox');
        opener.setAttribute('aria-haspopup', 'listbox');
        opener.setAttribute('aria-expanded', 'false');
        opener.setAttribute('aria-activedescendant', '');

        const openerText = document.createElement('span');
        openerText.classList.add('opener-text');
        opener.appendChild(openerText);

        const chevronIcon = CE.createSvgIcon(CHEVRON_CLOSED_PATH);
        chevronIcon.classList.add('chevron-icon');
        opener.appendChild(chevronIcon);

        const tags = document.createElement('div');
        tags.classList.add('tags');
        tags.setAttribute('role', 'group');

        const popup = document.createElement('div');
        popup.classList.add('popup');
        popup.setAttribute('tabindex', '-1');
        popup.hidden = true;

        const listbox = document.createElement('div');
        listbox.id = generateAndVerifyUniqueId('multiselect-listbox');
        listbox.classList.add('listbox');
        listbox.setAttribute('role', 'listbox');
        listbox.setAttribute('aria-multiselectable', 'true');

        opener.setAttribute('aria-controls', listbox.id);

        popup.append(listbox);

        const openerWrapper = document.createElement('div');
        openerWrapper.classList.add('opener-wrapper');
        openerWrapper.append(opener, tags, popup);

        this.shadowRoot.append(openerWrapper);
    }

    #addEventListeners() {
        this.shadowRoot.querySelector('.opener').addEventListener('click', this.#handleOpenerClick);
        this.shadowRoot.querySelector('.opener').addEventListener('keydown', this.#handleOpenerKeyDown);
        this.shadowRoot.querySelector('.popup').addEventListener('mousedown', this.#handlePopupMouseDown);
        this.shadowRoot.querySelector('.listbox').addEventListener('click', this.#handleListboxClick);
        this.shadowRoot.addEventListener('click', this.#handleTagClick); // Listener is placed on the shadow root to avoid NVDA announcing an unlabeled "clickable"
        this.shadowRoot.addEventListener('mousedown', this.#handleTagsMouseDown);
        this.shadowRoot.addEventListener('focusout', this.#handleFocusOut);
        this.addEventListener('fds-multiselect-option-change', this.#handleOptionChange);
    }

    #removeEventListeners() {
        this.shadowRoot.querySelector('.opener').removeEventListener('click', this.#handleOpenerClick);
        this.shadowRoot.querySelector('.opener').removeEventListener('keydown', this.#handleOpenerKeyDown);
        this.shadowRoot.querySelector('.popup').removeEventListener('mousedown', this.#handlePopupMouseDown);
        this.shadowRoot.querySelector('.listbox').removeEventListener('click', this.#handleListboxClick);
        this.shadowRoot.removeEventListener('click', this.#handleTagClick);
        this.shadowRoot.removeEventListener('mousedown', this.#handleTagsMouseDown);
        this.shadowRoot.removeEventListener('focusout', this.#handleFocusOut);
        this.removeEventListener('fds-multiselect-option-change', this.#handleOptionChange);
    }

    #init() {
        this.#setupHTML();
        this.#updateLabel();
        this.#buildOptions();
        this.#addEventListeners();
        this.#updateOpenerText();

        this.#initialized = true;
    }

    #updateLabel() {
        const labelText = this.label;
        const listbox = this.shadowRoot.querySelector('.listbox');
        let labelEl = this.shadowRoot.querySelector('.opener-label');

        // Remove the label element if the label attribute is empty or missing
        if (!labelText) {
            console.warn('fds-multiselect: missing "label" attribute.', this);
            if (labelEl) {
                labelEl.removeEventListener('click', this.#handleLabelClick);
                labelEl.remove();
            }
            listbox.removeAttribute('aria-labelledby');
            this.#updateTagsGroup();
            return;
        }

        // Add the label element if it is missing and the multiselect has a valid label attribute
        if (!labelEl) {
            const opener = this.shadowRoot.querySelector('.opener');
            const openerWrapper = this.shadowRoot.querySelector('.opener-wrapper');

            labelEl = document.createElement('label');
            labelEl.id = generateAndVerifyUniqueId('multiselect-label');
            labelEl.classList.add('opener-label');
            labelEl.setAttribute('for', opener.id);
            labelEl.addEventListener('click', this.#handleLabelClick);
            listbox.setAttribute('aria-labelledby', labelEl.id);

            this.shadowRoot.insertBefore(labelEl, openerWrapper);
        }

        labelEl.textContent = labelText;
        this.#updateTagsGroup();
    }

    #updateTagsGroup() {
        const tags = this.shadowRoot.querySelector('.tags');
        const hasTags = tags.children.length > 0;
        const labelText = this.label;

        if (!hasTags || !labelText) {
            tags.removeAttribute('role');
            tags.removeAttribute('aria-label');
            return;
        }

        tags.setAttribute('role', 'group');
        tags.setAttribute('aria-label', this.srGroupText ?? `Valgte muligheder for ${labelText}`);
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
        this.#setChevronPath(CHEVRON_OPEN_PATH);

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
        this.#setChevronPath(CHEVRON_CLOSED_PATH);

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

    // #region - ATTRIBUTE(S) CHANGED -----------------------------------------------------------------------

    attributeChangedCallback(attribute, oldValue, newValue) {
        if (!this.#initialized) return;
        if (oldValue === newValue) return;

        switch (attribute) {
            case 'label':
            case 'sr-group-text':
                this.#updateLabel();
                break;
            case 'placeholder':
                this.#updateOpenerText();
                break;
        }
    }

    // #endregion
}

function registerMultiselect() {
    if (!customElements.get('fds-multiselect')) {
        customElements.define('fds-multiselect', FDSMultiselect);
    }
}

export default registerMultiselect;