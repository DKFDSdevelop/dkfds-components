'use strict';

// Custom elements
import registerAccordion from './custom-elements/accordion/fds-accordion';
import registerAccordionGroup from './custom-elements/accordion/fds-accordion-group';
import registerInput from './custom-elements/input/fds-input';
import registerHelpText from './custom-elements/help-text/fds-help-text';
import registerCharacterLimit from './custom-elements/character-limit/fds-character-limit';
import registerErrorMessage from './custom-elements/error-message/fds-error-message';
import registerCheckbox from './custom-elements/checkbox/fds-checkbox';
import registerCheckboxGroup from './custom-elements/checkbox/fds-checkbox-group';
import registerRadioButton from './custom-elements/radio-button/fds-radio-button';
import registerRadioButtonGroup from './custom-elements/radio-button/fds-radio-button-group';
import registerDateInput from './custom-elements/date-input/fds-date-input';
import registerSelect from './custom-elements/select/fds-select';
import registerUploadFile from './custom-elements/upload-file/fds-upload-file';
import registerFileItem from './custom-elements/upload-file/fds-file-item';
import registerDatePicker from './custom-elements/date-picker/fds-date-picker';
import registerDatePickerGrid from './custom-elements/date-picker/fds-date-picker-grid';
import registerTextarea from './custom-elements/textarea/fds-textarea';
import registerErrorSummary from './custom-elements/error-summary/fds-error-summary';
import registerInputAffix from './custom-elements/input-affix/input-affix';
import registerDrawer from './custom-elements/header/fds-drawer';
import registerDrawerOpener from './custom-elements/header/fds-drawer-opener';
import registerPortalInfo from './custom-elements/header/fds-portal-info';
import registerSolutionInfo from './custom-elements/header/fds-solution-info';
import registerDropdownMenu from './custom-elements/dropdown-menu/fds-dropdown-menu';
import registerMainMenu from './custom-elements/header/fds-main-menu';
import registerTooltip from './custom-elements/tooltip/fds-tooltip';
import registerTooltipIcon from './custom-elements/tooltip/fds-tooltip-icon';
import registerToggleSwitch from './custom-elements/toggle-switch/fds-toggle-switch';

const registerCustomElements = () => {
    registerAccordion();
    registerAccordionGroup();
    registerInput();
    registerHelpText();
    registerCharacterLimit();
    registerErrorMessage();
    registerCheckbox();
    registerCheckboxGroup();
    registerRadioButton();
    registerRadioButtonGroup();
    registerDateInput();
    registerSelect();
    registerDatePicker();
    registerDatePickerGrid();
    registerTextarea();
    registerUploadFile();
    registerFileItem();
    registerErrorSummary();
    registerInputAffix();
    registerDrawer();
    registerDrawerOpener();
    registerPortalInfo();
    registerSolutionInfo();
    registerDropdownMenu();
    registerMainMenu();
    registerTooltip();
    registerTooltipIcon();
    registerToggleSwitch();
};

registerCustomElements();

export { registerCustomElements, registerAccordion, registerAccordionGroup, registerInput, registerHelpText, registerCharacterLimit, registerErrorMessage, registerCheckbox, registerCheckboxGroup, registerRadioButton, registerRadioButtonGroup, registerDateInput, registerSelect, registerUploadFile, registerFileItem, registerDatePicker, registerDatePickerGrid, registerTextarea, registerErrorSummary, registerInputAffix, registerDrawer, registerDrawerOpener, registerPortalInfo, registerSolutionInfo, registerDropdownMenu, registerMainMenu, registerTooltip, registerTooltipIcon, registerToggleSwitch };