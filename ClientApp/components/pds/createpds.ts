import Vue from 'vue';
import { Component } from 'vue-property-decorator';
import { Reagent } from '../../models/reagent';

@Component
export default class CreatePDSComponent extends Vue {	
	$refs!: {
		form: HTMLFormElement
	}

	rules: object = {
		required: value => !!value || 'Required',
		number: value => /[0-9]/.test(value) || 'Value must be number e.g. "8" or "10"'
	}

	reagent: Reagent = {
		id: 0,
		name: "",
		supplier: "",
		batch: "",
		validated: "",
		expiry: "",
		quantity: 0,
		minimum: 0,
		stockWarning: 0,
		dateWarning: 0
	}

	failed: boolean = false;
	validates: string[] = ["Yes", "No"];
	names: string[] = ["C", "Cw", "c", "D", "E", "e", "C+D+E", "K", "k", "Jk-a", "Jk-b", "M", "N", "Lu-a",
		"Lu-b", "Fy-b", "s", "S", "Kpa", "2 Cell screen antibody", "Bromelain", "Dextran", "High titre control",
		"EXTRAN", "PK Cleaning Solutions", "Syphilis Kits", "QC2 Syphilis Control"];

	setMinimum() {
		switch (this.reagent.name) {
			case "C":
				this.reagent.minimum = 1;
				break;
			case "Cw":
				this.reagent.minimum = 1;
				break;
			case "c":
				this.reagent.minimum = 1;
				break;
			case "D":
				this.reagent.minimum = 10;
				break;
			case "E":
				this.reagent.minimum = 1;
				break;
			case "e":
				this.reagent.minimum = 1;
				break;
			case "C+D+E":
				this.reagent.minimum = 10;
				break;
			case "K":
				this.reagent.minimum = 1;
				break;
			case "k":
				this.reagent.minimum = 2;
				break;
			case "Jk-a":
				this.reagent.minimum = 3;
				break;
			case "Jk-b":
				this.reagent.minimum = 10;
				break;
			case "M":
				this.reagent.minimum = 3;
				break;
			case "N":
				this.reagent.minimum = 2;
				break;
			case "Lu-a":
				this.reagent.minimum = 2;
				break;
			case "Lu-b":
				this.reagent.minimum = 2;
				break;
			case "Fy-b":
				this.reagent.minimum = 4;
				break;
			case "s":
				this.reagent.minimum = 1;
				break;
			case "S":
				this.reagent.minimum = 5;
				break;
			case "Kpa":
				this.reagent.minimum = 1;
				break;
			case "2 Cell screen antibody":
				this.reagent.minimum = 15;
				break;
			case "Bromelain":
				this.reagent.minimum = 1;
				break;
			case "Dextran":
				this.reagent.minimum = 1;
				break;
			case "High titre control":
				this.reagent.minimum = 1;
				break;
			case "EXTRAN":
				this.reagent.minimum = 2;
				break;
			case "PK Cleaning Solution":
				this.reagent.minimum = 3;
				break;
			case "Syphilis Kits":
				this.reagent.minimum = 5;
				break;
			case "QC2 Syphilis Control":
				this.reagent.minimum = 5;
				break;
			default:
				this.reagent.minimum = 0;
				break;
		}
	}

	createReagent() {
		this.failed = false;
		if (this.$refs.form.validate()) {
				fetch('api/PDS/CreateInventory', {
					method: 'POST',
					body: JSON.stringify(this.reagent)
				})
					.then(response => response.json() as Promise<number>)
					.then(data => {
						if (data < 1) {
							this.failed = true;
						} else {
							this.$router.push('/inventorypds');
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
		this.$router.push('/inventorypds');
	}
}