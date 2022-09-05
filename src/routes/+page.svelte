<script lang="ts">
	import {
		getDerivedContext,
		getReadableContext,
		setDerivedContext,
		setWritableContext
	} from '$lib/functions/store';
	import { writable, type Readable } from 'svelte/store';

	const first = writable(1);
	const second = setWritableContext('second', 10);
	const storeArray = [first, second];
	const product = setDerivedContext(
		'product',
		storeArray,
		// What types of values will the derived store consume?  What method will it use
		([a, b]: [number, number], set: (new_value: number) => void) => {
			const new_number = a * b;
			set(new_number);
		}
	);
	const found = getReadableContext<number>('product');
	const foundAgain: Readable<number> = getDerivedContext<number>('product');
	console.log('got readable context from a derived store', $found, $foundAgain);
</script>

<p>Click on a link to see examples</p>
<button on:click={() => $first++}>first number: {$first}</button>
<button on:click={() => $second++}>second number: {$second}</button>
<output>Product: {$product}</output>

<style lang="scss">
	p {
		margin: auto;
		max-width: max-content;
		font-weight: 400;
		font-style: italic;
	}
</style>
