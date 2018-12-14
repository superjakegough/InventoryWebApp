import Vue from 'vue';
import { Component } from 'vue-property-decorator';
import { Reagent } from '../../models/reagent';

@Component
export default class CreateWTAILComponent extends Vue {	
	$refs!: {
		form: HTMLFormElement
	}

	rules: object = {
		required: (value: string) => !!value || 'Required',
		number: (value: string) => /^\d+(\d{1,2})?$/.test(value) || 'Value must be number e.g. "8" or "10"',
		decimal: (value: string) => /^\d+(\.\d{1,2})?$/.test(value) || 'Value must be decimal e.g. "8.0" or "7.5"'
	}

	reagent: Reagent = {
		id: 0,
		name: "",
		supplier: "",
		batch: "",
		validated: "",
		expiry: "",
		quantity: 0,
		dateWarning: 0
	}

	failed: boolean = false;
	validates: string[] = ["Yes", "No"];
	names: string[] = ["C", "Cw", "c", "D", "E", "e", "C+D+E", "K", "k", "Jk-a", "Jk-b", "M", "N", "Lu-a",
		"Lu-b", "Fy-b", "s", "S", "Kpa", "2 Cell screen antibody", "Bromelain", "Dextran", "High titre control",
		"EXTRAN", "PK Cleaning Solutions", "Syphilis Kits", "QC2 Syphilis Control"];

	createReagent() {
		this.failed = false;
		if (this.$refs.form.validate()) {
				fetch('api/WTAIL/CreateInventory', {
					method: 'POST',
					body: JSON.stringify(this.reagent)
				})
					.then(response => response.json() as Promise<number>)
					.then(data => {
						if (data < 1) {
							this.failed = true;
						} else {
							this.$router.push('/inventorywtail');
						}
					})
			} else {
				this.failed = true;
			}
	}

	clear() {
		this.$refs.form.reset();
	}

	cancel() {
		this.$router.push('/inventorywtail');
	}
}