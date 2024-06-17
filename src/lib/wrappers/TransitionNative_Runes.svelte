<script context="module" lang="ts">
	export interface TransitionNativeProps {
		/** Will trigger the CSS transition when this value changes. */
		visible?: boolean;
		inner_container_styles?: string;
		inner_container_classes?: string;
		/** The type of transition to use. */
		types?: TransitionTypes[];
		/** Should the outro transition return to the same initial state as the intro transition?  */
		symmetrical?: boolean;
		/** The origin of the transition transform. */
		origin?: string;
		fly_transition_parameters?: FlyCSSParams;
		fade_transition_parameters?: FadeCSSParams;
		blur_transition_parameters?: BlurCSSParams;
		slide_transition_parameters?: SlideCSSParams;
		scale_transition_parameters?: ScaleCSSParams;
		/** A custom snippet for a fly transition. Be sure to add the `transition-inner` class to the outermost element. */
		fly_transition?: Snippet<[FlyCSSParams]>;
		fade_transition?: Snippet<[FadeCSSParams]>;
		blur_transition?: Snippet<[BlurCSSParams]>;
		slide_transition?: Snippet<[SlideCSSParams]>;
		scale_transition?: Snippet<[ScaleCSSParams]>;
		children?: Snippet;
	}
	interface CSSTransitionParams {
		duration?: number;
		delay?: number;
		easing?: EasingFunction;
	}
	interface FlyCSSParams extends CSSTransitionParams {
		x?: string;
		y?: string;
		outX?: string;
		outY?: string;
		opacity?: string;
	}
	interface FadeCSSParams extends CSSTransitionParams {}

	interface SlideCSSParams extends CSSTransitionParams {
		side?: SlideSide;
	}
	interface ScaleCSSParams extends CSSTransitionParams {
		initial?: number;
		/** Used when `symmetrical` is set to `false` to allow the outro transition to scale differently than the initial scale. */
		out_scale?: number;
	}
	interface BlurCSSParams extends CSSTransitionParams {
		amount?: string | number;
		opacity?: string;
	}
	/** A type union of all the easing function classes available */
	type EasingFunction =
		| 'ease'
		| 'ease-in'
		| 'ease-out'
		| 'ease-in-out'
		| 'ease-in-back'
		| 'ease-out-back'
		| 'ease-in-out-back'
		| 'ease-in-elastic'
		| 'ease-out-elastic'
		| 'ease-in-out-elastic'
		| 'ease-in-bounce'
		| 'ease-out-bounce'
		| 'ease-in-out-bounce'
		| 'ease-in-circ'
		| 'ease-out-circ'
		| 'ease-in-out-circ'
		| 'ease-in-sine'
		| 'ease-out-sine'
		| 'ease-in-out-sine'
		| 'ease-in-expo'
		| 'ease-out-expo'
		| 'ease-in-out-expo'
		| 'ease-in-cubic'
		| 'ease-out-cubic'
		| 'ease-in-out-cubic'
		| 'ease-in-quad'
		| 'ease-out-quad'
		| 'ease-in-out-quad'
		| 'ease-in-quart'
		| 'ease-out-quart'
		| 'ease-in-out-quart'
		| 'ease-in-quint'
		| 'ease-out-quint'
		| 'ease-in-out-quint'
		| 'linear';
</script>

<script lang="ts">
	import type { SlideSide, TransitionTypes } from '$lib/lib_types';

	// Inspired by https://dev.to/evanwinter/page-transitions-with-svelte-kit-35o6

	import type { Snippet } from 'svelte';

	let {
		visible = $bindable(false),
		inner_container_styles = '',
		inner_container_classes = '',
		types = ['fade'],
		symmetrical = true,
		origin,
		fly_transition_parameters = {
			x: '-50%',
			y: '0px',
			duration: 400,
			delay: 0,
			easing: 'ease-out-cubic'
		},
		fade_transition_parameters = {
			duration: 400,
			delay: 0,
			easing: 'linear'
		},
		blur_transition_parameters = {
			duration: 400,
			delay: 0,
			easing: 'ease-out-cubic',
			amount: '5px'
		},
		slide_transition_parameters = {
			duration: 400,
			delay: 0,
			easing: 'ease-out-cubic',
			side: 'top'
		},
		scale_transition_parameters = {
			duration: 400,
			delay: 0,
			easing: 'ease-out-cubic',
			initial: 0
		},
		fly_transition,
		fade_transition,
		blur_transition,
		slide_transition,
		scale_transition,
		children
	}: TransitionNativeProps = $props();

	let leaving = $state(false);
	let entering = $state(false);
	let timeout: ReturnType<Window['setTimeout']> | undefined = $state();

	export function toggle() {
		const { duration, delay } = get_duration_and_delay();
		// If it's currently visible, set the transition to leaving
		leaving = visible ? true : false;
		// Set a timeout to reset the transition to entering
		if (leaving) {
			timeout = window.setTimeout(() => {
				entering = true;
				leaving = false;
			}, duration + delay);
		} else {
			// Clear the timeout to allow for reversible transitions and avoid stuttered movement when quickly clicking
			clearTimeout(timeout);
		}
		// Set the visible state
		visible = leaving && !entering ? false : true;
		// Reset the entering state for the next transition
		entering = !visible;
	}

	function get_duration_and_delay(): { duration: number; delay: number } {
		if (types.includes('fly') || types.includes('slide')) {
			const { duration = 400, delay = 0 } = fly_transition_parameters;
			return { duration, delay };
		} else if (types.includes('scale')) {
			const { duration = 400, delay = 0 } = scale_transition_parameters;
			return { duration, delay };
		} else if (types.includes('fade')) {
			const { duration = 400, delay = 0 } = fade_transition_parameters;
			return { duration, delay };
		} else if (types.includes('blur')) {
			const { duration = 400, delay = 0 } = blur_transition_parameters;
			return { duration, delay };
		} else {
			return { duration: 0, delay: 0 };
		}
	}
	const sliding = $derived(types.includes('slide'));
</script>

{#snippet transition({
	easing = 'ease-out-cubic',
	duration = 400,
	delay = 0,
	types = [],
	amount,
	side,
	initial_scale,
	out_scale,
	initial_opacity,
	visible_opacity,
	x,
	y,
	outX,
	outY
})}
	<div
		class={`transition-inner ${types.length > 1 ? types.join(' ') : types} ${inner_container_classes}`}
		class:visible
		class:entering
		class:leaving
		class:asymmetrical={!symmetrical}
		class:ease={easing === 'ease'}
		class:ease-in={easing === 'ease-in'}
		class:ease-out={easing === 'ease-out'}
		class:ease-in-out={easing === 'ease-in-out'}
		class:ease-in-back={easing === 'ease-in-back'}
		class:ease-out-back={easing === 'ease-out-back'}
		class:ease-in-out-back={easing === 'ease-in-out-back'}
		class:ease-in-elastic={easing === 'ease-in-elastic'}
		class:ease-out-elastic={easing === 'ease-out-elastic'}
		class:ease-in-out-elastic={easing === 'ease-in-out-elastic'}
		class:ease-in-bounce={easing === 'ease-in-bounce'}
		class:ease-out-bounce={easing === 'ease-out-bounce'}
		class:ease-in-out-bounce={easing === 'ease-in-out-bounce'}
		class:ease-in-circ={easing === 'ease-in-circ'}
		class:ease-out-circ={easing === 'ease-out-circ'}
		class:ease-in-out-circ={easing === 'ease-in-out-circ'}
		class:ease-in-sine={easing === 'ease-in-sine'}
		class:ease-out-sine={easing === 'ease-out-sine'}
		class:ease-in-out-sine={easing === 'ease-in-out-sine'}
		class:ease-in-expo={easing === 'ease-in-expo'}
		class:ease-out-expo={easing === 'ease-out-expo'}
		class:ease-in-out-expo={easing === 'ease-in-out-expo'}
		class:ease-in-cubic={easing === 'ease-in-cubic'}
		class:ease-out-cubic={easing === 'ease-out-cubic'}
		class:ease-in-out-cubic={easing === 'ease-in-out-cubic'}
		class:ease-in-quad={easing === 'ease-in-quad'}
		class:ease-out-quad={easing === 'ease-out-quad'}
		class:ease-in-out-quad={easing === 'ease-in-out-quad'}
		class:ease-in-quart={easing === 'ease-in-quart'}
		class:ease-out-quart={easing === 'ease-out-quart'}
		class:ease-in-out-quart={easing === 'ease-in-out-quart'}
		class:ease-in-quint={easing === 'ease-in-quint'}
		class:ease-out-quint={easing === 'ease-out-quint'}
		class:ease-in-out-quint={easing === 'ease-in-out-quint'}
		class:linear={easing === 'linear'}
		class:slide-left={side === 'left' && sliding}
		class:slide-right={side === 'right' && sliding}
		class:slide-top={side === 'top' && sliding}
		class:slide-bottom={side === 'bottom' && sliding}
		style={inner_container_styles}
		style:--x={x}
		style:--y={y}
		style:--out-x={outX}
		style:--out-y={outY}
		style:--duration={`${duration}ms`}
		style:--delay={`${delay}ms`}
		style:--easing={easing}
		style:--initial-opacity={initial_opacity}
		style:--visible-opacity={visible_opacity}
		style:--blur={typeof amount === 'number' ? `${amount}px` : amount}
		style:--initial-scale={initial_scale}
		style:--out-scale={out_scale}
		style:--origin={origin}
	>
		{@render children?.()}
	</div>
{/snippet}

{#snippet default_fly_transition({
	x = '-50%',
	y = '0px',
	outX = '50%',
	outY = '0px',
	duration,
	delay,
	easing,
	opacity = 0
})}
	{@render transition({ easing, x, y, outX, outY, duration, delay, opacity, types: ['fly'] })}
{/snippet}

{#snippet default_fade_transition({ duration, delay, easing = 'linear' })}
	{@render transition({ duration, delay, easing, types: ['fade'] })}
{/snippet}

{#snippet default_blur_transition({ duration, delay, easing, opacity = 0, amount = '5px' })}
	{@render transition({
		duration,
		delay,
		easing,
		initial_opacity: opacity,
		amount,
		types: ['blur']
	})}
{/snippet}

{#snippet default_slide_transition({ duration, delay, easing, side = 'top' })}
	{@render transition({ duration, delay, easing, side, types: ['slide'] })}
{/snippet}

{#snippet default_scale_transition({
	duration,
	delay,
	easing,
	initial_scale = 0,
	out_scale,
	opacity
})}
	{@render transition({
		duration,
		delay,
		easing,
		initial_scale,
		out_scale,
		initial_opacity: opacity,
		types: ['scale']
	})}
{/snippet}

<div class="transition-outer" class:visible>
	{#if fade_transition && fade_transition_parameters}
		{@render fade_transition(fade_transition_parameters)}
	{:else if fly_transition && fly_transition_parameters}
		{@render fly_transition(fly_transition_parameters)}
	{:else if blur_transition && blur_transition_parameters}
		{@render blur_transition(blur_transition_parameters)}
	{:else if slide_transition && slide_transition_parameters}
		{@render slide_transition(slide_transition_parameters)}
	{:else if scale_transition && scale_transition_parameters}
		{@render scale_transition(scale_transition_parameters)}
	{:else if types.length === 1 && types[0] === 'fade' && fade_transition_parameters}
		{@render default_fade_transition(fade_transition_parameters)}
	{:else if types.length === 1 && types[0] === 'blur' && blur_transition_parameters}
		{@render default_blur_transition(blur_transition_parameters)}
	{:else if types.length === 1 && types[0] === 'slide' && slide_transition_parameters}
		{@render default_slide_transition(slide_transition_parameters)}
	{:else if types.length === 1 && types[0] === 'scale' && scale_transition_parameters}
		{@render default_scale_transition(scale_transition_parameters)}
	{:else if types.length === 1 && types[0] === 'fly' && fly_transition_parameters}
		{@render default_fly_transition(fly_transition_parameters)}
	{:else if types.length > 1}
		<!-- Allow for custom combo transitions -->
		{@render transition({
			...fly_transition_parameters,
			...fade_transition_parameters,
			...blur_transition_parameters,
			...slide_transition_parameters,
			...scale_transition_parameters,
			types
		})}
	{/if}
</div>

<style lang="scss">
	.transition-outer {
		display: grid;
		grid-template-rows: 1fr;
		grid-template-columns: 1fr;
	}
	.transition-inner {
		box-sizing: border-box;
		position: relative;
		background-size: cover;
		grid-row: 1;
		grid-column: 1;
		opacity: var(--initial-opacity, 0);
		pointer-events: none;
		transition-property: opacity;
		transition-duration: var(--duration, 400ms);
		transition-behavior: allow-discrete;
		transition-delay: var(--delay, 0);
		transition-timing-function: var(--easing, linear);
		transform-origin: var(--origin, center center);
		&.visible {
			opacity: var(--visible-opacity, 1);
			pointer-events: all;
		}
	}
	.fly {
		transition-property: translate, opacity;
		translate: var(--x, 0) var(--y, 0);
		&.visible {
			translate: 0;
		}
		&.asymmetrical.entering {
			translate: var(--x, 0) var(--y, 0);
		}
		&.asymmetrical.leaving {
			translate: var(--out-x, calc(-1 * var(--x, 0))) var(--out-y, calc(-1 * var(--y, 0)));
		}
	}
	.blur {
		transition-property: filter, opacity;
		filter: blur(var(--blur, 0));
		&.visible {
			filter: blur(0);
		}
	}
	.scale {
		transition-property: scale, opacity;
		scale: var(--initial-scale, 0);
		&.visible {
			scale: 1;
		}
		&.asymmetrical.entering {
			scale: var(--initial-scale, 0);
		}
		&.asymmetrical.leaving {
			scale: var(--out-scale, calc(-1 * var(--initial-scale, 0)));
		}
	}
	.fade {
		transition-property: opacity;
		opacity: var(--initial-opacity, 0);
		&.visible {
			opacity: var(--visible-opacity, 1);
		}
	}
	:is(.slide-left, .slide-top, .slide-right, .slide-bottom) {
		transition-property: scale, opacity;
		overflow: auto;
		&.visible {
			scale: 1 1;
		}
	}
	:is(.slide-left, .slide-right) {
		scale: 0 1;
	}
	:is(.slide-top, .slide-bottom) {
		scale: 1 0;
	}
	.slide-left {
		transform-origin: left;
	}
	.slide-right {
		transform-origin: right;
	}
	.slide-top {
		transform-origin: top;
	}
	.slide-bottom {
		transform-origin: bottom;
	}

	.ease {
		transition-timing-function: ease;
	}
	.ease-in {
		transition-timing-function: ease-in;
	}
	.ease-out {
		transition-timing-function: easeOut;
	}
	.ease-in-out {
		transition-timing-function: easeInOut;
	}
	.ease-in-sine {
		transition-timing-function: cubic-bezier(0.12, 0, 0.39, 0);
	}
	.ease-out-sine {
		transition-timing-function: cubic-bezier(0.61, 1, 0.88, 1);
	}
	.ease-in-out-sine {
		transition-timing-function: cubic-bezier(0.37, 0, 0.63, 1);
	}
	.ease-in-cubic {
		transition-timing-function: cubic-bezier(0.32, 0, 0.67, 0);
	}
	.ease-out-cubic {
		transition-timing-function: cubic-bezier(0.33, 1, 0.68, 1);
	}
	.ease-in-out-cubic {
		transition-timing-function: cubic-bezier(0.33, 0, 0.67, 1);
	}
	.ease-in-quad {
		transition-timing-function: cubic-bezier(0.55, 0.085, 0.68, 0.53);
	}
	.ease-out-quad {
		transition-timing-function: cubic-bezier(0.25, 0.46, 0.45, 0.94);
	}
	.ease-in-out-quad {
		transition-timing-function: cubic-bezier(0.455, 0.03, 0.515, 0.955);
	}
	.ease-in-cubic {
		transition-timing-function: cubic-bezier(0.55, 0.085, 0.68, 0.53);
	}
	.ease-out-cubic {
		transition-timing-function: cubic-bezier(0.25, 0.46, 0.45, 0.94);
	}
	.ease-in-out-cubic {
		transition-timing-function: cubic-bezier(0.455, 0.03, 0.515, 0.955);
	}
	.ease-in-quart {
		transition-timing-function: cubic-bezier(0.895, 0.03, 0.685, 0.22);
	}
	.ease-out-quart {
		transition-timing-function: cubic-bezier(0.165, 0.84, 0.44, 1);
	}
	.ease-in-out-quart {
		transition-timing-function: cubic-bezier(0.77, 0, 0.175, 1);
	}
	.ease-in-quint {
		transition-timing-function: cubic-bezier(0.755, 0.05, 0.855, 0.06);
	}
	.ease-out-quint {
		transition-timing-function: cubic-bezier(0.23, 1, 0.32, 1);
	}
	.ease-in-out-quint {
		transition-timing-function: cubic-bezier(0.86, 0, 0.07, 1);
	}
	.ease-in-expo {
		transition-timing-function: cubic-bezier(0.7, 0, 0.84, 0);
	}
	.ease-out-expo {
		transition-timing-function: cubic-bezier(0.19, 1, 0.22, 1);
	}
	.ease-in-out-expo {
		transition-timing-function: cubic-bezier(1, 0, 0, 1);
	}
	.ease-in-circ {
		transition-timing-function: cubic-bezier(0.6, 0.04, 0.98, 0.335);
	}
	.ease-out-circ {
		transition-timing-function: cubic-bezier(0.075, 0.82, 0.165, 1);
	}
	.ease-in-out-circ {
		transition-timing-function: cubic-bezier(0.785, 0.135, 0.15, 0.86);
	}
	.ease-in-back {
		transition-timing-function: cubic-bezier(0.6, -0.28, 0.735, 0.045);
	}
	.ease-out-back {
		transition-timing-function: cubic-bezier(0.175, 0.885, 0.32, 1.275);
	}
	.ease-in-out-back {
		transition-timing-function: cubic-bezier(0.68, -0.55, 0.265, 1.55);
	}
	.ease-in-elastic {
		transition-timing-function: cubic-bezier(0.175, 0.885, 0.32, 1.275);
	}
	.ease-out-elastic {
		transition-timing-function: cubic-bezier(0.6, -0.28, 0.735, 0.045);
	}
	.ease-in-out-elastic {
		transition-timing-function: cubic-bezier(0.68, -0.55, 0.265, 1.55);
	}
	.ease-in-bounce {
		transition-timing-function: cubic-bezier(0.68, -0.55, 0.265, 1.55);
	}
	.ease-out-bounce {
		transition-timing-function: cubic-bezier(0.175, 0.885, 0.32, 1.275);
	}
	.ease-in-out-bounce {
		transition-timing-function: cubic-bezier(0.68, -0.55, 0.265, 1.55);
	}
	.linear {
		transition-timing-function: linear;
	}
</style>
