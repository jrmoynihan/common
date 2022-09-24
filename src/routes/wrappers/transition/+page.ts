import { error, type LoadEvent } from '@sveltejs/kit';
import { arrayFromNumber } from '$lib/functions/helpers.js';

export function load(event: LoadEvent) {
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
	return {
		links
	};
	throw error(404, 'Not found.');
}
