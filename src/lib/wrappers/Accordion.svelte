<script context='module' lang='ts'>
	export interface AccordionProps extends HTMLAttributes<HTMLElement> {
		/** A snippet to provide a custom summary section instead of just passing the `summary_text`. */
		summary?: Snippet,
		/** The open state of the accordion. */
		open?: boolean
		/** The parameters of the transition. */
		transition_props?: ComponentProps<TransitionRunes>,
		/** The position of the expand icon. */
		expand_icon_position?: 'left' | 'right' | 'none',
		/** Props to apply to the expand/collapse icon's `<Fa>` component. */
		icon_props?: ComponentProps<Fa>,
		/** Custom styles to apply to the summary's `<button>` element that toggles the accordion. */
		summary_button_attributes?: HTMLButtonAttributes
		/** The rotation of the open icon. */
		closed_icon_rotation?: number
		/** The rotation of the closed icon. */
		open_icon_rotation?: number
	}
</script>

<script lang="ts">
	import { Fa } from '@jrmoynihan/svelte-fa';
	import type { ComponentProps, Snippet } from 'svelte';
	import { cubicInOut } from 'svelte/easing';
	import type { HTMLAttributes, HTMLButtonAttributes } from 'svelte/elements';
	import TransitionRunes from './Transition_Runes.svelte';

	export const toggle = () => (open = !open);

	let {
		summary,
		children,
		open = $bindable(false),
		transition_props = {
			slide_transition_parameters: { duration: 300, easing: cubicInOut },
		},
		expand_icon_position = 'right',
		icon_props,
		summary_button_attributes,
		closed_icon_rotation = 90,
		open_icon_rotation = -90,
		...accordion_container_attributes
	} : AccordionProps = $props()
</script>

{#snippet icon(icon_props)}
	<Fa
	class={'fa-CaretDown'}
	rotate={open ? open_icon_rotation : closed_icon_rotation}
	{...icon_props}
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
	style:--icon-closed-rotation={`${closed_icon_rotation}deg`}
	style:--icon-open-rotation={`${open_icon_rotation}deg`}
	{...accordion_container_attributes}
>
	<button
		onclick={toggle}
		class:left-icon={expand_icon_position === 'left'}
		class:right-icon={expand_icon_position === 'right'}
		class:no-icon={expand_icon_position === 'none'}
		aria-expanded={open}
		{...summary_button_attributes}
	>
		{#if icon_props && expand_icon_position === 'left'}
			{@render icon(icon_props)}
		{:else if expand_icon_position === 'left'}
			{@render default_expand_icon()}
		{/if}
		
		{#if summary}
			{@render summary()}
		{/if}
		
		{#if icon_props && expand_icon_position === 'right'}
			{@render icon(icon_props)}
		{:else if expand_icon_position === 'right'}
			{@render default_expand_icon()}
		{/if}
	</button>
	<TransitionRunes bind:trigger={open} {...transition_props} >
		{#if children && open}
			{@render children()}
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
			& :global( > svg) {
				rotate: var(--icon-open-rotation);
			}
		}
	}

	svg {
		transition: rotate 0.2s ease-in;
		rotate: var(--icon-closed-rotation);
	}
</style>
