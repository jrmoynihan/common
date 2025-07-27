import type { LayoutLoadEvent } from '../$types';

export async function load({ url }: LayoutLoadEvent) {
	return {
		url
	};
}
