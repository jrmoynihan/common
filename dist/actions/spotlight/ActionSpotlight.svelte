<svelte:options accessors={true} />

<script>import { createEventDispatcher } from 'svelte';
import { cubicOut } from 'svelte/easing';
import { tweened } from 'svelte/motion';
import { fade } from 'svelte/transition';
export let width = 0;
export let height = 0;
export let top = 0;
export let left = 0;
export let padding = 16;
export let padding_width = padding;
export let padding_height = padding;
export let visible = false;
export let delay = 0;
export let duration = 400;
export let opacity = 0.75;
export let color = '';
export let soft_edges = true;
export let soft_edge_distance = '1.5rem';
/**
 * The shape the spotlight will take.
 * @default circle
*/
export let shape = 'circle';
/** The additional nodes to travel to after closing the initial spotlight. */
export let nodes = [];
export let node_index = 0;
export let onClose = async () => { };
export let onOpen = async () => { };
let dialog;
let initial_x = 0;
let initial_y = 0;
let initial_width = window?.innerWidth;
let initial_height = window?.innerHeight;
$: final_x = left - padding_width / 2;
$: final_y = top - padding_height / 2;
$: final_width = width + padding_width;
$: final_height = height + padding_height;
const x = tweened(initial_x, { duration, delay, easing: cubicOut });
const y = tweened(initial_y, { duration, delay, easing: cubicOut });
const w = tweened(initial_width, { duration, delay, easing: cubicOut });
const h = tweened(initial_height, { duration, delay, easing: cubicOut });
const dispatch = createEventDispatcher();
export async function close() {
    visible = false;
    await onClose?.();
}
export async function open() {
    await reposition();
    await onOpen?.();
}
export async function reposition() {
    $x = final_x;
    $y = final_y;
    $w = final_width;
    $h = final_height;
}
export async function moveToNextNode() {
    if (node_index < nodes.length) {
        dispatch('next', { node_index, node: nodes[node_index] });
    }
    else {
        await close();
        dispatch('closeAll');
    }
}
export async function nextNodeOrClose() {
    if (nodes?.length > 0) {
        await moveToNextNode();
    }
    else {
        await close();
    }
}
$: visible ? open() : null;
</script>

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
<button
	bind:this={dialog}
	transition:fade={{ duration, delay, easing: cubicOut }}
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
	style:--spotlight-padding={`${padding}px`}
	style:--soft-edges={soft_edges ? soft_edge_distance : '0'}
	style:--opacity={opacity}
	style:--color={color}
	on:click|self|stopPropagation={nextNodeOrClose}
	on:keydown|self|stopPropagation={(e) => {
		if (e.key === 'Escape') {
			nextNodeOrClose();
		}
	}}
/>

<style>svg {
  position: fixed;
  width: 100vw;
  height: 100vh;
  inset: 0;
  pointer-events: none;
}

.spotlight {
  border: none;
  outline: none;
  position: fixed;
  inset: 0;
  pointer-events: none;
  width: 100vw;
  height: 100vh;
  opacity: 0;
  transition: webkit-mask var(--duration) ease-out, mask var(--duration) ease-out, opacity var(--duration) ease-out;
}
.spotlight.visible {
  pointer-events: initial;
  background-color: var(--color, hsl(0, 0%, 0%));
  opacity: var(--opacity, 75%);
}
.spotlight.visible.circle {
  -webkit-mask: radial-gradient(circle at calc(var(--width) / 2 + var(--left)) calc(var(--height) / 2 + var(--top)), transparent calc(var(--width) / 2 + var(--spotlight-padding, 1rem)), hsl(0, 0%, 100%) calc(var(--width) / 2 + var(--spotlight-padding) + var(--soft-edges)));
  mask: radial-gradient(circle at calc(var(--width) / 2 + var(--left)) calc(var(--height) / 2 + var(--top)), transparent calc(var(--width) / 2 + var(--spotlight-padding, 1rem)), hsl(0, 0%, 100%) calc(var(--width) / 2 + var(--spotlight-padding) + var(--soft-edges)));
}
.spotlight.visible.ellipse {
  -webkit-mask: radial-gradient(ellipse at calc(var(--width) / 2 + var(--left)) calc(var(--height) / 2 + var(--top)), transparent calc(var(--width) / 2 + var(--spotlight-padding, 1rem)), hsl(0, 0%, 100%) calc(var(--width) / 2 + var(--spotlight-padding) + var(--soft-edges)));
  mask: radial-gradient(ellipse at calc(var(--width) / 2 + var(--left)) calc(var(--height) / 2 + var(--top)), transparent calc(var(--width) / 2 + var(--spotlight-padding, 1rem)), hsl(0, 0%, 100%) calc(var(--width) / 2 + var(--spotlight-padding) + var(--soft-edges)));
}
.spotlight.visible.square {
  -webkit-mask: url(#square-mask);
  mask: url(#square-mask);
}</style>
