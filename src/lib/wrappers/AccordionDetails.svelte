<!--
	@component

	AccordionDetails

	AccordionDetails is a wrapper around the `<details>` element.  It allows for the display of content in an accordion-like fashion.
	
-->

<script context="module" lang="ts">
	export  interface AccordionDetailsProps extends HTMLDetailsAttributes {
	/** How many degrees to rotate the icon when closed. Defaults to 0. */
	closed_icon_rotation?: number;
	/** The icon to display. */
	icon?: IconDefinition;
	/** A custom icon snippet. */
	custom_icon?: Snippet;
	/** Attributes for the `<summary>` element. */
	summary_attributes?: HTMLAttributes<HTMLElement>;
	/** Text to display within the `<summary>` element. */
	summary_text?: string;
	/** Classes to apply to the `<details>` element. */
	details_classes?: string;
	/** The position of the expand icon. Defaults to `right`. */
	expand_icon_position?: "left" | "right" | "none";
	/** The class of the expand icon. Defaults to `fa-CaretDown`. */
	icon_class?: string;
	/** The maximum height of the content when closed. Defaults to `0`. */
	max_height_closed?: string;
	/** The maximum height of the content when open. Defaults to `100%`. */
	max_height_open?: string;
	/** Whether the accordion is open. Defaults to `false`. */
	open?: boolean;
	/** How many degrees to rotate the icon when open. Defaults to `90`. */
	open_icon_rotation?: number;
	/** The summary of the accordion. */
	summary_content?: Snippet;
	/** Parameters for the summary tooltip. Defaults to `{ disabled: true }`.*/
	summary_tooltip_parameters?: TooltipProps;
	/**
	 * Parameters for the content transition. Defaults to `{ slide_transition_parameters: { duration: '500ms', easing: 'ease' } }`.
	 *  Available transitions are `fly`, `fade`, `blur`, `slide`, and `scale`. See the {@link TransitionNative_Runes.svelte} component.
	 **/
	transition_props?: ComponentProps<TransitionNativeRunes>;
	/** If only details in a group should open at a time, set a name for the group */
	group_name?: string;
};
</script>

<script lang="ts">
import {
	tooltip,
	type TooltipProps,
} from "$actions/tooltip/tooltip.svelte.js";
import type { IconDefinition } from "@fortawesome/fontawesome-common-types";
import { Fa } from "@jrmoynihan/svelte-fa";
import type { ComponentProps, Snippet } from "svelte";
import type { HTMLAttributes, HTMLDetailsAttributes } from "svelte/elements";
import TransitionNativeRunes from "./TransitionNative_Runes.svelte";

let {
	closed_icon_rotation = 0,
	children,
	icon,
	custom_icon,
	details_classes = "",
	expand_icon_position = "right",
	icon_class = "fa-CaretDown",
	max_height_closed = "calc(3ch + 0.5rem)",
	max_height_open = "calc(100% + 1rem)",
	open = $bindable(false),
	open_icon_rotation = 90,
	summary_attributes: summary_styles,
	summary_attributes,
	summary_text,
	summary_content,
	transition_props = {
		slide_transition_parameters: { duration: 500, easing: "ease" },
	},
	summary_tooltip_parameters = {
		disabled: true,
	},
	group_name,
	...details_attributes
} : AccordionDetailsProps = $props();

const id = crypto.randomUUID();
let toggle: HTMLInputElement | undefined = $state();
let transition: TransitionNativeRunes | undefined = $state();

function toggle_accordion() {
	if (open && toggle) {
		toggle.checked = false;
		open = false;
	} else if (toggle) {
		toggle.checked = true;
		open = true;
	}
	transition?.toggle();
}
let max_duration: number | undefined = $state(undefined);
$effect(() => {
	max_duration =
		transition_props?.slide_transition_parameters?.duration ??
		transition_props?.blur_transition_parameters?.duration ??
		transition_props?.fade_transition_parameters?.duration ??
		transition_props?.scale_transition_parameters?.duration ??
		transition_props?.fly_transition_parameters?.duration;
});
</script>
	
{#snippet fa_icon_snippet(icon)}
	<Fa
	{icon}
	class={icon_class}
	rotate={open ? open_icon_rotation : closed_icon_rotation}
	/>
{/snippet}

{#snippet default_icon()}
		<svg
		style="tran"
		style:rotate={open ? `${open_icon_rotation}deg` : `${closed_icon_rotation}deg`}
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

<!--The `open` attribute on the <details> element is assigned to `true` to enable the transition trick with `max-height` in the CSS -->
<!--svelte-ignore a11y_no_noninteractive_element_interactions-->
<details 
	class={`details ${details_classes}`}
	open={true}
	style:--duration={max_duration ? `${max_duration}ms` : undefined}
	style:--details-max-height-closed={max_height_closed}
	style:--details-max-height-open={max_height_open}
	onkeydown={(e)=> {if(e.key === 'Enter' || e.key === ' '){ e.preventDefault(); toggle_accordion() } }}
	{...details_attributes}
	>
	<summary onclick={toggle_accordion} use:tooltip={summary_tooltip_parameters} {...summary_attributes} >
		{#if group_name}
			<input class:open bind:this={toggle} type="radio" name={group_name} {id} value={id} />
		{:else}
			<input class:open bind:this={toggle} type="checkbox" name={id} {id} bind:checked={open}/>
		{/if}

		<label onclick={toggle_accordion} for={id} onkeydown={(e)=> {if(e.key === 'Enter' || e.key === ' '){ toggle_accordion() } }} >
			{#if expand_icon_position === 'left'}
				{#if custom_icon}
					{@render custom_icon()}
				{:else if icon}
					{@render fa_icon_snippet(icon)}
				{:else}
					{@render default_icon()}
				{/if}
			{/if}
			
			{#if summary_content}
				{@render summary_content()}
			{:else if summary_text}
				{summary_text}
			{/if}
			
			{#if expand_icon_position === 'right'}
				{#if custom_icon}
					{@render custom_icon()}
				{:else if icon}
					{@render fa_icon_snippet(icon)}
				{:else}
					{@render default_icon()}
				{/if}
			{/if}
		</label>
	</summary>
	<TransitionNativeRunes bind:this={transition} {...transition_props}>
		{@render children?.()}
	</TransitionNativeRunes>
</details>

<style>
	@layer accordiondetails {
		details, summary {
			box-sizing: border-box;
		}
		summary, summary > * {
			cursor: pointer;
		}
		.details {
			max-height: var(--details-max-height-closed, 1.5rem);
			overflow: hidden;
			transition: max-height var(--duration, 400ms);
			transition-timing-function: var(--details-transition-timing-function, cubic-bezier(0.33, 0.68, 1));
			border-radius: var(--accordion-button-border-radius, 1rem);
			background-color: var(--details-background-color);
			padding: var(--details-padding, 0.25rem 0.5rem);
			margin: -0.5rem;
			cursor: pointer;
			/* overflow: auto; */
			&:hover{
				outline: var(--details-hover-outline, 
				ridge oklch(from var(--details-hover-outline-color, white) l c h / var(--details-hover-outline-opacity, 0.5)));
			}
			&:focus-within{
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
			&:has(input.open){
				border-radius: 1rem 1rem 0 0;
				max-height: var(--details-max-height-open, 110%); /* Needs to be a bit larger than the actual size of the content, but still a definite size. */
			}
	
			/* Remove the default triangle arrow */
			& > summary {
				/* width: 100%; */
				cursor: pointer;
				list-style: none;
				&:focus-visible{
					outline: none;
				}
				&::-webkit-details-marker {
					display: none;
				}
				/* Customize the summary styles */
				& > label {
					display: flex;
					/* width: 100%; */
					justify-content: space-between;
				}
				/* Hide the checkbox */
				& > input[type="checkbox"],
				& > input[type="radio"] {
					display: none;
					pointer-events: none;
				}
			}
		}
	
		svg {
			transition: rotate 0.2s ease-in;
		}
	}
</style>
