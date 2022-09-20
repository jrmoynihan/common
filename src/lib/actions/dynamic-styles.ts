export interface dynamicStyleParameters {
	static_styles?: string;
	hover_styles?: string;
	focus_styles?: string;
	dynamic_styles?: string;
}
const default_parameters: dynamicStyleParameters = {
	static_styles: '',
	hover_styles: '',
	focus_styles: '',
	dynamic_styles: ''
};

export function dynamicStyle(
	element: HTMLElement,
	parameters: dynamicStyleParameters = default_parameters
) {
	// Cache the existing styles on the element (NOTE: may need to have these to be passed by param?)
	let { static_styles, hover_styles, focus_styles, dynamic_styles } = parameters;
	let split_static_rules: string[];
	let split_hover_rules: string[];
	let split_focus_rules: string[];

	// For accessibility, if no focus styles are explicitly given, they should instead use the hover styles
	if (!focus_styles && hover_styles) focus_styles = hover_styles;
	if (static_styles) split_static_rules = splitStyleRules(static_styles);
	if (hover_styles) split_hover_rules = splitStyleRules(hover_styles);
	if (focus_styles) split_hover_rules = splitStyleRules(focus_styles);

	addExistingStaticStyles();

	function mouseEnter() {
		if (split_hover_rules) {
			applyStyles(element, split_hover_rules);
		}
	}
	function mouseLeave() {
		if (split_hover_rules) {
			removeStyles(element, split_hover_rules);
		}
	}
	function focused() {
		if (split_focus_rules) {
			applyStyles(element, split_focus_rules);
		}
	}
	function blurred() {
		if (split_focus_rules) {
			removeStyles(element, split_focus_rules);
		}
	}

	function addExistingStaticStyles() {
		if (split_static_rules) {
			applyStyles(element, split_static_rules);
		}
	}

	// Event listeners for mouseenter/mouseleave (hover) and focus/blur (focus)
	if (hover_styles) {
		element.addEventListener('mouseenter', mouseEnter);
		element.addEventListener('mouseleave', mouseLeave);
	}
	if (focus_styles) {
		element.addEventListener('focus', focused);
		element.addEventListener('blur', blurred);
	}

	return {
		update() {},
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
	const [key, value] = rule.split(':');
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
