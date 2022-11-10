import { arrayFromNumber } from '$functions/helpers.js';
import type { LoadEvent } from '@sveltejs/kit';
import { error } from '@sveltejs/kit';

export function load(event: LoadEvent): {
	images: { path: string; text: string; href: string; uuid: string }[];
} {
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
	const images: { path: string; text: string; href: string; uuid: string }[] = arrayFromNumber(
		number_of_links,
		(_: unknown, i: number) => {
			return {
				path: `route-${i}`,
				text: 'random',
				href: `https://source.unsplash.com/random?${double_seeds[i]}`,
				uuid: crypto.randomUUID()
			};
		}
	);
	if (images) {
		return { images };
	} else {
		throw error(404, 'Not found.');
	}
}
