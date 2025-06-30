<script module lang="ts">
	export interface AccordionJsonProps extends AccordionDetailsProps {
		value: unknown;
		key?: string;
		open?: boolean;
		level?: number;
	}
</script>

<script lang="ts">
	import { AccordionJson } from '$lib';
	import AccordionDetails, { type AccordionDetailsProps } from './AccordionDetails.svelte';
	import type { TransitionNativeProps } from './TransitionNative_Runes.svelte';

	let {
		value,
		key,
		open = $bindable(false),
		level = 1,
		...accordion_details_props
	}: AccordionJsonProps = $props();

	export const isValidUrl = (testString: string) => {
		try {
			if (testString) {
				new URL(testString);
				return true;
			}
		} catch (error) {
			return false;
		}
	};
	const transition_props: TransitionNativeProps = {
		types: ['slide'],
		slide_transition_parameters: { easing: 'ease' }
	};
</script>

{#if value instanceof Object && Object.entries(value).length > 0}
	<AccordionDetails
		--details-focus-outline={'none'}
		bind:open
		class="json"
		summary_attributes={{ class: 'json' }}
		{transition_props}
		{...accordion_details_props}
	>
		{#snippet custom_icon()}
			{#if value instanceof Array && open}
				{'['}
			{:else if value instanceof Array}
				{`[${value.length} items] `}
			{:else if open && typeof value === 'object'}
				{String.fromCodePoint(0x007b)}
			{:else if value && typeof value === 'object'}
				{String.fromCodePoint(0x007b)}{`${Object.keys(value).length} keys`}{String.fromCodePoint(
					0x007d
				)}
			{/if}
		{/snippet}
		{#snippet summary()}
			{#if key}
				<span class="key">{key}</span>
			{/if}
		{/snippet}
		{#if value instanceof Object}
			<ul>
				{#each Object.entries(value) as [key, v]}
					<li style="--level:{level}">
						<AccordionJson {...accordion_details_props} value={v} level={level + 1} {key} />
					</li>
				{/each}
			</ul>
		{/if}
		{#if value instanceof Array}
			<span class="end-bracket" style="--level:{level}">{']'}</span>
		{:else}
			<span class="end-bracket" style="--level:{level}">{String.fromCodePoint(0x007d)}</span>
		{/if}
	</AccordionDetails>
{:else}
	<span class="key">{key}</span>
	<span class="indent">
		{#if typeof value === 'string' && isValidUrl(value?.toString())}
			<a href={value.toString()}>{value}</a>
		{:else}
			<em>{`<${typeof value}>`}</em> {value}
		{/if}
	</span>
{/if}

<style>
	@layer common.accordiondetails {
		:global(details.json) {
			width: 100%;
			text-align: left;
		}
		:global(details.json > summary.json > label) {
			justify-content: unset;
			gap: 0.5em;
		}
	}

	.key {
		text-decoration: underline;
		font-style: italic;
	}

	.end-bracket {
		margin-inline-start: min(0.5em, 2ch);
	}

	li {
		list-style-type: none;
		margin-block: 1em;
	}
	.indent {
		text-indent: 2ch;
		word-break: break-word;
	}
	a {
		font-weight: 600;
		background-color: var(--link-background-color, var(--background, inherit));
		color: var(--link-color, var(--accent, initial));
		border-radius: 1rem;
		padding: 0 0.5rem;
		text-decoration: underline;
	}
</style>
