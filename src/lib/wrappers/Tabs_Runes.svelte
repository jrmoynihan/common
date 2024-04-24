<script lang='ts'>
	import TransitionNativeRunes from '$wrappers/TransitionNative_Runes.svelte';
	import type { ComponentProps, Snippet } from "svelte";
	import type { HTMLButtonAttributes } from "svelte/elements";

    interface TabProps {
        tabs?: Tab[],
        /** A replacement Snippet for the default tab button */
        tab_button?: Snippet,
        /** A replacement Snippet for the default tab container title */
        tab_container_title?: Snippet
        /** The title of the default tab button */
        title?: string,
        /** The attributes of the default tab <button> element */
        tab_button_attributes?: HTMLButtonAttributes,
        /** The selected tab */
        selected_tab?: Tab,
        /** The transition parameters of the tab content */
        tab_content_transition_parameters?: ComponentProps<TransitionNativeRunes>
    }
    interface Tab {
        title: string,
        content: Snippet
    }

    let {
        tabs = [],
        tab_button ,
        tab_container_title,
        title,
        tab_button_attributes,
        selected_tab = tabs?.length > 0 ? tabs[0] : undefined,
        tab_content_transition_parameters
    } : TabProps = $props();

    const id = crypto.randomUUID();
    let transitions : TransitionNativeRunes[] = $state([])

    function move_focus_to_tab(e: KeyboardEvent) {
      const i = get_index_of_tab(selected_tab);
      let new_i = i;
      switch(e.key){
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
      if(new_i > tabs.length - 1) new_i = 0;
      if(new_i < 0) new_i = tabs.length - 1;

      // Select the new tab
      const new_tab = tabs.at(new_i);
      if(new_tab) select_tab(new_tab);
      // Focus the new tab
      const focus_tab = document.getElementById(`tab-${new_i}-${id}`);
      if(focus_tab){
          focus_tab.focus();
      }
    }
    function get_index_of_tab(tab: Tab | undefined){
        if(!tab) return 0;
        return tabs.indexOf(tab);
    }
    function select_tab(tab: Tab){
      if(selected_tab){
        const old_tab_index = get_index_of_tab(selected_tab);
        transitions[old_tab_index]?.toggle();
      }
      selected_tab = tab;
      const new_tab_index = get_index_of_tab(selected_tab);
      transitions[new_tab_index]?.toggle();
    }

</script>

{#snippet default_tab_button({title})}
    <span>{title}</span>
{/snippet}

{#snippet default_tab_container_title(title)}
    <h3 id={`tablist-${id}`}>{title}</h3>
{/snippet}



<div {id} class="tabs">
    {#if tab_container_title}
        {@render tab_container_title()}
    {:else}
        {@render default_tab_container_title(title)}
    {/if}
    <div role="tablist" aria-labelledby={`tablist-${id}`} class="automatic">
        {#if tabs && tabs.length > 0}
            {#each tabs as tab, i}
                <button id={`tab-${i}-${id}`} tabindex={selected_tab === tab ? 0 : -1} onkeydown={move_focus_to_tab} type="button" role="tab" aria-selected={selected_tab === tab} aria-controls={`tabpanel-${i}-${id}`} onclick={()=>select_tab(tab)} {...tab_button_attributes}>
                  {#if tab_button}  
                    {@render tab_button()}
                  {:else}
                    {@render default_tab_button({title: tab.title})}
                  {/if}
                </button>
            {/each}
        {/if}
    </div>
    <div id={`tab-content-${id}`} class="tab-content">
      {#each tabs as tab, i}
          {@const {content} = tab}
          <div id={`tabpanel-${i}-${id}`} role="tabpanel" tabindex={selected_tab === tab ? 0 : -1} aria-labelledby={`tab-${i}-${id}`}>
            <TransitionNativeRunes bind:this={transitions[i]} visible={i === 0} children={content} {...tab_content_transition_parameters}/>
          </div>
      {/each}
    </div>
  </div>  

<style lang='scss'>
  .tabs{
    max-width: var(--tabs-max-width, 100%);
  }
[role="tablist"] {
  gap: 0.2rem;
  display: flex;
  overflow-x: scroll;
  position: relative;
  top: 2px;
  background-color: var(--background);
}

[role="tab"] {
  margin: 0;
  margin-top: var(--tab-margin-top, 0.25rem);
  padding: var(--tab-padding, 1rem);
  transition-property: var(--tab-transition-property, border, color, background-color);
  transition-duration: var(--tab-transition-duration, 200ms);
  transition-timing-function: var(--tab-transition-timing-function, ease-out);
  border-radius: 
    var(--tab-border-radius-top, var(--tab-border-radius, 0))
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

[role="tab"][aria-selected="true"] {
  border-style: inset;
  border-top-width: var(--tab-border-top-width-selected, 2px);
  border-top-color: var(--tab-border-top-color-selected, hsl(219deg 1% 72%));
  border-bottom: var(--tab-border-bottom-selected, none);
 background-color: var(--tab-background-color-selected);
}

[role="tab"] span.focus {
  display: inline-block;
  margin: 2px;
  padding: 4px 6px;
}

[role="tab"]:hover span.focus,
[role="tab"]:focus span.focus,
[role="tab"]:active span.focus {
  padding: 2px 4px;
  // border: 2px solid rgb(36 116 214);
  border-radius: 3px;
}

[role="tabpanel"] {
  z-index: -1;
  padding: 5px;
  border-radius: 0 5px 5px;
  // background: hsl(220deg 43% 99%);
  min-height: 10em;
  width: 100%;
  overflow: auto;
}

[role="tabpanel"] p {
  margin: 0;
}

.tab-content{
  border: 2px solid hsl(219deg 1% 72%);
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: 1fr;
  & > *{
    grid-area: 1 / 1;
  }
}

</style>