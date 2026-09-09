const styles = `
    :host {
        display: block;
    }
`;

const sheet = new CSSStyleSheet();
sheet.replaceSync(styles);

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

    // #endregion

    // #region - PRIVATE EVENT HANDLERS ---------------------------------------------------------------------

    #handleTabActivate = (event) => {
        const tabElement = event.composedPath().find((node) => node.nodeName === 'FDS-TAB');
        if (!tabElement || !tabElement.tabKey) return;

        this.#selectTab(tabElement.tabKey);
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

    // Returns a Map of tab-key -> element for all direct children matching the given tag name.
    // If more than one element shares the same tab-key, only the first one found is kept.
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

    // Determines which tabs/panels form a valid pair (matching tab-key on both sides) and
    // assigns only those to the slots. A tab or panel without a matching counterpart is
    // intentionally left unassigned - this is how a tab/panel can be hidden.
    #updateSlotAssignments() {
        const tabsByKey = this.#createTabKeyMap('FDS-TAB');
        const panelsByKey = this.#createTabKeyMap('FDS-TAB-PANEL');

        const pairedTabs = [];
        const pairedPanels = [];

        for (const [tabKey, tab] of tabsByKey) {
            const panel = panelsByKey.get(tabKey);
            if (panel) {
                pairedTabs.push(tab);
                pairedPanels.push(panel);
            }
        }

        this.shadowRoot.querySelector('#tab-slot').assign(...pairedTabs);
        this.shadowRoot.querySelector('#panel-slot').assign(...pairedPanels);
    }

    // Selects the tab/panel matching the given tab-key. Does nothing if there is no
    // matching, currently-assigned tab and panel pair for that key, or if it is already selected.
    // Dispatches 'fds-tab-changed' unless dispatch is explicitly set to false (used only for
    // the initial selection on connect, which is not considered a "change").
    #selectTab(tabKey, dispatch = true) {
        if (tabKey === this.selectedTab) return;

        const nextTab = this.querySelector(`:scope > fds-tab[tab-key="${tabKey}"]`);
        const nextPanel = this.querySelector(`:scope > fds-tab-panel[tab-key="${tabKey}"]`);
        if (!nextTab || !nextPanel) return;

        const previousTabKey = this.selectedTab;
        const previousTab = previousTabKey
            ? this.querySelector(`:scope > fds-tab[tab-key="${previousTabKey}"]`)
            : null;

        for (const panel of this.querySelectorAll(':scope > fds-tab-panel')) {
            panel.hidden = panel !== nextPanel;
        }

        if (dispatch) {
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

        this.selectedTab = tabKey;
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
        this.#updateSlotAssignments();
        this.addEventListener('fds-tab-activate', this.#handleTabActivate);

        const firstTab = this.shadowRoot.querySelector('#tab-slot').assignedElements()[0];
        if (firstTab) {
            this.#selectTab(firstTab.tabKey, false); // initial selection. Not a "change", so no event is dispatched.
        }

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
        this.#initialized = false;
    }

    // #endregion

    // #region - ATTRIBUTE(S) CHANGED -----------------------------------------------------------------------

    attributeChangedCallback(attribute, oldValue, newValue) {
        if (!this.#initialized) return;
        if (oldValue === newValue) return;

        if (attribute === 'selected-tab' && newValue) {
            this.#selectTab(newValue);
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
