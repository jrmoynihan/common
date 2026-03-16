// NOTE: Keep $alias for default (component) imports. See https://kit.svelte.dev/docs/packaging#caveats
// Prop types are derived via ComponentProps<typeof Component> so TS/IDE resolve them without importing from .svelte
// (see svelte#5817 / shadcn-svelte#1468: named type exports from .svelte are not seen by TS when imported from .ts).

import type { ComponentProps } from 'svelte';
// Side-effect: augments global Map so new Map() returns TypeSafeMap (has/get narrowing). See helpers.svelte.ts.
import './functions/helpers.svelte.js';

// Reexport your entry components here

// Buttons
import ResetButton from '$buttons/ResetButton.svelte';
import SubmitButton from '$buttons/SubmitButton.svelte';
import DragAnchor from './buttons/DragAnchor.svelte';
import LightDarkToggle from './buttons/LightDarkToggle_v2.svelte';
import ToggleSwitch from './buttons/ToggleSwitch.svelte';

// Tooltips
import ActionTooltip from './attach/tooltip/AttachedTooltip.svelte';

// Inputs
import Checkbox from '$inputs/Checkbox.svelte';
import InputButton from '$inputs/InputButton.svelte';
import InputLabel from '$inputs/InputLabel.svelte';
import RadioGroup from '$inputs/RadioGroup.svelte';
import NumericInput from './inputs/NumericInput.svelte';
import Select from './inputs/Select.svelte';
import type { SelectOptionGroup } from './inputs/select.types.js';
import DateInput from './inputs/TemporalDateInput.svelte';
import TextInput from './inputs/TextInput.svelte';
import type { DatalistOption, TextInputTypes } from './inputs/types.js';

// Navigation
import AnchorHeading from './navigation/AnchorHeading.svelte';
import Carousel, { carousel_item } from './navigation/Carousel.svelte';
import LinkableAnchorHeading from './navigation/LinkableAnchorHeading.svelte';
import NavLink from './navigation/NavLink.svelte';
import Navigation from './navigation/Navigation.svelte';
import ScrollProgress from './navigation/ScrollProgress.svelte';

// Wrappers
import AccordionDetails from '$wrappers/AccordionDetails.svelte';
import AccordionJson from '$wrappers/AccordionJSON.svelte';
import Dialog from '$wrappers/Dialog.svelte';
import Flex from '$wrappers/Flex.svelte';
import FlexItem from '$wrappers/FlexItem.svelte';
import FullDialog from '$wrappers/FullDialog.svelte';
import Grid from '$wrappers/Grid.svelte';
import JsonView from '$wrappers/JSONView.svelte';
import ResizableGrid from '$wrappers/ResizableGrid.svelte';
import Accordion from './wrappers/Accordion.svelte';
import DataGrid from './wrappers/DataGrid.svelte';
import {
	SortState,
	type DataColumn as DataGridColumn,
	type FilterState as DataGridFilterState,
	type FilterUI as DataGridFilterUI
} from './wrappers/data_grid_state.svelte.js';
import MiniDialog from './wrappers/MiniDialog.svelte';
import Table from './wrappers/Table.svelte';
import type { DataCell, DataRow, HeaderCell } from './wrappers/Table.types.js';
import Tabs from './wrappers/Tabs_Runes.svelte';
import type { ComponentTab, SnippetTab } from './wrappers/Tabs_Runes.svelte';
import TransitionNative_Runes from './wrappers/TransitionNative_Runes.svelte';
import Transition from './wrappers/Transition_Runes.svelte';

// Prop types derived from components so TS/IDE resolve without importing from .svelte
export type DragAnchorProps = ComponentProps<typeof DragAnchor>;
export type LightDarkToggleProps = ComponentProps<typeof LightDarkToggle>;
export type ToggleSwitchProps = ComponentProps<typeof ToggleSwitch>;
export type CheckboxProps = ComponentProps<typeof Checkbox>;
export type InputButtonProps = ComponentProps<typeof InputButton>;
export type InputLabelProps = ComponentProps<typeof InputLabel>;
export type RadioGroupProps = ComponentProps<typeof RadioGroup>;
export type NumericInputProps = ComponentProps<typeof NumericInput>;
export type SelectProps = ComponentProps<typeof Select>;
export type DateInputProps = ComponentProps<typeof DateInput>;
export type TextInputProps = ComponentProps<typeof TextInput>;
export type AnchorHeadingProps = ComponentProps<typeof AnchorHeading>;
export type CarouselProps = ComponentProps<typeof Carousel>;
export type LinkableAnchorHeadingProps = ComponentProps<typeof LinkableAnchorHeading>;
export type NavLinkProps = ComponentProps<typeof NavLink>;
export type NavigationProps = ComponentProps<typeof Navigation>;
export type ScrollProgressProps = ComponentProps<typeof ScrollProgress>;
export type AccordionDetailsProps = ComponentProps<typeof AccordionDetails>;
export type AccordionJsonProps = ComponentProps<typeof AccordionJson>;
export type DialogProps = ComponentProps<typeof Dialog>;
export type FlexProps = ComponentProps<typeof Flex>;
export type FlexItemProps = ComponentProps<typeof FlexItem>;
export type FullDialogProps = ComponentProps<typeof FullDialog>;
export type GridProps = ComponentProps<typeof Grid>;
export type JSONViewProps = ComponentProps<typeof JsonView>;
export type MiniDialogProps = ComponentProps<typeof MiniDialog>;
export type ResizableGridProps = ComponentProps<typeof ResizableGrid>;
export type AccordionProps = ComponentProps<typeof Accordion>;
export type DataGridProps = ComponentProps<typeof DataGrid>;
export type TableProps = ComponentProps<typeof Table>;
export type TabsProps = ComponentProps<typeof Tabs>;
export type TransitionNativeProps = ComponentProps<typeof TransitionNative_Runes>;
export type TransitionProps = ComponentProps<typeof Transition>;

// Exports
export {
	align_content_options,
	align_items_options,
	align_self_options,
	assert_valid_directory_path,
	assert_valid_email,
	assert_valid_file_path,
	assert_valid_phone,
	assert_valid_url,
	assert_valid_uuid,
	capitalize,
	clamp,
	dekebab,
	delay,
	direction_options,
	enumerate_runed_properties,
	flatten_object_recursively,
	get_ancestors,
	get_max,
	get_max_date,
	get_max_temporal_zoned_date_time,
	get_min,
	get_min_date,
	get_min_temporal_zoned_date_time,
	get_random_between,
	get_random_integer,
	get_transition_durations,
	grid_fit_options,
	group_by,
	is_object,
	justify_content_options,
	justify_items_options,
	justify_self_options,
	modulo,
	overflow_options,
	remove_special_characters,
	split_camel_case,
	split_snake_case,
	uniqueBy,
	wrap_options,
	type AtLeastOne,
	type Brand,
	type BrandedString,
	type ClassProperties,
	type CompareNumbers,
	type DeepPartial,
	type DeepReadonly,
	type DeepRequired,
	type DirectoryPathString,
	type EmailString,
	type Exact,
	type ExactlyOne,
	type FilePathString,
	type First,
	type Head,
	type HeterogenousArray,
	type HomogenousArray,
	type HttpVerbNonBody,
	type HttpVerbs,
	type HttpVerbWithBody,
	type JsonifiedObject,
	type JsonifiedValue,
	type KeyExists,
	type KeyOnlyInFirst,
	type KeysOfType,
	type Last,
	type MaxLength,
	type Maybe,
	type Merge,
	type MethodBodyCombination,
	type MimeTypes,
	type MinLength,
	type Mutable,
	type NonNullableValues,
	type NonOptional,
	type Nullable,
	type Optional,
	type PartiallyOptional,
	type PartiallyRequired,
	type PartialWithNonNullableValues,
	type PhoneString,
	type PreparedHeaders,
	type PrettifyIntersection,
	type Stringified,
	type StringLength,
	type StringLengthBetween,
	type Tail,
	type Tuple,
	type TypedHeaders,
	type TypedRequestInit,
	type TypedResponse,
	type TypeSafeMap,
	type UrlString,
	type UUIDString,
	type ValueOf
} from '$lib/functions/helpers.svelte.js';
export { dynamic_style } from './actions/dynamic-styles.svelte.js';
export { willChange } from './actions/will-change.js';
export {
	tooltip,
	type TooltipDirections,
	type TooltipProps
} from './attach/tooltip/tooltip.svelte.js';
export {
	delete_local_storage_item,
	get_local_storage_item,
	set_local_storage_item,
	type StorageKey
} from './functions/local-storage.js';
export {
	all_icons,
	default_log_style,
	// ErrorAndToast,
	ErrorLog,
	Log,
	// LogAndToast,
	SuccessLog,
	WarningLog,
	// type ErrorAndToastOptions,
	type ErrorLogOptions,
	// type LogAndToastOptions,
	type LogOptions
} from './functions/logging.js';
export {
	getDerivedStoreContext as getDerivedContext,
	getReadableStoreContext as getReadableContext,
	getWritableStoreContext as getWritableContext,
	setDerivedStoreContext as setDerivedContext,
	setReadableStoreContext as setReadableContext,
	setWritableStoreContext as setWritableContext
} from './functions/store.svelte.js';
export {
	make_subroute_nav_links,
	NavigationLink,
	should_layout_transition_on_navigation
} from './navigation/nav-functions.svelte.js';
export { Temporal } from '@js-temporal/polyfill';
export {
	Accordion,
	AccordionDetails,
	AccordionJson,
	ActionTooltip,
	AnchorHeading,
	Carousel,
	carousel_item,
	Checkbox,
	DataGrid,
	Dialog,
	DragAnchor,
	Flex,
	FlexItem,
	FullDialog,
	Grid,
	InputButton,
	InputLabel,
	JsonView,
	LightDarkToggle,
	LinkableAnchorHeading,
	MiniDialog,
	Navigation,
	NavLink,
	NumericInput,
	RadioGroup,
	ResetButton,
	ResizableGrid,
	ScrollProgress,
	Select,
	SortState,
	SubmitButton,
	Table,
	Tabs,
	DateInput as TemporalDateInput,
	TextInput,
	ToggleSwitch,
	Transition,
	TransitionNative_Runes,
	type DataCell,
	type DataGridColumn,
	type DataGridFilterState,
	type DataGridFilterUI,
	type DatalistOption,
	type DataRow,
	type HeaderCell,
	type SelectOptionGroup,
	type ComponentTab,
	type SnippetTab,
	type TextInputTypes
};
