import { all_icons, police_car_light } from '$functions/logging.js';
import SeenToast from '$toasts/SeenToast.svelte';
import { toast, type SvelteToastOptions } from '@zerodevx/svelte-toast';
import type { IconSize } from '../lib_types.js';
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
	toast_container_top?: string;
	toast_color?: string;
	toast_background?: string;
	toast_progress_background?: string;
	toast_box_shadow?: string;
	toast_border_radius?: string;
	toast_msg_padding?: string;
	use_seen_toast_component?: boolean;
	local_storage_key?: string;
	text_styles?: string;
	header_styles?: string;
	toast_bar_left?: string;
	toast_bar_height?: string;
	toast_bar_width?: string;
	toast_progress_border_radius?: string;
	icon?: string | null;
	icon_size?: IconSize;
	icon_color?: string | null;
	theme?: ToastTheme;
	pausable?: boolean | undefined;
}

export const default_toast = async (input: ToastOptions) => {
	const {
		title = '',
		msg = undefined,
		duration = 5000,
		progress = 0,
		next = 0,
		initial = 1,
		toast_container_top = '21rem',
		toast_color = 'var(--background)',
		toast_background = 'var(--accent)',
		toast_progress_background = 'var(--text)',
		toast_box_shadow = '0 0 4px 6px hsla(0,0,0,0.4)',
		toast_border_radius = '5vh',
		toast_msg_padding = '0.75rem',
		use_seen_toast_component = false,
		local_storage_key = 'toast',
		text_styles = '',
		header_styles = '',
		toast_bar_width = '90%',
		toast_bar_left = '5%',
		toast_progress_border_radius = '5rem',
		toast_bar_height = '4px',
		icon = null,
		icon_size = null,
		icon_color = null,
		pausable = true,
		theme = {
			'--toastContainerTop': `${toast_container_top}`,
			'--toastColor': `${toast_color}`,
			'--toastBackground': `${toast_background}`,
			'--toastProgressBackground': `${toast_progress_background}`,
			'--toastBoxShadow': `${toast_box_shadow}`,
			'--toastBorderRadius': `${toast_border_radius}`,
			'--toastMsgPadding': `${toast_msg_padding}`,
			'--toastBarLeft': `${toast_bar_left}`,
			'--toastBarWidth': `${toast_bar_width}`,
			'--toastBarHeight': `${toast_bar_height}`,
			'--toastProgressBorderRadius': `${toast_progress_border_radius}`
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
			src: use_seen_toast_component ? SeenToast : DefaultToast,
			props: use_seen_toast_component ? seen_toast_props : toast_props
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

export const error_toast = async (options: ToastOptions) => {
	const id = await default_toast({
		title: 'Error!',
		toast_color: 'white',
		toast_background: 'darkred',
		icon: options.icon ?? all_icons.police_car_light,
		...options
	});
	return id;
};

export const reminder_toast = async (input: ToastOptions) => {
	const { title = 'Reminder', duration = 60_000 } = input;
	const id = await default_toast({
		...input,
		title,
		duration
	});
	return id;
};
export const test_error_toast = async () =>
	await error_toast({
		msg: `${police_car_light} This is a test error. Try to avoid the real thing.`
	});
