<script lang="ts">
	import { browser } from '.svelte-kit/runtime/app/env.js';
	import ToggleSwitch from '$lib/buttons/ToggleSwitch.svelte';
	import { setLocalStorageItem } from '../functions/local-storage.js';

	export let message_markup = '';
	export let local_storage_key = browser ? crypto.randomUUID() : '';
	let checked = false;

	$: if (checked) {
		setLocalStorageItem(local_storage_key, 'true');
	} else {
		setLocalStorageItem(local_storage_key, 'false');
	}
</script>

<div class="grid">
	{@html message_markup}

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
		gap: 0.75rem;
		margin: 0 auto;
	}
	.toggle {
		grid-template-columns: auto 1fr;
		font-size: small;
	}
</style>
