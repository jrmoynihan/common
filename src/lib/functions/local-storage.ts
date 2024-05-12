import { browser } from '$app/environment';
import { Log } from '$functions/logging.js';

export const get_local_storage_item = async <T>(key: string): Promise<T | undefined> => {
	if (browser) {
		const item = localStorage.getItem(key);
		if (item) {
			const parsed_item = JSON.parse(item);
			return parsed_item as T;
		}
	} else {
		Log({ msg: 'unable to check for local storage without the browser available' });
	}
};
export const set_local_storage_item = async (key: string, value: unknown): Promise<void> => {
	if (browser) {
		localStorage.setItem(key, JSON.stringify(value));
	} else {
		Log({ msg: 'unable to set item in local storage without the browser available' });
	}
};
export const delete_local_storage_item = async (key: string): Promise<void> => {
	if (browser) {
		localStorage.removeItem(key);
	} else {
		Log({ msg: 'unable to delete item in local storage without the browser available' });
	}
};
