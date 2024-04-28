<script lang="ts">
	import TabsRunes from '$wrappers/Tabs_Runes.svelte';
	import { fly } from 'svelte/transition';

	const tabs = [
		{ title: 'One', content: content_one },
		{ title: 'Two', content: content_two },
		{ title: 'Three', content: content_three },
		{ title: 'One', content: content_one },
		{ title: 'Two', content: content_two },
		{ title: 'Three', content: content_three },
		{ title: 'One', content: content_one },
		{ title: 'Two', content: content_two },
		{ title: 'Three', content: content_three },
		{ title: 'One', content: content_one },
		{ title: 'Two', content: content_two },
		{ title: 'Three', content: content_three },
		{ title: 'One', content: content_one },
		{ title: 'Two', content: content_two },
		{ title: 'Three', content: content_three },
		{ title: 'One', content: content_one },
		{ title: 'Two', content: content_two },
		{ title: 'Three', content: content_three },
		{ title: 'One', content: content_one },
		{ title: 'Two', content: content_two },
		{ title: 'Three', content: content_three },
	]
</script>

{#snippet content_one()}
	<p transition:fly><strong>One content</strong></p>
{/snippet}

{#snippet content_two()}
	<p><em>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Aspernatur delectus minus dolor nesciunt hic culpa accusamus odit voluptatem in quod voluptatibus, eos beatae magnam, facere eveniet porro odio ea error.</em></p>
{/snippet}

{#snippet content_three()}
	<p><em>Three content</em></p>
{/snippet}

<!-- <TabsExample /> -->

<TabsRunes {tabs} tab_content_transition_parameters={{ types: ['fly'], symmetrical: false }} --tab-border-radius="0.5rem" --tab-border-radius-bottom="0" --tab-border-radius-left="0" --tabs-max-width="95vw" />
