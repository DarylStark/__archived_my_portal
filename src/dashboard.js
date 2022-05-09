// Import the VueJS components
import { createApp } from 'vue'
import store from './dashboard-store'
import router from './dashboard-router'
import eventbus from './dashboard-eventbus'

// Import the Dashboard Application and create the App object
import Dashboard from './apps/Dashboard.vue'
const dashboard = createApp(Dashboard)

// Specify the modules for VueJS
dashboard.use(store);
dashboard.use(router);

// Add the eventbus
dashboard.config.globalProperties.eventbus = eventbus;

// Mount the app object to the template
dashboard.mount('#app_dashboard')
