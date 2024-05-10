<script lang="ts">
	import type { Snippet } from "svelte";

	interface BreadcrumbProps {
		obj: Record<string, unknown>,
		selected_child?: unknown,
		selected_key?: string,
		crumb_separator?: Snippet
	}
	let {
		obj = {},
		selected_key = $bindable(Object.keys(obj)[0]),
		selected_child = $bindable(obj[selected_key] ?? null),
		crumb_separator 
	} : BreadcrumbProps = $props();
</script>

<!-- <a href="./home/">
    <span class="crumbicon">
      <svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true">
        <use href="#home-icon" />
      </svg>
    </span>
    <span class="home-label">Home</span>
  </a> -->

<span class="crumb">
	<button onclick={() => (selected_child = undefined)}>{selected_key}</button>
	<!--Or make this an <a> with href?-->
	<span class="crumbicon">
		<svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true">
			{#if Object.keys(obj).length > 0}
				<use href="#icon-dropdown-arrow" />
			{/if}
		</svg>
		<select
			class="disguised-select"
			title="Navigate to another category"
			bind:value={selected_key}
			onchange={() => (selected_child = obj[selected_key])}
		>
			{#each Object.keys(obj) as key}
				<option>{key}</option>
			{/each}
		</select>
	</span>
</span>
{#if selected_child && Object.keys(selected_child).length > 0}
	{#if crumb_separator}
		{@render crumb_separator()}
	{/if}
	{#key obj}
		<svelte:self obj={selected_child} />
	{/key}
{/if}

<style>
	/* a, */
	button {
		display: inline-flex;
		align-items: center;
		gap: calc(var(--nav-gap) / 4);
		appearance: none;
	}
	.crumb {
		display: inline-flex;
		align-items: center;
		gap: calc(var(--nav-gap) / 4);
		
		&:last-of-type {
            scroll-snap-align: end;
        }

		/* & > a {
			white-space: nowrap;

			&[aria-current='page'] {
				font-weight: bold;
			}
		} */
	}

	.crumbicon {
		--size: 3ch;
		display: grid;
		grid: [stack] var(--size) / [stack] var(--size);
		align-items: center;
		justify-items: center;
		place-items: center;
		border-radius: 50%;
		--icon-shadow-size: 0px;
		box-shadow: inset 0 0 0 var(--icon-shadow-size) currentColor;

		& > * {
			grid-area: stack;
		}
		& > svg {
			max-block-size: 100%;
			margin: calc(var(--nav-gap) / 4);
			stroke: currentColor;
			fill: none;
			stroke-linecap: round;
			stroke-linejoin: round;
			stroke-width: 1px;
		}
		&:is(:focus-within, :hover) {
			--icon-shadow-size: 2px;
		}
		@media (prefers-reduced-motion: no-preference) {
			transition: box-shadow 0.2s ease;
		}
	}

	.disguised-select {
		inline-size: 100%;
		block-size: 100%;
		opacity: 0.01;
		font-size: min(100%, 16px);
	}
</style>
