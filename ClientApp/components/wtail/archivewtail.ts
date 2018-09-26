import Vue from 'vue';
import { Component } from 'vue-property-decorator';
import { Reagent } from '../../models/reagent';

@Component
export default class ArchiveWTAILComponent extends Vue {
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
		this.loadArchive();
	}

	loadArchive() {
		this.loading = true;
		fetch('api/WTAIL/GetArchive')
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

	deleteReagent(id: number) {
		var ans = confirm("Do you want to delete this Reagent forever?");
		if (ans) {
			fetch('api/WTAIL/DeleteArchive?id=' + id, {
				method: 'DELETE'
			})
				.then(response => response.json() as Promise<number>)
				.then(data => {
					if (data < 1) {
						alert("Failed to delete reagent. Please make sure you are still connected?");
					} else {
						this.loadArchive();
					}
				})
		}
	}
}
