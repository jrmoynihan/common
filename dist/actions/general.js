import { tooltip } from './tooltip/tooltip.js';
import { spotlight } from './spotlight/spotlight.js';
export async function waitForAnimations(ticking) {
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
export function tutorial(node, parameters) {
    const spot = spotlight(node, parameters.spotlight);
    const tip = tooltip(node, parameters.tooltip);
    spot.spotlight.$on('next', (e) => {
        if (parameters?.tooltip?.steps) {
            const next = parameters.tooltip.steps[e.detail.node_index];
            if (next && tip) {
                const delay = parameters.spotlight.steps
                    ? parameters.spotlight.steps[e.detail.node_index].delay
                    : undefined;
                tip.goToNextNode(e.detail.node_index, delay);
            }
        }
    });
    spot.spotlight.$on('closeAll', () => tip?.destroy());
    return {
        async update(parameters) {
            spot.update(parameters.spotlight);
            tip?.update(parameters.tooltip);
        },
        destroy() {
            spot.destroy();
            tip?.destroy();
        }
    };
}
