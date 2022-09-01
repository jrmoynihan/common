import { capitalize, arrayFromNumber, delay, clamp } from './helpers.js';
import {
	getLocalStorageItem,
	setLocalStorageItem,
	deleteLocalStorageItem
} from './local-storage.js';
import {
	Log,
	WarningLog,
	ErrorLog,
	LogAndToast,
	ErrorAndToast,
	all_icons,
	defaultConsoleLogStyle,
	type LogOptions,
	type ErrorLogOptions,
	type LogAndToastOptions,
	type ErrorAndToastOptions
} from './logging.js';

export { arrayFromNumber, capitalize, clamp, delay };
export { getLocalStorageItem, setLocalStorageItem, deleteLocalStorageItem };
export {
	Log,
	WarningLog,
	ErrorLog,
	LogAndToast,
	ErrorAndToast,
	all_icons,
	defaultConsoleLogStyle,
	LogOptions,
	ErrorLogOptions,
	LogAndToastOptions,
	ErrorAndToastOptions
};
