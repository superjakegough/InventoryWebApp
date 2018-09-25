import Vue from 'vue';
import { Component } from 'vue-property-decorator';

class MenuItem {
	constructor(public title: string,
		public icon: string,
		public path: string) { };
}

@Component
export default class NavMenuComponent extends Vue {
	atItems: MenuItem[] = [
		new MenuItem('Inventory', 'folder', '/inventoryat'),
		new MenuItem('Archive', 'folder_open', '/archiveat'),
	];
	pdsItems: MenuItem[] = [
		new MenuItem('Inventory', 'folder', '/inventorypds'),
		new MenuItem('Archive', 'folder_open', '/archivepds'),
	];
	wtailItems: MenuItem[] = [
		new MenuItem('Inventory', 'folder', '/inventorywtail'),
		new MenuItem('Archive', 'folder_open', '/archivewtail'),
	]
}