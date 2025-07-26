import type { LoadEvent } from '@sveltejs/kit';

export async function load({ fetch }: LoadEvent) {
	const picture_data = await fetch('https://boringapi.com/api/v1/photos');
	const picture_data_json = await picture_data.json();
	return { picture_data: picture_data_json.photos };
}
