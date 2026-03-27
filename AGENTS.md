You are able to use the Svelte MCP server, where you have access to comprehensive Svelte 5 and SvelteKit documentation. Here's how to use the available tools effectively:

## Available MCP Tools:

### 1. list-sections

Use this FIRST to discover all available documentation sections. Returns a structured list with titles, use_cases, and paths.
When asked about Svelte or SvelteKit topics, ALWAYS use this tool at the start of the chat to find relevant sections.

### 2. get-documentation

Retrieves full documentation content for specific sections. Accepts single or multiple sections.
After calling the list-sections tool, you MUST analyze the returned documentation sections (especially the use_cases field) and then use the get-documentation tool to fetch ALL documentation sections that are relevant for the user's task.

### 3. svelte-autofixer

Analyzes Svelte code and returns issues and suggestions.
You MUST use this tool whenever writing Svelte code before sending it to the user. Keep calling it until no issues or suggestions are returned.

### 4. playground-link

Generates a Svelte Playground link with the provided code.
After completing the code, ask the user if they want a playground link. Only call this tool after user confirmation and NEVER if code was written to files in their project.

## Learned User Preferences

- Prefer npm granular access tokens (in `~/.npmrc` or `NPM_CONFIG_TOKEN`) for publishing and CI; interactive `npm login` sessions are short-lived (~2 hours).
- Do not put `npm login` in `package.json` publish scripts (interactive, poor for CI, does not extend session lifetime).

## Learned Workspace Facts

- This package is `@jrmoynihan/common`, a Svelte library built into `dist/` via `svelte-package`. Run `bun run package` (svelte-kit sync + svelte-package) before `bun publish` so the tarball includes a fresh build; `bun publish` packs the tree but does not replace that step.
- In `src/lib/index.ts`, TypeScript often does not resolve named type exports from `.svelte` in `.ts` files; use `ComponentProps<typeof Component>` and/or re-export types from `.ts` modules. A side-effect import of helpers applies global TS augmentations (`Map`, `JSON`, `fetch`) when consumers load the package entry.
- `Table` targets semantic `<table>`-style APIs; `DataGrid` targets richer grid UIs (sorting, filtering, optional virtualization)—different components on purpose.
- CSS anchor positioning for attached tooltips is separate from the Popover API: MDN does not describe Popover as setting an implicit CSS `anchor-name`; the anchor element needs a proper `anchor-name` and tooltip CSS must reference it (e.g. `anchor(var(--name) …)`).
