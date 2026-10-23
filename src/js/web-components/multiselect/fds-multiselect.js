import { generateAndVerifyUniqueId } from '../../utils/generate-unique-id';
import * as CE from '../custom-element-utils';
import { styles } from './fds-multiselect-styling';

const sheet = new CSSStyleSheet();
sheet.replaceSync(styles);

class FDSMultiselect extends HTMLElement {

    // #region - PRIVATE INSTANCE FIELDS --------------------------------------------------------------------

    #initialized = false;
    #mutationObserver = null;
    #optionTags = new Map();

    // #endregion

    // #region - PRIVATE EVENT HANDLERS ---------------------------------------------------------------------

    #handleOpenerExpanded = () => {
        this.querySelector('fds-multiselect-dialog')?.open();
    };

    #handleOpenerCollapsed = () => {
        this.querySelector('fds-multiselect-dialog')?.close();
    };

    #handleOptionSelected = (event) => {
        this.#addTag(event.target);
    };

    #handleOptionDeselected = (event) => {
        this.#removeTag(event.target);
    };

    #handleLabelClick = (event) => {
        if (!event.target.closest('label')) return;
        // Prevent the native label click from forwarding to the opener and opening the dialog.
        event.preventDefault();
        this.querySelector('fds-multiselect-opener')?.focus();
    };

    #handleTagClick = (event) => {
        const tag = event.target.closest('.tag');
        if (!tag) return;

        const sourceOption = this.#findSourceForTag(tag);
        if (!sourceOption) return;

        const opener = this.querySelector('fds-multiselect-opener');

        if (opener?.expanded) {
            opener.close();
        }

        const tags = Array.from(this.shadowRoot.querySelectorAll('.tag'));
        const index = tags.indexOf(tag);

        // Place focus on either the next tag, the previous tag if no next tag, or on the
        // opener if no tags are left at all.
        const focusTarget = tags[index + 1] ?? tags[index - 1] ?? opener;

        sourceOption.deselect();
        focusTarget?.focus();
    };

    #handleFocusOut = (event) => {
        const relatedTarget = event.relatedTarget;

        // Ensure the opener only closes when something outside the multiselect gets focus.
        const stillInside = relatedTarget && (this.contains(relatedTarget) || this.shadowRoot.contains(relatedTarget));
        if (stillInside) return;

        const opener = this.querySelector('fds-multiselect-opener');
        opener?.close();
    };

    #handleKeyDown = (event) => {
        if (event.key !== 'Escape') return;

        const opener = this.querySelector('fds-multiselect-opener');
        if (!opener?.expanded) return;

        event.preventDefault();
        opener.close();
        opener.focus();
    };

    #handleMutations = () => {
        this.#wireRelationships();
    };

    // #endregion

    // #region - PRIVATE METHODS ----------------------------------------------------------------------------

    #findSourceForTag(tag) {
        for (const [source, tagEl] of this.#optionTags) {
            if (tagEl === tag) { return source; }
        }
        return null;
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
        this.#constrainTagWidth(tag);

        this.#refreshOpener();
        this.#updateTagsGroup();
    }

    #removeTag(sourceOption) {
        const tag = this.#optionTags.get(sourceOption);
        if (!tag) return;

        tag.remove();
        this.#optionTags.delete(sourceOption);

        this.#refreshOpener();
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

    #updateTagsGroup() {
        const tags = this.shadowRoot.querySelector('.tags');
        const hasTags = tags.children.length > 0;
        const label = this.querySelector('label');

        if (!hasTags || !label) {
            tags.removeAttribute('role');
            tags.removeAttribute('aria-label');
            return;
        }

        tags.setAttribute('role', 'group');
        tags.setAttribute('aria-label', `Valgte muligheder for ${label.textContent}`);
    }

    #wireRelationships() {
        const label = this.querySelector('label');
        const opener = this.querySelector('fds-multiselect-opener');
        const dialog = this.querySelector('fds-multiselect-dialog');

        if (opener && !opener.id) { opener.id = generateAndVerifyUniqueId('multiselect-opener'); }
        if (dialog && !dialog.id) { dialog.id = generateAndVerifyUniqueId('multiselect-dialog'); }

        if (label && opener) { label.htmlFor = opener.id; }
        if (opener && dialog) { opener.setAttribute('aria-controls', dialog.id); }

        if (opener) { opener.setAttribute('slot', 'opener'); }
        if (dialog) { dialog.setAttribute('slot', 'dialog'); }

        for (const sourceOption of this.querySelectorAll('fds-multiselect-option[default-selected]')) {
            this.#addTag(sourceOption);
        }
    }

    // fds-multiselect-opener may not have been upgraded yet when called on page load.
    // Ensure refreshOpener is called when the custom element is defined.
    #refreshOpener() {
        customElements.whenDefined('fds-multiselect-opener').then(() => {
            const opener = this.querySelector('fds-multiselect-opener');
            opener?.refreshOpener();
        });
    }

    #setupHTML() {
        if (this.shadowRoot.querySelector('.opener-wrapper')) return;

        const labelSlot = document.createElement('slot');

        const openerWrapper = document.createElement('div');
        openerWrapper.classList.add('opener-wrapper');

        const openerSlot = document.createElement('slot');
        openerSlot.name = 'opener';

        const tags = document.createElement('div');
        tags.classList.add('tags');

        openerWrapper.append(openerSlot, tags);

        const dialogSlot = document.createElement('slot');
        dialogSlot.name = 'dialog';

        this.shadowRoot.append(labelSlot, openerWrapper, dialogSlot);
    }

    #connectMutationObserver() {
        if (this.#mutationObserver) return;
        this.#mutationObserver = new MutationObserver(this.#handleMutations);
        this.#mutationObserver.observe(this, { childList: true, subtree: false });
    }

    #disconnectMutationObserver() {
        if (this.#mutationObserver) {
            this.#mutationObserver.disconnect();
            this.#mutationObserver = null;
        }
    }

    #handleWindowLoad = () => {
        const tags = this.shadowRoot.querySelectorAll('.tag');
        tags.forEach(tag => this.#constrainTagWidth(tag));
    };

    #addEventListeners() {
        this.addEventListener('fds-multiselect-opener-expanded', this.#handleOpenerExpanded);
        this.addEventListener('fds-multiselect-opener-collapsed', this.#handleOpenerCollapsed);
        this.addEventListener('fds-multiselect-option-selected', this.#handleOptionSelected);
        this.addEventListener('fds-multiselect-option-deselected', this.#handleOptionDeselected);
        this.addEventListener('click', this.#handleLabelClick);
        this.addEventListener('focusout', this.#handleFocusOut);
        this.addEventListener('keydown', this.#handleKeyDown);
        this.shadowRoot.addEventListener('click', this.#handleTagClick);
        window.addEventListener('load', this.#handleWindowLoad, { once: true });
    }

    #removeEventListeners() {
        this.removeEventListener('fds-multiselect-opener-expanded', this.#handleOpenerExpanded);
        this.removeEventListener('fds-multiselect-opener-collapsed', this.#handleOpenerCollapsed);
        this.removeEventListener('fds-multiselect-option-selected', this.#handleOptionSelected);
        this.removeEventListener('fds-multiselect-option-deselected', this.#handleOptionDeselected);
        this.removeEventListener('click', this.#handleLabelClick);
        this.removeEventListener('focusout', this.#handleFocusOut);
        this.removeEventListener('keydown', this.#handleKeyDown);
        this.shadowRoot.removeEventListener('click', this.#handleTagClick);
        window.removeEventListener('load', this.#handleWindowLoad);
    }

    #init() {
        customElements.upgrade(this);

        this.#setupHTML();
        this.#wireRelationships();
        this.#addEventListeners();
        this.#connectMutationObserver();

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

    // #region - ADDED TO DOCUMENT --------------------------------------------------------------------------

    connectedCallback() {
        if (!this.#initialized) { this.#init(); }
    }

    // #endregion

    // #region - REMOVED FROM DOCUMENT ----------------------------------------------------------------------

    disconnectedCallback() {
        this.#removeEventListeners();
        this.#disconnectMutationObserver();
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