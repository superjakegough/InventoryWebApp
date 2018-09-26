import Vue from 'vue';
import { Component } from 'vue-property-decorator';
import { Reagent } from '../../models/reagent';

@Component
export default class InventoryWTAILComponent extends Vue {
	reagents: Reagent[] = [];
	loading: boolean = false;
	search: string = "";
	headers: object[] = [
		{ text: 'Name', value: 'name' },
		{ text: 'Supplier', value: 'supplier' },
		{ text: 'Batch', value: 'batch' },
		{ text: 'Validated', value: 'validated' },
		{ text: 'Expiry', value: 'expiry' },
		{ text: 'Minimum', value: 'minimum' },
		{ text: 'Quantity', value: 'quantity' }
	];

	mounted() {
		this.loadInventory();
	}

	loadInventory() {
		this.loading = true;
		fetch('api/WTAIL/GetInventory')
			.then(response => response.json() as Promise<Reagent[]>)
			.then(data => {
				this.reagents = data;
				this.loading = false;
			});
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
		this.$router.push("/createwtail");
	}

	editReagent(id: number) {
		this.$router.push("/editwtail/" + id);
	}

	deleteReagent(id: number) {
		var ans = confirm("Do you want to delete this Reagent?");
		if (ans) {
			fetch('api/WTAIL/DeleteInventory?id=' + id, {
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
