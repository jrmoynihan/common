<script module lang="ts">
	import type { Snippet } from 'svelte';
	import { cubicOut } from 'svelte/easing';
	import type { HTMLAttributes } from 'svelte/elements';
	import {
		blur,
		fade,
		fly,
		scale,
		slide,
		type BlurParams,
		type FadeParams,
		type FlyParams,
		type ScaleParams,
		type SlideParams
	} from 'svelte/transition';

	export interface TransitionProps {
		/** Will trigger the transition via {#key} block when this value changes. */
		trigger?: unknown;
		/** Attributes to apply to the inner container (parent of the transitioned content). */
		inner_container_attributes?: HTMLAttributes<HTMLDivElement>;
		/** Parameters to use with a fly transition. */
		fly_transition_parameters?: FlyParams;
		/** Parameters to use with a fade transition. */
		fade_transition_parameters?: FadeParams;
		/** Parameters to use with a blur transition. */
		blur_transition_parameters?: BlurParams;
		/** Parameters to use with a slide transition. */
		slide_transition_parameters?: SlideParams;
		/** Parameters to use with a scale transition. */
		scale_transition_parameters?: ScaleParams;
		/** A custom snippet for a fly transition. Be sure to add the `transition-inner` class to the outermost element within the snippet. */
		fly_transition?: Snippet<[FlyParams]>;
		/** A custom snippet for a fade transition. Be sure to add the `transition-inner` class to the outermost within the snippet. */
		fade_transition?: Snippet<[FadeParams]>;
		/** A custom snippet for a blur transition. Be sure to add the `transition-inner` class to the outermost within the snippet. */
		blur_transition?: Snippet<[BlurParams]>;
		/** A custom snippet for a slide transition. Be sure to add the `transition-inner` class to the outermost within the snippet. */
		slide_transition?: Snippet<[SlideParams]>;
		/** A custom snippet for a scale transition. Be sure to add the `transition-inner` class to the outermost within the snippet. */
		scale_transition?: Snippet<[ScaleParams]>;
		/** A snippet containing the transitioned content. */
		children?: Snippet;
	}
</script>

<script lang="ts">
	// Inspired by https://dev.to/evanwinter/page-transitions-with-svelte-kit-35o6

	let {
		trigger = $bindable(false),
		inner_container_attributes,
		fly_transition_parameters = {
			x: -150,
			duration: 300,
			delay: 0,
			easing: cubicOut
		},
		fade_transition_parameters,
		blur_transition_parameters,
		slide_transition_parameters,
		scale_transition_parameters,
		fly_transition,
		fade_transition,
		blur_transition,
		slide_transition,
		scale_transition,
		children
	}: TransitionProps = $props();
</script>

{#snippet default_fly_transition(params: FlyParams)}
	{#key trigger}
		<div
			{...inner_container_attributes}
			class={['transition-inner', 'fly', inner_container_attributes?.class]}
			in:fly={{ ...params }}
			out:fly={{ ...params, x: Number(params.x) * -1 }}
		>
			{@render children?.()}
		</div>
	{/key}
{/snippet}

{#snippet default_fade_transition(params: FadeParams)}
	{#key trigger}
		<div
			{...inner_container_attributes}
			class={['transition-inner', 'fade', inner_container_attributes?.class]}
			in:fade={params}
			out:fade={params}
		>
			{@render children?.()}
		</div>
	{/key}
{/snippet}

{#snippet default_blur_transition(params: BlurParams)}
	{#key trigger}
		<div
			{...inner_container_attributes}
			class={['transition-inner', 'blur', inner_container_attributes?.class]}
			in:blur={params}
			out:blur={params}
		>
			{@render children?.()}
		</div>
	{/key}
{/snippet}

{#snippet default_slide_transition(params: SlideParams)}
	{#key trigger}
		<div
			{...inner_container_attributes}
			class={['transition-inner', 'slide', inner_container_attributes?.class]}
			in:slide={params}
			out:slide={params}
		>
			{@render children?.()}
		</div>
	{/key}
{/snippet}

{#snippet default_scale_transition(params: ScaleParams)}
	{#key trigger}
		<div
			{...inner_container_attributes}
			class={['transition-inner', 'scale', inner_container_attributes?.class]}
			in:scale={params}
			out:scale={params}
		>
			{@render children?.()}
		</div>
	{/key}
{/snippet}

<div class="transition-outer">
	{#if fade_transition && fade_transition_parameters}
		{@render fade_transition(fade_transition_parameters)}
	{:else if blur_transition && blur_transition_parameters}
		{@render blur_transition(blur_transition_parameters)}
	{:else if slide_transition && slide_transition_parameters}
		{@render slide_transition(slide_transition_parameters)}
	{:else if scale_transition && scale_transition_parameters}
		{@render scale_transition(scale_transition_parameters)}
	{:else if fly_transition && fly_transition_parameters}
		{@render fly_transition(fly_transition_parameters)}
	{:else if fade_transition_parameters}
		{@render default_fade_transition(fade_transition_parameters)}
	{:else if blur_transition_parameters}
		{@render default_blur_transition(blur_transition_parameters)}
	{:else if slide_transition_parameters}
		{@render default_slide_transition(slide_transition_parameters)}
	{:else if scale_transition_parameters}
		{@render default_scale_transition(scale_transition_parameters)}
	{:else if fly_transition_parameters}
		{@render default_fly_transition(fly_transition_parameters)}
	{/if}
</div>

<style>
	.transition-outer {
		display: grid;
		grid-template-rows: minmax(0, 1fr);
		grid-template-columns: minmax(0, 1fr);
		justify-items: var(--transition-justify-items, stretch);
		align-items: var(--transition-align-items, stretch);
		flex-grow: var(--transition-flex-grow, 1);
		flex-shrink: var(--transition-flex-shrink, 1);
		flex-basis: var(--transition-flex-basis, auto);
	}
	.transition-inner {
		box-sizing: border-box;
		position: relative;
		max-width: 100%;
		background-size: cover;
		display: grid;
		grid-auto-rows: minmax(max-content, 100%);
		grid-template-columns: minmax(0, 1fr);
		grid-row: 1;
		grid-column: 1;
	}
</style>
