<!--@component
### A button to toggle between light and dark mode.
	- Will first check the user's local storage, then the system's color scheme preference: `window.matchMedia('(prefers-color-scheme: dark)')`.
	- When toggled, the user's preference will be saved to local storage, and the `data-theme` attribute will be set on the `html` element.
	- You can use the `data-theme` attribute selector to style your app based on the user's preference
***
### Usage:
It is recommended to add CSS variables to the `:root` element to control the color scheme of your app. Then, use the `data-theme` attribute to style your app based on the user's preference.
	***
	`app.css`
	```css
	:root {
		[data-theme='dark'] {
			--color: white;
			--background: black;
			// ...global dark mode styles
		}
		[data-theme='light'] {
			--color: black;
			--background: white;
			// ...global light mode styles
		}
	}
	```
***
However, you can also use the `:global` selector to apply a CSS rules for a given theme to more specific selectors.
***
	`Component.svelte`
	```svelte

	<p>Some content</p>

	<style>
		// Select any (scoped) descendant <p> tag of any element with the `data-theme` attribute set to `dark`
		:global([data-theme='dark']) p {
			color: orange;
		}
	</style>
	```
-->

<script lang="ts">
	type Theme = 'light' | 'dark';
	const storage_key = 'theme-preference';

	let toggle_button: HTMLButtonElement | null = $state(null);
	let theme: Theme = 'light';

	function get_color_preference(): Theme {
		if (window.localStorage.getItem(storage_key))
			return window.localStorage.getItem(storage_key) as Theme;
		else return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
	}
	function set_preference(theme: Theme) {
		window.localStorage.setItem(storage_key, theme);
		reflect_preference(theme);
	}

	function toggle() {
		if (theme === 'light') {
			theme = 'dark';
		} else if (theme === 'dark') {
			theme = 'light';
		}
		set_preference(theme);
	}

	function reflect_preference(theme: string) {
		document?.firstElementChild?.setAttribute('data-theme', theme);
		toggle_button?.setAttribute('aria-label', theme);
	}

	// Set early so no page flashes / CSS is made aware
	$effect(() => {
		window
			.matchMedia('(prefers-color-scheme: dark)')
			.addEventListener('change', ({ matches: isDark }) => {
				theme = isDark ? 'dark' : 'light';
				set_preference(theme);
			});
		theme = get_color_preference();
		reflect_preference(theme);
	});
</script>

<button
	bind:this={toggle_button}
	onclick={toggle}
	class="color-scheme-toggle"
	id="color-scheme-toggle"
	title="Toggles light & dark"
	aria-label="auto"
	aria-live="polite"
>
	<svg class="sun-and-moon" aria-hidden="true" width="24" height="24" viewBox="0 0 24 24">
		<circle class="sun" cx="12" cy="12" r="6" mask="url(#moon-mask)" fill="currentColor" />
		<g class="sun-beams" stroke="currentColor">
			<line x1="12" y1="1" x2="12" y2="3" />
			<line x1="12" y1="21" x2="12" y2="23" />
			<line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
			<line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
			<line x1="1" y1="12" x2="3" y2="12" />
			<line x1="21" y1="12" x2="23" y2="12" />
			<line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
			<line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
		</g>
		<mask class="moon" id="moon-mask">
			<rect x="0" y="0" width="100%" height="100%" fill="white" />
			<circle cx="24" cy="10" r="6" fill="black" />
		</mask>
	</svg>
</button>

<style lang="scss">
	/* Easings Source: 
	'https://unpkg.com/open-props/easings.min.css';
	*/

	.color-scheme-toggle {
		--size: 2rem;
		--icon-fill: hsl(210 10% 30%);
		--icon-fill-hover: hsl(210 10% 15%);
		--ease-3: cubic-bezier(0.25, 0, 0.3, 1);
		--ease-elastic-out-3: cubic-bezier(0.5, 1.25, 0.75, 1.25);
		--ease-elastic-out-4: cubic-bezier(0.5, 1.5, 0.75, 1.25);
		--ease-out-5: cubic-bezier(0, 0, 0, 1);

		background: none;
		border: none;
		padding: 0;

		inline-size: var(--size);
		block-size: var(--size);
		aspect-ratio: 1;
		border-radius: 50%;

		cursor: pointer;
		touch-action: manipulation;
		-webkit-tap-highlight-color: transparent;
		outline-offset: 5px;

		&:is(:hover, :focus-visible) {
			& .sun-and-moon {
				fill: var(--icon-fill-hover);
				& > .sun-beams {
					stroke: var(--icon-fill-hover);
				}
			}
		}

		/* Large size on touch-only interfaces */
		@media (hover: none) {
			--size: 48px;
		}
	}
	:global([data-theme='light']) {
		color-scheme: light;
	}

	:global([data-theme='dark']) {
		color-scheme: dark;
		& .color-scheme-toggle {
			--icon-fill: hsl(210 10% 70%);
			--icon-fill-hover: hsl(210 15% 90%);
		}

		& .sun-and-moon {
			& > .sun {
				transform: scale(1.75);
				transition-timing-function: var(--ease-3);
				transition-duration: 0.25s;
			}
			& > .sun-beams {
				opacity: 0;
				transform: rotateZ(-25deg);
				transition-duration: 0.15s;
			}
			& > .moon > circle {
				transform: translateX(-7px);
				transition-delay: 0.25s;
				transition-duration: 0.5s;

				@supports (cx: 1) {
					transform: translateX(0);
					cx: 17;
				}
			}
		}
	}

	.sun-and-moon {
		inline-size: 100%;
		block-size: 100%;
		stroke-linecap: round;
		& > :is(.moon, .sun, .sun-beams) {
			transform-origin: center center;
		}

		& > :is(.moon, .sun) {
			fill: var(--icon-fill);
		}

		& > .sun-beams {
			stroke: var(--icon-fill);
			stroke-width: 2px;
		}

		& > .sun {
			transition: transform 0.5s var(--ease-elastic-out-3);
		}

		& > .sun-beams {
			transition:
				transform 0.5s var(--ease-elastic-out-4),
				opacity 0.5s var(--ease-3);
		}

		& .moon > circle {
			transition: transform 0.25s var(--ease-out-5);

			@supports (cx: 1) {
				transition: cx 0.25s var(--ease-out-5);
			}
		}
	}
</style>
