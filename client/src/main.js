// import App from './App.vue'

import { createApp } from 'vue'
import { createBootstrap } from 'bootstrap-vue-next'
import App from './App.vue'
import router from './router'
import StarRating from 'vue-star-rating'

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue-next/dist/bootstrap-vue-next.css'

const app = createApp(App)

app.component('star-rating', StarRating)

app.use(createBootstrap())
app.use(router)
app.mount('#app')
