import './css/site.css';
import 'vuetify/dist/vuetify.min.css';
import Vue from 'vue';
import VueRouter from 'vue-router';
import Vuetify from 'vuetify';

Vue.use(VueRouter);
Vue.use(Vuetify, {
	theme: {
		primary: '#ed1c24',
		secondary: '#f36368',
		accent: '#af0e14', 
		error: '#af0e14'
	}
});

const routes = [
	{ path: '/', component: require('./components/home/home.vue.html').default },
	{ path: '/inventoryat', component: require('./components/at/inventoryat.vue.html').default },
	{ path: '/archiveat', component: require('./components/at/archiveat.vue.html').default },
	{ path: '/createat', component: require('./components/at/createat.vue.html').default },
	{ path: '/editat/:id', component: require('./components/at/editat.vue.html').default },
	{ path: '/inventorypds', component: require('./components/pds/inventorypds.vue.html').default },
	{ path: '/archivepds', component: require('./components/pds/archivepds.vue.html').default },
	{ path: '/createpds', component: require('./components/pds/createpds.vue.html').default },
	{ path: '/editpds/:id', component: require('./components/pds/editpds.vue.html').default },
	{ path: '/inventorywtail', component: require('./components/wtail/inventorywtail.vue.html').default },
	{ path: '/archivewtail', component: require('./components/wtail/archivewtail.vue.html').default },
	{ path: '/createwtail', component: require('./components/wtail/createwtail.vue.html').default },
	{ path: '/editwtail/:id', component: require('./components/wtail/editwtail.vue.html').default },
];

new Vue({
	el: '#app-root',
	router: new VueRouter({ mode: 'history', routes: routes }),
	render: h => h(
		require('./components/app/app.vue.html').default
	),
});
