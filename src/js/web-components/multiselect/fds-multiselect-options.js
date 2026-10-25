import { generateAndVerifyUniqueId } from '../../utils/generate-unique-id';
import { styles } from './fds-multiselect-options-styling';

const sheet = new CSSStyleSheet();
sheet.replaceSync(styles);

class FDSMultiselectOptions extends HTMLElement {

    // #region - PRIVATE INSTANCE FIELDS --------------------------------------------------------------------

    #initialized = false;

    // #endregion

    // #region - PRIVATE EVENT HANDLERS ---------------------------------------------------------------------

    #handleClick = (event) => {
        const option = event.target.closest('fds-multiselect-option');
        if (!option) return;

        this.#setActiveOption(option);
        option.toggle();
    };

    #handleFocus = () => {
        if (this.#getActiveOption()) return;

        const options = this.querySelectorAll('fds-multiselect-option');
        if (options.length > 0) { this.#setActiveOption(options[0]); }
    };

    #handleKeyDown = (event) => {
        const options = Array.from(this.querySelectorAll('fds-multiselect-option'));
        const active = this.#getActiveOption();
        const currentIndex = active ? options.indexOf(active) : -1;

        switch (event.key) {
            case 'ArrowDown': {
                event.preventDefault();
                const nextIndex = Math.min(currentIndex + 1, options.length - 1);
                this.#setActiveOption(options[nextIndex]);
                break;
            }

            case 'ArrowUp': {
                event.preventDefault();

                if (currentIndex <= 0) {
                    const dialog = this.closest('fds-multiselect-dialog');
                    if (dialog?.selectAll) {
                        dialog.focusSelectAllCheckbox();
                        break;
                    }
                }

                const previousIndex = currentIndex < 0 ? 0 : Math.max(currentIndex - 1, 0);
                this.#setActiveOption(options[previousIndex]);
                break;
            }

            case 'Home':
                event.preventDefault();
                this.#setActiveOption(options[0]);
                break;

            case 'End':
                event.preventDefault();
                this.#setActiveOption(options[options.length - 1]);
                break;

            case 'Enter':
            case ' ':
                event.preventDefault();
                if (active) { active.toggle(); }
                break;
        }
    };

    // #endregion

    // #region - PRIVATE METHODS ----------------------------------------------------------------------------

    #getActiveOption() {
        const activeId = this.getAttribute('aria-activedescendant');
        if (!activeId) return null;
        return this.querySelector(`#${activeId}`);
    }

    #setActiveOption(option) {
        if (!option) return;

        const previous = this.#getActiveOption();
        if (previous) { previous.removeAttribute('data-active'); }

        option.setAttribute('data-active', '');
        this.setAttribute('aria-activedescendant', option.id);
        option.scrollIntoView({ block: 'nearest' });
    }

    #setupHTML() {
        if (this.shadowRoot.querySelector('slot')) return;

        const slot = document.createElement('slot');
        this.shadowRoot.appendChild(slot);
    }

    #addEventListeners() {
        this.addEventListener('click', this.#handleClick);
        this.addEventListener('focus', this.#handleFocus);
        this.addEventListener('keydown', this.#handleKeyDown);
    }

    #removeEventListeners() {
        this.removeEventListener('click', this.#handleClick);
        this.removeEventListener('focus', this.#handleFocus);
        this.removeEventListener('keydown', this.#handleKeyDown);
    }

    #init() {
        this.#setupHTML();

        this.setAttribute('role', 'listbox');
        this.setAttribute('aria-multiselectable', 'true');
        this.tabIndex = 0;
        if (!this.id) { this.id = generateAndVerifyUniqueId('multiselect-options'); }

        this.#addEventListeners();
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
        this.#initialized = false;
    }

    // #endregion
}

function registerMultiselectOptions() {
    if (!customElements.get('fds-multiselect-options')) {
        customElements.define('fds-multiselect-options', FDSMultiselectOptions);
    }
}

export default registerMultiselectOptions;