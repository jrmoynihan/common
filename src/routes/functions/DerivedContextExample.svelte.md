##### Definition
```typescript
// @jrmoynihan/common/functions/store.ts
export function setDerivedContext<S, T>(
	key: string,
	stores: S extends Stores ? any : any,
	callback: (values: StoresValues<S>, set: (value: T) => void) => Unsubscriber | void,
	initial_value?: T
): Readable<T> {
	const unique_key = Symbol.for(key);
	return setContext(unique_key, derived(stores, callback, initial_value));
}
// Note: No difference between getDerivedContext and getReadableContext.  Just an alias!
export function getDerivedContext<T>(key: string): Readable<T> {
	return getReadableContext(key);
}
```
##### Usage
```svelte
<!-- ParentComponent.svelte -->
<script lang='ts'>
    import { setDerivedContext } from '@jrmoynihan/common/store'
    import ChildComponent from '/child-component-path/ChildComponent.svelte'

    // Set some writable or readable stores.  You can assign other contexts too!
    const first = readable(2);
	const second = setWritableContext('second', 10);
	// Place the stores in an array
    const storeArray = [first, second];

    // Provide the store or array of stores to the setDerivedContext function, along with a callback function that determines how the derived store will be set/updated when the passed parameter stores change.
	const product = setDerivedContext(
		'product',
		storeArray,
		// What types of values will the derived store consume?  What method will it use
		([a, b]: [number, number], set: (new_value: number) => void) => {
			const new_number = a * b;
			set(new_number);
		}
	);
</script>

<!-- No prop drilling or bind:prop syntax needed! -->
<ChildComponent />
```
```svelte
<!-- ChildComponent.svelte -->
<script lang='ts'>
    import { getDerivedContext, getWritableContext } from '@jrmoynihan/common/store'

    // A type-safe return of the store.
    const gotContext = getDerivedContext<number>('product')
    const secondNumber = getWritableContext<number>('second')
    console.log($gotContext) // returns 20
    $secondNumber = 20
    console.log($gotContext) // returns 40 upon reacting to the change in the writable store above
</script>
```