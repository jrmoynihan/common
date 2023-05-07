import type { IconSize } from '../lib_types.js';
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
export declare const defaultToast: (input: ToastOptions) => Promise<number>;
export declare const errorToast: (options: ToastOptions) => Promise<number>;
export declare const reminderToast: (input: ToastOptions) => Promise<number>;
export declare const testErrorToast: () => Promise<number>;
