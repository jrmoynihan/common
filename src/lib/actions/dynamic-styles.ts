import { derived, get, writable, type Readable, type Writable } from 'svelte/store';

export interface DynamicStyleParameters {
	styles?: string;
	hover_styles?: string;
	focus_styles?: string;
	active_styles?: string;
	dynamic_styles?: string;
}
const default_parameters: DynamicStyleParameters = {
	styles: '',
	hover_styles: '',
	focus_styles: '',
	active_styles: '',
	dynamic_styles: ''
};

export function dynamicStyle(
	element: HTMLElement,
	parameters: DynamicStyleParameters = default_parameters
) {
	// Cache the existing styles on the element in a store
	const store: Writable<DynamicStyleParameters> = writable(parameters);
	const split_static_rules: Readable<string[]> = derived(store, ($store, set) => {
		if ($store.styles) {
			const rules = splitStyleRules($store.styles);
			set(rules);
		}
	});
	const split_hover_rules: Readable<string[]> = derived(store, (store_value, set) => {
		if (store_value.hover_styles) {
			const rules = splitStyleRules(store_value.hover_styles);
			set(rules);
		}
	});
	const split_active_rules: Readable<string[]> = derived(store, (store_value, set) => {
		if (store_value.active_styles) {
			const rules = splitStyleRules(store_value.active_styles);
			set(rules);
		}
	});
	const split_focus_rules: Readable<string[]> = derived(store, ($store, set) => {
		// For accessibility, if no focus styles are explicitly given, they should instead use the hover styles
		if (!$store.focus_styles && $store.hover_styles) {
			$store.focus_styles = $store.hover_styles;
		}
		if ($store.focus_styles) {
			const rules = splitStyleRules($store.focus_styles);
			set(rules);
		}
	});

	addStaticStyles();

	// Event-Listener functions
	function mouseEnter() {
		if (get(split_hover_rules)) {
			applyStyles(element, get(split_hover_rules));
		}
	}
	function mouseLeave() {
		if (get(split_hover_rules)) {
			removeStyles(element, get(split_hover_rules));
		}
	}
	function focused() {
		if (get(split_focus_rules)) {
			applyStyles(element, get(split_focus_rules));
		}
	}
	function blurred() {
		if (get(split_focus_rules)) {
			removeStyles(element, get(split_focus_rules));
		}
	}
	function activated() {
		if (get(split_active_rules)) {
			applyStyles(element, get(split_active_rules));
		}
	}
	function deactivated() {
		if (get(split_active_rules)) {
			removeStyles(element, get(split_active_rules));
		}
	}

	function addStaticStyles() {
		if (get(split_static_rules)) {
			applyStyles(element, get(split_static_rules));
		}
	}

	// Event listeners for mouseenter/mouseleave (hover) and focus/blur (focus)
	if (get(store).hover_styles) {
		element.addEventListener('mouseenter', mouseEnter);
		element.addEventListener('mouseleave', mouseLeave);
	}
	if (get(store).focus_styles) {
		element.addEventListener('focus', focused);
		element.addEventListener('blur', blurred);
	}
	if (get(store).active_styles) {
		element.addEventListener('mousedown', activated);
		element.addEventListener('mouseup', deactivated);
	}

	return {
		update(new_parameters: DynamicStyleParameters) {
			store.set(new_parameters);
			addStaticStyles();
		},
		destroy() {
			element.removeEventListener('mouseenter', mouseEnter);
			element.removeEventListener('mouseleave', mouseLeave);
			element.removeEventListener('focus', focused);
			element.removeEventListener('blur', blurred);
			element.removeEventListener('mousedown', activated);
			element.removeEventListener('mouseup', deactivated);
		}
	};
}

function splitStyleRules(styles: string): string[] {
	try {
		return styles.split(';');
	} catch (error) {
		return [];
	}
}
function splitRuletoKeyValuePair(rule: string) {
	const trimmed_rule = rule.trim();
	const [key, value] = trimmed_rule.split(':');
	return [key, value];
}
function applyStyles(element: HTMLElement, split_rules: string[]) {
	split_rules.forEach((rule) => {
		const [key, value] = splitRuletoKeyValuePair(rule);
		element.style.setProperty(key, value);
	});
}
function removeStyles(element: HTMLElement, split_rules: string[]) {
	split_rules.forEach((rule) => {
		const [key, value] = splitRuletoKeyValuePair(rule);
		element.style.removeProperty(key);
	});
}
