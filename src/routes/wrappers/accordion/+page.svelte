<script lang="ts">
	import { tooltip } from '$lib';
	import Accordion from '$wrappers/Accordion.svelte';
	import AccordionDetails, { type AccordionDetailsProps } from '$wrappers/AccordionDetails.svelte';
	import AccordionJson from '$wrappers/AccordionJSON.svelte';
	import JsonView from '$wrappers/JSONView.svelte';
	import Treecordion from './Treecordion.svelte';

	// const details_styles = 'max-width: max-content;';
	// const summary_styles = 'min-width: min(20rem, 30vw)';

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

	const accordion_configs: AccordionDetailsProps[] = [
		{ summary: 'A minimalistic opacity transition.', icon_position: 'left' },
		{ summary: 'A slide transition.', icon_position: 'right' },
		{ summary: 'A scale transition.', icon_position: 'left' },
		{ summary: 'A blur transition.', icon_position: 'right' },
		{ summary: 'A fly transition.', icon_position: 'left' },
		{ summary: 'A combo transition.', icon_position: 'right' }
	];
	const content_text = `Hello from inside the accordion! Lorem ipsum dolor sit amet, consectetur adipisicing elit.
			Odio repellat veritatis accusamus odit quod distinctio. Adipisci laudantium illum aliquam
			omnis quae dolorum id accusantium assumenda! Nisi ullam aperiam inventore sint.`;
</script>

{#snippet content()}
	<div class="content">
		{content_text}
	</div>
{/snippet}

<div class="accordions">
	{#each accordion_configs as accordion, i}
		<AccordionDetails
			{...accordion}
			name="group_one"
			style="border-radius: 1rem;"
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
