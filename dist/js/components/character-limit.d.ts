export default CharacterLimit;
/**
 * Show number of characters left in a field
 * @param {HTMLElement} containerElement
 * @param {JSON} strings Translate labels: {"character_remaining": "Du har {value} tegn tilbage", "characters_remaining": "Du har {value} tegn tilbage", "character_too_many": "Du har {value} tegn for meget", "characters_too_many": "Du har {value} tegn for meget"}
 */
declare function CharacterLimit(containerElement: HTMLElement, strings?: JSON): void;
declare class CharacterLimit {
    /**
     * Show number of characters left in a field
     * @param {HTMLElement} containerElement
     * @param {JSON} strings Translate labels: {"character_remaining": "Du har {value} tegn tilbage", "characters_remaining": "Du har {value} tegn tilbage", "character_too_many": "Du har {value} tegn for meget", "characters_too_many": "Du har {value} tegn for meget"}
     */
    constructor(containerElement: HTMLElement, strings?: JSON);
    container: HTMLElement;
    input: Element;
    maxlength: string;
    text: JSON;
    init: () => void;
    charactersLeft(): number;
    updateMessages(): void;
}
//# sourceMappingURL=character-limit.d.ts.map