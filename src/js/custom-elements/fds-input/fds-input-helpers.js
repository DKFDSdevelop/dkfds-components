'use strict';

/* 
FUNCTIONS FOR DEFAULT SETTINGS
*/

export function setDefaultInputId(labelElement, inputElement) {
    let randomString = 'input-' + Date.now().toString().slice(-3) + Math.floor(Math.random() * 1000000).toString();
    labelElement.setAttribute('for', randomString);
    inputElement.setAttribute('id', randomString);
}

export function setDefaultType(inputElement) {
    inputElement.setAttribute('type', 'text');
}

/* 
CHARACTER LIMIT
*/

function characterLimitMessage(glossary, charactersLeft) {
    let message = "";

    if (charactersLeft === -1) {
        let exceeded = Math.abs(charactersLeft);
        message = glossary['oneCharacterExceededText'].replace(/{value}/, exceeded);
    }
    else if (charactersLeft === 1) {
        message = glossary['oneCharacterLeftText'].replace(/{value}/, charactersLeft);
    }
    else if (charactersLeft >= 0) {
        message = glossary['manyCharactersLeftText'].replace(/{value}/, charactersLeft);
    }
    else {
        let exceeded = Math.abs(charactersLeft);
        message = glossary['manyCharactersExceededText'].replace(/{value}/, exceeded);
    }

    return message;
}

export function updateVisibleMessage(glossary, charactersLeft, inputElement, characterLimitElement) {
    let newMessage = characterLimitMessage(glossary, charactersLeft);
    let visibleMessage = characterLimitElement.querySelector('.visible-message');

    if (charactersLeft < 0) {
        visibleMessage.classList.add('limit-exceeded');
        inputElement.classList.add('form-limit-error');
    }
    else {
        visibleMessage.classList.remove('limit-exceeded');
        inputElement.classList.remove('form-limit-error');
    }

    visibleMessage.innerHTML = newMessage;
}

export function updateSRMessage(glossary, charactersLeft, characterLimitElement) {
    let newMessage = characterLimitMessage(glossary, charactersLeft);
    let srMessage = characterLimitElement.querySelector('.sr-message');
    srMessage.innerHTML = newMessage;
}

/* 
REMAINING HELPERS
*/

export function setHelptextId(helptextElement, inputElement) {
    helptextElement.id = inputElement.id + '-helptext';
}

export function setErrorId(errorElement, inputElement) {
    errorElement.id = inputElement.id + '-error';
}

export function setCharacterLimitId(characterLimitElement, inputElement) {
    characterLimitElement.querySelector('.max-limit').id = inputElement.id + '-limit';
}

export function setTooltipId(tooltipElement, inputElement) {
    tooltipElement.dataset.tooltipId = inputElement.id + '-tooltip';;
}

export function updateErrorMessage(errorElement, errorText, srText) {
    errorElement.innerHTML = '<span class="sr-only">' + srText + ': </span>' + errorText;
}

export function updateEditButton(editButtonElement, labelText, editText) {
    editButtonElement.innerHTML = '<svg class="icon-svg" focusable="false" aria-hidden="true"><use xlink:href="#mode"></use></svg>' + editText + '<span class="sr-only"> ' + labelText + '</span>';
}

export function updateRequiredLabel(labelElement, labelText, requiredText) {
    labelElement.innerHTML = labelText + '<span class="weight-normal"> (*' + requiredText + ')</span>';
}

export function updateOptionalLabel(labelElement, labelText, optionalText) {
    labelElement.innerHTML = labelText + '<span class="weight-normal"> (' + optionalText + ')</span>';
}