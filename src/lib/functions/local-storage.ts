import { browser } from '$app/environment';
import { myLog } from '$lib/functions';

export const getLocalStorageItem = async <T>(key: string): Promise<any> => {
	if (browser) {
		const item = localStorage.getItem(key);
		if (item) {
			const parsed_item = JSON.parse(item);
			return parsed_item ?? null;
		}
	} else {
		myLog({ msg: 'unable to check for local storage without the browser available' });
	}
};
export const setLocalStorageItem = async (key: string, value: unknown): Promise<void> => {
	if (browser) {
		localStorage.setItem(key, JSON.stringify(value));
	} else {
		myLog({ msg: 'unable to set item in local storage without the browser available' });
	}
};
