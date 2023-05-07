<script>export let option;
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

<style></style>
