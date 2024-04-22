<script lang="ts">
import type { TooltipDirections } from "$actions/tooltip/tooltip.svelte.js";
import Button from "$buttons/Button.svelte";
import ButtonRunes from "$buttons/Button_Runes.svelte";
import ToggleSwitch from "$buttons/ToggleSwitch.svelte";
import { delay } from "$functions/helpers.svelte.js";
import { Log, checkeredFlag } from "$functions/logging.js";
import { defaultToast } from "$toasts/toasts.js";

let position: TooltipDirections = $state("top");
let keep_visible: boolean = $state(false);

async function testToastUpdate() {
	const id = await defaultToast({ duration: 5_000 });
	await updateToasts(id);
	await defaultToast({ id, msg: "finished", progress: 0 });
}

async function updateToast(id: number, i: number) {
	await defaultToast({ id, msg: `updating ${i}`, next: i / 10 });
}
async function updateToasts(id: number) {
	for (const i of Array.from({ length: 10 }) as number[]) {
		await delay(1000);
		await updateToast(id, i);
	}
}

let gradient_direction: TooltipDirections = $state("bottom");

$effect(() => {
	switch (position) {
		case "top":
			gradient_direction = "bottom";
		case "bottom":
			gradient_direction = "top";
		case "left":
			gradient_direction = "right";
		case "right":
			gradient_direction = "left";
		default:
			gradient_direction = "bottom";
	}
});

let step = $state(0);
let heading_three: HTMLHeadingElement | undefined = $state(undefined);
let high_button: HTMLButtonElement | undefined = $state(undefined);
</script>

<section class="buttons">
	{#snippet tooltip_one()}
		Click me!
	{/snippet}
	<Button
		on:click={() => {
			step++;
			Log({
				msg: 'clicking with the low elevation button?',
				title: 'HEY YOU CLICKED ME!',
				icon: checkeredFlag
			});
		}}
		text="I'm a button with low elevation"
		styles={`--shadow-color: 350deg 50% 70%;background: linear-gradient(to ${gradient_direction}, hsla(195, 40%, 60%, 30%), hsla(95, 40%, 60%, 30%), hsla(295, 40%, 60%, 30%) );`}
		box_shadow_elevation="low"
		tooltip_options={{ position, content: tooltip_one, keep_visible }}
	/>
	<Button
		on:click={() => testToastUpdate()}
		text="I'm a button with medium elevation"
		styles={`--shadow-color: 350deg 50% 70%;background-color: ${
			position === 'top' ? 'hsla(195, 10%, 60%, 20%)' : `green`
		};`}
		box_shadow_elevation="medium"
		tooltip_options={{ position, content: tooltip_one, keep_visible }}
	/>
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
	<ButtonRunes
		bind:button={high_button}
		classes='orange'
		attributes={{ onclick: () => keep_visible = !keep_visible, unselectable: 'on' }}>
		I'm a button with high elevation!!
	</ButtonRunes>

	<ToggleSwitch
		bind:checked={keep_visible}
		label_text={`I'm a toggle switch!`}
		button_props={{
			styles:
				'display: grid; transition: color 400ms ease; gap: 1rem; grid-auto-flow: column; --toggle-button-background: hsla(0,70%, 50%, 30%); padding: 1rem;',
			hover_styles: 'background-color: green;'
		}}
		label_hover_styles={'color: yellow;'}
	/>
	<ButtonRunes dynamic_styles={{hover_styles: 'box-shadow: 0 0 10px yellow'}} />
	<h3 
	class="orange"
	bind:this={heading_three}
	style:opacity={step <= 2 ? 1 : 0}
	>
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
	<button class="orange">
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
	label {
		display: flex;
		gap: 1rem;
		place-items: center;
		place-self: center;
	}
	@layer button {
		.button.orange {
			background-color: orange;
		}
	}
	button {
		background-color: green;
	}
</style>
