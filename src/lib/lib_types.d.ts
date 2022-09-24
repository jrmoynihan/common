import type {
	BlurParams,
	FadeParams,
	FlyParams,
	ScaleParams,
	SlideParams,
	TransitionConfig
} from 'svelte/transition';

export type IconSize =
	| 'xs'
	| 'sm'
	| 'lg'
	| '1x'
	| '2x'
	| '3x'
	| '4x'
	| '5x'
	| '6x'
	| '7x'
	| '8x'
	| '9x'
	| '10x';
export type SvelteTransitionParams =
	| (BlurParams & FadeParams & FlyParams & ScaleParams & SlideParams)
	| undefined;
export type SvelteTransition = (
	node: Element,
	{}: SvelteTransitionParams | undefined
) => TransitionConfig;
declare module '@fortawesome/free-solid-svg-icons/index' {
	export * from '@fortawesome/free-solid-svg-icons';
}
