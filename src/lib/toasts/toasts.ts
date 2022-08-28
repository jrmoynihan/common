import SeenToast from './SeenToast.svelte';
import { toast } from '@zerodevx/svelte-toast';
import { all_icons, policeCarLight } from '../functions/logging';

export type myToastOptions = {
	id?: number | null;
	title?: string;
	msg?: string;
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
	textFontWeight?: string;
	toastBarLeft?: string;
	toastBarHeight?: string;
	toastBarWidth?: string;
	toastProgressBorderRadius?: string;
	icon?: string | null;
};

export const defaultToast = ({
	id = null,
	title = '',
	msg = '',
	duration = 5000,
	toastContainerTop = '21rem',
	toastColor = 'var(--background)',
	toastBackground = 'var(--accent)',
	toastProgressBackground = 'var(--text)',
	toastBoxShadow = '0 0 4px 6px hsla(0,0,0,0.4)',
	toastBorderRadius = '5vh',
	toastMsgPadding = '1.5rem 2rem',
	useSeenToastComponent = false,
	localStorageKey = 'toast',
	textFontWeight = '600',
	toastBarWidth = '90%',
	toastBarLeft = '5%',
	toastProgressBorderRadius = '5rem',
	toastBarHeight = '4px',
	icon = null
}: myToastOptions) => {
	const msgBuilder = `<div style="display:grid;grid-template-columns:minmax(0,auto);text-align:center;font-weight:${textFontWeight}">
						<h3>
							${icon ?? ''} ${title}
						</h3>
						<section style="overflow:auto;word-wrap:anywhere;">
							${msg}
						</section>
					</div>`;
	const theme = {
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
	};

	if (useSeenToastComponent) {
		if (id) {
			toast.set(id, {
				msg,
				component: {
					src: SeenToast,
					props: { msgMarkup: msgBuilder, localStorageKey: localStorageKey }
				},
				duration: duration,
				pausable: true,
				theme: theme
			});
		} else {
			id = toast.push(msg, {
				component: {
					src: SeenToast,
					props: { msgMarkup: msgBuilder, localStorageKey: localStorageKey }
				},
				duration: duration,
				pausable: true,
				theme: theme
			});
		}
	} else if (id) {
		toast.set(id, {
			msg: msgBuilder,
			duration: duration,
			pausable: true,
			theme: theme
		});
	} else {
		id = toast.push(msgBuilder, {
			duration: duration,
			pausable: true,
			theme: theme
		});
	}
	return id;
};

export const errorToast = (options: myToastOptions) => {
	const id = defaultToast({
		title: 'Error!',
		toastColor: 'white',
		toastBackground: 'darkred',
		icon: options.icon ?? all_icons.policeCarLight,
		...options
	});
	return id;
};

export const reminderToast = (title: string, msg: string, useSeenToastComponent = true) => {
	const id = defaultToast({
		title,
		msg,
		duration: 200_000,
		textFontWeight: '600',
		useSeenToastComponent
	});
	return id;
};
export const testErrorToast = () =>
	errorToast({ msg: `${policeCarLight} This is a test error. Try to avoid the real thing.` });
