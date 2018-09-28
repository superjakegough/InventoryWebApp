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
	reagentSearch: string = "";
	inventorySearch: string = "";
	reagentHeaders: object[] = [
		{ text: 'Name', value: 'name', sortable: false },
		{ text: 'Minimum', value: 'minimum', sortable: false },
		{ text: 'Quantity', value: 'quantity', sortable: false }
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

	deleteReagent(id: number) {
		var ans = confirm("Do you want to delete this Reagent?");
		if (ans) {
			fetch('api/AT/DeleteInventory?id=' + id, {
				method: 'DELETE'
			})
				.then(response => response.json() as Promise<number>)
				.then(data => {
					if (data < 1) {
						alert("Failed to delete reagent. Please make sure you are still connected?");
					} else {
						this.loadInventory();
					}
				})
		}
	}
}
