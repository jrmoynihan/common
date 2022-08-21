<script lang="ts">
	import { fly } from 'svelte/transition';

	export let refresh: unknown;
	export let customStyles = '';
	export let customClasses = '';
	export let inTransition = fly;
	export let inTransitionParams = { duration: 200, x: -50, delay: 300 };
	export let outTransition = fly;
	export let outTransitionParams = { duration: 200, x: 50 };

	// https://dev.to/evanwinter/page-transitions-with-svelte-kit-35o6
</script>

<div class="transition-outer">
	{#key refresh}
		<div
			class="transition-inner {customClasses}"
			style={customStyles}
			in:inTransition={inTransitionParams}
			out:outTransition={outTransitionParams}
		>
			<slot />
		</div>
	{/key}
</div>

<style lang="scss">
	.transition-outer {
		display: grid;
		grid-template: 1fr 1fr;
		width: 100%;
	}
	.transition-inner {
		box-sizing: border-box;
		position: relative;
		max-width: 100%;
		background-size: cover;
		will-change: opacity transform;
		display: grid;
		grid-auto-rows: max-content;
		grid-row: 1;
		grid-column: 1;
		justify-content: center;
	}
</style>
