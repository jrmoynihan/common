import { mount, type ComponentProps } from 'svelte';
import ActionSpotlight from './ActionSpotlight.svelte';

// Options to make:
// Toggleable
// Dismissable
// Rounded-spotlight
// Horizontal/Vertical Elliptical-spotlight
// Cut-out spotlight
// Follows the cursor

/** Each additional step takes the same parameters as the action itself, but you must also provide a node to move the spotlight to at each step. */
export type SpotlightStep = {
	node: HTMLElement;
} & Omit<ComponentProps<ActionSpotlight>, 'steps'>;

export type SpotlightParameters = Omit<SpotlightStep, 'node'> & { steps?: SpotlightStep[] };

export function spotlight(node: HTMLElement, parameters: SpotlightParameters) {
	let props = $state(parameters);
	// let spotlight: { $destroy: () => void; $set: (props: ComponentProps<ActionSpotlight>) => void };

	const { delay = 0 } = props;

	// setTimeout(async () => {
	// requestAnimationFrame(async () => {
	const spot = mount(ActionSpotlight, {
		target: document.body,
		// Allow easy use without declaring `steps` explicitly for a single node
		props: { steps: props.steps ?? [{ node }], ...props },
		intro: true
	});
	// })
	// }
	// , delay)

	async function updater(new_parameters?: SpotlightParameters) {
		props = { ...new_parameters };
	}

	return {
		async update(new_parameters?: SpotlightParameters) {
			updater(new_parameters);
		},
		async destroy() {
			spot.$destroy();
		},
		async next() {
			if (props?.steps && props?.steps.length > 0 && props.step) {
				props.step++;
			}
		}
	};
}
