export function validateInputHTML(children) {

    const labels = Array.from(children).filter(child => child.tagName === 'LABEL');
    const inputs = Array.from(children).filter(child => child.tagName === 'INPUT');
    
    if (labels.length !== 1 || inputs.length !== 1) return false;
    
    return true;
}