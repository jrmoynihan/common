<script lang="ts">
	import { setLocalStorageItem } from '../functions/local-storage.js';
	import { browser } from '$app/environment';

	/** Bind this with your store that holds the state for light/dark theme selection */
	export let use_dark_theme = false;
	let root: HTMLElement | null = browser ? document?.documentElement : null;

	/** A set of key-value light theme colors */
	export let light_theme_colors = {
		text: 'hsla(0, 0%, 0%, 1)', // main/text color
		background: 'hsla(0, 0%, 100%, 1)', // background/alternate color
		accent: 'hsl(195, 81%, 24%)'
	};
	/** A set of key-value dark theme colors */
	export let dark_theme_colors = {
		text: 'hsla(0, 0%, 100%, 1)', // main/text color
		background: 'hsl(195, 61%, 14%)', // background/alternate color
		accent: 'orange'
	};
	/** The default colors to start with (currently set to dark theme) */
	export let default_colors = { ...dark_theme_colors };

	// Store these original colors for later if you want to reset them
	const darkResets = { ...dark_theme_colors };
	const lightResets = { ...light_theme_colors };

	// Set globally available CSS custom properties (AKA variables) on the root element
	const setCSSvariables = (colors: { [x: string]: string }) => {
		// console.table(colors);
		for (const key of Object.keys(colors)) {
			const color = colors[key];
			if (browser && root) {
				// Set a CSS custom property name and value for each theme array member; e.g. `--text: hsl(0,0,0)`
				root.style.setProperty(`--${key}`, color);

				const inverted = key.includes('Inverted');
				const value = key.includes('Value');
				const gutter = key.includes('Gutter');
				const fade = key.includes('Fade');

				// Set derived colors
				if (inverted && value) {
					root.style.setProperty(`--${key.split('Inverted')[0]}-inverted-value`, color);
				} else if (inverted) {
					root.style.setProperty(`--${key.split('Inverted')[0]}-inverted`, color);
				} else if (gutter) {
					root.style.setProperty(`--${key.split('Gutter')[0]}-gutter`, color);
				} else if (fade) {
					root.style.setProperty(`--${key.split('Fade')[0]}-fade`, color);
				}
				// // A regular expression to find elements within parentheses
				const regExp = /\(([^)]+)\)/;
				// RegExp search returns an arrau of 3 elements:
				// 0) everything to the left parentheses (including the parentheses), 1) everything in between parentheses, 2) everything to the right of the parentheses (including the parentheses)
				const matches = regExp.exec(color);
				if (matches && matches?.length > 0) {
					const [h, s, l, a] = matches[1].split(',');
					const hsl = `${h}, ${s}, ${l}`;
					root.style.setProperty(`--${key}-value`, hsl);
					root.style.setProperty(`--${key}-hue`, `${h}`);
					root.style.setProperty(`--${key}-saturation`, `${s}`);
					root.style.setProperty(`--${key}-lightness`, `${l}`);
					root.style.setProperty(`--${key}-alpha`, `${a}`);
				}
			}
		}
	};

	// Resets both the CSS custom properties and the internal state of these theme objects to their defaults
	// const resetCSSvariable = (colorName: string) => {
	//     const resetColor = $use_dark_theme ? darkResets[colorName] : lightResets[colorName];
	//     $use_dark_theme
	// 	? (darkThemeColors = { ...darkResets })
	// 	: (lightThemeColors = { ...lightResets });
	//     root.style.setProperty(`--${colorName}-color`, resetColor);
	// };

	const storeDarkThemePreference = async () => {
		await setLocalStorageItem('useDarkTheme', use_dark_theme);
	};

	// Update/set the CSS custom properties anytime the colors object changes
	$: default_colors = use_dark_theme ? { ...dark_theme_colors } : { ...light_theme_colors };
	$: setCSSvariables(default_colors);
</script>

<label class="switch" tabindex="0">
	<input type="checkbox" bind:checked={use_dark_theme} on:change={storeDarkThemePreference} />
	<div>
		<span />
	</div>
</label>

<style lang="scss">
	.switch {
		--line: var(--text, white);
		--dot: hsl(0, 0%, 0%);
		--circle: hsl(233, 100%, 98%); //#9EA0BE
		--duration: 0.3s;
		--text: hsl(236, 20%, 68%);
		cursor: pointer;
		outline: none;
		padding: 0.5rem;
		user-select: none;
		border-radius: 1rem;
		&:focus {
			box-shadow: var(--button-focus-shadow, darkblue);
		}
		&:hover {
			box-shadow: var(--button-hover-shadow, blue);
		}
		input {
			display: none;
			& + div {
				position: relative;
				&:before,
				&:after {
					--scale: 1;
					content: '';
					position: absolute;
					height: 0.25em;
					top: 0.625em;
					width: 1.5em;
					background: var(--line);
					transform: scaleX(var(--scale));
					transition: transform var(--duration) ease;
				}
				&:before {
					--scale: 0;
					left: 0;
					transform-origin: 0 50%;
					border-radius: 0.125em 0 0 0.125em;
				}
				&:after {
					left: 1.75em;
					transform-origin: 100% 50%;
					border-radius: 0 0.125em 0.125em 0;
				}
				span {
					padding-left: 3.5em;
					line-height: 1.5em;
					color: var(--text);
					&:before {
						--translateX: 0;
						--box-shadow-color: var(--dot);
						--scale: 0.25em;
						content: '';
						position: absolute;
						left: 0;
						top: 0;
						width: 1.5em;
						height: 1.5em;
						border-radius: 50%;
						box-shadow: inset 0 0 0 var(--scale) var(--box-shadow-color);
						transform: translateX(var(--translateX));
						transition: box-shadow var(--duration) ease, transform var(--duration) ease;
					}
					&:not(:empty) {
						padding-left: 4em;
					}
				}
			}
			&:checked {
				& + div {
					&:before {
						--scale: 1;
					}
					&:after {
						--scale: 0;
					}
					span {
						&:before {
							--translateX: 1.7em;
							--scale: 0.25em;
							--box-shadow-color: var(--text);
						}
					}
				}
			}
		}
	}
</style>
