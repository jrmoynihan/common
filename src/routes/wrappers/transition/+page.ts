import { arrayFromNumber } from '$functions/helpers.js';
import { error, type LoadEvent } from '@sveltejs/kit';

export function load(event: LoadEvent): { links: { path: string; text: string; href: string }[] } {
	const seeds = [
		'?anime,cosplay',
		'coffee',
		'cat',
		'technology',
		'science',
		'football',
		'global',
		'modern',
		'beautiful',
		'dream'
	];
	const number_of_links = 10;
	const links: { path: string; text: string; href: string }[] = arrayFromNumber(
		number_of_links,
		(_, i: number) => {
			return {
				path: `route-${i}`,
				text: 'random',
				href: `https://source.unsplash.com/random?${seeds[i]}`
			};
		}
	);
	if (links) {
		return { links };
	} else {
		error(404, 'Not found.');
	}
}
