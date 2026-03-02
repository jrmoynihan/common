import { browser } from '$app/environment';
import { Log } from '$functions/logging.js';
import type { BrandedString, JsonifiedObject, PrettifyIntersection } from './helpers.svelte';

/** Branded string type for localStorage keys. Cast key strings when calling storage functions, e.g. `'user_prefs' as StorageKey`. */
export type StorageKey = BrandedString<'StorageKey'>;

/**
 * Returns the stored value as {@link PrettifyIntersection}<{@link JsonifiedObject}<T>> (only JSON-serializable keys).
 * @param key - Must be a {@link StorageKey} (e.g. `'mykey' as StorageKey` or a constant typed as StorageKey)
 */
export const get_local_storage_item = async <T>(
	key: StorageKey
): Promise<PrettifyIntersection<JsonifiedObject<T>> | undefined> => {
	if (browser) {
		const item = localStorage.getItem(key as unknown as string);
		if (item) {
			try {
				const parsed_item = JSON.parse(item);
				return parsed_item as PrettifyIntersection<JsonifiedObject<T>>;
			} catch (error) {
				Log({ msg: `Failed to parse localStorage item "${key}": ${error}` });
				// Optionally remove the corrupted item
				localStorage.removeItem(key as unknown as string);
				return undefined;
			}
		}
	} else {
		Log({ msg: 'unable to check for local storage without the browser available' });
	}
};
/** @param key - Must be a {@link StorageKey} (e.g. `'mykey' as StorageKey` or a constant typed as StorageKey) */
export const set_local_storage_item = async (key: StorageKey, value: unknown): Promise<void> => {
	if (browser) {
		localStorage.setItem(key as unknown as string, JSON.stringify(value));
	} else {
		Log({ msg: 'unable to set item in local storage without the browser available' });
	}
};
/** @param key - Must be a {@link StorageKey} (e.g. `'mykey' as StorageKey` or a constant typed as StorageKey) */
export const delete_local_storage_item = async (key: StorageKey): Promise<void> => {
	if (browser) {
		localStorage.removeItem(key as unknown as string);
	} else {
		Log({ msg: 'unable to delete item in local storage without the browser available' });
	}
};
