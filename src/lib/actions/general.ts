import { tooltip } from '$tooltip/tooltip-action.js';
import type ActionTooltip from '.tooltip/ActionTooltip.svelte';
import type { ComponentProps } from 'svelte';
import type ActionSpotlight from './spotlight/ActionSpotlight.svelte';
import { spotlight } from './spotlight/spotlight.js';

export async function waitForAnimations(ticking: boolean) {
	// Get animations running within the document's body
	const animations = document.body.getAnimations({ subtree: true });
	// Only run this function once per frame
	if (!ticking) {
		window.requestAnimationFrame(async () => {
			// Make sure all animations have settled (resolved or rejected); Rejection can happen when the element unmounts before the animation finishes
			if (animations?.length > 0) {
				const finishes = animations.map((a) => a.finished);
				await Promise.allSettled(finishes);
			}
			ticking = false;
		});
		ticking = true;
	}
}

export function tutorial(
	node: HTMLElement,
	parameters: { spotlight: ComponentProps<ActionSpotlight>; tooltip: ComponentProps<ActionTooltip> }
) {
	const spot = spotlight(node, parameters.spotlight);
	const tip = tooltip(node, parameters.tooltip);
	return {
		async update(parameters: {
			spotlight: ComponentProps<ActionSpotlight>;
			tooltip: ComponentProps<ActionTooltip>;
		}) {
			spot.update(parameters.spotlight);
			tip.update(parameters.tooltip);
		},
		destroy() {
			spot.destroy();
			tip.destroy();
		}
	};
}
