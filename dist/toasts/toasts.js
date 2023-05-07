import { all_icons, policeCarLight } from '../functions/logging.js';
import SeenToast from './SeenToast.svelte';
import { toast } from '@zerodevx/svelte-toast';
import DefaultToast from './DefaultToast.svelte';
export const defaultToast = async (input) => {
    const { title = '', msg = undefined, duration = 5000, progress = 0, next = 0, initial = 1, toastContainerTop = '21rem', toastColor = 'var(--background)', toastBackground = 'var(--accent)', toastProgressBackground = 'var(--text)', toastBoxShadow = '0 0 4px 6px hsla(0,0,0,0.4)', toastBorderRadius = '5vh', toastMsgPadding = '0.75rem', useSeenToastComponent = false, local_storage_key = 'toast', text_styles = '', header_styles = '', toastBarWidth = '90%', toastBarLeft = '5%', toastProgressBorderRadius = '5rem', toastBarHeight = '4px', icon = null, icon_size = null, icon_color = null, pausable = true, theme = {
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
    } } = input;
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
    const toastProps = {
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
    }
    else {
        // console.log('pushing toast...');
        id = toast.push(toastProps);
    }
    return id;
};
export const errorToast = async (options) => {
    const id = await defaultToast({
        title: 'Error!',
        toastColor: 'white',
        toastBackground: 'darkred',
        icon: options.icon ?? all_icons.policeCarLight,
        ...options
    });
    return id;
};
export const reminderToast = async (input) => {
    const { title = 'Reminder', duration = 60_000 } = input;
    const id = await defaultToast({
        ...input,
        title,
        duration
    });
    return id;
};
export const testErrorToast = async () => await errorToast({ msg: `${policeCarLight} This is a test error. Try to avoid the real thing.` });
