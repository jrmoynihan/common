<script context="module" lang="ts">
	export interface SeenToastProps {
		title: string;
		msg: string;
		local_storage_key: string;
	}
</script>

<script lang="ts">
	import { browser } from '$app/environment';
	import ToggleSwitch from '$buttons/ToggleSwitch.svelte';
	import { setLocalStorageItem } from '$functions/local-storage.js';
	import DefaultToast from './DefaultToast.svelte';

	let {
		title = '',
		msg = '',
		local_storage_key = browser ? crypto.randomUUID() : ''
	}: SeenToastProps = $props();

	let checked = $state(false);

	$effect(() => {
		if (checked) {
			setLocalStorageItem(local_storage_key, 'true');
		} else {
			setLocalStorageItem(local_storage_key, 'false');
		}
	});
</script>

<div class="grid">
	<DefaultToast {msg} {title} />
	<ToggleSwitch
		bind:checked
		label_position={'after'}
		label_text={checked ? `Won't show this again` : `Don't show this next time?`}
		style={'display: grid; grid-template-columns: auto 1fr; cursor: pointer;'}
	/>
</div>

<style lang="scss">
	.grid {
		display: grid;
		place-items: center;
		place-content: center;
		gap: 0.5rem;
		margin: 0 auto;
	}
</style>
