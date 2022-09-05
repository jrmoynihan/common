<script lang="ts">
	import WritableContextExample from './WritableContextExample.svelte.md';
	import ReadableContextExample from './ReadableContextExample.svelte.md';
	import DerivedContextExample from './DerivedContextExample.svelte.md';
	import type Cat from '../+layout.svelte';
	import { getReadableContext } from '$lib';
	import Code from '$lib/internal/Code.svelte';
	import ExternalLink from '$lib/internal/ExternalLink.svelte';

	const read = getReadableContext<Cat>('dude');
	console.log(`tried reading 'dude'`, $read);
</script>

<section>
	<h3>setReadableContext / getReadableContext</h3>
	<p>
		<Code>setReadableContext</Code> creates a Svelte
		<ExternalLink url={new URL('https://svelte.dev/docs#run-time-svelte-store-readable')}
			>readable store</ExternalLink
		>
		from the provided value, and assigns it to a
		<ExternalLink url={new URL('https://svelte.dev/docs#run-time-svelte-setcontext')}
			>context</ExternalLink
		>
		with the given key for descendant components to look up, using <Code>getReadableContext</Code>.
	</p>
	<p>
		Note: Since these functions internally use a unique Symbol as the key for context lookups, you
		can't use the normal <Code>getContext()</Code> function to obtain their values.
	</p>
	<p>
		<ReadableContextExample />
	</p>
</section>
<section>
	<h3>setWritableContext / getWritableContext</h3>
	<p>
		<Code>setWritableContext</Code> creates a Svelte
		<ExternalLink url={new URL('https://svelte.dev/docs#run-time-svelte-store-writable')}
			>writable store</ExternalLink
		>
		from the provided value, and assigns it to a
		<ExternalLink url={new URL('https://svelte.dev/docs#run-time-svelte-setcontext')}
			>context</ExternalLink
		> with the given key for descendant components to look up, using <Code>getWritableContext</Code>
		(or
		<Code>getReadableContext</Code> -- all stores inherit the Readable interface).
	</p>
	<p>
		<WritableContextExample />
	</p>
</section>
<section>
	<h3>setDerivedContext / getDerivedContext</h3>
	<p>
		<Code>setDerivedContext</Code> creates a Svelte
		<ExternalLink url={new URL('https://svelte.dev/docs#run-time-svelte-store-derived')}
			>derived store</ExternalLink
		>
		from the provided value, and assigns it to a
		<ExternalLink url={new URL('https://svelte.dev/docs#run-time-svelte-setcontext')}
			>context</ExternalLink
		> with the given key for descendant components to look up, using <Code>getDerivedContext</Code>
		(or
		<Code>getReadableContext</Code> -- all stores inherit the Readable interface).
	</p>
	<p>
		<DerivedContextExample />
	</p>
</section>

<style lang="scss">
	section {
		display: grid;
		justify-content: center;
	}
	p {
		max-width: 80ch;
		line-height: 1.2;
	}
</style>
