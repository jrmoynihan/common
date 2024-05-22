<script context="module" lang="ts">
	export interface SeenToastProps {
		title: string;
		local_storage_key: string;
		children: Snippet;
	}
</script>

<script lang="ts">
	import { browser } from '$app/environment';
	import ToggleSwitch from '$buttons/ToggleSwitch.svelte';
	import { set_local_storage_item } from '$functions/local-storage.js';
	import type { Snippet } from 'svelte';
	import DefaultToast from './DefaultToast.svelte';

	let {
		title = '',
		local_storage_key = browser ? crypto.randomUUID() : '',
		children
	}: SeenToastProps = $props();

	let checked = $state(false);

	$effect(() => {
		if (checked) {
			set_local_storage_item(local_storage_key, 'true');
		} else {
			set_local_storage_item(local_storage_key, 'false');
		}
	});
</script>

<div class="grid">
	<DefaultToast {title}>
		{@render children()}
	</DefaultToast>
	<ToggleSwitch
		bind:checked
		label_position={'after'}
		label_text={checked ? `Won't show this again` : `Don't show this next time?`}
		style={'display: grid; grid-template-columns: auto 1fr; cursor: pointer;'}
	/>
</div>

<style>
	.grid {
		display: grid;
		place-items: center;
		place-content: center;
		gap: 0.5rem;
		margin: 0 auto;
	}
</style>
