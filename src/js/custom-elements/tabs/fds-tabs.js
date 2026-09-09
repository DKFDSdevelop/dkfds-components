const styles = `
    :host {
        display: block;
    }
`;

const sheet = new CSSStyleSheet();
sheet.replaceSync(styles);

const mutationObserverConfig = {
    subtree: true,
    childList: true,
    attributes: true,
    attributeFilter: ['tab-key'],
};

class FDSTabs extends HTMLElement {

    // #region - ATTRIBUTES (can invoke attributeChangedCallback()) -----------------------------------------

    static observedAttributes = ['selected-tab'];

    // #endregion

    // #region - GETTERS AND SETTERS ------------------------------------------------------------------------

    get selectedTab() { return this.getAttribute('selected-tab'); }
    set selectedTab(value) { value == null ? this.removeAttribute('selected-tab') : this.setAttribute('selected-tab', value); }

    // #endregion

    // #region - PRIVATE INSTANCE FIELDS --------------------------------------------------------------------

    #initialized = false;
    #mutationObserver = null;

    // #endregion

    // #region - PRIVATE EVENT HANDLERS ---------------------------------------------------------------------

    #handleTabActivate = (event) => {
        const tabElement = event.composedPath().find((node) => node.nodeName === 'FDS-TAB');
        if (!tabElement || !tabElement.tabKey) return;

        this.selectedTab = tabElement.tabKey;
    };

    #handleMutations = () => {
        this.#updateSlotAssignments();
    };

    // #endregion

    // #region - PRIVATE METHODS ----------------------------------------------------------------------------

    #setupHTML() {
        if (this.shadowRoot.querySelector('div[role="tablist"]')) return;

        const wrapper = document.createElement('div');
        wrapper.setAttribute('role', 'tablist');

        const tabSlot = document.createElement('slot');
        tabSlot.id = 'tab-slot';
        wrapper.appendChild(tabSlot);

        const panelSlot = document.createElement('slot');
        panelSlot.id = 'panel-slot';

        this.shadowRoot.appendChild(wrapper);
        this.shadowRoot.appendChild(panelSlot);
    }

    // If selected-tab is missing or doesn't match any tab-key, default to the first tab.
    #applyFallbackSelection() {
        const hasValidSelection = this.querySelector(`:scope > fds-tab[tab-key="${this.selectedTab}"]`);
        const firstTab = this.querySelector(':scope > fds-tab[tab-key]');
        
        if (!hasValidSelection && firstTab) {
            this.selectedTab = firstTab.tabKey;
        }
    }

    // Returns a Map of (tab-key, element) for all direct children matching the given tag name.
    #createTabKeyMap(tagName) {
        const elementsByTabKey = new Map();

        for (const child of this.children) {
            const shouldAddEntry = child.tagName === tagName && child.tabKey && !elementsByTabKey.has(child.tabKey);

            if (shouldAddEntry) {
                elementsByTabKey.set(child.tabKey, child);
            }
        }

        return elementsByTabKey;
    }

    // Assign valid tab and tab-panel pairs to slots
    #updateSlotAssignments() {
        const tabsByKey = this.#createTabKeyMap('FDS-TAB');
        const panelsByKey = this.#createTabKeyMap('FDS-TAB-PANEL');

        const pairedTabs = [];
        const pairedPanels = [];

        for (const [tabKey, tab] of tabsByKey) {
            const panel = panelsByKey.get(tabKey);
            if (panel) {
                tab.setAttribute('aria-controls', panel.id);
                panel.setAttribute('aria-labelledby', tab.id);
                panel.hidden = tabKey !== this.selectedTab;

                pairedTabs.push(tab);
                pairedPanels.push(panel);
            }
        }

        this.shadowRoot.querySelector('#tab-slot').assign(...pairedTabs);
        this.shadowRoot.querySelector('#panel-slot').assign(...pairedPanels);
    }

    #updateSelectedTab(tabKey, previousTabKey) {
        const assignedTabs = this.shadowRoot.querySelector('#tab-slot').assignedElements();
        const assignedPanels = this.shadowRoot.querySelector('#panel-slot').assignedElements();

        const nextTab = assignedTabs.find((tab) => tab.tabKey === tabKey);
        if (!nextTab) return;

        for (const panel of assignedPanels) {
            panel.hidden = panel.tabKey !== tabKey;
        }

        const previousTab = previousTabKey
            ? assignedTabs.find((tab) => tab.tabKey === previousTabKey) ?? null
            : null;

        this.dispatchEvent(new CustomEvent('fds-tab-changed', {
            bubbles: true,
            detail: {
                selectedTab: nextTab,
                selectedTabKey: tabKey,
                previousTab: previousTab ?? null,
                previousTabKey: previousTabKey ?? null,
            },
        }));
    }

    #connectMutationObserver() {
        if (this.#mutationObserver) return;
        this.#mutationObserver = new MutationObserver(this.#handleMutations);
        this.#mutationObserver.observe(this, mutationObserverConfig);
    }

    #disconnectMutationObserver() {
        if (this.#mutationObserver) {
            this.#mutationObserver.disconnect();
            this.#mutationObserver = null;
        }
    }

    // #endregion

    // #region - CONSTRUCTOR (do not access or add attributes in the constructor) ---------------------------

    constructor() {
        super();
        this.attachShadow({ mode: 'open', slotAssignment: 'manual' });
        this.shadowRoot.adoptedStyleSheets = [sheet];
    }

    // #endregion

    // #region - PUBLIC METHODS -----------------------------------------------------------------------------

    init() {
        this.#setupHTML();
        this.#applyFallbackSelection();
        this.#updateSlotAssignments();
        this.addEventListener('fds-tab-activate', this.#handleTabActivate);
        this.#connectMutationObserver();

        this.#initialized = true;
    }

    // #endregion

    // #region - ADDED TO DOCUMENT --------------------------------------------------------------------------

    connectedCallback() {
        this.init();
    }

    // #endregion

    // #region - REMOVED FROM DOCUMENT ----------------------------------------------------------------------

    disconnectedCallback() {
        this.removeEventListener('fds-tab-activate', this.#handleTabActivate);
        this.#disconnectMutationObserver();
        this.#initialized = false;
    }

    // #endregion

    // #region - ATTRIBUTE(S) CHANGED -----------------------------------------------------------------------

    attributeChangedCallback(attribute, oldValue, newValue) {
        if (!this.#initialized) return;
        if (oldValue === newValue) return;

        if (attribute === 'selected-tab' && newValue) {
            this.#updateSelectedTab(newValue, oldValue);
        }
    }

    // #endregion
}

function registerTabs() {
    if (!customElements.get('fds-tabs')) {
        customElements.define('fds-tabs', FDSTabs);
    }
}

export default registerTabs;
