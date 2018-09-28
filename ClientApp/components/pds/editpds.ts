import Vue from 'vue';
import { Component } from 'vue-property-decorator';
import { Reagent } from '../../models/reagent';

@Component
export default class EditPDSComponent extends Vue {
	$refs!: {
		form: HTMLFormElement
	}

	rules: object = {
		required: value => !!value || 'Required',
		number: value => /[0-9]/.test(value) || 'Value must be number e.g. "8" or "10"'
	}

	before: Reagent = {
		id: 0,
		name: "",
		supplier: "",
		batch: "",
		validated: "",
		expiry: "",
		quantity: 0,
		dateWarning: 0
	}

	after: Reagent = {
		id: 0,
		name: "",
		supplier: "",
		batch: "",
		validated: "",
		expiry: "",
		quantity: 0,
		dateWarning: 0
	}

	loading: boolean = false;
	failed: boolean = false;
	validates: string[] = ["Yes", "No"];

	mounted() {
		this.loading = true;
		fetch('api/PDS/GetByIdInventory?id=' + this.$route.params.id)
			.then(respone => respone.json() as Promise<Reagent>)
			.then(data => {
				this.before = JSON.parse(JSON.stringify(data));
				this.after = data;
				this.loading = false;
			});
	}

	editReagent() {
		this.failed = false;
		if (this.$refs.form.validate()) {
			let reagents: Reagent[] = [];
			reagents.push(this.before);
			reagents.push(this.after);
			fetch('api/PDS/UpdateInventory', {
				method: 'PUT',
				body: JSON.stringify(reagents)
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

	cancel() {
		this.$router.push('/inventorypds');
	}
}
