<script>export let id;
export let text;
export let header_type = 3;
</script>

<a {id}>
	{#if header_type === 1}
		<h1>
			{text}
			<slot />
		</h1>
	{/if}
	{#if header_type === 2}
		<h2>
			{text}
			<slot />
		</h2>
	{/if}
	{#if header_type === 3}
		<h3>
			{text}
			<slot />
		</h3>
	{/if}
	{#if header_type === 4}
		<h4>
			{text}
			<slot />
		</h4>
	{/if}
	{#if header_type === 5}
		<h5>
			{text}
			<slot />
		</h5>
	{/if}
	{#if header_type === 6}
		<h6>
			{text}
			<slot />
		</h6>
	{/if}
</a>

<style></style>
