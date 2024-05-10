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
	/** CSS styles to apply to the element when it is in the `:dynamic` state. */
	// dynamic_styles?: string;
}
const default_parameters: DynamicStyleParameters = {
	styles: '',
	hover_styles: '',
	focus_styles: '',
	active_styles: ''
	// dynamic_styles: ''
};

export function dynamicStyle(
	element: HTMLElement,
	parameters: DynamicStyleParameters = default_parameters
) {
	// Cache the existing styles on the element in a store
	let store = $state<DynamicStyleParameters>(parameters);
	let split_static_rules = $derived(splitStyleRules(store.styles));
	let split_hover_rules = $derived(splitStyleRules(store.hover_styles));
	let split_active_rules = $derived(splitStyleRules(store.active_styles));
	let split_focus_rules = $derived.by(() => {
		if (!store.focus_styles && store.hover_styles) {
			store.focus_styles = store.hover_styles;
		}
		return splitStyleRules(store.focus_styles);
	});

	addStaticStyles();

	// Event-Listener functions
	function mouseEnter(): void {
		if (split_hover_rules) {
			applyStyles(element, split_hover_rules);
		}
	}
	function mouseLeave(): void {
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

	// Event listeners for mouseenter/mouseleave (hover) and focus/blur (focus)
	if (store?.hover_styles) {
		element.addEventListener('mouseenter', mouseEnter);
		element.addEventListener('mouseleave', mouseLeave);
	}
	if (store?.focus_styles) {
		element.addEventListener('focus', focused);
		element.addEventListener('blur', blurred);
	}
	if (store?.active_styles) {
		element.addEventListener('mousedown', activated);
		element.addEventListener('mouseup', deactivated);
	}

	return {
		update(new_parameters: DynamicStyleParameters) {
			store = new_parameters;
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
