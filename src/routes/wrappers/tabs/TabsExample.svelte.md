```svelte example Wrapper="/src/routes/NoBackgroundWrapper.svelte"
<script lang="ts">
	import Tooltips from '$routes/tooltips/+page.svelte';
	import { Tab } from '$wrappers/tab';
	import Tabs from '$wrappers/Tabs.svelte';
	import Accordions from '../accordion/+page.svelte';
	import Buttons from '../../buttons/+page.svelte';
	import { fly } from 'svelte/transition';

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
	transition={fly}
	in_transition_parameters={{ x: -100 }}
	out_transition_parameters={{ x: 100 }}
/>
```
