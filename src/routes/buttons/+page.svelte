<script lang="ts">
	import type { TooltipDirections } from '$actions/tooltip/tooltip.svelte.js';
	import ButtonRunes from '$buttons/Button_Runes.svelte';
	import ResetButton from '$buttons/ResetButton.svelte';
	import ToggleSwitch from '$buttons/ToggleSwitch.svelte';
	import { delay } from '$functions/helpers.svelte.js';
	import { Log, checkered_flag } from '$functions/logging.js';
	import { SubmitButton } from '$lib';
	import { complex_state } from '$routes/stores.svelte';
	// import { default_toast } from "$toasts/toasts.js";

	let position: TooltipDirections = $state<TooltipDirections>('top');
	let keep_visible: boolean = $state(false);

	async function testToastUpdate() {
		disabled = false;
		// const id = await default_toast({ duration: 5_000 });
		// await updateToasts(id);
		// await default_toast({ id, msg: "finished", progress: 0 });
	}

	async function updateToast(id: number, i: number) {
		// await default_toast({ id, msg: `updating ${i}`, next: i / 10 });
	}
	async function updateToasts(id: number) {
		for (const i of Array.from({ length: 10 }) as number[]) {
			await delay(1000);
			await updateToast(id, i);
		}
	}

	let gradient_direction: TooltipDirections = $state('bottom');

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

	let step = $state(0);
	let heading_three: HTMLHeadingElement | undefined = $state(undefined);
	let high_button: HTMLButtonElement | undefined = $state(undefined);
	let disabled = $state(false);

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
			step++;
			Log({
				msg: 'clicking with the low elevation button?',
				title: 'HEY YOU CLICKED ME!',
				icon: checkered_flag
			});
		}}
		dynamic_styles={{
			styles: `;background: linear-gradient(to ${gradient_direction}, hsla(195, 40%, 60%, 30%), hsla(95, 40%, 60%, 30%), hsla(295, 40%, 60%, 30%) );`
		}}
		tooltip_options={{ position, content_snippet: tooltip_one, keep_visible }}
		--shadow-color={'350deg 50% 70%'}
	>
		I'm a button with low elevation
	</ButtonRunes>
	<ButtonRunes
		onclick={testToastUpdate}
		style={`--shadow-color: 350deg 50% 70%;`}
		tooltip_options={{ position, content_snippet: tooltip_one, keep_visible }}
	>
		I'm a button with medium elevation
	</ButtonRunes>
	<!-- <div bind:this={high_button}>
		<Button
			on:click={() => {
				keep_visible = !keep_visible;
				step = 0;
			}}
			text="I'm a button with high elevation"
			box_shadow_elevation="high"
			styles={'--button-hover-background: linear-gradient(to bottom left, hsla(350, 100%, 50%, 80%), hsl(33, 100%, 55%),  hsla(350, 100%, 50%, 80%)); --shadow-color: 350deg 50% 70%; '}
			tooltip_options={{
				position,
				content: tooltip_one,
				keep_visible
			}}
		/>
	</div> -->
	<ResetButton classes="red" {onclick}>I'm a reset button with high elevation!!</ResetButton>
	<SubmitButton classes="green" {onclick}>I'm a submit button with high elevation!!</SubmitButton>

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
	{complex_state.player.toggled}
	<ButtonRunes dynamic_styles={{ hover_styles: 'box-shadow: 0 0 10px yellow' }} />
	<h3 class="orange" bind:this={heading_three} style:opacity={step <= 2 ? 1 : 0}>
		<!-- use:spotlight={{
		shape: 'circle',
		padding: 0,
		duration: 1000,
		delay: 1000,
		steps: [
			{
				node: heading_three,
				opacity: 0.5,
				padding: 0,
				shape: 'ellipse',
			},
			{
				node: high_button,
				opacity: 0.5,
				padding: 48,
			},
			]
		}
	} -->
		Is that enough?
	</h3>
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
	@layer button {
		/* .button.orange {
			background-color: orange;
		} */
	}
</style>
