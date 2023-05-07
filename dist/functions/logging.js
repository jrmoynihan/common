import { defaultToast, errorToast } from '../toasts/toasts.js';
export const ErrorLog = async (input) => {
    const { error, msg, icon = all_icons.policeCarLight, additional_params } = input;
    let str = icon ? `%c${icon} ` : '%c';
    str += `\n ${msg}\ `;
    let args = [str, default_log_style, error];
    if (additional_params)
        args = args.concat(additional_params);
    console.error(...args);
};
export const Log = async (input) => {
    const { msg, icon, title, traceLocation, additional_params, use_warning, title_styles, msg_styles, icon_styles } = input;
    let str = '';
    if (icon && title) {
        str = `%c${icon} %c${title} `;
    }
    else if (icon) {
        str = `%c${icon} `;
    }
    else if (title) {
        str = `%c${title} `;
    }
    str += `\n %c${msg}\ `;
    let args = [str];
    // Msg styles have a default that can be overridden
    const log_style = `${default_log_style}; ${msg_styles ?? ''}`;
    const icon_style = `${default_icon_style}; ${icon_styles ?? ''}`;
    const title_style = `${default_title_style}; ${title_styles ?? ''}`;
    // Add the provided styles as additional arguments to the console.log function
    if (icon)
        args.push(icon_style);
    if (title)
        args.push(title_style);
    args.push(log_style);
    if (additional_params)
        args.push(additional_params);
    if (traceLocation) {
        console.trace(...args);
    }
    else if (additional_params) {
        console.group(...args);
        console.groupEnd();
    }
    else if (use_warning) {
        console.warn(...args);
    }
    else {
        console.log(...args);
    }
};
export const WarningLog = async (input) => {
    input.use_warning = true;
    await Log(input);
};
export const SuccessLog = async (input) => {
    let success_input = { ...defaultSuccessLogParams, ...input };
    await Log(success_input);
};
export const LogAndToast = async (options) => {
    await Log({ ...options });
    const toastId = await defaultToast({ ...options });
    return toastId;
};
export const ErrorAndToast = async (options) => {
    await ErrorLog({ ...options });
    const toastId = await errorToast({ ...options });
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
const defaultSuccessLogParams = {
    icon: checkmark,
    title: 'Success!',
    msg: ''
};
export const default_log_style = [
    'align-items:center',
    'display:grid',
    'grid-template-columns:repeat(auto-fit, minmax(0,auto))',
    'font-size: 1rem',
    'padding: 0.25rem'
].join(';');
export const default_icon_style = ['font-size: 2rem'];
export const default_title_style = ['font-weight: bold', 'font-size: 1.5rem'].join(';');
