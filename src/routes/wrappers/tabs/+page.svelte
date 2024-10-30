<script lang="ts">
	import CustomComponent from '$routes/tooltips/CustomComponent.svelte';
	import TabsRunes, { type ComponentTab, type SnippetTab } from '$wrappers/Tabs_Runes.svelte';
	import { fly } from 'svelte/transition';

	const tabs: SnippetTab[] = [
		{ title: 'One', snippet: content_one },
		{ title: 'Two', snippet: content_two },
		{ title: 'Three', snippet: content_three },
		{ title: 'One', snippet: content_one },
		{ title: 'Two', snippet: content_two },
		{ title: 'Three', snippet: content_three },
		{ title: 'One', snippet: content_one },
		{ title: 'Two', snippet: content_two },
		{ title: 'Three', snippet: content_three },
		{ title: 'One', snippet: content_one },
		{ title: 'Two', snippet: content_two },
		{ title: 'Three', snippet: content_three },
		{ title: 'One', snippet: content_one },
		{ title: 'Two', snippet: content_two },
		{ title: 'Three', snippet: content_three },
		{ title: 'One', snippet: content_one },
		{ title: 'Two', snippet: content_two },
		{ title: 'Three', snippet: content_three },
		{ title: 'One', snippet: content_one },
		{ title: 'Two', snippet: content_two },
		{ title: 'Three', snippet: content_three }
	];
	const component_tabs: ComponentTab<typeof CustomComponent>[] = [
		{
			title: 'Custom 1',
			Component: CustomComponent,
			props: {
				text: "I'm custom component #1!",
				color: 'black',
				background: 'orange',
				required_text: 'this text was required'
			}
		},
		{
			title: 'Custom 2',
			Component: CustomComponent,
			props: {
				text: "I'm custom component #2!",
				color: 'var(--text)',
				background: 'darkblue',
				required_text: 'this text was required'
			}
		},
		{
			title: 'Custom 3',
			Component: CustomComponent,
			props: {
				text: "I'm custom component #3!",
				color: 'var(--text)',
				background: 'darkseagreen',
				required_text: 'this text was required'
			}
		}
	];
</script>

{#snippet content_one()}
	<p transition:fly><strong>Snippet content #1</strong></p>
{/snippet}

{#snippet content_two()}
	<p>
		Snippet content #2:
		<em
			>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Aspernatur delectus minus dolor
			nesciunt hic culpa accusamus odit voluptatem in quod voluptatibus, eos beatae magnam, facere
			eveniet porro odio ea error.</em
		>
	</p>
{/snippet}

{#snippet content_three()}
	<p><em>Snippet content #3</em></p>
{/snippet}

<!-- <TabsExample /> -->

<TabsRunes
	{tabs}
	tab_content_transition_parameters={{ types: ['fly'], symmetrical: false }}
	--tab-border-radius="0.5rem"
	--tab-border-radius-bottom="0"
	--tab-border-radius-left="0"
	--tabs-max-width="95vw"
/>

<TabsRunes
	tabs={component_tabs}
	tab_content_transition_parameters={{ types: ['fly'], symmetrical: false }}
/>
