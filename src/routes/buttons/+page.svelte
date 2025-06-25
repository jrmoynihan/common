<script lang="ts">
	import type { TooltipDirections } from '$lib/attach/tooltip/tooltip.svelte.js';
	import ButtonRunes from '$buttons/Button_Runes.svelte';
	import ResetButton from '$buttons/ResetButton.svelte';
	import ToggleSwitch from '$buttons/ToggleSwitch.svelte';
	import { Log, checkered_flag } from '$functions/logging.js';
	import { SubmitButton, tooltip } from '$lib';
	import { complex_state } from '$routes/stores.svelte';

	let position: TooltipDirections = $state<TooltipDirections>('top');
	let keep_visible: boolean = $state(false);
	let gradient_direction: TooltipDirections = $state('bottom');
	let disabled = $state(false);

	$effect(() => {
		switch (position) {
			case 'top':
				gradient_direction = 'bottom';
			case 'bottom':
				gradient_direction = 'top';
			case 'left':
				gradient_direction = 'right';
			case 'right':
				gradient_direction = 'left';
			default:
				gradient_direction = 'bottom';
		}
	});

	function onclick() {
		keep_visible = !keep_visible;
	}
</script>

<section class="buttons">
	{#snippet tooltip_one()}
		Click me!
	{/snippet}
	<ButtonRunes
		bind:disabled
		onclick={() => {
			disabled = !disabled;
			Log({
				msg: 'clicking with the low elevation button?',
				title: 'HEY YOU CLICKED ME!',
				icon: checkered_flag
			});
		}}
		{@attach tooltip({
			position,
			content_snippet: tooltip_one,
			keep_visible,
			args: 'test'
		})}
		--shadow-color={'350deg 50% 70%'}
	>
		I'm a button with low elevation
	</ButtonRunes>
	<ButtonRunes
		style={`--shadow-color: 350deg 50% 70%;`}
		{@attach tooltip({ position, content: tooltip_one, keep_visible })}
	>
		I'm a button with medium elevation
	</ButtonRunes>
	<ResetButton class="red" {onclick}>I'm a reset button with high elevation!!</ResetButton>
	<SubmitButton class="green" {onclick}>I'm a submit button with high elevation!!</SubmitButton>

	<ToggleSwitch
		bind:checked={complex_state.player.toggled}
		style={'display: grid; transition: background-color 250ms ease, color 250ms ease; gap: 1rem; grid-auto-flow: column; padding: 1rem;'}
		label_dynamic_styles={{
			hover_styles: 'background-color: darkgreen;',
			styles: `text-transform: capitalize; ${complex_state.player.toggled === true ? '' : 'text-decoration: line-through'}`
		}}
	>
		<p>I'm a toggle switch!</p>
	</ToggleSwitch>
</section>

<style module="mixed">
	section {
		display: flex;
		flex-wrap: wrap;
		place-content: center;
		place-items: center;
		margin: auto;
		grid: auto / repeat(2, 1fr);
		gap: 2rem;
	}
</style>
