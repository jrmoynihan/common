import { error } from '@sveltejs/kit';
import type { LoadEvent } from '@sveltejs/kit';
import { arrayFromNumber } from '$lib/functions/helpers';

export function load(event: LoadEvent) {
	const seeds = [
		'beer',
		'coffee',
		'cat',
		'technology',
		'science',
		'football',
		'lightning',
		'modern',
		'space',
		'exercise',
		'outdoors',
		''
	];
	const double_seeds = [...seeds];
	const number_of_links = double_seeds.length;
	const images = arrayFromNumber(number_of_links, (_, i: number) => {
		return {
			path: `route-${i}`,
			text: 'random',
			href: `https://source.unsplash.com/random?${double_seeds[i]}`,
			uuid: crypto.randomUUID()
		};
	});
	return { images };
	throw error(404, 'Not found.');
}