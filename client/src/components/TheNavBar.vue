<template>
  <div>
    <b-navbar toggleable="md" type="dark" variant="dark" class="justify-content-between">

      <!-- Brand with link to homepage -->
      <b-navbar-brand href="#" @click.prevent="refreshHomepage">
          <img src="@/assets/logo/courseReviewr-48pt-i.webp" class="navbar-logo">
      </b-navbar-brand>

      <!-- Toggler for collapsing nav-collapse -->
      <b-navbar-toggle target="nav-collapse"
        class="align-items-center gap-1"><b-icon-list></b-icon-list>
        Menu</b-navbar-toggle>

      <!-- Collapsible content -->
      <b-collapse id="nav-collapse" is-nav v-model="isNavCollapsed">
        <b-navbar-nav>
          <router-link to="/courses/table" class="nav-link mx-1" @click.native="collapseNav">Courses</router-link>
          <router-link to="/courses/create" class="nav-link mx-1" @click.native="collapseNav">Create Course</router-link>
          <router-link :to="{ name: 'reviews', params: { id: 'userId' } }" class="nav-link mx-1" @click.native="collapseNav">Reviews</router-link>
          <router-link to="/course-lists" class="nav-link mx-1" @click.native="collapseNav">Course Lists</router-link>
        </b-navbar-nav>

        <!-- Signin / Profile button to the right with ml-auto -->
        <b-navbar-nav class="ml-auto">
          <router-link v-if="!isSignedIn" to="/signin" class="nav-link-button" @click.native="collapseNav">
            <b-button pill variant="outline-secondary" class="signin-button">Sign In</b-button>
          </router-link>
          <router-link v-else to="/profile" class="nav-link-button" @click.native="collapseNav">
            <b-button pill variant="outline-secondary" class="signin-button">
              <b-icon-person />
              <span class="truncate-text">
                {{ username }}
              </span>
            </b-button>
          </router-link>
        </b-navbar-nav>
      </b-collapse>

    </b-navbar>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

defineProps({
  isSignedIn: Boolean,
  username: String,
  userId: String
})

const router = useRouter()
const isNavCollapsed = ref(false)

const collapseNav = () => {
  isNavCollapsed.value = false
}

const refreshHomepage = () => {
  router.push('/').then(() => {
    window.location.reload()
  })
}

</script>

<style>
/* Enables login/signup to end up to the right */
.ml-auto {
  margin-left: auto !important;
}

.navbar-toggler {
  background-color: #6B91B8 !important;
  box-shadow: none !important;
}

.navbar-toggler:hover {
  background-color: #D9D9D9 !important;
}

/* Logo link and styling */
.navbar-logo-link {
  display: inline-block;
}

.navbar-logo {
  height: 5vh;
  max-width: 50vw;
}

/* Styling for navigation links */
.nav-link {
  color: #D9D9D9 !important;
  padding: 0.5rem 1rem;
  text-decoration: none;
  transition: color 0.3s;
}

/* Hover effect for navigation links */
.nav-link:hover {
  color: #6B91B8 !important;
  cursor: pointer;
}

/* Button styling */
.signin-button {
  border: 2px solid #D9D9D9 !important;
  color: #D9D9D9 !important;
  padding: 0.5vh 2vw;
  transition: 0.3s;
  border-radius: 2vw;
}

/* Hover effect for signin button */
.signin-button:hover {
  background-color: #6B91B8 !important;
  color: #383024;
  border-color: #D9D9D9 !important;
}

/* Truncate username with ellipsis */
.truncate-text {
  display: inline-block;
  max-width: 100px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  vertical-align: middle;
}
</style>
