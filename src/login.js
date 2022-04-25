// Import the VueJS components
import { createApp } from 'vue'

// Import the Login Application and create the App object
import LoginForm from './apps/LoginForm.vue'
const loginform = createApp(LoginForm);

// Mount the app object to the template
loginform.mount('#app_login')
