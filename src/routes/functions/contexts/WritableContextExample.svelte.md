##### Definition

```typescript
// @jrmoynihan/common/functions/store.ts
export function setWritableContext<T>(key: string, value: T): Writable<T> {
	const unique_key = Symbol.for(key);
	return setContext(unique_key, writable<T>(value));
}
export function getWritableContext<T>(key: string): Writable<T> {
	const unique_key = Symbol.for(key);
	return getContext<Writable<T>>(unique_key);
}
```

##### Usage

```svelte
<!-- ParentComponent.svelte -->
<script lang="ts" context="module">
	export interface Pet {
		name: string;
		type: string;
		breed: string;
	}
</script>

<script lang="ts">
	import { setWritableContext } from '@jrmoynihan/common/store';
	import ChildComponent from '/child-component-path/ChildComponent.svelte';

	const myCat: Pet = { name: 'Winston', type: 'cat', breed: 'Maine Coon' };

	// Set a store value of myCat (a typed object) with the key, 'my-cat'
	const writableContext = setWritableContext('my-cat', myCat);
</script>

<!-- No prop drilling or bind:prop syntax needed! -->
<ChildComponent />
```

```svelte
<!-- ChildComponent.svelte -->
<script lang="ts">
	import { getReadableContext } from '@jrmoynihan/common/store';

	// A type-safe return of the store.  Typescript can infer the PetCat type.
	const gotContext = getWritableContext<Pet>('my-cat');

	// Now, even without explicitly binding a prop, I can modify this value,
	// just like other writable stores, and have it reflected in its subscribers
	$gotContext.breed = 'Tortoise Shell';
</script>
```
