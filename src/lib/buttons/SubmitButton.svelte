<script lang="ts">
	import type { HTMLButtonAttributes } from 'svelte/elements';

	let { children, ...button_attributes }: HTMLButtonAttributes = $props();
</script>

<button {...button_attributes} type="submit">
	{@render children?.()}
</button>
