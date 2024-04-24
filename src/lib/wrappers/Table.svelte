<script lang='ts'>
	import ButtonRunes from '$buttons/Button_Runes.svelte';
	import { faArrowDown19, faArrowDownAZ, faArrowDownWideShort, faArrowUp91, faArrowUpShortWide, faArrowUpZA, type IconDefinition } from '@fortawesome/free-solid-svg-icons';
	import type { Snippet } from 'svelte';

    interface TableProps<T> {
        data?: T[];
        /** An snippet representing the table header row(s) */
        headers?: Snippet<[any]>;
        /** An snippet representing the table data row(s) */
        rows?: Snippet<[T]>;
        /** A snippet representing the table data cells (`<td>` elements within `<tbody>` `<tr>` rows)*/
        data_cell?: Snippet<[T]>
        /** An snippet representing the table caption */
        caption?: Snippet<[any]>;
        /** The text of the table caption */
        caption_text?: string;
        /** The side of the table caption, with respect to the table */
        caption_side?: 'top' | 'bottom'
        /** An snippet representing the table footer */
        footer?: Snippet<[any]>;
        /** The text of the table footer */
        footer_text?: string;
        /** A list of keys to include from the objects in the `data` array.  If left empty and `omitted_keys` is also left empty, all keys will be included */
        visible_keys?: string[]
        /** A list of keys to omit from the objects in the `data` array.  If left empty and `visible_keys` is also left empty, no keys will be omitted */
        omitted_keys?: string[],
        /** Should the headers be capitalized? */
        capitalize_headers?: boolean
    }

	let {
		data = $bindable([]),
		headers = default_headers,
		rows = default_rows,
        data_cell = default_data_cell,
        caption = default_caption,
        caption_text,
        caption_side = 'top',
        footer = default_footer,
        footer_text,
        visible_keys = $bindable([]),
        omitted_keys = $bindable([]),
        capitalize_headers = true
    } : TableProps<any> = $props()
    type Ordering = 'asc' | 'desc' | null
    let orders : Ordering[] = $state(Object.keys(data[0]).map(d => 'desc'))
    // Assign icons for sorting; A-Z icons for strings, 1-9 icons for numbers, arrow icons for everything else
    
    function capitalize(s: string){
        return s.charAt(0).toUpperCase() + s.slice(1);
    }
    function replace_camel_case(s: string): string {
        return s.replaceAll('_', ' ');
    }
    function capitalize_all_words(s: string){
        return replace_camel_case(s).split(' ').map(capitalize).join(' ')
    }
    
    function map_icons(d: typeof data[0], order: Ordering = null){
        if (typeof data[0][d] === 'string'){
            return order === 'desc' ? faArrowDownAZ : faArrowUpZA 
        } else if (typeof data[0][d] === 'number'){
            return order === 'desc' ? faArrowDown19 : faArrowUp91
        } else {
            return order === 'desc' ? faArrowDownWideShort : faArrowUpShortWide
        }
    }

    let icons : IconDefinition[] = $state(Object.keys(data[0]).map((d) => map_icons(d)))

    function sort_strings({key, index }: {key: string, index: number }){
        const new_order = change_order(index);
        new_order === 'asc' ? 
            data.sort((a, b) => b[key].localeCompare(a[key])) :
            data.sort((a, b) => a[key].localeCompare(b[key]));
    }

    function sort_numbers_or_boolean_or_dates({key, index }: {key: string, index: number, }){
        const new_order = change_order(index);
        new_order === 'asc' ? 
            data.sort((a, b) => b[key] - a[key]):
            data.sort((a, b) => a[key] - b[key]) ;
    }

    function change_order(index: number) : Ordering {
        let order = orders[index];
        if(order === 'asc'){
            orders[index] = 'desc'
            icons[index] = map_icons(Object.keys(data[0])[index], 'desc');
        }else{
            orders[index] = 'asc';
            icons[index] = map_icons(Object.keys(data[0])[index], 'asc');
        } 
        return orders[index];
    }
</script>

{#snippet default_caption(text)}
    <caption><h3>{text}</h3></caption>
{/snippet}

{#snippet default_headers(d)}
	<tr>
		{#each Object.keys(d) as header, index}
            {#if !omitted_keys.includes(header)}
                {#if capitalize_headers}
                    {#if header === 'id'}
                        <th>
                            ID
                            {@render sort_button('id', index)}
                        </th>
                        {:else}
                        <th>
                            {capitalize_all_words(header)}
                            {@render sort_button(header, index)}
                        </th>
                    {/if}
                {:else}
                    <th>
                        {header}
                        {@render sort_button(header, index)}
                    </th>
                {/if}
            {/if}
		{/each}
	</tr>
{/snippet}

{#snippet sort_button(key: string, index: number)}
    {@const datum_0 = data[0][key]}
    {#if typeof datum_0 === 'string'}
            <ButtonRunes
            classes={`sort-button ${orders[index]}`}
            attributes={{onclick: () => sort_strings({key, index}), style: 'padding: 0.25rem;' }}
            icon_props={{icon: icons[index]}}
            tooltip_options={{ content: `Sort strings (current: ${orders[index] === 'desc' ? 'A-Z' : 'Z-A'})` }}
            />
    {:else if typeof datum_0 === 'number'}
        <ButtonRunes 
            classes={`sort-button ${orders[index]}`}
            attributes={{onclick: () => sort_numbers_or_boolean_or_dates({key, index}) }}
            icon_props={{icon: icons[index]}}
            tooltip_options={{ content: `Sort numbers (current: ${orders[index] === 'desc' ? 'low-to-high' : 'high-to-low'})` }}
        />
    <!-- TODO: other data types -->
    {/if}
{/snippet}
    

{#snippet default_rows()}
	{#each data as datum, index (datum)}
		<tr >	
			{#each Object.entries(datum) as [key, value]}
                {#if visible_keys.length > 0 && visible_keys.includes(key)}
                    {@render data_cell({datum, key})}
                {:else if omitted_keys.length > 0 && !omitted_keys.includes(key)}
                    {@render data_cell({datum, key})}
                {:else if visible_keys.length === 0 && omitted_keys.length === 0}
                    {@render data_cell({datum, key})}
                {/if}
            {/each}
        </tr>
    {/each}
{/snippet}
            
{#snippet default_data_cell({datum, key})}
    <td>{datum[key]}</td>
{/snippet}

{#snippet default_footer(text)}
    <tfoot>
        <tr>
            {@render data_cell(text)}
        </tr>
    </tfoot>
{/snippet}

<table style:--caption-side={caption_side}>
    {#if caption && caption_text}
        {@render caption(caption_text)}
    {/if}

	{#if data.length > 0 && headers}
    <thead>
		{@render headers(data[0])}
    </thead>
	{/if}
	{#if rows}
        <!-- TODO: Add support for virtual list -->
        <tbody>
            {@render rows(data)}
        </tbody>
	{/if}
    {#if footer && footer_text}
        {@render footer(footer_text)}
    {/if}
</table>

<style lang="scss" module="mixed">
    table {
        --table-border-color: hsla(0, 0%, 80%, 0.3);
        --table-cell-padding-inline: 0.5rem;
        --table-cell-padding-block: 0.25rem;
        --table-cell-padding: var(--table-cell-padding-block) var(--table-cell-padding-inline);
        
        background-color: var(--table-background-color, inherit);
        border-spacing: 0;
        border: 2px solid var(--table-border-color);
        border-radius: var(--table-border-radius);
        width: var(--table-width, auto);
        max-width: var(--table-max-width, 100%);
        margin: var(--table-margin, 1rem 0);

        @media (width < 768px) {
            display: block;
            border-collapse: collapse;
            overflow: auto;
        }
        
        & > tbody {
            white-space: nowrap;
        }
    }
    caption {
        caption-side: var(--table-caption-side);
        font-weight: var(--table-caption-font-weight, bold);
    }
    th,
    td {
    border: 1px solid var(--table-border-color);
    padding: var(--table-cell-padding);
    }
    th:first-child {
        border-top-left-radius: var(--table-border-radius, inherit);
    }
    th:last-child {
        border-top-right-radius: var(--table-border-radius, inherit);
    }
    :global(tr:last-child > td:first-child) {
        border-bottom-left-radius: var(--table-border-radius, inherit);
    }
    :global(tr:last-child > td:last-child) {
        border-bottom-right-radius: var(--table-border-radius, inherit);
    }

    th {
        background-color: var(--table-header-background-color, inherit);
        color: var(--table-header-color, inherit);
        position: sticky;
        top: 0;
    }
    tr {
        background-color: var(--table-row-background-color, inherit);
        color: var(--table-row-color, inherit);
    }
    td {
        background-color: var(--table-cell-background-color, inherit);
        color: var(--table-cell-color, inherit);
    }
</style>