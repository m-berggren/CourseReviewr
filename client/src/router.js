import { createRouter, createWebHistory } from 'vue-router'

import Homepage from './views/Homepage.vue'
import Courses from './views/Courses.vue'

const routes = [
  { path: '/', name: 'home', component: Homepage },
  { path: '/courses', name: 'courses', component: Courses }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
