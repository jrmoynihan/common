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
	| BlurParams
	| FadeParams
	| FlyParams
	| ScaleParams
	| SlideParams;
export type SvelteTransition = (node: Element, {}: AnyTransitionParams) => TransitionConfig;
