import { createRouter, createWebHistory } from 'vue-router'

import Homepage from './views/Homepage.vue'
import Courses from './views/Courses.vue'
import Signin from './views/Signin.vue'
import Register from './views/Register.vue'
import Profile from './views/Profile.vue'
import CreateCourse from './views/CreateCourse.vue'

const routes = [
  { path: '/', name: 'home', component: Homepage },
  { path: '/signin', name: 'signin', component: Signin },
  { path: '/courses', name: 'courses', component: Courses },
  { path: '/register', name: 'register', component: Register },
  { path: '/profile', name: 'profile', component: Profile },
  { path: '/courses/create', name: 'create-course', component: CreateCourse }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
