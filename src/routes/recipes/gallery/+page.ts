import type { LoadEvent } from '@sveltejs/kit';

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
	];
	const double_seeds = [...seeds];
	const images: { path: string; text: string; href: string; uuid: string }[] = Array.from({length: double_seeds.length},
		(_: unknown, i: number) => {
			return {
				path: `route-${i}`,
				text: 'random',
				href: `https://source.unsplash.com/random?${double_seeds[i]}`,
				uuid: crypto.randomUUID()
			};
		}
	);

	return { images };
}
