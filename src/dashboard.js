// Import Vue
import { createApp } from 'vue'

// Import the store
import store from './store'

// Import the router
import router from './router';

// Import the Dashboard Application
import Dashboard from './apps/Dashboard.vue'

// Create the app
const dashboard = createApp(Dashboard)

// Specify the store
dashboard.use(store);

// Specify the router
dashboard.use(router);

// Mount the app
dashboard.mount('#app_dashboard')
