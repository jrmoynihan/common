export type TextInputTypes = 'text' | 'datalist';
export interface DatalistOption {
	value: unknown;
	label: string;
}
export interface SelectOption {
	value: unknown;
	display_text?: string;
	disabled?: boolean;
}
export interface SelectOptionGroup {
	options: SelectOption[];
	label?: string;
}
export type SelectOptionList = (SelectOption | SelectOptionGroup)[];
