'use strict';

import {isValidText, isValidInteger} from './fds-input-attribute-validators';

/* Functions for initial creation of fds-input elements */

export function createWrapperElement() {
    let wrapperElement = document.createElement('div');
    wrapperElement.classList.add('form-group');
    return wrapperElement;
}

export function createLabelElement() {
    let labelElement = document.createElement('label');
    labelElement.classList.add('form-label');
    return labelElement;
}

export function createTooltipElement(glossary) {
    let tooltipElement = document.createElement('span');
    tooltipElement.classList.add('tooltip-wrapper', 'custom-element-tooltip', 'ml-2');
    tooltipElement.dataset.tooltip = '';
    tooltipElement.dataset.tooltipId = '';
    tooltipElement.dataset.position = 'above';
    tooltipElement.dataset.trigger = 'click';
    tooltipElement.innerHTML = 
        '<button class="button button-unstyled tooltip-target" type="button" aria-label="' + glossary['tooltipIconText'] + '">' + 
            '<svg class="icon-svg mr-0 mt-0" focusable="false" aria-hidden="true"><use xlink:href="#help"></use></svg>' + 
        '</button>';
    return tooltipElement;
}

export function createHelptextElement() {
    let helptextElement = document.createElement('span');
    helptextElement.classList.add('form-hint');
    return helptextElement;
}

export function createErrorElement() {
    let errorElement = document.createElement('span');
    errorElement.classList.add('form-error-message');
    return errorElement;
}

export function createEditWrapperElement() {
    let editWrapperElement = document.createElement('div');
    editWrapperElement.classList.add('edit-wrapper');
    return editWrapperElement;
}

export function createInputWrapperElement() {
    let inputWrapperElement = document.createElement('div');
    inputWrapperElement.classList.add('form-input-wrapper');
    return inputWrapperElement;
}

export function createPrefixElement() {
    let prefixElement = document.createElement('div');
    prefixElement.classList.add('form-input-prefix');
    prefixElement.setAttribute('aria-hidden', 'true');
    return prefixElement;
}

export function createInputElement() {
    let inputElement = document.createElement('input');
    inputElement.classList.add('form-input');
    return inputElement;
}

export function createSuffixElement() {
    let suffixElement = document.createElement('div');
    suffixElement.classList.add('form-input-suffix');
    suffixElement.setAttribute('aria-hidden', 'true');
    return suffixElement;
}

export function createEditButtonElement(handleEditClicked) {
    let editButtonElement = document.createElement('button');
    editButtonElement.setAttribute('type', 'button');
    editButtonElement.classList.add('function-link', 'edit-button');
    editButtonElement.addEventListener('click', handleEditClicked, false);
    return editButtonElement;
}

export function createCharacterLimitElement() {
    let characterLimitElement = document.createElement('div');
    characterLimitElement.classList.add('character-limit-wrapper');
    characterLimitElement.innerHTML = 
        '<span class="max-limit"></span>' + 
        '<span class="visible-message form-hint" aria-hidden="true"></span>' + 
        '<span class="sr-message" aria-live="polite"></span>';
    return characterLimitElement;
}

/* Functions for rebuilding fds-input */

export function setInputAriaDescribedBy(error, helptext, maxchar, errorElement, helptextElement, characterLimitElement, inputElement) {
    let ariaDescribedBy = '';
    if (isValidText(error)) {
        ariaDescribedBy = ariaDescribedBy + errorElement.id + ' ';
    }
    if (isValidText(helptext)) {
        ariaDescribedBy = ariaDescribedBy + helptextElement.id + ' ';
    }
    if (isValidInteger(maxchar)) {
        ariaDescribedBy = ariaDescribedBy + characterLimitElement.querySelector('.max-limit').id + ' ';
    }
    if (ariaDescribedBy.trim() !== '') {
        inputElement.setAttribute('aria-describedby', ariaDescribedBy.trim());
    }
}