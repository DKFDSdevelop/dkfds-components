'use strict';

export let glossary = {
    'errorText': 'Fejl',
    'editText': 'Rediger',
    'requiredText': 'skal udfyldes',
    'optionalText': 'frivilligt',
    'oneCharacterLeftText': 'Du har {value} tegn tilbage',
    'manyCharactersLeftText': 'Du har {value} tegn tilbage',
    'oneCharacterExceededText': 'Du har {value} tegn for meget',
    'manyCharactersExceededText': 'Du har {value} tegn for meget',
    'maxCharactersText': 'Du kan indtaste op til {value} tegn',
    'tooltipIconText': 'Læs mere'
};

export function updateGlossary(oldGlossary, newGlossary) {
    let keys = Object.keys(newGlossary);
    keys.forEach((key) => {
        if (oldGlossary[key] !== undefined) {
            oldGlossary[key] = newGlossary[key]
        }
    });
}