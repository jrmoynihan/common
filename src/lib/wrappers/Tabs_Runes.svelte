<script module lang="ts">
	export interface TabsProps<T extends Component> {
		tabs?: (SnippetTab | ComponentTab<T>)[];
		/** A replacement Snippet for the default tab button */
		tab_button?: Snippet<[tab: SnippetTab | ComponentTab<T>]>;
		/** A replacement Snippet for the default tab container title */
		tab_container_title?: Snippet | null;
		/** The title of the default tab button */
		title?: string;
		/** The attributes of the outermost tab container <div> element */
		tab_container_attributes?: HTMLAttributes<HTMLDivElement>;
		/** The attributes of the tab button container <div> element */
		tab_button_container_attributes?: HTMLAttributes<HTMLDivElement>;
		/** The attributes of the tab content container <div> element that holds all the tab content panels */
		tab_content_container_attributes?: HTMLAttributes<HTMLDivElement>;
		/** The attributes of the tab panel contaner element that holds the tab content for an individual tab */
		tab_panel_attributes?: HTMLAttributes<HTMLDivElement>;
		/** The attributes of the default tab <button> element */
		tab_button_attributes?: HTMLButtonAttributes;
		/** The selected tab */
		selected_tab?: SnippetTab | ComponentTab<T>;
		/** The transition parameters of the tab content */
		tab_content_transition_parameters?: ComponentProps<typeof TransitionNativeRunes>;
	}

	interface Tab {
		title: string;
	}
	export interface SnippetTab extends Tab {
		snippet?: Snippet;
	}

	export interface ComponentTab<T extends Component<any, any>> extends Tab {
		Component?: T;
		props?: ComponentProps<T>;
	}
</script>

<script lang="ts" generics="T extends Component<any>">
	import TransitionNativeRunes from '$wrappers/TransitionNative_Runes.svelte';
	import type { Component, ComponentProps, Snippet } from 'svelte';
	import type { HTMLAttributes, HTMLButtonAttributes } from 'svelte/elements';
	let {
		tabs = [],
		tab_button = default_tab_button,
		tab_container_title = default_tab_container_title,
		title,
		tab_container_attributes,
		tab_button_container_attributes,
		tab_content_container_attributes,
		tab_panel_attributes,
		tab_button_attributes,
		tab_content_transition_parameters
	}: TabsProps<T> = $props();

	const id = crypto.randomUUID();
	let transitions = $state<TransitionNativeRunes[]>([]);
	let selected_tab = $state.raw(tabs[0]);

	function move_focus_to_tab(e: KeyboardEvent) {
		const i = get_index_of_tab(selected_tab);
		let new_i = i;
		switch (e.key) {
			case 'ArrowLeft':
				new_i = i - 1;
			case 'ArrowUp':
				break;
			case 'ArrowRight':
				new_i = i + 1;
			case 'ArrowDown':
				break;
			default:
				break;
		}
		// Allow wrap-around with the arrow keys
		if (new_i > tabs.length - 1) new_i = 0;
		if (new_i < 0) new_i = tabs.length - 1;

		// Select the new tab
		const new_tab = tabs.at(new_i);
		if (new_tab) select_tab(new_tab);
		// Focus the new tab
		const focus_tab = document.getElementById(`tab-${new_i}-${id}`);
		focus_tab?.focus();
	}

	function get_index_of_tab(tab: SnippetTab | ComponentTab<T> | undefined) {
		if (!tab) return 0;
		return tabs.findIndex((t) => t === tab);
	}

	function select_tab(tab: SnippetTab | ComponentTab<T>) {
		if (selected_tab) {
			// Toggle off/out the old tab
			const old_tab_index = get_index_of_tab(selected_tab);
			transitions.at(old_tab_index)?.toggle();
		}

		// Toggle on/in the new tab
		selected_tab = tab;
		const new_tab_index = get_index_of_tab(selected_tab);
		transitions.at(new_tab_index)?.toggle();
	}
</script>

<div {id} class="tabs" {...tab_container_attributes}>
	{@render tab_container_title?.()}
	<div
		role="tablist"
		aria-labelledby={`tablist-${id}`}
		class="automatic"
		{...tab_button_container_attributes}
	>
		{#each tabs as tab, i (tab)}
			<button
				id={`tab-${i}-${id}`}
				tabindex={tab === selected_tab ? 0 : -1}
				onkeydown={move_focus_to_tab}
				type="button"
				role="tab"
				aria-selected={tab === selected_tab}
				aria-controls={`tabpanel-${i}-${id}`}
				onclick={() => select_tab(tab)}
				{...tab_button_attributes}
			>
				{@render tab_button?.(tab)}
			</button>
		{/each}
	</div>
	<div
		id={`tab-content-${id}`}
		{...tab_content_container_attributes}
		class={`tab-content ${tab_content_container_attributes?.class} ;`}
	>
		{#each tabs as tab, i (tab)}
			<div
				id={`tabpanel-${i}-${id}`}
				role="tabpanel"
				tabindex={tab === selected_tab ? 0 : -1}
				aria-labelledby={`tab-${i}-${id}`}
				{...tab_panel_attributes}
			>
				{#if 'snippet' in tab}
					{@render snippet_tab(tab, i)}
				{:else if 'Component' in tab && 'props' in tab}
					{@render component_tab(tab, i)}
				{/if}
			</div>
		{/each}
	</div>
</div>
{#snippet default_tab_button({ title }: SnippetTab)}
	<span>{title}</span>
{/snippet}

{#snippet default_tab_container_title()}
	<h3 id={`tablist-${id}`}>{title}</h3>
{/snippet}
{#snippet snippet_tab(tab: SnippetTab, i: number)}
	<TransitionNativeRunes
		bind:this={transitions[i]}
		visible={i === 0}
		{...tab_content_transition_parameters}
	>
		{@render tab.snippet?.()}
	</TransitionNativeRunes>
{/snippet}
{#snippet component_tab(tab: ComponentTab<T>, i: number)}
	{@const { Component, props } = tab}
	<TransitionNativeRunes
		bind:this={transitions[i]}
		visible={i === 0}
		{...tab_content_transition_parameters}
	>
		<Component {...props} />
	</TransitionNativeRunes>
{/snippet}

<style>
	.tabs {
		max-width: var(--tabs-max-width, 100%);
	}
	[role='tablist'] {
		gap: 0.2rem;
		display: flex;
		overflow-x: scroll;
		position: relative;
		top: 2px;
		background-color: var(--background);
	}

	[role='tab'] {
		margin: 0;
		margin-top: var(--tab-margin-top, 0.25rem);
		padding: var(--tab-padding, 1rem);
		transition-property: var(--tab-transition-property, border, color, background-color);
		transition-duration: var(--tab-transition-duration, 200ms);
		transition-timing-function: var(--tab-transition-timing-function, ease-out);
		border-radius: var(--tab-border-radius-top, var(--tab-border-radius, 0))
			var(--tab-border-radius-right, var(--tab-border-radius, 0))
			var(--tab-border-radius-bottom, var(--tab-border-radius, 0))
			var(--tab-border-radius-left, var(--tab-border-radius, 0));
		max-width: var(--tab-max-width, 100%);
		font-weight: var(--tab-font-weight);
		font-size: var(--tab-font-size);
		font: var(--tab-font);
		color: var(--tab-color, inherit);
		background-color: var(--tab-background-color, inherit);
		cursor: pointer;
	}

	[role='tab'][aria-selected='true'] {
		border-style: inset;
		border-top-width: var(--tab-border-top-width-selected, 2px);
		border-top-color: var(--tab-border-top-color-selected, hsl(219deg 1% 72%));
		border-bottom: var(--tab-border-bottom-selected, none);
		background-color: var(--tab-background-color-selected);
		color: var(--tab-color-selected, inherit);
	}

	[role='tabpanel'] {
		padding: 5px;
		border-radius: var(--tab-panel-border-radius-top, var(--tab-panel-border-radius, 0))
			var(--tab-panel-border-radius-right, var(--tab-panel-border-radius, 0))
			var(--tab-panel-border-radius-bottom, var(--tab-panel-border-radius, 0))
			var(--tab-panel-border-radius-left, var(--tab-panel-border-radius, 0));
		min-height: 10em;
		overflow: hidden; /* Is there a good reason to have overflow auto instead? */
	}

	.tab-content {
		border: 2px solid hsl(219deg 1% 72%);
		display: grid;
		grid-template-columns: 1fr;
		grid-template-rows: 1fr;
		border-radius: var(--tab-content-border-radius-top, var(--tab-content-border-radius, 0))
			var(--tab-content-border-radius-right, var(--tab-content-border-radius, 0))
			var(--tab-content-border-radius-bottom, var(--tab-content-border-radius, 0))
			var(--tab-content-border-radius-left, var(--tab-content-border-radius, 0));
		& > * {
			grid-area: 1 / 1;
		}
	}
</style>
