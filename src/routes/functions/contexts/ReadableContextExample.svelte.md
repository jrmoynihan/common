##### Definition

```typescript
// @jrmoynihan/common/functions/store.ts
export function setReadableContext<T>(key: string, value: T): Readable<T> {
	const unique_key = Symbol.for(key);
	return setContext(unique_key, readable<T>(value));
}
export function getReadableContext<T>(key: string): Readable<T> {
	const unique_key = Symbol.for(key);
	return getContext<Readable<T>>(unique_key);
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
	import { setReadableContext } from '@jrmoynihan/common/store';
	import ChildComponent from '/child-component-path/ChildComponent.svelte';

	const myCat: Pet = { name: 'Winston', type: 'cat', breed: 'Maine Coon' };

	// Set a store value of myCat (a typed object) with the key, 'my-cat'.  The function returns a typed readable store.
	const myReadable = setReadableContext('my-cat', myCat);
</script>

<!-- You can use the returned store directly in the current component -->
<p>{$myReadable.breed}</p>

<ChildComponent />
```

```svelte
<!-- ChildComponent.svelte -->
<script lang="ts">
	import { getReadableContext } from '@jrmoynihan/common/store';
	import { Pet } from './ParentComponent.svelte';

	// And you can access the store via its context key.  Provide type-safety by declaring its type <Pet> with the function
	const gotContext = getReadableContext<Pet>('my-cat');
	console.log($gotContext.name); // 'Winston'
</script>
```
