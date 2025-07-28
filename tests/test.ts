import { make_subroute_nav_links } from '$lib';
import { expect, test } from '@playwright/test';

test('make correct subroute nav links', async () => {
	const url = new URL('https://localhost:5173/wrappers');
	const nav_links = await make_subroute_nav_links(url);
	expect(nav_links).toContain([
		{
			url: new URL('https://localhost:5173/wrappers/accordion'),
			link_text: 'Accordion'
		}
	]);
});
