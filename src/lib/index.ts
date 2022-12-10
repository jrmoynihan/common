// NOTE: Use fully specified relative imports to point files to their generated type definitions within the Package folder:
// https://kit.svelte.dev/docs/packaging#caveats

// Reexport your entry components here

// Buttons
import Button from './buttons/Button.svelte';
import LightDarkToggle from './buttons/LightDarkToggle.svelte';
import ToggleSwitch from './buttons/ToggleSwitch.svelte';

// Tooltips
import ActionTooltip from './tooltip/ActionTooltip.svelte';

// Inputs
import NumericInput from './inputs/NumericInput.svelte';
import TemporalDateInput from './inputs/TemporalDateInput.svelte';
import TextInput from './inputs/TextInput.svelte';
import type { DatalistOption, TextInputTypes } from './inputs/types.js';

// Navigation
import AnchorHeading from './navigation/AnchorHeading.svelte';
import LinkableAnchorHeading from './navigation/LinkableAnchorHeading.svelte';
import Navigation from './navigation/Navigation.svelte';
import NavLink from './navigation/NavLink.svelte';
import ScrollProgress from './navigation/ScrollProgress.svelte';

// Toasts
import { SvelteToast, toast } from '@zerodevx/svelte-toast';
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
export { Temporal } from '@js-temporal/polyfill';
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
	all_icons,
	default_log_style,
	ErrorAndToast,
	ErrorLog,
	Log,
	LogAndToast,
	SuccessLog,
	WarningLog,
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
	makeAnchorLinks,
	makeLinks,
	makeNavLinks,
	NavigationLink,
	shouldLayoutTransitionOnNavigation,
	type IconLayer,
	type makeNavLinksOptions
} from './navigation/nav-functions.js';
export { defaultToast, errorToast, reminderToast, type ToastOptions } from './toasts/toasts.js';
export {
	tooltip,
	type TooltipDirections,
	type TooltipParameters
} from './tooltip/tooltip-action.js';
export type { ButtonProps } from './wrappers/ModalWithButton.svelte';
export { Tab } from './wrappers/tab.js';
export {
	Button,
	LightDarkToggle,
	ToggleSwitch,
	Accordion,
	ErrorModal,
	Modal,
	ModalWithButton,
	Tabs,
	Transition
};
export { TextInput, TemporalDateInput, NumericInput, type TextInputTypes, type DatalistOption };
export { Navigation, NavLink, AnchorHeading, LinkableAnchorHeading, ScrollProgress };
export { SeenToast, SvelteToast, toast };
export { ActionTooltip };
