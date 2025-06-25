<script lang="ts">
	import Accordion from '$wrappers/Accordion.svelte';
	import AccordionDetails from '$wrappers/AccordionDetails.svelte';
	import AccordionJson from '$wrappers/AccordionJSON.svelte';
	import JsonView from '$wrappers/JSONView.svelte';
	import type { ComponentProps } from 'svelte';
	import Treecordion from './Treecordion.svelte';
	import { tooltip } from '$lib';

	const details_styles = 'max-width: max-content;';
	const summary_styles = 'min-width: min(20rem, 30vw)';

	const value = {
		things: ['one', 2, 'three', 'https://svelte.dev'],
		other_object: {
			nested: true,
			idea: 'test',
			items: ['a', 'b', 'c']
		}
	};
	const test_promise = fetch(
		'https://sports.core.api.espn.com/v2/sports/football/leagues/nfl/events/401671786?lang=en&region=us'
	);

	const accordion_configs: ComponentProps<typeof AccordionDetails>[] = [
		{
			summary: opacity_default
		},
		{
			summary: slide_snippet,
			group_name: 'group_one',
			transition_props: {
				types: ['slide'],
				slide_transition_parameters: { easing: 'ease' }
			}
		},
		{
			summary: scale_snippet,
			group_name: 'group_one',
			transition_props: {
				types: ['scale'],
				symmetrical: false,
				scale_transition_parameters: { initial: 2, out_scale: 0 }
			}
		},
		{
			summary: blur_snippet,
			group_name: 'group_one',
			transition_props: { types: ['blur'] }
		},
		{
			summary: fly_snippet,
			group_name: 'group_one',
			transition_props: { types: ['fly'], symmetrical: false }
		},
		{
			summary: combo_snippet,
			group_name: 'group_one',
			transition_props: {
				types: ['scale', 'blur'],
				origin: 'top left',
				blur_transition_parameters: { duration: 500, amount: 5 },
				symmetrical: false,
				scale_transition_parameters: { duration: 300, initial: 0, out_scale: 3 }
			}
		}
	];
	const content_text = `Hello from inside the accordion! Lorem ipsum dolor sit amet, consectetur adipisicing elit.
			Odio repellat veritatis accusamus odit quod distinctio. Adipisci laudantium illum aliquam
			omnis quae dolorum id accusantium assumenda! Nisi ullam aperiam inventore sint.`;
</script>

{#snippet opacity_default()}
	A minimalistic opacity transition.
{/snippet}
{#snippet slide_snippet()}
	A slide transition.
{/snippet}
{#snippet scale_snippet()}
	An asymmetrical scaling transition.
{/snippet}
{#snippet blur_snippet()}
	A blur transition.
{/snippet}
{#snippet fly_snippet()}
	A asymmetrical fly-in transition.
{/snippet}
{#snippet combo_snippet()}
	A combo transition.
{/snippet}

{#snippet content()}
	<div class="content">
		{content_text}
	</div>
{/snippet}

<div class="accordions">
	{#each accordion_configs as accordion, i}
		<AccordionDetails
			{...accordion}
			style={details_styles}
			summary_attributes={{ style: summary_styles }}
			{@attach tooltip({ content: 'A summary tooltip' })}
		>
			{@render content()}
		</AccordionDetails>
	{/each}
</div>
{#await test_promise}
	<p>Loading test data...</p>
{:then response}
	{#await response.json() then value}
		<Accordion summary="A brief summary">
			<JsonView obj={value} depth={0} />
		</Accordion>
	{/await}
{:catch error}
	<p>{error.message}</p>
{/await}
<AccordionJson {value} />
<Treecordion />

<style>
	.accordions {
		display: flex;
		gap: 2rem;
		margin-block: 1rem;
		flex-wrap: wrap;
		flex-direction: column;
		padding-inline: 1rem;
	}
	.content {
		display: grid;
		place-items: center;
		place-content: center;
		place-self: center;
		text-align: center;
	}
</style>
