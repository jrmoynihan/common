<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';

	interface BreadcrumbProps extends HTMLAttributes<HTMLElement> {
		crumbs: {};
	}

	let { crumbs, ...attributes }: BreadcrumbProps = $props();
</script>

<svg style="display: none;">
	<symbol id="icon-home">
		<title>A home icon</title>
		<path
			d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
		/>
	</symbol>

	<symbol id="icon-dropdown-arrow" rotate="-90deg">
		<title>A down arrow</title>
		<path d="M19 9l-7 7-7-7" />
	</symbol>
</svg>

{#snippet crumb_separator()}
	<span class="crumb-separator" aria-hidden="true">{String.fromCodePoint(0x226b)}</span>
{/snippet}

<!-- svelte-ignore a11y_no_redundant_roles -->
<nav role="navigation" class="breadcrumbs" {...attributes}>
	<!--Or use SvelteFa component-->
	{#if Object.keys(crumbs).length > 0}
		<!-- <Breadcrumb obj={crumbs} {crumb_separator} /> -->
	{/if}
</nav>

<style>
	.breadcrumbs {
		--nav-gap: 2ch;

		display: inline-flex;
		align-items: baseline;
		gap: var(--nav-gap);
		padding: calc(var(--nav-gap) / 2);
		overflow-x: auto;
		overscroll-behavior-x: contain;
		scroll-snap-type: x proximity;
		scroll-padding-inline: calc(var(--nav-gap) / 2);
		flex-wrap: wrap;

		@supports (-webkit-hyphens: none) {
			& {
				scroll-snap-type: none;
			}
		}
	}

	@media (width <= 480px) {
		/* .breadcrumbs .home-label {
            display: none;
        } */
	}
	@media (prefers-reduced-motion: no-preference) {
		/* .crumbicon {
            transition: box-shadow .2s ease;
        } */
	}
</style>
