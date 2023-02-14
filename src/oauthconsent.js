// Import the VueJS components
import { createApp } from 'vue'

// Import the Login Application and create the App object
import OAuthConsent from './apps/OAuthConsent.vue'
const oauthconsent = createApp(OAuthConsent);

// Mount the app object to the template
oauthconsent.mount('#app_oauth')