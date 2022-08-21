// //@ts-nocheck
import { clamp } from '$lib/functions/helpers';
export interface RealShadowParameters {
	resolution?: number;
	oomph?: number;
	crispness?: number;
	/** Three-digit HSL color string, without commas (e.g. '30 100% 50%') */
	hsl?: string | null;
	/** A distance factor between -1 and 1 to change the angle of the shadow */
	vertical_distance?: number;
	/** A distance factor between -1 and 1 to change the angle of the shadow */
	horizontal_distance?: number;
	elevation?: ShadowElevation;
}
export type ShadowElevation = 'low' | 'medium' | 'high';
interface ShadowParameters extends RealShadowParameters {
	resolution: number;
	oomph: number;
	crispness: number;
	vertical_distance: number;
	horizontal_distance: number;
	hsl: string | null;
	elevation: ShadowElevation;
}
const defaultShadowParameters: ShadowParameters = {
	resolution: 0.5,
	oomph: 0.5,
	crispness: 0.5,
	vertical_distance: -0.5,
	horizontal_distance: -0.5,
	hsl: null,
	elevation: 'medium'
};

export function realShadow(input: RealShadowParameters = defaultShadowParameters) {
	const internal: ShadowParameters = { ...defaultShadowParameters, ...input };
	const { resolution, oomph, crispness, hsl, elevation, vertical_distance, horizontal_distance } =
		internal;
	console.table(internal);
	// Ensure a valid distance factor
	const horizontal_offset_factor = clamp(horizontal_distance, -1, 1);
	const vertical_offset_factor = clamp(vertical_distance, -1, 1);
	const min_shadows = elevation === 'high' ? 3 : 2;
	const max_shadows = elevation === 'high' ? 10 : elevation === 'medium' ? 5 : 3;
	const shadow_count = Math.ceil(resolution * (max_shadows - min_shadows)) + min_shadows;

	const shadow_blur = (horizontal_offset_factor + vertical_offset_factor) * crispness * oomph;
	const shadow_color = hsl ? hsl : '0 0% 0%';
	const base_alpha = (1 / shadow_count) * crispness * (1 + 2 * oomph);
	const shadows = Array(shadow_count)
		.fill(0)
		.map((_, current_shadow) => {
			const base_spread = 5 * crispness; // max spread at furthest shadow, in px
			const spread = -1 * (base_spread / (shadow_count - 1)) * current_shadow;
			// const distance = spread * shadow_count * i;
			const distance = current_shadow / shadow_count;
			const x = (horizontal_offset_factor + distance) ^ current_shadow;
			const y = (vertical_offset_factor + distance) ^ current_shadow;
			// const y = i * shadow_spread;
			// const y = vertical_offset_factor * distance;
			// const alpha = base_alpha * (1 - i / shadow_count);
			const alpha = base_alpha - (base_alpha / shadow_count) * (current_shadow - 1);
			return `${x.toPrecision(2)}px ${y.toPrecision(2)}px ${shadow_blur}px ${
				current_shadow > 0 ? `${spread < 0 ? spread.toPrecision(2) : ''}px` : ''
			} hsla(${shadow_color} / ${alpha})`;
		});
	return `box-shadow: ${shadows};`;
}
