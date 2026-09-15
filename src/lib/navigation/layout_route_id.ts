/**
 * Map a `+layout` / `+page` module path (or `import.meta.url`) to a Kit route id.
 *
 * `page.route.id` is the **leaf page**, so it cannot name the layout that is
 * rendering `<Navigation />`. The layout file's location under `src/routes` can.
 */

const ROUTES_DIR = '/src/routes';
const ROUTE_FILE =
	/\/\+(?:layout|page|error|server|group)(?:@[^./\\]+)?\.(?:svelte|ts|js|md)(?:\.[a-z]+)?$/i;

function pathname_from_module_url(source: string): string {
	try {
		if (source.includes('://')) {
			return decodeURIComponent(new URL(source).pathname);
		}
	} catch {
		// Fall through and treat `source` as a filesystem path.
	}
	return source;
}

/** Kit route id for a file under `src/routes`, or `undefined` if it is not a route module. */
export function route_id_from_filename(source: string): string | undefined {
	const path = pathname_from_module_url(source).replaceAll('\\', '/');
	const dir_index = path.lastIndexOf(ROUTES_DIR);
	if (dir_index === -1) return undefined;

	let rest = path.slice(dir_index + ROUTES_DIR.length);
	rest = rest.replace(ROUTE_FILE, '');
	rest = rest.replace(/\/$/, '');

	const segments = rest
		.split('/')
		.filter((segment) => segment.length > 0 && !/^\(.*\)$/.test(segment));
	return segments.length === 0 ? '/' : `/${segments.join('/')}`;
}

/**
 * Accept a Kit route id (`/recipes`), a bare segment (`recipes`), a `URL`, or a
 * layout `import.meta.url` / filename, and return a route id with a leading `/`.
 */
export function to_nav_parent_path(parent: string | URL): string {
	const raw = typeof parent === 'string' ? parent : parent.href;
	const from_file = route_id_from_filename(raw);
	if (from_file !== undefined) return from_file;

	const path = typeof parent === 'string' ? parent : parent.pathname;
	if (path.includes('://') || path === '' || path === '/') return '/';
	const trimmed = path.replace(/\/+$/, '');
	return trimmed.startsWith('/') ? trimmed : `/${trimmed}`;
}

/** Last static segment of a layout route id (`/recipes` → `recipes`, `/` → `''`). */
export function layout_route_segment(parent: string | URL): string {
	const id = to_nav_parent_path(parent);
	if (id === '/') return '';
	return id.slice(id.lastIndexOf('/') + 1);
}
