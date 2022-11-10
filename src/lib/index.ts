// Buttons
import Button from '$lib/buttons/Button.svelte';
import LightDarkToggle from '$lib/buttons/LightDarkToggle.svelte';
import ToggleSwitch from '$lib/buttons/ToggleSwitch.svelte';

// Tooltips
import ActionTooltip from '$tooltip/ActionTooltip.svelte';

// Inputs
import NumericInput from '$inputs/NumericInput.svelte';
import TemporalDateInput from '$inputs/TemporalDateInput.svelte';
import TextInput from '$inputs/TextInput.svelte';
import type { DatalistOption, TextInputTypes } from '$inputs/types.js';

// Navigation
import AnchorHeading from '$navigation/AnchorHeading.svelte';
import LinkableAnchorHeading from '$navigation/LinkableAnchorHeading.svelte';
import Navigation from '$navigation/Navigation.svelte';
import NavLink from '$navigation/NavLink.svelte';
import ScrollProgress from '$navigation/ScrollProgress.svelte';

// Toasts
import SeenToast from '$toasts/SeenToast.svelte';
import { SvelteToast, toast } from '@zerodevx/svelte-toast';

// Wrappers
import Accordion from '$wrappers/Accordion.svelte';
import ErrorModal from '$wrappers/ErrorModal.svelte';
import Modal from '$wrappers/Modal.svelte';
import ModalWithButton from '$wrappers/ModalWithButton.svelte';
import Tabs from '$wrappers/Tabs.svelte';
import Transition from '$wrappers/Transition.svelte';

// Exports
// Functions
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
	getMin,
	getMinDate,
	getRandomBetween,
	getTransitionDurations,
	modulo,
	removeSpecialCharacters,
	splitCamelCase,
	splitSnakeCase
} from '$lib/functions/helpers.js';
export {
	deleteLocalStorageItem,
	getLocalStorageItem,
	setLocalStorageItem
} from '$lib/functions/local-storage.js';
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
} from '$lib/functions/logging.js';
export {
	getDerivedContext,
	getReadableContext,
	getWritableContext,
	setDerivedContext,
	setReadableContext,
	setWritableContext
} from '$lib/functions/store.js';
export { defaultToast, errorToast, reminderToast, type ToastOptions } from '$lib/toasts/toasts.js';
export {
	makeAnchorLinks,
	makeLinks,
	makeNavLinks,
	NavigationLink,
	shouldLayoutTransitionOnNavigation,
	type makeNavLinksOptions
} from '$navigation/nav-functions.js';
export {
	tooltip,
	type TooltipDirections,
	type TooltipParameters
} from '$tooltip/tooltip-action.js';
export { Tab } from '$wrappers/tab.js';
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
