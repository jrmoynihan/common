import type { LoadEvent } from '@sveltejs/kit';
// import type { LayoutServerLoad } from './$types';

export type WrapperServerLoad = {
	refresh: string;
};

export function load(event: LoadEvent): WrapperServerLoad {
	const { url } = event;
	const { href } = url;
	return {
		refresh: 'hi from wrappers/+layout.server.ts'
	};
}
