<script lang="ts">
	import { cubicOut } from 'svelte/easing';
	import { tweened } from 'svelte/motion';
	import { fade } from 'svelte/transition';
	import type { SpotlightStep } from './spotlight.svelte.ts';

	type SpotlightShape = 'circle' | 'ellipse' | 'square';

	type ActionSpotlightProps = {
		/** The additional nodes to travel to after closing the initial spotlight. */
		steps: SpotlightStep[];
		width?: number;
		height?: number;
		top?: number;
		left?: number;
		padding?: number;
		padding_width?: number;
		padding_height?: number;
		visible?: boolean;
		delay?: number;
		duration?: number;
		opacity?: number;
		color?: string;
		soft_edge_distance?: string | number;
		shape?: SpotlightShape;
		step?: number;
		on_close?: () => void;
		on_open?: () => void;
		on_next?: () => void;
	};
	let {
		steps,
		padding = 0,
		visible = false,
		delay = 0,
		duration = 400,
		opacity = 0.75,
		color = '',
		soft_edge_distance = 16,
		shape = 'circle',
		step = 0,
		on_close = () => {},
		on_open = () => {},
		on_next = () => {}
	}: ActionSpotlightProps = $props();

	let initial_x = 0;
	let initial_y = 0;
	let initial_width = window?.innerWidth;
	let initial_height = window?.innerHeight;
	let x = tweened(initial_x, { duration, delay, easing: cubicOut });
	let y = tweened(initial_y, { duration, delay, easing: cubicOut });
	let w = tweened(initial_width, { duration, delay, easing: cubicOut });
	let h = tweened(initial_height, { duration, delay, easing: cubicOut });

	async function close() {
		visible = false;
		on_close?.();
	}

	async function open() {
		await reposition(steps[0]);
		await on_open?.();
		visible = true;
	}

	async function reposition(next_step: SpotlightStep) {
		requestAnimationFrame(() => {
			// TODO: Make sure no other animations or transitions are running at the same time on the same node?

			const { node, delay: next_delay, duration: next_duration } = next_step;

			// Update all the component props with the next step
			padding = next_step.padding ?? padding;
			delay = next_step.delay ?? delay;
			duration = next_step.duration ?? duration;
			opacity = next_step.opacity ?? opacity;
			color = next_step.color ?? color;
			soft_edge_distance = next_step.soft_edge_distance ?? soft_edge_distance;
			shape = next_step.shape ?? shape;
			on_close = next_step.on_close ?? on_close;
			on_open = next_step.on_open ?? on_open;
			on_next = next_step.on_next ?? on_next;

			const rect = node.getBoundingClientRect();
			const { width, height, top, left } = rect;

			const half_width = width * 0.5;
			const new_x = left - half_width - padding * 2;
			const new_y = top - padding * 2;
			const new_w = width + padding * 2;
			const new_h = height + padding * 2;

			// Use the new settings from the next step to control the repositioning, or use the existing ones
			const new_settings = {
				duration,
				delay,
				easing: cubicOut,
				...next_step
			};

			// Update the tweened values
			x.set(new_x, new_settings);
			y.set(new_y, new_settings);
			w.set(new_w, new_settings);
			h.set(new_h, new_settings);
		});
	}

	async function moveToNextNode() {
		if (step < steps.length - 1) {
			step++;
			const next_step = steps[step];
			await reposition(next_step);
			on_next?.();
		} else {
			await close();
		}
	}

	async function next() {
		if (steps?.length > 0) {
			await moveToNextNode();
		} else {
			await close();
		}
	}

	setTimeout(() => open(), delay);
</script>

<svelte:window
	on:keydown={(e) => {
		if (e.key === 'Escape') close();
	}}
/>
{#if shape === 'square' && visible}
	<svg transition:fade={{ duration, delay, easing: cubicOut }}>
		<defs>
			<mask id="square-mask">
				<rect
					style:opacity
					fill={`hsla(0,100%,100%, ${opacity * 100}%)`}
					x="0"
					y="0"
					width="100%"
					height="100%"
				/>
				<rect id="animated-mask" fill="black" x={$x} y={$y} width={$w} height={$h} />
			</mask>
		</defs>
		<rect fill="black" x="0" y="0" width="100%" height="100%" mask="url(#square-mask)" />
	</svg>
{/if}
{#if visible}
	<button
		transition:fade={{ duration, delay, easing: cubicOut }}
		role="dialog"
		aria-live="polite"
		aria-label="spotlight"
		class="spotlight"
		class:visible
		class:circle={shape === 'circle'}
		class:ellipse={shape === 'ellipse'}
		class:square={shape === 'square'}
		style:--left={`${$x}px`}
		style:--top={`${$y}px`}
		style:--width={`${$w}px`}
		style:--height={`${$h}px`}
		style:--duration={duration}
		style:--padding={`${padding}px`}
		style:--soft-edge-distance={typeof soft_edge_distance === 'string'
			? soft_edge_distance
			: `${soft_edge_distance}px`}
		style:--opacity={opacity}
		style:--color={color}
		onclick={next}
	>
	</button>
{/if}

<style>
	svg {
		position: fixed;
		width: 100vw;
		height: 100vh;
		inset: 0;
		pointer-events: none;
	}
	.spotlight {
		--circle: circle at var(--mask-location);
		--ellipse: ellipse at var(--mask-location);
		--mask-location: calc(var(--left) + var(--width)) calc(var(--top) + var(--height));
		--mask-size: var(--width) + var(--padding, 1rem);
		--transparent-gradient: transparent calc(var(--mask-size));
		--opaque-gradient: oklch(0% 0% 0 / 100%) calc(var(--mask-size) + var(--soft-edge-distance));
		border: none;
		outline: none;
		position: fixed;
		inset: 0;
		pointer-events: none;
		width: 100vw;
		height: 100vh;
		opacity: 0;
		transition:
			-webkit-mask var(--duration) ease-out,
			mask var(--duration) ease-out,
			opacity var(--duration) ease-out,
			background-color var(--duration) ease-out;
		transition-behavior: allow-discrete;
		-webkit-mask: var(--mask);
		mask: var(--mask);

		&.visible {
			pointer-events: initial;
			background-color: var(--color, hsla(0, 0%, 0%, 100%));
			opacity: var(--opacity, 75%);

			&.circle {
				--mask: radial-gradient(var(--circle), var(--transparent-gradient), var(--opaque-gradient));
			}
			&.ellipse {
				--mask: radial-gradient(
					var(--ellipse),
					var(--transparent-gradient),
					var(--opaque-gradient)
				);
				-webkit-mask: var(--mask);
				mask: var(--mask);
			}
			&.square {
				-webkit-mask: url(#square-mask);
				mask: url(#square-mask);
			}
		}
	}
</style>
