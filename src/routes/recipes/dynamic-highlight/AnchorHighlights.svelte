<!-- Roman Komarov, 'Future CSS: Anchor Positioning' https://kizu.dev/anchor-positioning-experiments/#transitions -->
<script lang='ts'>

    const links = [
        { 
            href: 'https://developer.mozilla.org/en-US/docs/Web/CSS/Universal_selectors',
            text: 'Universal'
        },
        {
            href: 'https://developer.mozilla.org/en-US/docs/Web/CSS/Type_selectors',
            text: 'Type'
        },
        {
            href: 'https://developer.mozilla.org/en-US/docs/Web/CSS/Class_selectors',
            text: 'Class'
        },
        {
            href: 'https://developer.mozilla.org/en-US/docs/Web/CSS/ID_selectors',
            text: 'ID'
        },
        {
            href: 'https://developer.mozilla.org/en-US/docs/Web/CSS/Attribute_selectors',
            text: 'Attribute'
        }
    ]
</script>

<ul class="slider">
    {#each links as {href, text}, i }
    <li class="slider-item" style:--i={`--${i}`} >
      <a class="slider-link" {href} target="_blank">{text}</a>
    </li>
    {/each}
  </ul>


<style lang='scss'>
    .slider {
        position: relative;
        display: flex;
        flex-wrap: wrap;
        min-height: 3em;
        place-content: center;
        anchor-name: --slider-menu;
        --target: --slider-menu;
    }

    .slider:not(:has(.slider-link:is(:hover, :focus-visible)))::before {
        visibility: hidden;
        opacity: 0;
        filter: blur(2em);
    }

    .slider::before {
        content: "";
        position: absolute;
        top: anchor(var(--target) top);
        left: anchor(var(--target) left);
        right: anchor(var(--target) right);
        bottom: anchor(var(--target) bottom);
        box-shadow: inset 0 0 0 0.5em hotpink;
        border-radius: 9em;
        opacity: 0.5;
        pointer-events: none;
        transition: all 0.3s;
    }

    .slider-item {
        display: flex;
        place-items: center;
        flex-grow: 1;
        // --target: var(--i);
    }

    .slider-link {
        all: unset;
        cursor: pointer;
        padding: 0.5em 1em;
        anchor-name: var(--i);
    }
    
    .slider-item {
        --is: var(--i);
    }
    .slider:has(:nth-child(1).slider-link:is(:hover, :focus-visible)){
        --target: --0;
    }

    // .slider-item:nth-child(2) { 
    //     --is: --item-2;
    // }

    // .slider:has(:nth-child(2) > .slider-link:is(:hover, :focus-visible)) {
    //     --target: --item-2;
    // }
</style>