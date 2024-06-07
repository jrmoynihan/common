<script lang="ts" generics="T">
	import { tooltip } from '$actions/tooltip/tooltip.svelte';
	
	
    interface JSONViewProps<T> {
        /**  object or array to display */
        obj: Object | Array<T>
        /** initial expansion depth */
        depth?: number
        /** show tooltips on object and array items? */
        use_tooltips?: boolean
        _current_depth?: number
        _is_last_item_or_key?: boolean
    }
    let { obj, depth = 1, use_tooltips = true, _current_depth = 0, _is_last_item_or_key = false } : JSONViewProps<T> = $props();
    
    const keys = $derived(getType(obj) === 'object' ? Object.keys(obj) : [])
    const is_array = $derived(Array.isArray(obj))
    const brackets = $derived(is_array ? ['[', ']'] : ['{', '}'])
    let collapsed = $state(false);
    
    /** Get the type of an item */
    function getType(item: unknown) {
        if (item === null) return 'null'
        return typeof item
    }
    
    /** Format an item */
    function format(item: unknown) {
        switch (getType(item)) {
            case 'function':
                return 'f () {...}'
            case 'symbol':
                const i = item as symbol;
                return i.toString()
            default:
                return JSON.stringify(item)
        }
    }
    
    function clicked() {
        collapsed = !collapsed
    }
    
    /** Press enter or space to expand/collapse */
    function pressed(e : Event) {
        if (e instanceof KeyboardEvent && ['Enter', ' '].includes(e.key)){
            clicked()
        }
    }

    function is_valid_URL (str: string) {
		try {
			if (!str) return false;
            new URL(str);
            return true;
		} catch (error) {
			return false;
		}
	};
    
    $effect(()=>{
        collapsed = depth < _current_depth
    })

    </script>

    {#snippet bracket(position: 'start' | 'end' | 'both', empty : boolean, collapsed: boolean)}
        <button
            class="_jsonBkt"
            class:empty
            class:is_array
            tabindex="0"
            onclick={clicked}
            onkeydown={pressed}
            disabled={empty}
        >
            {#if position === 'start' || position === 'both'}
                {brackets[0]}
            {/if}
            {#if collapsed}
                {keys.length} {is_array ? ' items' : ' keys'}
            {/if}
            {#if position === 'end' || position === 'both'}
                {brackets[1]}
            {/if}
        </button>
    {/snippet}

    {#snippet separator(sep: string)}
        <span class="_jsonSep">
            {sep}
        </span>
    {/snippet}

    {#snippet content({index, type}: {index: number, type: string})}
        <ul class="tooltip-content">
            <li class="tooltip-item">index: {index}</li> 
            <li class="tooltip-item">type: {type}</li>
        </ul>
    {/snippet}

    {#snippet formatted_value(value)}
        {#if is_valid_URL(value)}
            <a href={value} rel="noopener noreferrer" target="_blank">{value}</a>
        {:else}
            {format(value)}
        {/if}
    {/snippet}
    
    <!-- JSON --->
    {#if !keys.length}
        {@render bracket('both', true, false)}
        
        {#if !_is_last_item_or_key}
            {@render separator(',')}
        {/if}

    {:else if collapsed}
        {@render bracket('both', false, true)}

        {#if !_is_last_item_or_key && collapsed}
            {@render separator(',')}
        {/if}

    {:else}
        {@render bracket('start', false, false)}
            <ul class="_jsonList">
                {#each keys as key, index}
                    <!-- Make TS happy about string index lookups on the object-->
                    {@const record = obj as Record<string, unknown>}
                    {#if key in record}
                        {@const value = record[key]}
                        {@const type = getType(value)}
                        <li>
                            {#if !is_array}
                                <span class="_jsonKey">
                                    {JSON.stringify(key)}
                                </span>
                                {@render separator(':')}
                            {/if}

                            {#if type === 'object'}
                                    <svelte:self obj={value} {depth} _cur={_current_depth + 1} _last={index === keys.length - 1} />
                                {:else}
                                
                                    <span class="_jsonVal {type}" use:tooltip={use_tooltips ? { content, content_args: {index, type}, position: 'right'} : {disabled: true}}>
                                        {@render formatted_value(value)}
                                    </span>

                                    {#if index < keys.length - 1}
                                        {@render separator(',')}
                                    {/if}

                                {/if}
                        </li>
                    {/if}
                {/each}
        </ul>
        
        {@render bracket('end', false, false)}

        {#if !_is_last_item_or_key}
            {@render separator(',')}
        {/if}
    {/if}
    
    <style>
    :where(._jsonList) {
        list-style: none;
        margin: 0;
        padding: 0;
        padding-left: var(--jsonPaddingLeft, 1rem);
        border-left: var(--jsonBorderLeft, 1px dotted);
    }
    :where(._jsonBkt) {
        appearance: none;
        background-color: unset;
        border: unset;
        color: var(--jsonBracketColor, currentcolor);
        width: var(--json-width, max-content);
    }
    :where(._jsonBkt):not(.empty):hover {
        cursor: pointer;
        background-color: var(--jsonBracketHoverBackground, #aaad);
    }
    :where(._jsonSep) {
        color: var(--jsonSeparatorColor, currentcolor);   
    }
    :where(._jsonKey) {
        color: var(--jsonKeyColor, currentcolor);
    }
    :where(._jsonVal) {
        color: var(--jsonValColor, #9ca3af);
    }
    :where(._jsonVal).string {
        color: var(--jsonValStringColor, #059669);
    }
    :where(._jsonVal).number {
        color: var(--jsonValNumberColor, #d97706);
    }
    :where(._jsonVal).boolean {
        color: var(--jsonValBooleanColor, #2563eb);
    }
    li.tooltip-item {
        list-style: none;
        display: grid;
        grid-auto-rows: auto;
        grid-template-columns: auto 1fr;
    }
    ul.tooltip-content {
        margin: none;
        padding: 0;
    }
    </style>