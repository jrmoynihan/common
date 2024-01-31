<script lang="ts">
	import { onMount } from 'svelte';

	const storage_key = 'theme-preference';

	const get_color_preference = () => {
		if (localStorage.getItem(storage_key)) return localStorage.getItem(storage_key);
		else return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
	};
	const set_preference = (theme: string) => {
		localStorage.setItem(storage_key, theme);
		reflect_preference();
	};

	let theme = get_color_preference();

	const toggle = () => {
		if (theme === 'light') {
			theme = 'dark';
		} else if (theme === 'dark') {
			theme = 'light';
		}

		if (theme) set_preference(theme);
	};

	const reflect_preference = () => {
		if (theme) {
			document?.firstElementChild?.setAttribute('data-theme', theme);
			document?.querySelector('#color-scheme-toggle')?.setAttribute('aria-label', theme);
		}
	};

	// set early so no page flashes / CSS is made aware
	onMount(() => {
		theme = get_color_preference();
		if (theme === 'light') {
		} else if (theme === 'dark') {
		}
		reflect_preference();
	});

	// sync with system changes; TODO: SVELTE IT
	window
		.matchMedia('(prefers-color-scheme: dark)')
		.addEventListener('change', ({ matches: isDark }) => {
			theme = isDark ? 'dark' : 'light';
			set_preference(theme);
		});
</script>

<button
	on:click={toggle}
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

<style>
	@import 'https://unpkg.com/open-props/easings.min.css';

	.color-scheme-toggle {
		--size: 2rem;
		--icon-fill: hsl(210 10% 30%);
		--icon-fill-hover: hsl(210 10% 15%);

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

		& > svg {
			inline-size: 100%;
			block-size: 100%;
			stroke-linecap: round;
		}
		&:is(:hover, :focus-visible) {
			& .sun-and-moon {
				fill: var(--icon-fill-hover);
				& > .sun-beams {
					stroke: var(--icon-fill-hover);
				}
			}
		}

		@media (hover: none) {
			--size: 48px;
		}
	}

	:global([data-theme='dark']) {
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
			transition: transform 0.5s var(--ease-elastic-3);
		}

		& > .sun-beams {
			transition:
				transform 0.5s var(--ease-elastic-4),
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
