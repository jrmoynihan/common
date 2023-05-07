import { type Readable, type StartStopNotifier, type Unsubscriber, type Writable } from 'svelte/store';
/** One or more `Readable`s. */
declare type Stores = Readable<any> | [Readable<any>, ...Array<Readable<any>>] | Array<Readable<any>>;
/** One or more values from `Readable` stores. */
declare type StoresValues<T> = T extends Readable<infer U> ? U : {
    [K in keyof T]: T[K] extends Readable<infer U> ? U : never;
};
export declare function setWritableContext<T>(key: string, value: T, start?: StartStopNotifier<T>): Writable<T>;
export declare function getWritableContext<T>(key: string): Writable<T>;
export declare function setReadableContext<T>(key: string, value: T, start?: StartStopNotifier<T>): Readable<T>;
export declare function getReadableContext<T>(key: string): Readable<T>;
export declare function setDerivedContext<S, T>(key: string, stores: S extends Stores ? any : any, callback: (values: StoresValues<S>, set: (value: T) => void) => Unsubscriber | void, initial_value?: T): Readable<T>;
export declare function getDerivedContext<T>(key: string): Readable<T>;
export declare function asyncGet<T>(store: Readable<T>): Promise<T>;
export {};
