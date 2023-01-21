<script lang="ts">
	import Button from '$buttons/Button.svelte';
	import ToggleSwitch from '$buttons/ToggleSwitch.svelte';
	import { arrayFromNumber, delay } from '$functions/helpers.js';
	import { checkeredFlag, Log } from '$functions/logging.js';
	// import { realShadow } from '../styles/shadow.js';
	import { tutorial } from '$actions/general.js';
	import type { TooltipDirections } from '$actions/tooltip/tooltip.js';
	import { defaultToast } from '$toasts/toasts.js';
	import { onMount } from 'svelte';

	let position: TooltipDirections = 'top';
	let keep_visible: boolean = false;
	// let shadows = realShadow({
	// 	hsl: '0deg 100% 100%',
	// 	elevation: 'high',
	// 	horizontal_distance: -1,
	// 	vertical_distance: 0
	// });
	let gradient_direction: TooltipDirections = 'bottom';

	async function testToastUpdate() {
		const id = await defaultToast({ duration: 5_000 });
		await updateToasts(id);
		await defaultToast({ id, msg: 'finished', progress: 0 });
	}

	async function updateToast(id: number, i: number) {
		console.log('updating toast', id, i);
		await defaultToast({ id, msg: `updating ${i}`, next: i / 10 });
	}
	async function updateToasts(id: number) {
		for (const i of arrayFromNumber(10)) {
			await delay(1000);
			await updateToast(id, i);
		}
	}

	$: {
		switch (position) {
			case 'top':
				gradient_direction = 'bottom';
				break;
			case 'bottom':
				gradient_direction = 'top';
				break;
			case 'left':
				gradient_direction = 'right';
				break;
			case 'right':
				gradient_direction = 'left';
				break;
		}
	}
	let step = 0;
	let heading_three: HTMLHeadingElement;
	let high_button: HTMLDivElement;

	onMount(() => {
		setTimeout(() => {
			step++;
		}, 1_000);
	});
</script>

step: {step}
<section class="buttons">
	<div class="directions">
		<h3
			use:tutorial={{
				tooltip: {
					visible: step === 1,
					title: `Cool spotlight, right?`,
					position,
					disabled: step !== 1,
					delay: 500,
					steps: [
						{
							node: heading_three,
							title: 'This is a heading',
							position,
							disabled: step !== 1,
						},
						{
							node: high_button,
							title: 'This is a button',
							position,
							disabled: step !== 1,
						}
					]
				},
				spotlight: {
					shape: 'circle',
					padding: 40,
					visible: step === 1,
					duration: 1000,
					steps: [
						{
							node: heading_three,
							shape: 'circle',
							opacity: 0.5,
							padding: 10,
							onClose: () => {
								defaultToast({ msg: 'moving on...', duration: 1_000 });
								step++;
							}
						},
						{
							node: high_button,
							shape: 'ellipse',
							color: 'hsl(5, 70%, 20%)',
							opacity: 0.55,
							padding: 60,
							onClose: () => {
								defaultToast({ msg: 'closing', duration: 1_000 });
								step++;
							}
						}
					]
				}
			}}
			style=" grid-column: span 2; place-self: center; width: max-content"
		>
			Tooltip Direction
		</h3>
		{#each ['top', 'right', 'bottom', 'left'] as direction}
			<label for={direction}>
				{direction}
			</label>
			<input id={direction} type="radio" bind:group={position} value={direction} />
		{/each}
	</div>
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
		tooltip_options={{ position, title: 'Click me!', log_functions: true, keep_visible }}
	/>
	<Button
		on:click={() => testToastUpdate()}
		text="I'm a button with medium elevation"
		styles={`--shadow-color: 350deg 50% 70%;background-color: ${
			position === 'top' ? 'hsla(195, 10%, 60%, 20%)' : `green`
		};`}
		box_shadow_elevation="medium"
		tooltip_options={{ position, title: 'Click me!', log_functions: true, keep_visible }}
	/>
	<div bind:this={high_button}>
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
				title: 'Click me!',
				keep_visible
			}}
		/>
	</div>

	<ToggleSwitch
		bind:checked={keep_visible}
		on:toggle={(e) => console.log(e.detail.checked)}
		label_text={`I'm a toggle switch!`}
		button_props={{
			styles:
				'display: grid; transition: color 400ms ease; gap: 1rem; grid-auto-flow: column; --toggle-button-background: hsla(0,70%, 50%, 30%); padding: 1rem;',
			hover_styles: 'background-color: green;'
		}}
		label_hover_styles={'color: yellow;'}
	/>
	<Button hover_styles={'box-shadow: 0 0 10px yellow'} />
	<h3 bind:this={heading_three} style:opacity={step <= 2 ? 1 : 0}>
		<!-- use:tutorial={{
			tooltip: { visible: step === 2, title: 'It really is!', position, disabled: step !== 2 },
			spotlight: {
				visible: step === 2,
				shape: 'ellipse',
				duration: 400,
				onClose: async () => step++
			}
		}} -->
		Is that enough?
	</h3>
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
