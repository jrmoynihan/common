export function capitalize(str: string) {
	return str.charAt(0).toUpperCase() + str.slice(1);
}
// A function to make an array from a number
export function arrayFromNumber(n: number, map_function?: (a: any, i: number) => any) {
	if (!map_function) map_function = (_: any, i?: number) => i;
	return Array(n).fill(0).map(map_function);
}
// A function to clamp a number between two numbers
export function clamp(n: number, min: number, max: number) {
	return Math.min(Math.max(n, min), max);
}
export async function delay(time: number) {
	await new Promise((args) => setTimeout(args, time));
}
