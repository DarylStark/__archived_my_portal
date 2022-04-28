// Import the VueJS components
import { createApp } from 'vue'
import store from './dashboard-store'
import router from './dashboard-router'
import mitt from 'mitt';

// Import the Dashboard Application and create the App object
import Dashboard from './apps/Dashboard.vue'
const dashboard = createApp(Dashboard)

// Specify the modules for VueJS
dashboard.use(store);
dashboard.use(router);

// Create the eventbus
const emitter = mitt();
dashboard.config.globalProperties.eventbus = emitter;

// Mount the app object to the template
dashboard.mount('#app_dashboard')
