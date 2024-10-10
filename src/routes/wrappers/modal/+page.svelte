<script lang="ts" generics="T">
	import { tooltip } from '$lib';
	import FullDialog from '$wrappers/FullDialog.svelte';
	import MiniDialog from '$wrappers/MiniDialog.svelte';

	let dialog = $state<FullDialog<unknown>>();
</script>

{#snippet lorem()}
	<p>
		Lorem ipsum dolor sit, amet consectetur adipisicing elit. Deleniti, tenetur nihil voluptate
		placeat quo delectus sunt consequatur tempore maiores aliquid consequuntur illum molestiae
		corrupti quaerat animi perferendis nesciunt nostrum optio!
	</p>
{/snippet}

{@render lorem()}
{@render lorem()}
{@render lorem()}
<section class="modals">
	<MiniDialog
		button_props={{
			tooltip_options: {
				content: 'Really, open the mini modal!'
			}
		}}
		heading="MiniModal"
	>
		{#snippet button_content()}
			Open the mini modal!
		{/snippet}
		<p use:tooltip={{ content: 'Hello again!' }}>
			Hello! Lorem ipsum dolor sit, amet consectetur adipisicing elit. Deleniti, tenetur nihil
			voluptate placeat quo delectus sunt consequatur tempore maiores aliquid consequuntur illum
			molestiae corrupti quaerat animi perferendis nesciunt nostrum optio!
		</p>
	</MiniDialog>

	<FullDialog
		bind:this={dialog}
		onopening={() => console.log('opening!')}
		button_props={{ tooltip_options: { content: 'Really, open the mega modal!' } }}
		heading="MegaModal"
	>
		{#snippet button_content()}
			Open the mega modal!
		{/snippet}
		{#each { length: 10 } as _}
			{@render lorem()}
		{/each}
	</FullDialog>

	<button onclick={() => dialog?.open()}>You can open the dialog externally, too!</button>

	<!-- TODO: replace with mdsvex snippet -->
	<code>
		<pre>
&lt;button onclick=&#123;()=>dialog?.open()&#125;&gt;
	You can open the dialog externally, too!
&lt;button/&gt;
		</pre>
	</code>
</section>

<style>
	.modals {
		display: grid;
		gap: 1rem;
		align-items: center;
		justify-content: center;
		justify-self: center;
		margin: 2rem;
		z-index: 1;
		position: sticky;
		padding-block: 1rem;
		bottom: 0;
		background-color: var(--background);
		width: 100%;
		height: max-content;
	}
</style>
