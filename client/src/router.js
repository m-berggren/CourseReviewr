import { createRouter, createWebHistory } from 'vue-router'

import Homepage from './views/Homepage.vue'
import Courses from './views/Courses.vue'
import Signin from './views/Signin.vue'
import Register from './views/Register.vue'
import Profile from './views/Profile.vue'
import CreateCourse from './views/CreateCourse.vue'
import CourseLists from './views/CourseLists.vue'
import Coursepage from './views/Coursepage.vue'
import { token } from './token'

const routes = [
  { path: '/', name: 'home', component: Homepage },
  { path: '/signin', name: 'signin', component: Signin },
  { path: '/courses', name: 'courses', component: Courses },
  { path: '/register', name: 'register', component: Register },
  { path: '/profile', name: 'profile', component: Profile, meta: { requiresAuth: true } },
  { path: '/courses/create', name: 'create-course', component: CreateCourse, meta: { requiresAuth: true } },
  { path: '/course-lists', name: 'courselists', component: CourseLists, meta: { requiresAuth: true } },
  { path: '/courses/:id', name: 'course-page', component: Coursepage }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const isSignedIn = token.isSignedIn()
  if (to.meta.requiresAuth && !isSignedIn) {
    next({ name: 'signin' })
  } else {
    next()
  }
})

export default router
