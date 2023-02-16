// Import the VueJS components
import { createApp } from 'vue'
import eventbus from './dashboard-eventbus'

// Import the Login Application and create the App object
import OAuthConsent from './apps/OAuthConsent.vue'
const oauthconsent = createApp(OAuthConsent);

// Add the eventbus
oauthconsent.config.globalProperties.eventbus = eventbus;

// Mount the app object to the template
oauthconsent.mount('#app_oauth')