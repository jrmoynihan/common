# Bug Analysis and Fixes

This document details 3 bugs found in the Svelte component library codebase, their impact, and the implemented fixes.

## Bug 1: JSON Parsing Error Handling in Local Storage Functions

### Location
`src/lib/functions/local-storage.ts:8`

### Description
The `get_local_storage_item` function lacks proper error handling for `JSON.parse()`, which can throw exceptions if the stored data is malformed JSON. This could crash the application when users have corrupted localStorage data.

### Impact
- **Severity**: High
- **Type**: Error Handling Bug
- **Risk**: Application crashes when localStorage contains invalid JSON

### Current Buggy Code
```typescript
export const get_local_storage_item = async <T>(key: string): Promise<T | undefined> => {
	if (browser) {
		const item = localStorage.getItem(key);
		if (item) {
			const parsed_item = JSON.parse(item); // BUG: No error handling
			return parsed_item as T;
		}
	} else {
		Log({ msg: 'unable to check for local storage without the browser available' });
	}
};
```

### Fixed Code
```typescript
export const get_local_storage_item = async <T>(key: string): Promise<T | undefined> => {
	if (browser) {
		const item = localStorage.getItem(key);
		if (item) {
			try {
				const parsed_item = JSON.parse(item);
				return parsed_item as T;
			} catch (error) {
				Log({ msg: `Failed to parse localStorage item "${key}": ${error}` });
				// Optionally remove the corrupted item
				localStorage.removeItem(key);
				return undefined;
			}
		}
	} else {
		Log({ msg: 'unable to check for local storage without the browser available' });
	}
};
```

---

## Bug 2: Division by Zero in Modulo Function

### Location
`src/lib/functions/helpers.svelte.ts:796`

### Description
The `modulo` function doesn't handle the edge case where the divisor is 0, which results in division by zero and returns `NaN`. This violates mathematical expectations and can cause unexpected behavior in calculations.

### Impact
- **Severity**: Medium
- **Type**: Logic Error
- **Risk**: Silent failures in mathematical calculations, unexpected NaN values

### Current Buggy Code
```typescript
export function modulo(dividend: number, divisor: number): number {
	// handle negative numbers to behave like a true modulo operation instead of a remainder operation
	return ((dividend % divisor) + divisor) % divisor; // BUG: No check for divisor === 0
}
```

### Fixed Code
```typescript
export function modulo(dividend: number, divisor: number): number {
	if (divisor === 0) {
		throw new Error('Division by zero: modulo function requires a non-zero divisor');
	}
	// handle negative numbers to behave like a true modulo operation instead of a remainder operation
	return ((dividend % divisor) + divisor) % divisor;
}
```

---

## Bug 3: Invalid CSS Style Attribute in TextInput Component

### Location
`src/lib/inputs/TextInput.svelte:99`

### Description
The component sets the `style` attribute to `null` instead of an empty string or undefined when hiding elements. This generates console warnings in browsers because `null` is not a valid CSS style value.

### Impact
- **Severity**: Low
- **Type**: UI/Console Warning
- **Risk**: Console pollution, potential rendering inconsistencies

### Current Buggy Code
```svelte
<InputButton
	tabindex={value && valid ? 0 : -1}
	onclick={handle_confirm_click}
	disabled={!value}
	icon_props={{
		icon: 'fa6-solid:check',
		color: 'var(--text-input-button-color, buttontext)'
	}}
	{...button_props}
	style={`${value === undefined || value === null ? null : 'display: none;'}`}
	class={['_confirm-btn', { value, valid }]}
></InputButton>
```

### Fixed Code
```svelte
<InputButton
	tabindex={value && valid ? 0 : -1}
	onclick={handle_confirm_click}
	disabled={!value}
	icon_props={{
		icon: 'fa6-solid:check',
		color: 'var(--text-input-button-color, buttontext)'
	}}
	{...button_props}
	style={value === undefined || value === null ? 'display: none;' : undefined}
	class={['_confirm-btn', { value, valid }]}
></InputButton>
```

---

## Summary

These three bugs represent common categories of issues in web applications:

1. **Error Handling**: The localStorage function needed proper exception handling for JSON parsing
2. **Mathematical Edge Cases**: The modulo function needed to handle division by zero
3. **DOM Attribute Handling**: The TextInput component had improper style attribute assignment

All fixes have been implemented to improve the robustness, reliability, and maintainability of the codebase.