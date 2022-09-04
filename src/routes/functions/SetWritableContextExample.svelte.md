##### Definition
```typescript
// @jrmoynihan/common/functions/store.ts
export function setWritableContext<T>(key: string, value: T): Writable<T> {
	const unique_key = Symbol.for(key);
	return setContext(unique_key, writable<T>(value));
}
```
##### Usage
```html
<!-- ParentComponent.svelte -->
<script lang='ts'>
    import { setWritableContext, getReadableContext } from '@jrmoynihan/common/store'
    import ChildComponent from '/child-component-path'

    interface PetCat = {
        name: string,
        breed: string
    }
    const myCat : PetCat = {name: 'Winston', breed: 'Maine Coon'}

    // Set a store value of myCat (a typed object) with the key, 'my-cat'
    const writableContext = setWritableContext('my-cat', myCat);
</script>

<ChildComponent />
```
```html
<!-- ChildComponent.svelte -->
<script lang='ts'>
    // A type-safe
    const gotContext = getWritableContext('my-cat')
    console.log($gotContext.name)    // 'Winston'
</script>
```