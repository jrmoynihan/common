<script lang="ts">
	import { browser } from '$app/environment';
	import ToggleSwitch from '$lib/buttons/ToggleSwitch.svelte';
	import { setLocalStorageItem } from '$lib/functions/local-storage.js';
	import DefaultToast from './DefaultToast.svelte';

	export let title: string = '';
	export let msg: string = '';
	export let local_storage_key = browser ? crypto.randomUUID() : '';
	let checked = false;

	$: if (checked) {
		setLocalStorageItem(local_storage_key, 'true');
	} else {
		setLocalStorageItem(local_storage_key, 'false');
	}
</script>

<div class="grid">
	<DefaultToast {msg} {title} />

	<div class="grid toggle">
		<ToggleSwitch bind:checked />
		<p on:click={() => (checked = !checked)} style="cursor: pointer;">
			{checked ? `Won't show this again` : `Don't show this next time?`}
		</p>
	</div>
</div>

<style lang="scss">
	.grid {
		display: grid;
		place-items: center;
		place-content: center;
		gap: 0.25rem;
		margin: 0 auto;
	}
	.toggle {
		grid-template-columns: auto 1fr;
		font-size: small;
	}
</style>
