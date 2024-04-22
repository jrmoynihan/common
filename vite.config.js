import { sveltekit } from "@sveltejs/kit/vite";
import examples from "mdsvexamples/vite";
import path from "node:path";
import { kitRoutes } from "vite-plugin-kit-routes";

const $root = path.resolve(__dirname, "./src");
const $lib = path.resolve($root, "./lib");
const $routes = path.resolve($root, "./routes");
const $scripts = path.resolve($lib, "./scripts");
const $actions = path.resolve($lib, "./actions");

/** @type {import('vite').UserConfig} */
const config = {
	plugins: [examples, sveltekit(), kitRoutes()],
	resolve: {
		alias: {
			$lib,
			$routes,
			$scripts,
			$actions,
		},
	},
	ssr: {
		noExternal: [
			"@fortawesome/free-solid-svg-icons",
			"@fortawesome/free-brands-svg-icons",
		],
	},
};

export default config;
