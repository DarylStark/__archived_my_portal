// Import the VueJS components
import { createApp } from 'vue'
import store from './login-store'

// Import the Login Application and create the App object
import LoginForm from './apps/LoginForm.vue'
const loginform = createApp(LoginForm);

// Specify the modules for VueJS
loginform.use(store);

// Mount the app object to the template
loginform.mount('#app_login')
