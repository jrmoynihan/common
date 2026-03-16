export interface DataRow<T> {
	datum: T;
	index: number;
}

export interface HeaderCell<T> extends DataRow<T> {
	key: keyof T;
}

export interface DataCell<T> extends HeaderCell<T> {
	value: any;
}
