import { FDSInput } from './custom-elements/fds-input/fds-input';

if (customElements.get('fds-input') === undefined) {
    window.customElements.define('fds-input', FDSInput);
}

export * from './custom-elements/fds-input/fds-input';
