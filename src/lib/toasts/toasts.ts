import SeenToast from '$lib/toasts/SeenToast.svelte';
import { toast, type SvelteToastOptions } from '@zerodevx/svelte-toast';
import { all_icons, policeCarLight } from '$lib/functions/logging';
import DefaultToast from './DefaultToast.svelte';
import type { IconSize } from '$lib/lib_types';

export interface ToastTheme {
	[key: string]: string;
}
export interface ToastOptions {
	id?: number | null;
	title?: string;
	msg?: string | null;
	duration?: number;
	toastContainerTop?: string;
	toastColor?: string;
	toastBackground?: string;
	toastProgressBackground?: string;
	toastBoxShadow?: string;
	toastBorderRadius?: string;
	toastMsgPadding?: string;
	useSeenToastComponent?: boolean;
	localStorageKey?: string;
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

export const defaultToast = (input: ToastOptions) => {
	const {
		title = '',
		msg = undefined,
		duration = 5000,
		toastContainerTop = '21rem',
		toastColor = 'var(--background)',
		toastBackground = 'var(--accent)',
		toastProgressBackground = 'var(--text)',
		toastBoxShadow = '0 0 4px 6px hsla(0,0,0,0.4)',
		toastBorderRadius = '5vh',
		toastMsgPadding = '0.75rem',
		useSeenToastComponent = false,
		localStorageKey = 'toast',
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
	const toastProps: SvelteToastOptions = {
		component: {
			src: DefaultToast,
			props: {
				msg,
				title,
				icon,
				icon_size,
				icon_color,
				text_styles,
				header_styles,
				localStorageKey
			}
		},
		duration,
		pausable,
		theme
	};

	if (useSeenToastComponent && toastProps.component) {
		// Change the rendered component
		toastProps.component.src = SeenToast;
	}

	if (id) {
		toast.set(id, toastProps);
	} else {
		id = toast.push(toastProps);
	}
	return id;
};

export const errorToast = (options: ToastOptions) => {
	const id = defaultToast({
		title: 'Error!',
		toastColor: 'white',
		toastBackground: 'darkred',
		icon: options.icon ?? all_icons.policeCarLight,
		...options
	});
	return id;
};

export const reminderToast = (input: ToastOptions) => {
	const { title = 'Reminder', duration = 60_000 } = input;
	const id = defaultToast({
		...input,
		title,
		duration
	});
	return id;
};
export const testErrorToast = () =>
	errorToast({ msg: `${policeCarLight} This is a test error. Try to avoid the real thing.` });
