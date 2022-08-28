<script lang="ts">
	import Tooltips from '$routes/tooltips/+page.svelte';
	import { Tab } from '$lib/wrappers/tab';
	import Tabs from '$lib/wrappers/Tabs.svelte';
	import Accordions from '../accordion/+page.svelte';
	import Buttons from '../../buttons/+page.svelte';

	const tabs: Tab[] = [
		new Tab({ name: 'Buttons', component: Buttons }),
		new Tab({ name: 'Tooltips', component: Tooltips }),
		new Tab({ name: 'Accordions', component: Accordions })
	];
	let selected_tab: Tab = tabs[0];
</script>

<Tabs
	{tabs}
	{selected_tab}
	in_transition_parameters={{ x: -100 }}
	out_transition_parameters={{ x: 100 }}
/>

<style lang="scss">
</style>
