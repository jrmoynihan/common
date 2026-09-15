import { route_id_from_filename } from './layout_route_id.js';

type MarkupArgs = { content: string; filename?: string };

/**
 * Fills `parent_path` on `<Navigation>` in `+layout.svelte` from the layout file's
 * folder, so callers do not type `/recipes` (or pass `import.meta.url`).
 *
 * Add to the Kit `preprocess` array in `vite.config.ts`. Explicit `parent_path` /
 * `layout_url` attributes are left alone.
 */
export function navigation_layout_preprocess() {
	return {
		name: 'navigation-layout-path',
		markup({ content, filename }: MarkupArgs) {
			if (!filename) return;
			const normalized = filename.replaceAll('\\', '/');
			if (!normalized.endsWith('/+layout.svelte')) return;
			if (!/<Navigation(?=[\s/>])/.test(content)) return;

			const route_id = route_id_from_filename(filename);
			if (!route_id) return;

			const next = content.replace(
				/<Navigation(?=[\s/>])([^>]*?)(\/?>)/g,
				(full, rest: string, close: string) => {
					if (/\b(?:parent_path|layout_url)=/.test(rest)) return full;
					return `<Navigation parent_path=${JSON.stringify(route_id)} ${rest.trimStart()}${close}`;
				}
			);

			if (next === content) return;
			return { code: next };
		}
	};
}
