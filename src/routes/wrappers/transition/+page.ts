import type { PageLoadEvent } from "./$types";

export function load(event: PageLoadEvent): {
	links: { path: string; text: string; href: string }[];
} {
	const seeds = [
		"?anime,cosplay",
		"coffee",
		"cat",
		"technology",
		"science",
		"football",
		"global",
		"modern",
		"beautiful",
		"dream",
	];
	const links: { path: string; text: string; href: string }[] = Array.from({
		length: 10,
	}).map((_, i: number) => {
		return {
			path: `route-${i}`,
			text: "random",
			href: `https://source.unsplash.com/random?${seeds[i]}`,
		};
	});
	return { links };
}
