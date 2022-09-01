import { capitalize, arrayFromNumber, delay, clamp } from './helpers.js';
import { getLocalStorageItem, setLocalStorageItem } from './local-storage.js';
import {
	myLog,
	myWarning,
	myError,
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
export { getLocalStorageItem, setLocalStorageItem };
export {
	myLog,
	myWarning,
	myError,
	LogAndToast,
	ErrorAndToast,
	all_icons,
	defaultConsoleLogStyle,
	LogOptions,
	ErrorLogOptions,
	LogAndToastOptions,
	ErrorAndToastOptions
};
