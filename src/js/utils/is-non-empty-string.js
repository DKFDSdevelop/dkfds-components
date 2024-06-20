export default function isNonEmptyString (s) {
    // If s is falsy, it is not a non-empty string
    if (!s) {
        return false;
    }
    // If s is a string, check that it doesn't contain only whitespace
    else if (typeof s === 'string' || s instanceof String) {
        if (s.trim() === '') {
            return false;
        }
        else {
            return true;
        }
    }
    // s is not a string
    else {
        return false;
    }
}