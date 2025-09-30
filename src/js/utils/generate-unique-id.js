export function generateUniqueId() {
    return crypto.getRandomValues(new Uint32Array(1))[0].toString(16);
}

export function generateUniqueIdWithPrefix(str) {
    return str + crypto.getRandomValues(new Uint32Array(1))[0].toString(16);
}