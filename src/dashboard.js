// Import the VueJS components
import { createApp } from 'vue'
import store from './store'
import router from './router';

// Import the Dashboard Application and create the App object
import Dashboard from './apps/Dashboard.vue'
const dashboard = createApp(Dashboard)

// Specify the modules for VueJS
dashboard.use(store);
dashboard.use(router);

// Mount the app object to the template
dashboard.mount('#app_dashboard')
