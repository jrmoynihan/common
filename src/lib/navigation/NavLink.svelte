<script lang="ts">
	import { page } from '$app/stores';
	import { tooltip, type TooltipParameters } from '$lib/tooltip';
	import { capitalize } from '$lib/functions';

	export let link: URL;
	export let link_text: string | null = null;
	export let tooltip_options: TooltipParameters | TooltipParameters[] = [];
	export let is_current_page: boolean = false;
	export let i: number;
	export let static_styles = '';

	// Determine if the current path matches a given path string
	function doesPathMatchCurrentURL(path: string, currentURL: string) {
		return currentURL.includes(`/${path}`);
	}
	$: is_current_page = doesPathMatchCurrentURL(link.pathname, $page?.url?.pathname);
</script>

<a
	use:tooltip={Array.isArray(tooltip_options) ? tooltip_options[i] : tooltip_options}
	href={link.href}
	sveltekit:prefetch
	class="link"
	class:current-page={is_current_page}
	style={static_styles}>{link_text ?? capitalize(link.pathname)}</a
>

<style lang="scss">
	.link {
		text-decoration: none;
		font-size: 1.5rem;
		padding: 1rem;
		color: white;
		border-radius: 2rem;
		background-color: hsl(195, 61%, 34%);
		transition: background-color 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
		&:hover,
		&:focus-visible {
			background-color: hsl(195, 61%, 44%);
		}
		&.current-page {
			box-shadow: 0 0 14px 4px orange;
			background-color: hsl(195, 61%, 44%);
		}
	}
</style>
