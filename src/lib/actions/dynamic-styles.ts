import { derived, get, writable, type Readable, type Writable } from 'svelte/store';

export interface DynamicStyleParameters {
	styles?: string;
	hover_styles?: string;
	focus_styles?: string;
	dynamic_styles?: string;
}
const default_parameters: DynamicStyleParameters = {
	styles: '',
	hover_styles: '',
	focus_styles: '',
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
	const split_hover_rules: Readable<string[]> = derived(store, ($store, set) => {
		if ($store.hover_styles) {
			const rules = splitStyleRules($store.hover_styles);
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
		}
	};
}

function splitStyleRules(styles: string): string[] {
	return styles.split(';');
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
