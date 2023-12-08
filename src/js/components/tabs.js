'use strict';

// Add or substract depending on key pressed
var direction = {
    'ArrowLeft': -1,
    'ArrowRight': 1,
};

/**
 * Adds functionality to tab container component without URL change
 * @param {HTMLElement} tabContainer Tab container
 */
function Tabs(tabContainer) {
    if (!tabContainer) {
        throw new Error(`Missing tab container element`);
    }
    this.tabContainer = tabContainer;
    this.tabs = this.tabContainer.querySelectorAll('.tab-button');
}

/**
 * Set event on component
 */
Tabs.prototype.init = function () {
    if (this.tabs.length === 0) {
        throw new Error(`tabContainer element seems to be missing a child tab-button. There needs to be atleast one tab of class tab-button to set an active tab`);
    }

    // if no hash is set on load, set active tab
    if (!setActiveHashTab()) {
        // set first tab as active
        let tab = this.tabs[0];

        // check no other tabs has been set at default. If so set tab to the first active tab found
        let alreadyActive = getActiveTabs(this.tabContainer);
        if (alreadyActive.length !== 0) {
            tab = alreadyActive[0];
        }

        // activate and deactivate tabs
        this.activateTab(tab, false);
    }
    let $module = this;
    // add eventlisteners on buttons
    for (let t = 0; t < this.tabs.length; t++) {
        this.tabs[t].addEventListener('click', function () { $module.activateTab(this, false) });
        this.tabs[t].addEventListener('keydown', keydownEventListener);
    }
}

/***
 * Show tab and hide others
 * @param {HTMLButtonElement} tab button element
 * @param {boolean} setFocus True if tab button should be focused
 */
Tabs.prototype.activateTab = function (tab, setFocus) {
    let tabs = getAllTabsInList(tab);

    if (tab.getAttribute('aria-selected') !== null) {

        // close all tabs except selected
        for (let i = 0; i < this.tabs.length; i++) {
            if (tabs[i] === tab) {
                continue;
            }

            if (tabs[i].getAttribute('aria-selected') === 'true') {
                let eventClose = new Event('fds.tab.close');
                tabs[i].dispatchEvent(eventClose);
            }

            tabs[i].setAttribute('aria-selected', 'false');
            tabs[i].setAttribute('tabindex', '-1');
            let tabpanelID = tabs[i].getAttribute('aria-controls');
            let tabpanel = document.getElementById(tabpanelID)
            if (tabpanel === null) {
                throw new Error(`Could not find tabpanel from ID.`);
            }
            tabpanel.setAttribute('hidden', '');
        }

        // Set selected tab to active
        tab.setAttribute('aria-selected', 'true');
        tab.setAttribute('tabindex', '0');
        let tabpanelID = tab.getAttribute('aria-controls');
        let tabpanel = document.getElementById(tabpanelID);
        if (tabpanel === null) {
            throw new Error(`Could not find tabpanel to set active.`);
        }
        tabpanel.removeAttribute('hidden');

        // Set focus when required
        if (setFocus) {
            tab.focus();
        }

        let eventChanged = new Event('fds.tab.changed');
        tab.parentNode.parentNode.parentNode.dispatchEvent(eventChanged);

        let eventOpen = new Event('fds.tab.open');
        tab.dispatchEvent(eventOpen);
    }
}

function keydownEventListener(event) {
    let key = event.key;
    if (key === 'ArrowLeft' || key === 'ArrowRight' || key === 'Home' || key === 'End') {
        event.preventDefault();
        if (event.repeat) {
            return;
        }
        switchTabOnKeyPress(event);
    }
}

/**
 * Either focus the next, previous, first, or last tab
 * depending on key pressed
 */
function switchTabOnKeyPress(event) {
    let pressed = event.key;
    let target = event.target;
    let greatGrandparentNode = target.parentNode.parentNode.parentNode;
    let tabs = getAllTabsInList(target);
    if (direction[pressed]) {
        let index = getIndexOfElementInList(target, tabs);
        if (index !== -1) {
            if (tabs[index + direction[pressed]]) {
                new Tabs(greatGrandparentNode).activateTab(tabs[index + direction[pressed]], true);
            }
            else if (pressed === 'ArrowLeft') {
                new Tabs(greatGrandparentNode).activateTab(tabs[tabs.length - 1], true);
            }
            else if (pressed === 'ArrowRight') {
                new Tabs(greatGrandparentNode).activateTab(tabs[0], true);
            }
        }
    } else if (pressed === 'Home') {
        new Tabs(greatGrandparentNode).activateTab(tabs[0], true);
    } else if (pressed === 'End') {
        new Tabs(greatGrandparentNode).activateTab(tabs[tabs.length - 1], true);
    }
}

/**
 * Get all active tabs in list
 * @param tabContainer parent .tab-container element
 * @returns returns list of active tabs if any
 */
function getActiveTabs(tabContainer) {
    if (tabContainer.querySelector('button.tab-button') !== null) {
        return tabContainer.querySelectorAll('.tab-button[aria-selected=true]');
    } else {
        throw new Error(`tabContainer HTML seems to be missing a tab-button in the tab-container.`);
    }
}

/**
 * Get a list of all button tabs in current tablist
 * @param tab Button tab element
 * @returns {*} return array of tabs
 */
function getAllTabsInList(tab) {
    let greatGrandparentNode = tab.parentNode.parentNode.parentNode;
    if (greatGrandparentNode.classList.contains('tab-container')) {
        return greatGrandparentNode.querySelectorAll('.tab-button');
    } else {
        return [];
    }
}

/**
 * Get index of element in list
 * @param {HTMLElement} element 
 * @param {HTMLCollection} list 
 * @returns {index}
 */
function getIndexOfElementInList(element, list) {
    let index = -1;
    for (let i = 0; i < list.length; i++) {
        if (list[i] === element) {
            index = i;
            break;
        }
    }
    return index;
}

/**
 * Checks if there is a tab hash in the url and activates the tab accordingly
 * @returns {boolean} returns true if tab has been set - returns false if no tab has been set to active
 */
function setActiveHashTab() {
    let hash = location.hash.replace('#', '');
    if (hash !== '' && hash !== "tab-component") {
        let selector = '.tab-button[aria-controls="' + hash + '"]';
        let tab = document.querySelector(selector);
        if (tab !== null) {
            new Tabs(tab.parentNode.parentNode.parentNode).activateTab(tab, false);
            return true;
        }
    }
    return false;
}

export default Tabs;