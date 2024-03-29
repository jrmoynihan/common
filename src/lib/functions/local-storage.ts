import { browser } from '$app/environment';
import { Log } from '$functions/logging.js';

export const getLocalStorageItem = async <T>(key: string): Promise<T | undefined> => {
	if (browser) {
		const item = localStorage.getItem(key);
		if (item) {
			const parsed_item = JSON.parse(item);
			return parsed_item ?? null;
		}
	} else {
		Log({ msg: 'unable to check for local storage without the browser available' });
	}
};
export const setLocalStorageItem = async (key: string, value: unknown): Promise<void> => {
	if (browser) {
		localStorage.setItem(key, JSON.stringify(value));
	} else {
		Log({ msg: 'unable to set item in local storage without the browser available' });
	}
};
export const deleteLocalStorageItem = async (key: string): Promise<void> => {
	if (browser) {
		localStorage.removeItem(key);
	} else {
		Log({ msg: 'unable to delete item in local storage without the browser available' });
	}
};
