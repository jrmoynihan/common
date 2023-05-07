import { getContext, setContext } from 'svelte';
import { derived, readable, writable } from 'svelte/store';
export function setWritableContext(key, value, start) {
    const unique_key = Symbol.for(key);
    return setContext(unique_key, writable(value, start));
}
export function getWritableContext(key) {
    const unique_key = Symbol.for(key);
    return getContext(unique_key);
}
export function setReadableContext(key, value, start) {
    const unique_key = Symbol.for(key);
    return setContext(unique_key, readable(value, start));
}
export function getReadableContext(key) {
    const unique_key = Symbol.for(key);
    return getContext(unique_key);
}
export function setDerivedContext(key, stores, callback, initial_value) {
    const unique_key = Symbol.for(key);
    return setContext(unique_key, derived(stores, callback, initial_value));
}
export function getDerivedContext(key) {
    return getReadableContext(key);
}
export function asyncGet(store) {
    return new Promise((resolve) => {
        store.subscribe((value) => {
            resolve(value);
        });
    });
}
