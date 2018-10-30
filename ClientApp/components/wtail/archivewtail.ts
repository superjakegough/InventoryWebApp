import Vue from 'vue';
import { Component } from 'vue-property-decorator';
import { Reagent } from '../../models/reagent';

@Component
export default class ArchiveWTAILComponent extends Vue {
	reagents: Reagent[] = [];
	loading: boolean = false;
	search: string = "";
	failed: boolean = false;
	dialog: boolean = false;
	selected: number = 0;
	headers: object[] = [
		{ text: 'Name', value: 'name' },
		{ text: 'Supplier', value: 'supplier' },
		{ text: 'Batch', value: 'batch' },
		{ text: 'Validated', value: 'validated' },
		{ text: 'Expiry', value: 'expiry' },
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

	openDelete(selected: number) {
		this.selected = selected;
		this.dialog = true;
	}

	deleteReagent() {
		this.failed = false;
		this.dialog = false;
		fetch('api/WTAIL/DeleteArchive?id=' + this.selected, {
			method: 'DELETE'
		})
			.then(response => response.json() as Promise<number>)
			.then(data => {
				if (data < 1) {
					this.failed = true;
				} else {
					this.loadArchive();
				}
			})
	}
}
