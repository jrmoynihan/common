<svelte:options accessors={true} />

<script lang="ts">
	import { fade } from 'svelte/transition';

	export let width_px: string = '';
	export let height_px: string = '';
	export let top_px: string = '';
	export let left_px: string = '';
	export let width: number = 0;
	export let height: number = 0;
	export let top: number = 0;
	export let left: number = 0;
	export let padding: number = 16;
	export let padding_width: number = padding;
	export let padding_height: number = padding;
	export let visible = false;
	export let delay: number = 0;
	export let duration: number = 400;
	export let opacity: number = 0.75;
	export let color: string = null;
	export let soft_edges: boolean = true;
	export let soft_edge_distance: string = '1.5rem';
	export let shape: 'circle' | 'ellipse' | 'square' = 'circle';
	export let onClose: () => void = async () => {};
	export let onOpen: () => void = async () => {};
	$: hasOpened = visible ? true : hasOpened;

	async function close() {
		await onClose?.();
	}

	async function open() {
		await onOpen?.();
	}

	$: if (visible) {
		open();
	} else if (hasOpened) {
		close();
	}

	// let dialog: HTMLDialogElement;
	// $: dialog?.showModal();
	
</script>

{#if visible}
	{#if shape === 'square'}
		<svg>
			<defs>
			<mask id="square-mask">
				<rect fill="white" x="0" y="0" width="100%" height="100%" opacity={`${opacity * 100}%`} />
				<rect
				fill="black"
				x={left - padding_width / 2}
				y={top - padding_height / 2}
				width={width + padding_width}
				height={height + padding_height}
				/>
			</mask>
		</defs>
		<rect fill="black" x="0" y="0" width="100%" height="100%" mask="url(#square-mask)"/>
		</svg>
	{/if}
	<button
		transition:fade={{ duration, delay }}
		class="spotlight"
		class:visible
		class:circle={shape === 'circle'}
		class:ellipse={shape === 'ellipse'}
		class:square={shape === 'square'}
		style:--height={height_px}
		style:--width={width_px}
		style:--top={top_px}
		style:--left={left_px}
		style:--spotlight-padding={`${padding}px`}
		style:--soft-edges={soft_edges ? soft_edge_distance : '0'}
		style:--opacity={opacity}
		style:--color={color}
		on:click|self|stopPropagation={() => {
			visible = false;
		}}
	/>
{/if}

<style lang="scss">
	svg {
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

		&.visible {
			pointer-events: initial;
			background-color: var(--color, hsla(0, 0%, 0%, 100%));
			opacity: var(--opacity, 75%);

			&.circle {
				-webkit-mask: radial-gradient(
					circle at calc(var(--width) / 2 + var(--left)) calc(var(--height) / 2 + var(--top)),
					transparent calc(var(--width) / 2 + var(--spotlight-padding, 1rem)),
					hsla(0, 0%, 100%, 100%)
						calc(var(--width) / 2 + var(--spotlight-padding) + var(--soft-edges))
				);
				mask: radial-gradient(
					circle at calc(var(--width) / 2 + var(--left)) calc(var(--height) / 2 + var(--top)),
					transparent calc(var(--width) / 2 + var(--spotlight-padding, 1rem)),
					hsla(0, 0%, 100%, 100%)
						calc(var(--width) / 2 + var(--spotlight-padding) + var(--soft-edges))
				);
			}
			&.ellipse {
				-webkit-mask: radial-gradient(
					ellipse at calc(var(--width) / 2 + var(--left)) calc(var(--height) / 2 + var(--top)),
					transparent calc(var(--width) / 2 + var(--spotlight-padding, 1rem)),
					hsla(0, 0%, 100%, 100%)
						calc(var(--width) / 2 + var(--spotlight-padding) + var(--soft-edges))
				);
				mask: radial-gradient(
					ellipse at calc(var(--width) / 2 + var(--left)) calc(var(--height) / 2 + var(--top)),
					transparent calc(var(--width) / 2 + var(--spotlight-padding, 1rem)),
					hsla(0, 0%, 100%, 100%)
						calc(var(--width) / 2 + var(--spotlight-padding) + var(--soft-edges))
				);
			}
			&.square {
				-webkit-mask: url(#square-mask);
				mask: url(#square-mask);
			}
		}
	}
</style>
