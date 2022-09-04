import { getContext, setContext } from 'svelte';
import { readable, writable, type Readable, type Writable } from 'svelte/store';

export function setWritableContext<T>(key: string, value: T): Writable<T> {
	const unique_key = Symbol.for(key);
	return setContext(unique_key, writable<T>(value));
}
export function getWritableContext<T>(key: string): Writable<T> {
	const unique_key = Symbol.for(key);
	return getContext<Writable<T>>(unique_key);
}
export function setReadableContext<T>(key: string, value: T): Readable<T> {
	const unique_key = Symbol.for(key);
	return setContext(unique_key, readable<T>(value));
}
export function getReadableContext<T>(key: string): Readable<T> {
	const unique_key = Symbol.for(key);
	return getContext<Readable<T>>(unique_key);
}
