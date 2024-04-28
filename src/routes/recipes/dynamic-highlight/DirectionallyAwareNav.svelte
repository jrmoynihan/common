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

<nav>
	<ul>
		{#each links as {text, href}}
			<li>
                <a {href}>
                    {text}
                </a>
            </li>
		{/each}
	</ul>
</nav>

<style>
	nav {
		--gap: 1rem;
		display: grid;
		place-content: center;
		font-size: 1.5rem;
		& > ul {
			display: flex;
			list-style: none;
			margin: 0;
			padding: 0;
			& > li {
				/* Hides the pseudo-element as it moves outside its content box */
				overflow: hidden;
				/* Gives a 'gap'-like effect but keeps elements' boxes 
						actually adjacent without a space */
				padding-inline: var(--gap);
				
				position: relative;
				
				&:hover, &:focus-within{
						/* Scales UP the pseudo-element when the parent list-item IS hovered */
					--scale-width: 1;
					
					@supports selector(:has(li)){
						& + li {
							/* Moves the line under the <li> to the LEFT when hovering a preceding <li>
							   (note: the '+' sibling selector), as if it's following the cursor */
							--translate: -100%;
							--scale-delay: 400ms;
							--translate-delay: 200ms;
						}
					}
					
				}
				@supports selector(:has(li)){
					/* Moves the line under the preceding sibling <li> to the RIGHT when this <li> is hovered
						   (note: the '+' sibling selector), as if it's following the cursor */
				&:has(+ :hover) {
					--translate: 100%;
					--scale-delay: 400ms;
					--translate-delay: 200ms;
				}
				}
				
				&::after{
					content: '';
					position: absolute;
					height: 3px;
					width: 100%;
					background: orangered;
					left: 0;
					bottom: 0;
					/* Scales DOWN the pseudo-element along the x-axis when the parent list-item is NOT hovered */
					scale: var(--scale-width, 0) 1;
					transition: scale 250ms var(--scale-delay, 0ms), translate 250ms var(--translate-delay, 0ms);
					translate: var(--translate, 0 0);
				}
				& a {
					/* color: #ddd; */
					color: unset;
					text-transform: uppercase;
					text-decoration: none;
					font-weight: 500;
				}
			}
		}
	}
</style>