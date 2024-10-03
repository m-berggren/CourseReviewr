// import App from './App.vue'

import { createApp } from 'vue'
import { createBootstrap } from 'bootstrap-vue-next'
import { BootstrapIconsPlugin } from 'bootstrap-icons-vue'
import App from './App.vue'
import router from './router'
import StarRating from 'vue-star-rating'
import SimpleTypeahead from 'vue3-simple-typeahead'

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue-next/dist/bootstrap-vue-next.css'
import 'vue3-simple-typeahead/dist/vue3-simple-typeahead.css'

const app = createApp(App)

app.component('star-rating', StarRating)
app.use(createBootstrap())
app.use(SimpleTypeahead)
app.use(router)
app.use(BootstrapIconsPlugin)
app.mount('#app')
