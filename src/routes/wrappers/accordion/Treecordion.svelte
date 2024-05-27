<script lang='ts'>
import AccordionDetails from "$wrappers/AccordionDetails.svelte";
import TreeItem from "./TreeItem.svelte";
import TreeList from "./TreeList.svelte";

const base = new URL('https://developer.mozilla.org/en-US/docs/Web/CSS/');


const node_1_1_items = [
	{
		href: new URL('Universal_selectors', base),
		text: "Universal",
	},
	{
		href: new URL('Type_selectors', base),
		text: "Type",
	},
	{
		href: new URL('Class_selectors', base),
		text: "Class",
	},
	{
		href: new URL('ID_selectors', base),
		text: "ID",
	},
	{
		href: new URL('Attribute_selectors', base),
		text: "Attribute",
	},
];
const node_1_3_items = [
	{
		href: new URL('Descendant_selectors', base),
		text: "Descendant",
	},
	{
		href: new URL('Child_selectors', base),
		text: "Child",
	},
	{
		href: new URL('Adjacent_sibling_selectors', base),
		text: "Adjacent",
	},
	{
		href: new URL('General_sibling_selectors', base),
		text: "General",
	},
];
const node_1_4_items = [
	{
		href: new URL('Pseudo-classes', base),
		text: "Pseudo-class",
	},
	{
		href: new URL('Pseudo-elements', base),
		text: "Pseudo-element",
	},
];
</script>

{#snippet summary(text)}
    <summary class="tree-item-label">{text}</summary>
{/snippet}

{#snippet tree_item(node, children)}
    <li class="tree-item" style:--is={node}>
        {@render children()}
    </li>
{/snippet}

{#snippet tree(node, items)}
    <ul class="tree" style:--to={node}>
        {#each items as item}
            {@render tree_item(item.node, item.children)}
        {/each}
    </ul>
{/snippet}

{#snippet details(children)}
    <details class="tree-item-details">
        {@render children()}
    </details>
{/snippet}

{#snippet tree_item_label(text, href)}
    <!-- <p class="tree-item-label"> -->
        <a target="_blank" {href}>
            {text}
        </a>
    <!-- </p> -->
{/snippet}

<TreeList node_to={''}>
    <TreeItem is_node="--node-1">
        <AccordionDetails details_classes={"tree-item-details"} summary_attributes={{class: 'tree-item-label'}} summary_text={'CSS selectors'} transition_props={{ types: ['scale'] }}>
            <TreeList node_to="--node-1">
                <TreeItem is_node="--node-1-1">
                    <AccordionDetails details_classes={"tree-item-details"} summary_attributes={{class: 'tree-item-label'}} summary_text={'Basic selectors'} transition_props={{ types: ['fly'], slide_transition_parameters: { side: 'left'} }}>
                        <TreeList node_to="--node-1-1">
                            {#each node_1_1_items as item, i}
                                <TreeItem is_node="--node-1-1-{i+1}">
                                    {@render tree_item_label(item.text, item.href)}
                                </TreeItem>
                            {/each}
                        </TreeList>
                    </AccordionDetails>
                </TreeItem>
                <TreeItem is_node="--node-1-2">
                    {@render tree_item_label('Selector list', 'https://developer.mozilla.org/en-US/docs/Web/CSS/Attribute_selectors')}
                </TreeItem>
                <TreeItem is_node="--node-1-3">
                    <AccordionDetails details_classes={"tree-item-details"} summary_attributes={{class: 'tree-item-label'}} summary_text={'Combinators'} transition_props={{ types: ['slide'] }} >
                        <TreeList node_to="--node-1-3">
                            {#each node_1_3_items as item, i}
                                <TreeItem is_node="--node-1-3-{i+1}">
                                    {@render tree_item_label(item.text, item.href)}
                                </TreeItem>
                            {/each}
                        </TreeList>
                    </AccordionDetails>
                </TreeItem>
                <TreeItem is_node="--node-1-4">
                    <AccordionDetails details_classes={"tree-item-details"} summary_attributes={{class: 'tree-item-label'}} summary_text={'Pseudos'} >
                        <TreeList node_to="--node-1-4">
                            {#each node_1_4_items as item, i}
                                <TreeItem is_node="--node-1-4-{i+1}">
                                    {@render tree_item_label(item.text, item.href)}
                                </TreeItem>
                            {/each}
                        </TreeList>
                    </AccordionDetails>
                </TreeItem>
            </TreeList>
        </AccordionDetails>
    </TreeItem>
</TreeList>


<ul class="tree">
    <li class="tree-item" style="--is: --node-1">
        <details class="tree-item-details">
            {@render summary('CSS selectors')}
        <ul class="tree" style="--to: --node-1">
            <li class="tree-item" style="--is: --node-1-1">
                <details class="tree-item-details">
                    <summary class="tree-item-label">Basic selectors</summary>
                    <ul class="tree" style="--to: --node-1-1">
                        <li class="tree-item" style="--is: --node-1-1-1">
                            <p class="tree-item-label"><a target="_blank" href="https://developer.mozilla.org/en-US/docs/Web/CSS/Universal_selectors">Universal</a></p>
                        </li>
                        <li class="tree-item" style="--is: --node-1-1-2">
                            <p class="tree-item-label"><a target="_blank" href="https://developer.mozilla.org/en-US/docs/Web/CSS/Type_selectors">Type</a></p>
                        </li>
                        <li class="tree-item" style="--is: --node-1-1-3">
                            <p class="tree-item-label"><a target="_blank" href="https://developer.mozilla.org/en-US/docs/Web/CSS/Class_selectors">Class</a></p>
                        </li>
                        <li class="tree-item" style="--is: --node-1-1-4">
                            <p class="tree-item-label"><a target="_blank" href="https://developer.mozilla.org/en-US/docs/Web/CSS/ID_selectors">ID</a></p>
                        </li>
                        <li class="tree-item" style="--is: --node-1-1-5">
                            <p class="tree-item-label"><a target="_blank" href="https://developer.mozilla.org/en-US/docs/Web/CSS/Attribute_selectors">Attribute</a></p>
                        </li>
                    </ul>
                </details>
            </li>
            <li class="tree-item" style="--is: --node-1-2">
                <p class="tree-item-label"><a target="_blank" href="https://developer.mozilla.org/en-US/docs/Web/CSS/Attribute_selectors">Selector list</a></p>
            </li>
            <li class="tree-item" style="--is: --node-1-3">
            <details class="tree-item-details">
              <summary class="tree-item-label">Combinators</summary>
              <ul class="tree" style="--to: --node-1-3">
                <li class="tree-item" style="--is: --node-1-3-1">
                  <p class="tree-item-label"><a target="_blank" href="https://developer.mozilla.org/en-US/docs/Web/CSS/Descendant_combinator">Descendant</a></p>
                </li>
                <li class="tree-item" style="--is: --node-1-3-2">
                  <p class="tree-item-label"><a target="_blank" href="https://developer.mozilla.org/en-US/docs/Web/CSS/Child_combinator">Child</a></p>
                </li>
                <li class="tree-item" style="--is: --node-1-3-3">
                  <p class="tree-item-label"><a target="_blank" href="https://developer.mozilla.org/en-US/docs/Web/CSS/General_sibling_combinator">General sibling</a></p>
                </li>
                <li class="tree-item" style="--is: --node-1-3-4">
                  <p class="tree-item-label"><a target="_blank" href="https://developer.mozilla.org/en-US/docs/Web/CSS/Adjacent_sibling_combinator">Adjacent sibling</a></p>
                </li>
              </ul>
            </details>
          </li>
          <li class="tree-item" style="--is: --node-1-4">
            <details class="tree-item-details">
              <summary class="tree-item-label">Pseudos</summary>
              <ul class="tree" style="--to: --node-1-4">
                <li class="tree-item" style="--is: --node-1-4-1">
                  <p class="tree-item-label"><a target="_blank" href="https://developer.mozilla.org/en-US/docs/Web/CSS/Pseudo-classes">Pseudo classes</a></p>
                </li>
                <li class="tree-item" style="--is: --node-1-4-2">
                  <p class="tree-item-label"><a target="_blank" href="https://developer.mozilla.org/en-US/docs/Web/CSS/Pseudo-elements">Pseudo elements</a></p>
                </li>
              </ul>
            </details>
          </li>
        </ul>
      </details>
    </li>
  </ul>

<style lang='scss'>
    .tree {
        all: unset;
        display: flex;
        flex-direction: column;
        gap: 0.5em;
        --offset: 4px;
        --lh: 1.2em;
        margin-bottom: 2px;
    }
    .tree-item {
        all: unset;
        display: flex;
        gap: 2em;
        align-items: center;
        &::before, &::after{
            position: absolute;
            content: "";
            left: anchor(var(--to) right);
            right: anchor(var(--is) left);
            background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100' preserveAspectRatio='none'%3E%3Cpath d='M0 0c25 0 50 50 50 50s25 50 50 50' stroke='currentColor' vector-effect='non-scaling-stroke' fill='none' /%3E%3C/svg%3E");
            background-size: calc(100% - var(--offset)* 2) 100%;
            background-position: var(--offset) 0;
            background-repeat: no-repeat;
            pointer-events: none;
        }
        &::before{
            bottom: calc(anchor(var(--to) top) - 0.5* var(--lh));
            top: anchor(var(--is) center);
            transform: scaleY(-1);
        }
        &::after{
            top: calc(anchor(var(--to) top) + 0.5* var(--lh));
            bottom: anchor(var(--is) center);
        }
    }
    :global(.tree-item-details) {
        display: contents;
    }
    :global(summary.tree-item-label) {
        cursor: pointer;
        text-decoration: underline;
        text-decoration-style: dashed;
        text-decoration-thickness: 1px;
        text-underline-offset: 2px;
        text-shadow: none;
        user-select: none;
        &::marker{
            content: none;
        }
    }

    :global(.tree-item-label) {
        hyphens: none;
        line-height: var(--lh);
        anchor-name: var(--is);
        --link-underline-position: bottom 12%;
    }
</style>