<script lang="ts">
	import type { TooltipDirections } from '$lib';
	import { realShadow } from '$lib/styles/shadow';
	import Button from '$lib/buttons/Button.svelte';
	import ToggleSwitch from '$lib/buttons/ToggleSwitch.svelte';

	let position: TooltipDirections = 'top';
	let keep_visible: boolean = false;
	let shadows = realShadow({
		hsl: '0deg 100% 100%',
		elevation: 'high',
		horizontal_distance: -1,
		vertical_distance: 0
	});
</script>

<section class="buttons">
	<div class="directions">
		<h3 style="grid-column: span 2; place-self: center; width: max-content">Tooltip Direction</h3>
		{#each ['top', 'right', 'bottom', 'left'] as direction}
			<label for={direction}>
				{direction}
			</label>
			<input id={direction} type="radio" bind:group={position} value={direction} />
		{/each}
	</div>
	<Button
		text="I'm a button with low elevation"
		static_styles={'--shadow-color: 350deg 50% 70%; background-color: hsla(195, 10%, 60%, 20%);'}
		box_shadow="low"
		tooltip_options={{ position, title: 'Click me!', log_functions: true, keep_visible }}
	/>
	<Button
		text="I'm a button with medium elevation"
		static_styles={'--shadow-color: 350deg 50% 70%; background-color: hsla(195, 10%, 60%, 20%);'}
		box_shadow="medium"
		tooltip_options={{ position, title: 'Click me!', log_functions: true, keep_visible }}
	/>
	<Button
		on:click={() => (keep_visible = !keep_visible)}
		text="I'm a button with high elevation"
		box_shadow="high"
		static_styles={'--button-hover-background: linear-gradient(to bottom left, hsla(350, 100%, 50%, 80%), hsl(33, 100%, 55%),  hsla(350, 100%, 50%, 80%)); --shadow-color: 350deg 50% 70%; '}
		tooltip_options={{
			position,
			title: 'Click me!',
			keep_visible
		}}
	/>
	<button style={`${shadows} padding: 1rem; background: inherit; color: var(--text);`}
		>[WIP] Shadow Generation</button
	>
	<ToggleSwitch
		bind:checked={keep_visible}
		label_text={`I'm a toggle switch!`}
		button_styles={'display: grid; gap: 1rem; grid-auto-flow: column; --toggle-button-background: hsla(0,70%, 50%, 30%);'}
	/>
	<Button hover_styles={[['box-shadow', '0 0 10px yellow']]} />
</section>

<style lang="scss">
	section {
		display: flex;
		place-items: center;
		margin: auto;
		grid: auto / repeat(2, 1fr);
		gap: 2rem;
	}
	.directions {
		display: grid;
		grid-template-columns: max-content 1fr;
		gap: 1rem;
		margin: 1rem;
	}
	label {
		display: flex;
		gap: 1rem;
		place-items: center;
		place-self: center;
	}
</style>
