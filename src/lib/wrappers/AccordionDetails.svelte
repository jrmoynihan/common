<!--
	@component

	AccordionDetails

	AccordionDetails is a wrapper around the `<details>` element.  It allows for the display of content in an accordion-like fashion.
	
-->

<script module lang="ts">
	export interface AccordionDetailsProps extends HTMLDetailsAttributes {
		/** A snippet to provide a custom icon or a string for an Iconify icon. */
		icon?: Snippet | string;
		/** Props to apply to the expand/collapse icon's component. */
		icon_props?: IconProps;
		/** Attributes for the `<summary>` element. */
		summary_attributes?: HTMLAttributes<HTMLElement>;
		/** The position of the expand icon. Defaults to `right`. */
		icon_position?: 'left' | 'right';
		/** The maximum height of the content when closed. Defaults to `0`. */
		max_height_closed?: string;
		/** The maximum height of the content when open. Defaults to `100%`. */
		max_height_open?: string;
		/** Whether the accordion is open. Defaults to `false`. */
		open?: boolean;
		/** A callback function to be called when the accordion is toggled. */
		on_toggle?: (open: boolean) => void;
		/** The summary of the accordion. */
		summary?: string | Snippet;
		/** Whether to show the marker. Defaults to `true`. */
		show_icon?: boolean;
	}
</script>

<script lang="ts">
	import Icon, { type IconProps } from '@iconify/svelte';
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes, HTMLDetailsAttributes } from 'svelte/elements';

	let {
		icon = default_icon,
		icon_props,
		icon_position = 'right',
		open = $bindable(false),
		summary_attributes,
		summary,
		show_icon = true,
		on_toggle,
		children,
		...details_attributes
	}: AccordionDetailsProps = $props();

	// Handle toggle
	function handle_toggle() {
		open = !open;
		on_toggle?.(open);
	}
</script>

{#snippet default_icon()}
	<svg
		xmlns="http://www.w3.org/2000/svg"
		aria-hidden="true"
		role="img"
		width="1em"
		height="1em"
		viewBox="0 0 24 24"
	>
		<path fill="currentColor" d="M8.59 16.58L13.17 12L8.59 7.41L10 6l6 6l-6 6z" class:open />
	</svg>
{/snippet}

<details class={['_details', details_attributes.class]} {...details_attributes}>
	<summary
		onclick={handle_toggle}
		{...summary_attributes}
		class={[
			{ show_icon, right: icon_position === 'right', left: icon_position === 'left' },
			summary_attributes?.class
		]}
	>
		<span style="grid-area: icon;">
			{#if typeof icon === 'string'}
				<Icon {icon} {...icon_props} />
			{:else}
				{@render icon?.()}
			{/if}
		</span>

		<div style="grid-area: summary;">
			{#if typeof summary === 'string'}
				<span class="summary-text">{summary}</span>
			{:else}
				{@render summary?.()}
			{/if}
		</div>
	</summary>
	<hr />
	{@render children?.()}
</details>

<style>
	@layer common.accordiondetails {
		details,
		summary {
			box-sizing: border-box;
		}
		summary,
		summary > * {
			cursor: pointer;
		}
		._details {
			--duration: 500ms;
			--easing: ease;
			--details-max-height-closed: calc(3ch + 0.5rem);
			--details-max-height-open: max-content;
			overflow: hidden;
			transition-property: box-shadow, border-radius;
			transition-duration: var(--duration, 500ms);
			transition-timing-function: var(
				--details-transition-timing-function,
				cubic-bezier(0.33, 0.68, 1)
			);
			border-radius: var(--details-border-radius, var(--border-radius, revert));
			background-color: var(--details-background-color, var(--background, inherit));
			padding: var(--details-padding, 0.25rem 0.5rem);

			&::details-content {
				content-visibility: auto;
				transition-property: block-size, content-visibility;
				transition-duration: var(--duration);
				transition-timing-function: var(--easing);
				transition-behavior: allow-discrete;
				block-size: 0;
			}
			&[open]::details-content {
				block-size: auto;
				block-size: calc-size(auto, size);
			}
			&:hover {
				box-shadow: var(--color-shadow-hover) 0 0 0.5rem;
				outline: var(
					--details-hover-outline,
					ridge
						oklch(
							from var(--details-hover-outline-color, white) l c h /
								var(--details-hover-outline-opacity, 0.5)
						)
				);
			}

			&:focus-within {
				outline: var(--details-focus-outline, ridge);
			}

			&.right-icon {
				grid-template-columns: 1fr auto;
			}
			&.left-icon {
				grid-template-columns: auto 1fr;
			}
			&.no-icon {
				grid-template-columns: 1fr;
			}
			&:has(input.open) {
				border-radius: 1rem 1rem 0 0;
				max-height: var(
					--details-max-height-open,
					110%
				); /* Needs to be a bit larger than the actual size of the content, but still a definite size. */
			}

			/* Remove the default triangle arrow */
			& > summary {
				cursor: pointer;
				list-style: none;
				display: grid;
				gap: 0.5rem;
				align-items: center;
				justify-items: start;
				place-content: start;
				&.show_icon.left {
					grid-template-columns: auto 1fr;
					grid-template-areas: 'icon summary';
				}
				&.show_icon.right {
					grid-template-columns: 1fr auto;
					grid-template-areas: 'summary icon';
				}

				&:focus-visible {
					outline: none;
				}
				&::-webkit-details-marker {
					display: none;
				}
			}
		}

		path {
			transition: rotate var(--duration) var(--easing);
			transform-origin: center;
			&.open {
				rotate: 90deg;
			}
		}
		hr {
			margin: 1rem 0;
			color: var(--border-color, inherit);
		}
	}
</style>
