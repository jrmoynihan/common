<script lang="ts">
	import { browser } from '$app/environment';
	import { setLocalStorageItem } from '$functions/local-storage.js';

	/** Bind this with your store that holds the state for light/dark theme selection */
	export let use_dark_theme = false;
	export let button_switch_styles = '';
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
		accent: 'var(--orange)'
	};
	/** The default colors to start with (currently set to dark theme) */
	export let default_colors = { ...dark_theme_colors };

	// Store these original colors for later if you want to reset them
	const darkResets = { ...dark_theme_colors };
	const lightResets = { ...light_theme_colors };

	// Set globally available CSS custom properties (AKA variables) on the root element
	const setCSSvariables = (colors: { [x: string]: string }) => {
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
				// A regular expression to find elements within parentheses
				const regExp = /\(([^)]+)\)/;
				// RegExp search returns an array of 3 elements:
				// 0) everything to the left parentheses (including the parentheses), 1) everything in between parentheses, 2) everything to the right of the parentheses (including the parentheses)
				let matches = regExp.exec(color);
				if (matches && matches[1]?.includes('--')) {
					const CSS_value = regExp.exec(window.getComputedStyle(root).getPropertyValue(matches[1]));
					if (CSS_value) {
						splitColorToVariables(CSS_value[1], key);
					}
				} else if (matches && matches?.length > 0) {
					splitColorToVariables(matches[1], key);
				}
			}
		}
	};
	function splitColorToVariables(color: string, key: string) {
		const [h, s, l, a] = color.split(',');
		const hsl = `${h}, ${s}, ${l}`;
		if (browser && root) {
			root.style.setProperty(`--${key}-value`, hsl);
			root.style.setProperty(`--${key}-hue`, `${h}`);
			root.style.setProperty(`--${key}-saturation`, `${s}`);
			root.style.setProperty(`--${key}-lightness`, `${l}`);
			root.style.setProperty(`--${key}-alpha`, `${a}`);
		}
	}

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

<label for="light-dark-toggle">
	<button
		class="switch"
		style={button_switch_styles}
		tabindex="0"
		on:click={() => {
			use_dark_theme = !use_dark_theme;
			storeDarkThemePreference();
		}}
	>
		<input
			type="checkbox"
			name="light-dark-toggle"
			bind:checked={use_dark_theme}
			on:change={storeDarkThemePreference}
		/>
		<div>
			<span />
		</div>
	</button>
</label>

<style lang="scss">
	.switch {
		--line: var(--text, white);
		--dot: hsl(0, 0%, 0%);
		--circle: hsl(233, 100%, 98%); //#9EA0BE
		--duration: 0.3s;
		--text: hsl(236, 20%, 68%);
		cursor: pointer;
		padding: 0.5rem;
		user-select: none;
		border-radius: 1rem;
		display: grid;
		background-color: transparent;
		border: none;
		&:focus {
			box-shadow: var(--button-focus-shadow);
		}
		&:hover {
			box-shadow: var(--button-hover-shadow);
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
					scale: var(--scale);
					transition: all var(--duration) ease;
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
						translate: var(--translateX) 0 0;
						transition:
							box-shadow var(--duration) ease,
							translate var(--duration) ease;
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
