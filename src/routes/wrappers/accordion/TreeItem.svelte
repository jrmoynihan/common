<script lang="ts">
	import type { Snippet } from 'svelte';

	let {
		is_node,
		children
	}: {
		is_node: string;
		children: Snippet;
	} = $props();
</script>

<li class="tree-item" style:--is={is_node}>
	{@render children()}
</li>

<style>
	.tree-item {
		all: unset;
		display: flex;
		gap: 2em;
		align-items: center;
		&::before,
		&::after {
			position: absolute;
			content: '';
			left: anchor(var(--to) right);
			right: anchor(var(--is) left);
			background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100' preserveAspectRatio='none'%3E%3Cpath d='M0 0c25 0 50 50 50 50s25 50 50 50' stroke='currentColor' vector-effect='non-scaling-stroke' fill='none' /%3E%3C/svg%3E");
			background-size: calc(100% - var(--offset) * 2) 100%;
			background-position: var(--offset) 0;
			background-repeat: no-repeat;
			pointer-events: none;
		}
		&::before {
			bottom: calc(anchor(var(--to) top) - 0.5 * var(--lh));
			top: anchor(var(--is) center);
			transform: scaleY(-1);
		}
		&::after {
			top: calc(anchor(var(--to) top) + 0.5 * var(--lh));
			bottom: anchor(var(--is) center);
		}
	}
	:global(details:not([open])) {
		& .tree-item {
			&::before,
			&::after {
				display: none;
			}
		}
	}
</style>
