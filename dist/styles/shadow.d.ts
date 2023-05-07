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
export declare function realShadow(input?: RealShadowParameters): string;
