<script module lang="ts">
	export interface AccordionProps extends HTMLButtonAttributes {
		/** A snippet to provide a custom summary section instead of just passing the `summary_text`. */
		summary?: Snippet | string;
		/** Attributes to apply to the `<summary>` element. */
		summary_attributes?: HTMLAttributes<HTMLElement>;
		/** (Bindable) The open state of the accordion. */
		open?: boolean;
		/** The parameters of the transition. */
		transition_props?: TransitionProps;
		/** The position of the expand icon. */
		expand_icon_position?: 'left' | 'right' | 'none';
		/** Props to apply to the expand/collapse icon's component. */
		icon_props?: IconProps;
		/** The rotation of the open icon. */
		closed_icon_rotation?: number;
		/** The rotation of the closed icon. */
		open_icon_rotation?: number;
	}
</script>

<script lang="ts">
	import type { Snippet } from 'svelte';
	import { cubicInOut } from 'svelte/easing';
	import type { HTMLButtonAttributes, HTMLAttributes } from 'svelte/elements';
	import type { TransitionProps } from './Transition_Runes.svelte';
	import Icon, { type IconProps } from '@iconify/svelte';
	export const toggle = () => {
		open = !open;
	};

	let {
		summary,
		summary_attributes,
		children,
		open = $bindable(false),
		transition_props = {
			slide_transition_parameters: { duration: 300, easing: cubicInOut }
		},
		expand_icon_position = 'right',
		icon_props,
		closed_icon_rotation = 90,
		open_icon_rotation = -90,
		...button_attributes
	}: AccordionProps = $props();
</script>

{#snippet icon(icon_props: IconProps)}
	{@const { icon = 'mdi:caret-down', ...rest } = icon_props}
	<Icon rotate={open ? open_icon_rotation : closed_icon_rotation} {icon} {...rest} />
{/snippet}

{#snippet default_expand_icon()}
	<svg
		class:open
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

<button
	{...button_attributes}
	aria-roledescription="accordion"
	aria-expanded={open}
	onclick={toggle}
	class={['accordion-container', button_attributes.class]}
>
	<summary
		class:left-icon={expand_icon_position === 'left'}
		class:right-icon={expand_icon_position === 'right'}
		class:no-icon={expand_icon_position === 'none'}
		{...summary_attributes}
	>
		{#if expand_icon_position === 'left'}
			{#if icon_props}
				{@render icon(icon_props)}
			{:else}
				{@render default_expand_icon()}
			{/if}
		{/if}

		{#if typeof summary !== 'string'}
			{@render summary?.()}
		{:else}
			{summary}
		{/if}

		{#if expand_icon_position === 'right'}
			{#if icon_props}
				{@render icon(icon_props)}
			{:else}
				{@render default_expand_icon()}
			{/if}
		{/if}
	</summary>

	<!--This prevents the accordion from closing when the button's content is clicked, similar to a <details> element-->
	<!--svelte-ignore a11y_no_static_element_interactions -->
	<!--svelte-ignore a11y_click_events_have_key_events-->
	<div
		class="content"
		onclick={(e) => {
			e.stopPropagation();
		}}
	>
		<div class="content-overflow-container">
			{@render children?.()}
		</div>
	</div>
</button>

<style>
	@layer common.accordion {
		.accordion-container {
			--duration: 400ms;
			appearance: none;
			box-sizing: border-box;
			display: grid;
			grid-template-rows: auto auto;
			color: inherit;
			font: inherit;
			cursor: pointer;
			margin: 1rem;
			padding: 1rem;
			border-radius: 1rem;
			border: var(--accordion-button-border, none);
			align-items: unset;
			box-sizing: border-box;
			&[aria-expanded='true'] {
				border-radius: 1rem 1rem 0 0;
				& > .content {
					grid-template-rows: 1fr;
					opacity: 1;
				}
			}
			& > .content {
				grid-row: 2;
				display: grid;
				grid-template-rows: 0fr;
				opacity: 0;
				transition:
					grid-template-rows 400ms ease,
					opacity 400ms ease;
				& > .content-overflow-container {
					display: grid;
					overflow: hidden;
				}
			}
		}
		summary {
			display: grid;
			align-items: center;
			grid-row: 1;

			&.right-icon {
				grid-template-columns: 1fr auto;
			}
			&.left-icon {
				grid-template-columns: auto 1fr;
			}

			&.no-icon {
				grid-template-columns: 1fr;
			}
		}
		svg {
			transition: rotate var(--duration, 400ms) var(--transition-speed, ease);
			rotate: var(--icon-closed-rotation, 0deg);
			&.open {
				rotate: var(--icon-open-rotation, 90deg);
			}
		}
	}
</style>
