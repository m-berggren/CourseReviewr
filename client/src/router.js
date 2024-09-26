import { createRouter, createWebHistory } from 'vue-router'

import Homepage from './views/Homepage.vue'

const routes = [
  { path: '/', name: 'home', component: Homepage }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
