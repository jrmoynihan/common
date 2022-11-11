import { all_icons, policeCarLight } from '$functions/logging.js';
import type { IconSize } from '../lib_types.js';
import SeenToast from '$toasts/SeenToast.svelte';
import { toast, type SvelteToastOptions } from '@zerodevx/svelte-toast';
import DefaultToast from './DefaultToast.svelte';

export interface ToastTheme {
	[key: string]: string;
}
export interface ToastOptions {
	id?: number | null;
	title?: string;
	msg?: string | undefined;
	duration?: number;
	progress?: number;
	next?: number;
	initial?: number;
	toastContainerTop?: string;
	toastColor?: string;
	toastBackground?: string;
	toastProgressBackground?: string;
	toastBoxShadow?: string;
	toastBorderRadius?: string;
	toastMsgPadding?: string;
	useSeenToastComponent?: boolean;
	local_storage_key?: string;
	text_styles?: string;
	header_styles?: string;
	toastBarLeft?: string;
	toastBarHeight?: string;
	toastBarWidth?: string;
	toastProgressBorderRadius?: string;
	icon?: string | null;
	icon_size?: IconSize;
	icon_color?: string | null;
	theme?: ToastTheme;
	pausable?: boolean | undefined;
}

export const defaultToast = async (input: ToastOptions) => {
	const {
		title = '',
		msg = undefined,
		duration = 5000,
		progress = 0,
		next = 0,
		initial = 1,
		toastContainerTop = '21rem',
		toastColor = 'var(--background)',
		toastBackground = 'var(--accent)',
		toastProgressBackground = 'var(--text)',
		toastBoxShadow = '0 0 4px 6px hsla(0,0,0,0.4)',
		toastBorderRadius = '5vh',
		toastMsgPadding = '0.75rem',
		useSeenToastComponent = false,
		local_storage_key = 'toast',
		text_styles = '',
		header_styles = '',
		toastBarWidth = '90%',
		toastBarLeft = '5%',
		toastProgressBorderRadius = '5rem',
		toastBarHeight = '4px',
		icon = null,
		icon_size = null,
		icon_color = null,
		pausable = true,
		theme = {
			'--toastContainerTop': `${toastContainerTop}`,
			'--toastColor': `${toastColor}`,
			'--toastBackground': `${toastBackground}`,
			'--toastProgressBackground': `${toastProgressBackground}`,
			'--toastBoxShadow': `${toastBoxShadow}`,
			'--toastBorderRadius': `${toastBorderRadius}`,
			'--toastMsgPadding': `${toastMsgPadding}`,
			'--toastBarLeft': `${toastBarLeft}`,
			'--toastBarWidth': `${toastBarWidth}`,
			'--toastBarHeight': `${toastBarHeight}`,
			'--toastProgressBorderRadius': `${toastProgressBorderRadius}`
		}
	} = input;
	let { id } = input;
	const toast_props = {
		msg,
		title,
		icon,
		icon_size,
		icon_color,
		text_styles,
		header_styles
	};
	const seen_toast_props = { ...toast_props, local_storage_key };

	const toastProps: SvelteToastOptions = {
		component: {
			src: useSeenToastComponent ? SeenToast : DefaultToast,
			props: useSeenToastComponent ? seen_toast_props : toast_props
		},
		duration,
		progress,
		next,
		initial,
		pausable,
		theme,
		msg
	};

	if (id) {
		// console.log(`setting toast #${id}`);

		toast.set({ id, ...toastProps });
	} else {
		// console.log('pushing toast...');

		id = toast.push(toastProps);
	}
	return id;
};

export const errorToast = async (options: ToastOptions) => {
	const id = await defaultToast({
		title: 'Error!',
		toastColor: 'white',
		toastBackground: 'darkred',
		icon: options.icon ?? all_icons.policeCarLight,
		...options
	});
	return id;
};

export const reminderToast = async (input: ToastOptions) => {
	const { title = 'Reminder', duration = 60_000 } = input;
	const id = await defaultToast({
		...input,
		title,
		duration
	});
	return id;
};
export const testErrorToast = async () =>
	await errorToast({ msg: `${policeCarLight} This is a test error. Try to avoid the real thing.` });
