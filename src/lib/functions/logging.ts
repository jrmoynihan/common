import { defaultToast, errorToast, type ToastOptions } from '$lib/toasts/toasts.js';

export interface LogOptions {
	msg: string;
	title?: string;
	icon?: string | null;
	additional_params?: any;
	traceLocation?: boolean;
	use_warning?: boolean;
}
export interface ErrorLogOptions {
	error: Error;
	msg?: string;
	title?: string;
	icon?: string | null;
	additional_params?: any;
}

// Creates a union of the two types for combined usage
export type LogAndToastOptions = ToastOptions & LogOptions;
export type ErrorAndToastOptions = ToastOptions & ErrorLogOptions;

export const ErrorLog = (input: ErrorLogOptions): void => {
	const { error, msg, icon = all_icons.policeCarLight, additional_params } = input;
	let str = icon ? `%c${icon} ` : '%c';
	str += `\n ${msg}\ `;
	let args = [str, defaultConsoleLogStyle, error];
	if (additional_params) args = args.concat(additional_params);
	console.error(...args);
};
export const Log = (input: LogOptions): void => {
	const { msg, icon, title, traceLocation, additional_params, use_warning } = input;
	let str: string = '';
	if (icon && title) {
		str = `%c${icon} ${title} `;
	} else if (icon) {
		str = `%c${icon} `;
	} else if (title) {
		str = `%c${title} `;
	}
	str += `\n ${msg}\ `;
	let args = [str, defaultConsoleLogStyle];

	if (additional_params) args = args.concat(additional_params);

	if (traceLocation) {
		console.trace(...args);
	} else if (additional_params) {
		console.group(...args);
		console.groupEnd();
	} else if (use_warning) {
		console.warn(...args);
	} else {
		console.log(...args);
	}
};

export const WarningLog = (input: LogOptions): void => {
	input.use_warning = true;
	Log(input);
};

export const SuccessLog = (input?: LogOptions): void => {
	let success_input: LogOptions = { ...defaultSuccessLogParams, ...input };
	Log(success_input);
};

export const LogAndToast = (options: LogAndToastOptions): number => {
	Log({ ...options });
	const toastId = defaultToast({ ...options });
	return toastId;
};
export const ErrorAndToast = (options: ErrorAndToastOptions): number => {
	ErrorLog({ ...options });
	const toastId = errorToast({ ...options });
	return toastId;
};
// CSS emoji for console logging (https://unicode.org/emoji/charts/full-emoji-list.html)
export const airplaneDeparture = String.fromCodePoint(0x1f6eb);
export const bomb = String.fromCodePoint(0x1f4a3);
export const butter = String.fromCodePoint(0x1f9c8);
export const bread = String.fromCodePoint(0x1f35e);
export const checkmark = String.fromCodePoint(0x2705);
export const checkeredFlag = String.fromCodePoint(0x1f3c1);
export const detective = String.fromCodePoint(0x1f575);
export const dog = String.fromCodePoint(0x1f415);
export const dogFace = String.fromCodePoint(0x1f436);
export const football = String.fromCodePoint(0x1f3c8);
export const home = String.fromCodePoint(0x1f3e0);
export const hourglass = String.fromCodePoint(0x231b);
export const key = String.fromCodePoint(0x1f511);
export const lock = String.fromCodePoint(0x1f512);
export const wood_log = String.fromCodePoint(0x1fab5);
export const necktie = String.fromCodePoint(0x1f454);
export const okHand = String.fromCodePoint(0x1f44c);
export const pencil = String.fromCodePoint(0x270f);
export const pick = String.fromCodePoint(0x26cf);
export const policeCarLight = String.fromCodePoint(0x1f6a8);
export const stopSign = String.fromCodePoint(0x1f6d1);
export const unlock = String.fromCodePoint(0x1f513);
export const all_icons = {
	okHand,
	policeCarLight,
	pencil,
	key,
	lock,
	unlock,
	pick,
	football,
	checkmark,
	checkeredFlag,
	dog,
	dogFace,
	airplaneDeparture,
	home,
	hourglass,
	stopSign,
	bread,
	bomb,
	detective,
	necktie,
	butter,
	wood_log
};
const defaultSuccessLogParams: LogOptions = {
	icon: checkmark,
	title: 'Success!',
	msg: ''
};

export const defaultConsoleLogStyle = [
	'align-items:center',
	'display:grid',
	'grid-template-columns:repeat(auto-fit, minmax(0,auto))',
	'font-size: 1.5rem',
	'padding: 0.25rem'
].join(';');
