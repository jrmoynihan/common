<!-- Roman Komarov, 'Future CSS: Anchor Positioning' https://kizu.dev/anchor-positioning-experiments/#transitions -->
<script lang="ts">
	const base = new URL('https://developer.mozilla.org/en-US/docs/Web/CSS/');
	const links = [
		{
			url: new URL('Universal_selectors', base),
			text: 'Universal'
		},
		{
			url: new URL('Type_selectors', base),
			text: 'Type'
		},
		{
			url: new URL('Class_selectors', base),
			text: 'Class'
		},
		{
			url: new URL('ID_selectors', base),
			text: 'ID'
		},
		{
			url: new URL('Attribute_selectors', base),
			text: 'Attribute'
		}
	];
</script>

<ul class="slider">
	{#each links as { url, text }, i}
		<li class="slider-item" style:--i={`--${i}`}>
			<a class="slider-link" href={url.href} target="_blank">{text}</a>
		</li>
	{/each}
</ul>

<style>
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
		content: '';
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
		/* --target: var(--i); */
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
	.slider:has(:nth-child(1).slider-link:is(:hover, :focus-visible)) {
		--target: --0;
	}

	/* .slider-item:nth-child(2) {
	//     --is: --item-2;
	// }

	// .slider:has(:nth-child(2) > .slider-link:is(:hover, :focus-visible)) {
	//     --target: --item-2;
	// }
	*/
</style>
