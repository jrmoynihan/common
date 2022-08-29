<script lang="ts">
	import type { SvelteTransition, SvelteTransitionParams } from '$lib/lib_types';
	import { fade, fly } from 'svelte/transition';

	import type { Tab } from './tab';
	import Transition from './Transition.svelte';

	export let tabs: Tab[];
	export let selected_tab: Tab;
	export let transition: SvelteTransition = fade;
	export let in_transition: SvelteTransition = transition;
	export let out_transition: SvelteTransition = transition;
	export let transition_parameters: SvelteTransitionParams = undefined; 
	export let in_transition_parameters: SvelteTransitionParams = undefined;
	export let out_transition_parameters: SvelteTransitionParams = undefined;
	export let tab_container_styles = '';
	export let tab_headers_styles = '';
	export let header_label_styles = '';
	export let header_text_styles = '';

	export const checkForEnterOrSpace = (
		e: KeyboardEvent & { currentTarget: EventTarget & HTMLLabelElement },
		index: number
	) => {
		if (e.code === 'Enter' || e.code === 'Space') {
			selected_tab = tabs[index];
		}
	};
</script>

<div class="tabs-container" style={tab_container_styles}>
	<div class="tab-headers" style={tab_headers_styles}>
		{#if tabs}
			{#each tabs as tab, i}
				<label
					style={header_label_styles}
					class:active={tab === selected_tab}
					for={tab.name}
					tabindex="0"
					on:keypress={(e) => checkForEnterOrSpace(e, i)}
				>
					<input type="radio" bind:group={selected_tab} value={tab} id={tab.name} />
					<h3 style={header_text_styles}>{tab.name}</h3>
				</label>
			{/each}
		{/if}
	</div>
	{#if selected_tab}
		<Transition
			refresh={selected_tab}
			{transition}
			{transition_parameters}
			{in_transition}
			{in_transition_parameters}
			{out_transition}
			{out_transition_parameters}
			inner_container_styles={'margin: 1rem'}
		>
			<svelte:component this={selected_tab?.component} {selected_tab} />
		</Transition>
	{/if}
	<slot name="tab-footer" />
</div>

<style lang="scss">
	.tabs-container {
		grid-template-rows: max-content max-content;
		margin: 1rem 0;
	}
	label {
		box-sizing: border-box;
		align-items: center;
		box-shadow: 0 0 2px 2px hsla(0, 0%, 0%, 0.3);
		cursor: pointer;
		display: grid;
		font-weight: bold;
		padding: 1rem;
		height: 100%;
		// &.active.light {
		// 	@include active($color: var(--background));
		// }
		// &.active.dark {
		// 	@include active($backgroundAlpha: 0.4);
		// }
	}
	.tab-headers {
		// @include rounded;
		align-items: center;
		display: grid;
		gap: 0.2em;
		grid-template-columns: repeat(auto-fit, minmax(15ch, auto));
		& > label:first-of-type {
			border-radius: 1rem 0 0 1rem;
		}
		& > label:last-of-type {
			border-radius: 0 1rem 1rem 0;
		}
		// & > label.mobile {
		// 	border-radius: 1rem;
		// }
		// & > label:hover:not(.active),
		// & > label:focus-within:not(.active) {
		// 	&.dark {
		// 		background-color: hsla(var(--accent-value, hsl(37, 75%, 65%)), 20%);
		// 	}
		// 	&.light {
		// 		background-color: hsla(var(--accent-value, forestgreen), 60%);
		// 		color: var(--background);
		// 	}
		// }
	}

	input[type='radio'] {
		visibility: hidden;
		display: none;
	}
</style>
