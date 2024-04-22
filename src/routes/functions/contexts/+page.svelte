<script lang="ts">
	import LinkableAnchorHeading from '$navigation/LinkableAnchorHeading.svelte';
	import Code from '$routes/internal/Code.svelte';
	import ExternalLink from '$routes/internal/ExternalLink.svelte';
	import DerivedContextExample from './DerivedContextExample.svelte.md';
	import ReadableContextExample from './ReadableContextExample.svelte.md';
	import WritableContextExample from './WritableContextExample.svelte.md';
</script>

<a id="contexts"><h2>Contexts</h2></a>
<section>
	<LinkableAnchorHeading
		heading_props={{
			id: 'set-get-readable-context',
			text: 'setReadableContext / getReadableContext'
		}}
	/>
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
		can't use the normal <Code>getContext()</Code> function to obtain their values unless you use the
		equivalent key to access it, <Code>getContext(Symbol.for('key'))</Code>.
	</p>
	<p>
		<ReadableContextExample />
	</p>
</section>
<section>
	<LinkableAnchorHeading
		heading_props={{
			id: 'set-get-writable-context',
			text: 'setWritableContext / getWritableContext'
		}}
	/>
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
	<LinkableAnchorHeading
		heading_props={{ id: 'set-get-derived-context', text: 'setDerivedContext / getDerivedContext' }}
	/>
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
	h2 {
		text-align: center;
	}
</style>
