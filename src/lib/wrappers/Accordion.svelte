<script lang="ts">
	import { tooltip, type TooltipProps } from '$actions/tooltip/tooltip.svelte.js';
	import type { IconDefinition } from '@fortawesome/fontawesome-common-types';
	import { Fa } from '@jrmoynihan/svelte-fa';
	import type { ComponentProps, Snippet } from 'svelte';
	import { cubicInOut } from 'svelte/easing';
	import TransitionRunes from './Transition_Runes.svelte';


	export const toggle = () => (open = !open);

	type AccordionProps = {
		/** A snippet to provide a custom summary section instead of just passing the `summary_text`. */
		summary?: Snippet,
		/** A snippet to provide content within the accordion. */
		content?: Snippet,
		/** The parameters of the transition. */
		transition_props?: ComponentProps<TransitionRunes>,
		/** The position of the expand icon. */
		expand_icon_position?: 'left' | 'right' | 'none',
		/** A custom expand icon. */
		custom_expand_icon?: IconDefinition,
		/** Classes to apply to the expand icon. */
		icon_class?: string,
		/** Custom styles to apply to the summary. */
		custom_summary_styles?: string
		/** Custom styles to apply to the accordion container. */
		custom_accordion_container_styles?: string
		/** The open state of the accordion. */
		open?: boolean
		/** The rotation of the open icon. */
		closed_icon_rotation?: number
		/** The rotation of the closed icon. */
		open_icon_rotation?: number
		/** The parameters of the tooltip. */
		summary_tooltip_parameters?: TooltipProps,
		/** The text of the summary. */
		summary_text?: string
	}
	let {
		summary,
		content,
		transition_props = {
			slide_transition_parameters: { duration: 300, easing: cubicInOut },
		},
		expand_icon_position = 'right',
		custom_expand_icon,
		icon_class = 'fa-CaretDown',
		custom_summary_styles,
		custom_accordion_container_styles,
		open = false,
		closed_icon_rotation = 90,
		open_icon_rotation = -90,
		summary_tooltip_parameters = {
			disabled: true
		},
		summary_text
	} : AccordionProps = $props()
</script>

{#snippet icon(custom_expand_icon)}
	<Fa
	icon={custom_expand_icon}
	class={icon_class}
	rotate={open ? open_icon_rotation : closed_icon_rotation}
	/>
{/snippet}

{#snippet default_expand_icon()}
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
{/snippet}

<div
	class="accordion-container"
	style={custom_accordion_container_styles}
	style:--icon-closed-rotation={`${closed_icon_rotation}deg`}
	style:--icon-open-rotation={`${open_icon_rotation}deg`}
>
	<button
		onclick={toggle}
		use:tooltip={summary_tooltip_parameters}
		class:left-icon={expand_icon_position === 'left'}
		class:right-icon={expand_icon_position === 'right'}
		class:no-icon={expand_icon_position === 'none'}
		aria-expanded={open}
		style={custom_summary_styles}
	>
		{#if custom_expand_icon && expand_icon_position === 'left'}
			{@render icon(custom_expand_icon)}
		{:else if expand_icon_position === 'left'}
			{@render default_expand_icon()}
		{/if}
		
		{#if summary}
			{@render summary()}
		{:else if summary_text}
			{summary_text}
		{/if}
		
		{#if custom_expand_icon && expand_icon_position === 'right'}
			{@render icon(custom_expand_icon)}
		{:else if expand_icon_position === 'right'}
			{@render default_expand_icon()}
		{/if}
	</button>
	<TransitionRunes bind:trigger={open} {...transition_props} >
		{#if content && open}
			{@render content()}
		{/if}
	</TransitionRunes>
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
