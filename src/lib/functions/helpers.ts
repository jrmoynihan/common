// A function to make an array from a number
export function arrayFromNumber(n: number) {
	return Array(n)
		.fill(0)
		.map((_, i) => i);
}
// A function to clamp a number between two numbers
export function clamp(n: number, min: number, max: number) {
	return Math.min(Math.max(n, min), max);
}
