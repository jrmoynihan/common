<script lang="ts" generics="T">
	import { tooltip, Button } from '$lib';
	import FullDialog from '$wrappers/FullDialog.svelte';
	import MiniDialog from '$wrappers/MiniDialog.svelte';

	let dialog = $state<FullDialog<unknown>>();
</script>

{#snippet lorem()}
	<p use:tooltip={{ content: 'Hello again!' }}>
		Lorem ipsum dolor sit, amet consectetur adipisicing elit. Deleniti, tenetur nihil voluptate
		placeat quo delectus sunt consequatur tempore maiores aliquid consequuntur illum molestiae
		corrupti quaerat animi perferendis nesciunt nostrum optio!
	</p>
{/snippet}

<section class="modals">
	<MiniDialog
		button_props={{
			tooltip_props: {
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
		button_props={{ tooltip_props: { content: 'Really, open the mega modal!' } }}
		heading="MegaModal"
	>
		{#snippet button_content()}
			Open the mega modal!
		{/snippet}
		{#each { length: 10 } as _}
			{@render lorem()}
		{/each}
	</FullDialog>

	<hr />
	<Button class="mt-4" onclick={() => dialog?.open()}>
		You can open the dialog externally, too!
	</Button>

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

		& > :global(button) {
			font-weight: bold;
			font-size: large;
			background: linear-gradient(darkcyan -70%, rgb(9, 94, 94) 25%, darkcyan 190%);
			margin-inline: auto;
			max-width: max-content;
			padding: 0.5rem 1rem;
			border-radius: 1em;
		}
	}
	code {
		white-space: pre-wrap;
		word-break: break-all;
		overflow-x: auto;
		overflow-y: hidden;
		scrollbar-width: thin;
		scrollbar-color: var(--accent) var(--background);
		scrollbar-gutter: stable;
		scrollbar-gutter: stable;
		background-color: light-dark(oklch(0.9 0 0), oklch(0.5 0 0));
		padding: 1rem;
		border-radius: 0.5rem;
		border: 1px solid var(--accent);
		color: var(--text);
	}
</style>
