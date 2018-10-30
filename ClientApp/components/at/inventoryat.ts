import Vue from 'vue';
import { Component } from 'vue-property-decorator';
import { Reagent } from '../../models/reagent';
import { Stock } from '../../models/stock';

@Component
export default class InventoryATComponent extends Vue {
	reagents: Reagent[] = [];
	stocks: Stock[] = [];
	filtered: Reagent[] = [];
	loading: boolean = false;
	failed: boolean = false;
	dialog: boolean = false;
	reagentSearch: string = "";
	inventorySearch: string = "";
	selected: number = 0;
	reagentHeaders: object[] = [
		{ text: 'Name', value: 'name' },
		{ text: 'Minimum', value: 'minimum' },
		{ text: 'Quantity', value: 'quantity' }
	];
	inventoryHeaders: object[] = [
		{ text: 'Name', value: 'name', sortable: false },
		{ text: 'Supplier', value: 'supplier' },
		{ text: 'Batch', value: 'batch' },
		{ text: 'Validated', value: 'validated' },
		{ text: 'Expiry', value: 'expiry' },
		{ text: 'Quantity', value: 'quantity' }
	];

	mounted() {
		this.loadInventory();
	}

	loadInventory() {
		this.loading = true;
		fetch('api/AT/GetInventory')
			.then(response => response.json())
			.then(data => {
				this.reagents = data["item1"];
				this.stocks = data["item2"];
				this.loading = false;
			})
	}

	filterReagents(name: string) {
		this.filtered = [];
		for (var i = 0; i < this.reagents.length; i++) {
				if (this.reagents[i].name === name) {
					this.filtered.push(this.reagents[i]);
				}
			}
	}

	warningColour(warning: number) {
		switch (warning) {
			case 1:
				return "Orange";
			case 2:
				return "Red";
		}
	}

	createReagent() {
		this.$router.push("/createat");
	}

	editReagent(id: number) {
		this.$router.push("/editat/" + id);
	}

	openDelete(selected: number) {
		this.selected = selected;
		this.dialog = true;
	}

	deleteReagent() {
		this.failed = false;
		this.dialog = true;
		fetch('api/AT/DeleteInventory?id=' + this.selected, {
			method: 'DELETE'
		})
			.then(response => response.json() as Promise<number>)
			.then(data => {
				if (data < 1) {
					this.failed = true;
				} else {
					this.loadInventory();
				}
			})
	}
}
