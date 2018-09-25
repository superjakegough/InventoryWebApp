export interface Reagent {
	id: number;
	name: string;
	supplier: string;
	batch: string;
	validated: string;
	expiry: string;
	minimum: number;
	quantity: number;
	stockWarning: number;
	dateWarning: number;
}