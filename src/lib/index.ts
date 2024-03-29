// NOTE: Use fully specified relative imports to point files to their generated type definitions within the Package folder:
// https://kit.svelte.dev/docs/packaging#caveats

// Reexport your entry components here

// Buttons
import Button from './buttons/Button.svelte';
import DragAnchor from './buttons/DragAnchor.svelte';
import LightDarkToggle from './buttons/LightDarkToggle.svelte';
import LightDarkToggleV2 from './buttons/LightDarkToggle_v2.svelte';
import ToggleSwitch from './buttons/ToggleSwitch.svelte';

// Tooltips
import ActionTooltip from './actions/tooltip/ActionTooltip.svelte';

// Inputs
import NumericInput from './inputs/NumericInput.svelte';
import OptionOrGroup from './inputs/OptionOrGroup.svelte';
import Select from './inputs/Select.svelte';
import TemporalDateInput from './inputs/TemporalDateInput.svelte';
import TextInput from './inputs/TextInput.svelte';
import type {
	DatalistOption,
	SelectOption,
	SelectOptionGroup,
	SelectOptionList,
	TextInputTypes
} from './inputs/types.js';

// Navigation
import AnchorHeading from './navigation/AnchorHeading.svelte';
import LinkableAnchorHeading from './navigation/LinkableAnchorHeading.svelte';
import NavLink from './navigation/NavLink.svelte';
import Navigation from './navigation/Navigation.svelte';
import ScrollProgress from './navigation/ScrollProgress.svelte';

// Toasts
import { SvelteToast, toast } from '@zerodevx/svelte-toast';
import type { SvelteToastOptions } from '@zerodevx/svelte-toast/stores';
import SeenToast from './toasts/SeenToast.svelte';

// Wrappers
import Accordion from './wrappers/Accordion.svelte';
import ErrorModal from './wrappers/ErrorModal.svelte';
import Modal from './wrappers/Modal.svelte';
import ModalWithButton from './wrappers/ModalWithButton.svelte';
import Tabs from './wrappers/Tabs.svelte';
import Transition from './wrappers/Transition.svelte';

// Exports
// Functions
export { tutorial } from '$actions/general.js';
export {
	spotlight,
	type SpotlightParameters,
	type SpotlightStep
} from '$actions/spotlight/spotlight.js';
export { Temporal } from '@js-temporal/polyfill';
export { dynamicStyle } from './actions/dynamic-styles.js';
export {
	tooltip,
	type TooltipDirections,
	type TooltipParameters
} from './actions/tooltip/tooltip.js';
export { willChange } from './actions/will-change.js';
export {
	arrayFromNumber,
	capitalize,
	clamp,
	deKebab,
	delay,
	flattenObjectRecursively,
	getAncestors,
	getMax,
	getMaxDate,
	getMaxTemporalZonedDateTime,
	getMin,
	getMinDate,
	getMinTemporalZonedDateTime,
	getRandomBetween,
	getTransitionDurations,
	modulo,
	removeSpecialCharacters,
	splitCamelCase,
	splitSnakeCase
} from './functions/helpers.js';
export {
	deleteLocalStorageItem,
	getLocalStorageItem,
	setLocalStorageItem
} from './functions/local-storage.js';
export {
	ErrorAndToast,
	ErrorLog,
	Log,
	LogAndToast,
	SuccessLog,
	WarningLog,
	all_icons,
	default_log_style,
	type ErrorAndToastOptions,
	type ErrorLogOptions,
	type LogAndToastOptions,
	type LogOptions
} from './functions/logging.js';
export {
	getDerivedContext,
	getReadableContext,
	getWritableContext,
	setDerivedContext,
	setReadableContext,
	setWritableContext
} from './functions/store.js';
export {
	NavigationLink,
	makeAnchorLinks,
	makeLinks,
	makeNavLinks,
	shouldLayoutTransitionOnNavigation,
	type IconLayer,
	type makeNavLinksOptions
} from './navigation/nav-functions.js';
export { defaultToast, errorToast, reminderToast, type ToastOptions } from './toasts/toasts.js';
export { Tab } from './wrappers/tab.js';
export {
	Accordion,
	ActionTooltip,
	AnchorHeading,
	Button,
	DragAnchor,
	ErrorModal,
	LightDarkToggle,
	LightDarkToggleV2,
	LinkableAnchorHeading,
	Modal,
	ModalWithButton,
	NavLink,
	Navigation,
	NumericInput,
	OptionOrGroup,
	ScrollProgress,
	SeenToast,
	Select,
	SvelteToast,
	SvelteToastOptions,
	Tabs,
	TemporalDateInput,
	TextInput,
	ToggleSwitch,
	Transition,
	toast,
	type DatalistOption,
	type SelectOption,
	type SelectOptionGroup,
	type SelectOptionList,
	type TextInputTypes
};
