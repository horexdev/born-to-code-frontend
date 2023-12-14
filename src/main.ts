import { createApp } from 'vue'
import { createPinia } from 'pinia'

import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap"
import './assets/fonts/FiraSans/stylesheet.css'
import './main.css'

import App from './App.vue'
import router from './router'
import axios from 'axios'
import VueAxios from 'vue-axios'


const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(VueAxios, axios)
app.mount('#app')
