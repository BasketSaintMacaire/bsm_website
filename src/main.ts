import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

import '@fontsource/antonio/100.css'
import '@fontsource/antonio/200.css'
import '@fontsource/antonio/300.css'
import '@fontsource/antonio/400.css'
import '@fontsource/antonio/500.css'
import '@fontsource/antonio/600.css'
import '@fontsource/antonio/700.css'

document.documentElement.classList.add('dark')

const app = createApp(App)

app.use(router)

app.mount('#app')
