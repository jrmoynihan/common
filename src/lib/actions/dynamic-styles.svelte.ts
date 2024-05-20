/** Dynamic styles to apply to an element */
export interface DynamicStyleParameters {
	/** CSS styles to apply to the element. Will be re-applied when hover, focus, current-page status is lost. */
	styles?: string;
	/** CSS styles to apply to the element on hover. */
	hover_styles?: string;
	/** CSS styles to apply to the element on focus. */
	focus_styles?: string;
	/** CSS styles to apply to the element when it is in the `:active` state. */
	active_styles?: string;
	/** CSS styles to apply to the element when it is in the `:valid` state. */
	valid_styles?: string;
	/** CSS styles to apply to the element when it is in the `:invalid` state. */
	invalid_styles?: string;
	// dynamic_styles?: string;
}
const default_parameters: DynamicStyleParameters = {
	styles: '',
	hover_styles: '',
	focus_styles: '',
	active_styles: ''
	// dynamic_styles: ''
};

export function dynamic_style(
	element: HTMLElement,
	parameters: DynamicStyleParameters = default_parameters
) {
	// Cache the existing styles on the element in a store
	let store = $state<DynamicStyleParameters>(parameters);
	let cached_styles = $state(element.style);
	let split_static_rules = $derived(splitStyleRules(store.styles));
	let split_hover_rules = $derived(splitStyleRules(store.hover_styles));
	let split_active_rules = $derived(splitStyleRules(store.active_styles));
	let split_valid_rules = $derived(splitStyleRules(store.valid_styles));
	let split_invalid_rules = $derived(splitStyleRules(store.invalid_styles));
	let split_focus_rules = $derived.by(() => {
		if (!store.focus_styles && store.hover_styles) {
			store.focus_styles = store.hover_styles;
		}
		return splitStyleRules(store.focus_styles);
	});

	addStaticStyles();

	// Event-Listener functions
	function mouseenter(): void {
		if (split_hover_rules) {
			applyStyles(element, split_hover_rules);
		}
	}
	function mouseleave(): void {
		if (split_hover_rules) {
			removeStyles(element, split_hover_rules);
		}
	}
	function focused(): void {
		if (split_focus_rules) {
			applyStyles(element, split_focus_rules);
		}
	}
	function blurred(): void {
		if (split_focus_rules) {
			removeStyles(element, split_focus_rules);
		}
	}
	function activated(): void {
		if (split_active_rules) {
			applyStyles(element, split_active_rules);
		}
	}
	function deactivated(): void {
		if (split_active_rules) {
			removeStyles(element, split_active_rules);
		}
	}

	function addStaticStyles(): void {
		if (split_static_rules) {
			applyStyles(element, split_static_rules);
		}
	}
	function add_valid_styles(): void {
		if (split_valid_rules) {
			applyStyles(element, split_valid_rules);
		}
	}
	function add_invalid_styles(): void {
		if (split_invalid_rules) {
			applyStyles(element, split_invalid_rules);
		}
	}
	function remove_valid_styles(): void {
		if (split_valid_rules) {
			removeStyles(element, split_valid_rules);
		}
	}
	function remove_invalid_styles(): void {
		if (split_invalid_rules) {
			removeStyles(element, split_invalid_rules);
		}
	}
	function check_input_validity(input: HTMLInputElement) {
		if (input.value && input.validity.valid) {
			remove_invalid_styles();
			add_valid_styles();
		} else if (input.value && !input.validity.valid) {
			remove_valid_styles();
			add_invalid_styles();
		} else {
			remove_invalid_styles();
			remove_valid_styles();
		}
	}
	function add_cached_styles(): void {
		remove_valid_styles();
		remove_invalid_styles();
		for (const [key, value] of Object.entries(cached_styles)) {
			element.style.setProperty(key, value);
		}
	}

	// Event listeners for mouseenter/mouseleave (hover) and focus/blur (focus)
	if (store?.hover_styles) {
		element.addEventListener('mouseenter', mouseenter);
		element.addEventListener('mouseleave', mouseleave);
	}
	if (store?.focus_styles) {
		element.addEventListener('focus', focused);
		element.addEventListener('blur', blurred);
	}
	if (store?.active_styles) {
		element.addEventListener('mousedown', activated);
		element.addEventListener('mouseup', deactivated);
	}
	if (store?.valid_styles || store?.invalid_styles) {
		if (element.tagName === 'INPUT') {
			const input = element as HTMLInputElement;
			input.addEventListener('input', () => check_input_validity(input));
			input.addEventListener('blur', () => check_input_validity(input));
		} else {
			element.addEventListener('valid', remove_invalid_styles);
			element.addEventListener('invalid', remove_valid_styles);
			element.addEventListener('valid', add_valid_styles);
			element.addEventListener('invalid', add_invalid_styles);
			element.addEventListener('blur', add_cached_styles);
		}
	}

	return {
		update(new_parameters: DynamicStyleParameters) {
			store = new_parameters;
			addStaticStyles();
		},
		destroy() {
			element.removeEventListener('mouseenter', mouseenter);
			element.removeEventListener('mouseleave', mouseleave);
			element.removeEventListener('focus', focused);
			element.removeEventListener('blur', blurred);
			element.removeEventListener('mousedown', activated);
			element.removeEventListener('mouseup', deactivated);
			element.removeEventListener('valid', remove_invalid_styles);
			element.removeEventListener('invalid', remove_valid_styles);
			element.removeEventListener('valid', add_valid_styles);
			element.removeEventListener('invalid', add_invalid_styles);
			element.removeEventListener('blur', add_cached_styles);
			element.oninvalid = null;
			element.removeEventListener('input', () => check_input_validity);
		}
	};
}

function splitStyleRules(styles: string | undefined): string[] {
	try {
		if (styles) {
			return styles.split(';');
		} else {
			return [];
		}
	} catch (error) {
		return [];
	}
}
function splitRuletoKeyValuePair(rule: string): [string, string] {
	const trimmed_rule = rule.trim();
	const [key, value] = trimmed_rule.split(':');
	return [key, value];
}
function applyStyles(element: HTMLElement, split_rules: string[]): void {
	for (const rule of split_rules) {
		const [key, value] = splitRuletoKeyValuePair(rule);
		element.style.setProperty(key, value);
	}
}
function removeStyles(element: HTMLElement, split_rules: string[]): void {
	for (const rule of split_rules) {
		const [key, value] = splitRuletoKeyValuePair(rule);
		element.style.removeProperty(key);
	}
}
