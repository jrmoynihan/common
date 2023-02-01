<script lang="ts">
	import type { SelectOption, SelectOptionGroup } from './types';

	export let option: SelectOption | SelectOptionGroup;
</script>

{#if 'options' in option}
	<optgroup label={option.label}>
		{#each option.options as suboption}
			<svelte:self option={suboption} />
		{/each}
	</optgroup>
{:else}
	<option value={option.value} disabled={option.disabled}>
		{option.display_text ?? ''}
	</option>
{/if}

<style lang="scss">
</style>
