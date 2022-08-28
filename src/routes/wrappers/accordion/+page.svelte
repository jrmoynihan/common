<script lang="ts">
	import Accordion from '$lib/wrappers/Accordion.svelte';
	import type { ComponentProps } from 'svelte';
	import { blur, fly, scale } from 'svelte/transition';

	interface IAccordion extends ComponentProps<Accordion> {}
	const custom_accordion_container_styles = 'max-width: 30%';
	const custom_summary_styles = 'min-width: min(20rem, 30vw)';
	const accordion_configs: IAccordion[] = [
		{
			summary_text: 'Classic slide transition',
			custom_summary_styles,
			custom_accordion_container_styles
		},
		{
			summary_text: 'A blurry transition',
			custom_summary_styles,
			custom_accordion_container_styles,
			transition: blur,
			content_tooltip_parameters: { title: 'A content tooltip', position: 'bottom' }
		},
		{
			summary_text: 'A fly-in transition',
			custom_summary_styles,
			custom_accordion_container_styles,
			transition: fly,
			transition_parameters: { y: -20 },
			summary_tooltip_parameters: { title: 'A summary tooltip' }
		}
	];
	const content_text = `Hello from inside the accordion! Lorem ipsum dolor sit amet, consectetur adipisicing elit.
			Odio repellat veritatis accusamus odit quod distinctio. Adipisci laudantium illum aliquam
			omnis quae dolorum id accusantium assumenda! Nisi ullam aperiam inventore sint.`;
</script>

<div class="accordions">
	{#each accordion_configs as accordion}
		<Accordion {...accordion} {custom_accordion_container_styles} {custom_summary_styles}>
			<div class="content" slot="content">
				{content_text}
			</div>
		</Accordion>
	{/each}
</div>

<style lang="scss">
	.accordions {
		display: flex;
		gap: 1rem;
		justify-content: space-evenly;
		margin-top: 1rem;
	}
	.content {
		display: grid;
		place-items: center;
		place-content: center;
		place-self: center;
		text-align: center;
		max-width: 16.5rem;
	}
</style>
