import { generateAndVerifyUniqueId } from '../../utils/generate-unique-id';
import * as CE from '../custom-element-utils';
import { styles } from './fds-multiselectfirst-styling';

const sheet = new CSSStyleSheet();
sheet.replaceSync(styles);

const CHEVRON_CLOSED_PATH = 'M480-344 240-584l56-56 184 184 184-184 56 56-240 240Z';
const CHEVRON_OPEN_PATH = 'M480-528 296-344l-56-56 240-240 240 240-56 56-184-184Z';

class FDSMultiselectfirst extends HTMLElement {

    // #region - ATTRIBUTES (can invoke attributeChangedCallback()) -----------------------------------------

    static formAssociated = true;
    static observedAttributes = ['label', 'placeholder', 'sr-group-text', 'name'];

    // #endregion

    // #region - GETTERS AND SETTERS ------------------------------------------------------------------------

    get label() { return this.getAttribute('label'); }
    set label(value) { value == null ? this.removeAttribute('label') : this.setAttribute('label', value); }

    get placeholder() { return this.getAttribute('placeholder') ?? 'Vælg en eller flere'; }
    set placeholder(value) { value == null ? this.removeAttribute('placeholder') : this.setAttribute('placeholder', value); }

    get srGroupText() { return this.getAttribute('sr-group-text'); }
    set srGroupText(value) { value == null ? this.removeAttribute('sr-group-text') : this.setAttribute('sr-group-text', value); }

    get name() { return this.getAttribute('name'); }
    set name(value) { value == null ? this.removeAttribute('name') : this.setAttribute('name', value); }

    get value() {
        const values = [];
        for (const sourceOption of this.querySelectorAll('fds-multiselectfirst-option')) {
            if (this.#optionTags.has(sourceOption)) { values.push(sourceOption.value); }
        }
        return values;
    }

    // #endregion

    // #region - PRIVATE INSTANCE FIELDS --------------------------------------------------------------------

    #initialized = false;
    #optionElements = new Map();
    #optionTags = new Map();
    #internals;

    // #endregion

    // #region - PRIVATE EVENT HANDLERS ---------------------------------------------------------------------

    #handleOpenerClick = () => {
        this.toggle();
    };

    #handleLabelClick = (event) => {
        event.preventDefault();
        this.shadowRoot.querySelector('.opener').focus();
    };

    #handleFocusOut = (event) => {
        if (event.relatedTarget && this.shadowRoot.contains(event.relatedTarget)) return;
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

        const opener = this.shadowRoot.querySelector('.opener');
        const isOpen = opener.getAttribute('aria-expanded') === 'true';
        const popup = this.shadowRoot.querySelector('.popup');
        const rectBefore = isOpen ? popup.getBoundingClientRect() : null; // Get the popup's screen position

        isSelected ? this.#addTag(sourceOption) : this.#removeTag(sourceOption);

        const shadowOption = this.#optionElements.get(sourceOption);
        if (shadowOption) {
            shadowOption.setAttribute('aria-selected', isSelected ? 'true' : 'false');
        }

        this.#updateOpenerText();
        this.#updateFormValue();

        // The width of the tag should be constrained to avoid too much empty space.
        if (isSelected) {
            const tag = this.#optionTags.get(sourceOption);

            if (tag) {
                // The 62.5% trick means we need to ensure the document has loaded for correct calculations.
                const pageIsAlreadyLoaded = document.readyState === 'complete';

                if (pageIsAlreadyLoaded) {
                    this.#constrainTagWidth(tag);
                }
                else {
                    window.addEventListener('load', () => this.#constrainTagWidth(tag), { once: true });
                }
            }
        }

        // Keep the popup visually anchored on screen.
        if (isOpen) {
            const rectAfter = popup.getBoundingClientRect();
            const difference = rectAfter.top - rectBefore.top;

            if (difference !== 0) {
                this.#getScrollableAncestor().scrollBy(0, difference);
            }
        }
    };

    #handleTagClick = (event) => {
        // Only react when the click originated from an actual tag (handler may receive
        // clicks delegated from anywhere in the shadow tree).
        const tag = event.target.closest('.tag');
        if (!tag) return;

        // Do nothing if the tag clicked somehow doesn't have a matching <fds-multiselectfirst-option>.
        const sourceOption = this.#findSourceForTag(tag);
        if (!sourceOption) return;

        const opener = this.shadowRoot.querySelector('.opener');
        const isOpen = opener.getAttribute('aria-expanded') === 'true';

        if (isOpen) {
            this.close();
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
        if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') return; // Enter and Space is handled by #handleOpenerClick()

        event.preventDefault();
        this.open();
    };

    #handleListboxKeyDown = (event) => {
        const shadowOptions = Array.from(this.shadowRoot.querySelectorAll('.option'));
        const active = this.#getActiveShadowOption();
        const currentIndex = active ? shadowOptions.indexOf(active) : -1;

        switch (event.key) {
            case 'ArrowDown': {
                event.preventDefault();
                const nextIndex = Math.min(currentIndex + 1, shadowOptions.length - 1);
                this.#setActiveShadowOption(shadowOptions[nextIndex]);
                break;
            }

            case 'ArrowUp': {
                event.preventDefault();
                const previousIndex = currentIndex < 0 ? 0 : Math.max(currentIndex - 1, 0);
                this.#setActiveShadowOption(shadowOptions[previousIndex]);
                break;
            }

            case 'Home':
                event.preventDefault();
                this.#setActiveShadowOption(shadowOptions[0]);
                break;

            case 'End':
                event.preventDefault();
                this.#setActiveShadowOption(shadowOptions[shadowOptions.length - 1]);
                break;

            case 'Enter':
            case ' ': {
                event.preventDefault();

                if (active) {
                    const sourceOption = this.#findSourceForShadow(active);
                    if (sourceOption) {
                        sourceOption.toggle();
                    }
                }
                break;
            }

            case 'Escape':
                event.preventDefault();
                this.close();
                this.shadowRoot.querySelector('.opener').focus();
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
        const listbox = this.shadowRoot.querySelector('.listbox');
        const activeId = listbox.getAttribute('aria-activedescendant');

        if (!activeId) return null;
        return this.shadowRoot.getElementById(activeId);
    }

    #setActiveShadowOption(shadowOption) {
        if (!shadowOption) return;

        const listbox = this.shadowRoot.querySelector('.listbox');
        const previous = this.#getActiveShadowOption();

        if (previous) {
            previous.removeAttribute('data-active');
        }

        shadowOption.setAttribute('data-active', '');
        listbox.setAttribute('aria-activedescendant', shadowOption.id);
        shadowOption.scrollIntoView({ block: 'nearest' });
    }

    #getScrollableAncestor() {
        let node = this.parentElement;

        while (node) {
            const style = getComputedStyle(node);
            const isScrollable = (style.overflowY === 'auto' || style.overflowY === 'scroll') && node.scrollHeight > node.clientHeight;
            if (isScrollable) { return node; }
            node = node.parentElement;
        }

        return document.scrollingElement ?? document.documentElement;
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

        const closeIcon = CE.createSvgIcon('m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z');
        tag.appendChild(closeIcon);

        this.shadowRoot.querySelector('.tags').appendChild(tag);
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

    #constrainTagWidth(tag) {
        const tagLabel = tag.querySelector('.tag-label');
        const textNode = tagLabel.firstChild;
        if (!textNode) return;
        const icon = tag.querySelector('.icon-svg');

        // Calculate height threshold for when a tag's text is considered to span several lines
        const tagLineHeight = parseFloat(getComputedStyle(tag).lineHeight);
        const PIXEL_BUFFER = 1; // 1 px added to avoid issues where height may be a floating number
        const singleLineHeightThreshold = tagLineHeight + PIXEL_BUFFER;

        // Reset any previously applied constraint.
        tag.style.maxWidth = '';

        const height = tag.getBoundingClientRect().height;
        if (height <= singleLineHeightThreshold) return; // Already a single line so nothing to constrain.

        // The tag wrapped onto multiple lines. Measure the widest actual rendered
        // line and set a max-width, so the box doesn't stretch wider than the text.
        const range = document.createRange();
        range.selectNodeContents(textNode);

        let widestLine = 0;
        for (const rect of range.getClientRects()) {
            if (rect.width > widestLine) { widestLine = rect.width; }
        }

        if (widestLine === 0) return;

        const tagStyle = getComputedStyle(tag);
        const paddingLeft = parseFloat(tagStyle.paddingLeft);
        const paddingRight = parseFloat(tagStyle.paddingRight);

        const tagLabelStyle = getComputedStyle(tagLabel);
        const paddingRightLabel = parseFloat(tagLabelStyle.paddingRight);
        
        const iconWidth = icon ? icon.getBoundingClientRect().width : 0;

        tag.style.maxWidth = `${Math.ceil(widestLine + paddingLeft + paddingRight + paddingRightLabel + iconWidth)}px`;
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
        const optionsToBuild = this.querySelectorAll('fds-multiselectfirst-option');

        for (const sourceOption of optionsToBuild) {
            if (this.#optionElements.has(sourceOption)) continue;

            const shadowOption = document.createElement('div');
            shadowOption.classList.add('option');
            shadowOption.id = generateAndVerifyUniqueId('multiselect-option');
            shadowOption.setAttribute('role', 'option');
            shadowOption.setAttribute('tabindex', '-1');
            shadowOption.setAttribute('aria-selected', sourceOption.getAttribute('data-selected') === 'true' ? 'true' : 'false');

            const checkbox = CE.createSvgIcon('M382-240 154-468l57-57 171 171 367-367 57 57-424 424Z');
            checkbox.classList.add('option-checkbox');
            shadowOption.appendChild(checkbox);

            const optionLabel = document.createElement('span');
            optionLabel.classList.add('option-label');
            optionLabel.textContent = sourceOption.textContent.trim();
            shadowOption.appendChild(optionLabel);

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
        opener.setAttribute('aria-haspopup', 'dialog');
        opener.setAttribute('aria-expanded', 'false');

        const openerText = document.createElement('span');
        openerText.classList.add('opener-text');
        opener.appendChild(openerText);

        const chevronIcon = CE.createSvgIcon(CHEVRON_CLOSED_PATH);
        chevronIcon.classList.add('chevron-icon');
        opener.appendChild(chevronIcon);

        const tags = document.createElement('div');
        tags.classList.add('tags');

        const popup = document.createElement('div');
        popup.id = generateAndVerifyUniqueId('multiselect-dialog');
        popup.classList.add('popup');
        popup.setAttribute('role', 'dialog');
        popup.setAttribute('aria-label', 'Vælg en eller flere muligheder');
        popup.hidden = true;

        opener.setAttribute('aria-controls', popup.id);

        const listbox = document.createElement('div');
        listbox.id = generateAndVerifyUniqueId('multiselect-listbox');
        listbox.classList.add('listbox');
        listbox.setAttribute('role', 'listbox');
        listbox.setAttribute('aria-multiselectable', 'true');
        listbox.setAttribute('tabindex', '0');

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
        this.shadowRoot.querySelector('.listbox').addEventListener('keydown', this.#handleListboxKeyDown);
        this.shadowRoot.addEventListener('click', this.#handleTagClick); // Listener is placed on the shadow root to avoid NVDA announcing an unlabeled "clickable"
        this.shadowRoot.addEventListener('mousedown', this.#handleTagsMouseDown);
        this.shadowRoot.addEventListener('focusout', this.#handleFocusOut);
        this.addEventListener('fds-multiselectfirst-option-change', this.#handleOptionChange);
    }

    #removeEventListeners() {
        this.shadowRoot.querySelector('.opener').removeEventListener('click', this.#handleOpenerClick);
        this.shadowRoot.querySelector('.opener').removeEventListener('keydown', this.#handleOpenerKeyDown);
        this.shadowRoot.querySelector('.popup').removeEventListener('mousedown', this.#handlePopupMouseDown);
        this.shadowRoot.querySelector('.listbox').removeEventListener('click', this.#handleListboxClick);
        this.shadowRoot.querySelector('.listbox').removeEventListener('keydown', this.#handleListboxKeyDown);
        this.shadowRoot.removeEventListener('click', this.#handleTagClick);
        this.shadowRoot.removeEventListener('mousedown', this.#handleTagsMouseDown);
        this.shadowRoot.removeEventListener('focusout', this.#handleFocusOut);
        this.removeEventListener('fds-multiselectfirst-option-change', this.#handleOptionChange);
    }

    #init() {
        this.#setupHTML();
        this.#updateLabel();
        this.#buildOptions();
        this.#addEventListeners();
        this.#updateOpenerText();
        this.#updateFormValue();

        this.#initialized = true;
    }

    #updateLabel() {
        const labelText = this.label;
        const listbox = this.shadowRoot.querySelector('.listbox');
        let labelEl = this.shadowRoot.querySelector('.opener-label');

        // Remove the label element if the label attribute is empty or missing
        if (!labelText) {
            console.warn('fds-multiselectfirst: missing "label" attribute.', this);

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

            this.shadowRoot.insertBefore(labelEl, openerWrapper);
        }

        labelEl.textContent = labelText;
        listbox.setAttribute('aria-labelledby', labelEl.id);
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

    #updateFormValue() {
        if (!this.name) {
            this.#internals.setFormValue(null);
            return;
        }

        const formData = new FormData();
        for (const value of this.value) {
            formData.append(this.name, value);
        }

        this.#internals.setFormValue(formData);
    }

    // #endregion

    // #region - CONSTRUCTOR (do not access or add attributes in the constructor) ---------------------------

    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.adoptedStyleSheets = [sheet];
        this.#internals = this.attachInternals();
    }

    // #endregion

    // #region - PUBLIC METHODS -----------------------------------------------------------------------------

    open() {
        if (!this.#initialized) return;

        const opener = this.shadowRoot.querySelector('.opener');
        const popup = this.shadowRoot.querySelector('.popup');
        const listbox = this.shadowRoot.querySelector('.listbox');

        opener.setAttribute('aria-expanded', 'true');
        popup.hidden = false;
        this.#setChevronPath(CHEVRON_OPEN_PATH);

        if (!this.#getActiveShadowOption()) {
            this.#setActiveShadowOption(listbox.querySelector('.option'));
        }

        listbox.focus();
    }

    close() {
        if (!this.#initialized) return;

        const opener = this.shadowRoot.querySelector('.opener');
        const popup = this.shadowRoot.querySelector('.popup');
        const listbox = this.shadowRoot.querySelector('.listbox');

        opener.setAttribute('aria-expanded', 'false');
        popup.hidden = true;
        this.#setChevronPath(CHEVRON_CLOSED_PATH);

        const active = this.#getActiveShadowOption();
        if (active) {
            active.removeAttribute('data-active');
        }

        listbox.setAttribute('aria-activedescendant', '');
    }

    toggle() {
        if (!this.#initialized) return;

        const opener = this.shadowRoot.querySelector('.opener');
        const isOpen = opener.getAttribute('aria-expanded') === 'true';

        if (isOpen) {
            this.close();
            opener.focus();
        }
        else {
            this.open();
        }
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
            case 'name':
                this.#updateFormValue();
                break;
        }
    }

    // #endregion

    // #region - FORM-ASSOCIATED CALLBACKS ------------------------------------------------------------------

    formResetCallback() {
        for (const sourceOption of this.querySelectorAll('fds-multiselectfirst-option')) {
            sourceOption.reset();
        }
    }

    // #endregion
}

function registerMultiselectfirst() {
    if (!customElements.get('fds-multiselectfirst')) {
        customElements.define('fds-multiselectfirst', FDSMultiselectfirst);
    }
}

export default registerMultiselectfirst;