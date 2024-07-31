import './assets/main.css';
import 'mapbox-gl/dist/mapbox-gl.css';

import { createApp } from 'vue';
import { createPinia } from 'pinia';

import App from './App.vue';
import router from './router';

import VueSweetalert2 from 'vue-sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { FontAwesomeIcon } from './font-awesome';
import axios from 'axios';
import config from './config';
axios.defaults.baseURL = config.apiBaseUrl;

const app = createApp(App);

app.use(createPinia());
app.use(router);
app.use(VueSweetalert2);
app.component('font-awesome-icon', FontAwesomeIcon);

app.mount('#app');
