import { createApp } from 'vue';
import vuetify from './plugins/vuetify';
import VueDatePicker from './plugins/VueDatePicker';
import router from './router';
import App from './App.vue';

const app = createApp(App);
app.use(vuetify);
app.component('VueDatePicker', VueDatePicker);
app.use(router);
app.mount('#app');
