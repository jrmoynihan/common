<script lang="ts">
	import type { SvelteTransition, SvelteTransitionParams } from '$lib/lib_types.js';
	import { tooltip, type TooltipParameters } from '$lib/tooltip/tooltip-action.js';
	import type { IconDefinition } from '@fortawesome/fontawesome-common-types';
	import Fa from 'svelte-fa';
	import { cubicInOut } from 'svelte/easing';
	import { slide } from 'svelte/transition';
	import Transition from '$lib/wrappers/Transition.svelte';

	export let summary_text: string = '';
	export let expand_icon_position: 'left' | 'right' | 'none' = 'right';
	export let custom_expand_icon: IconDefinition | null = null;
	export let icon_class: string = 'fa-CaretDown';
	export let custom_summary_styles: string = '';
	export let custom_accordion_container_styles: string = '';
	export let open = false;
	export let transition: SvelteTransition = slide;
	export let transition_parameters: SvelteTransitionParams = { duration: 300, easing: cubicInOut };
	export let closed_icon_rotation = 90; // in degrees
	export let open_icon_rotation = -90; // in degrees
	export let summary_tooltip_parameters: TooltipParameters = { disabled: true };
	export let content_tooltip_parameters: TooltipParameters = { disabled: true };

	export const toggle = () => (open = !open);
</script>

<div
	class="accordion-container"
	style={custom_accordion_container_styles}
	style:--icon-closed-rotation={`${closed_icon_rotation}deg`}
	style:--icon-open-rotation={`${open_icon_rotation}deg`}
>
	<button
		on:click={toggle}
		use:tooltip={summary_tooltip_parameters}
		class:left-icon={expand_icon_position === 'left'}
		class:right-icon={expand_icon_position === 'right'}
		class:no-icon={expand_icon_position === 'none'}
		aria-expanded={open}
		tabindex="0"
		style={custom_summary_styles}
	>
		{#if custom_expand_icon && expand_icon_position === 'left'}
			<Fa
				icon={custom_expand_icon}
				class={icon_class}
				rotate={open ? open_icon_rotation : closed_icon_rotation}
			/>
		{:else if expand_icon_position === 'left'}
			<svg
				style="tran"
				width="20"
				height="20"
				fill="none"
				stroke-linecap="round"
				stroke-linejoin="round"
				stroke-width="2"
				viewBox="0 0 24 24"
				stroke="currentColor"><path d="M9 5l7 7-7 7" /></svg
			>
		{/if}
		{#if summary_text !== ''}
			{summary_text}
		{/if}
		<slot name="summary" />
		{#if custom_expand_icon && expand_icon_position === 'right'}
			<Fa
				icon={custom_expand_icon}
				class={icon_class}
				rotate={open ? open_icon_rotation : closed_icon_rotation}
			/>
		{:else if expand_icon_position === 'right'}
			<svg
				style="tran"
				width="20"
				height="20"
				fill="none"
				stroke-linecap="round"
				stroke-linejoin="round"
				stroke-width="2"
				viewBox="0 0 24 24"
				stroke="currentColor"><path d="M9 5l7 7-7 7" /></svg
			>
		{/if}
	</button>
	<Transition
		bind:refresh={open}
		{transition}
		{transition_parameters}
		tooltip_parameters={content_tooltip_parameters}
	>
		{#if open}
			<slot name="content" />
		{/if}
	</Transition>
</div>

<style lang="scss">
	button {
		box-sizing: border-box;
		background: none;
		display: grid;
		color: inherit;
		font: inherit;
		cursor: pointer;
		margin: 0;
		padding: 0.5em;
		gap: 0.5rem;
		justify-items: center;
		align-items: center;
		transition: border-radius 800ms ease-in-out;
		border-radius: 1rem;
		width: 100%;
		border: var(--accordion-button-border, none);
		&.right-icon {
			grid-template-columns: 1fr auto;
		}
		&.left-icon {
			grid-template-columns: auto 1fr;
		}
		&.no-icon {
			grid-template-columns: 1fr;
		}
		&[aria-expanded='true'] {
			border-radius: 1rem 1rem 0 0;
			transition: border-radius 0s ease-in-out;
			& svg {
				rotate: var(--icon-open-rotation);
			}
		}
	}

	svg {
		transition: rotate 0.2s ease-in;
		rotate: var(--icon-closed-rotation);
	}
</style>
