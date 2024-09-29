<template>
  <div id="app">
    <div id="nav">
      <b-navbar toggleable="sm" type="dark" variant="dark">

        <!-- Brand with link to homepage -->
        <b-navbar-brand href="#">
          <router-link to="/" class="navbar-logo-link">
            <img src="@/assets/logo/courseReviewr-48pt-i.webp" class="navbar-logo">
          </router-link>
        </b-navbar-brand>

        <!-- Toggler for collapse -->
        <b-navbar-toggle target="nav-collapse">
          <!-- Customize the toggler with an icon and text -->
          <b-icon icon="list" class="navbar-toggler-icon"></b-icon>
            <span class="ml-2" style="color: #D9D9D9; font-size: 1rem;">Menu</span>
        </b-navbar-toggle>

        <!-- Collapsible content -->
        <b-collapse id="nav-collapse" is-nav>
          <b-navbar-nav>
            <router-link to="/courses" class="nav-link">Courses</router-link>
            <router-link to="/reviews" class="nav-link">Reviews</router-link>
            <router-link to="/course-lists" class="nav-link">Course Lists</router-link>
          </b-navbar-nav>
        </b-collapse>

          <!-- Pushes the next navbar items to the right -->
          <b-navbar-nav class="ml-auto">
          <router-link v-if="!isSignedIn" to="/signin" class="nav-link-button">
            <b-button pill variant="outline-secondary" class="signin-button">Sign In</b-button>
          </router-link>
          <router-link v-else to="/profile" class="nav-link-button">
            <b-button pill variant="outline-secondary" class="signin-button">My Page</b-button>
          </router-link>
        </b-navbar-nav>
      </b-navbar>

      <!-- Render the content of the current page view -->
      <router-view @signin="handleSignin"/>
    </div>
  </div>
</template>

<script>
import { token } from '@/token'

export default {
  data() {
    return {
      isSignedIn: false
    }
  },
  created() {
    // Check the sign-in status when the component is created
    this.isSignedIn = token.isSignedIn()
  },
  methods: {
    handleSignin() {
      // Update the sign-in state based on the token when user signs in
      this.isSignedIn = token.isSignedIn()
    }
  },
  watch: {
    // Add a watcher to reactively track token changes when route changes
    '$route'() {
      this.isSignedIn = token.isSignedIn()
    }
  }
}
</script>

<style>
/* Styling affects all sub-pages */
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
}

/* Logo link and styling */
.navbar-logo-link {
  display: inline-block;
}
.navbar-logo {
  height: 5vh;
  max-width: 100vw;
}
.navbar-toggler-icon {
  margin-right: 0.5rem;
}

/* Styling for navigation links */
.nav-link {
  color: #D9D9D9 !important;
  padding: 0.5rem 1rem;
  text-decoration: none;
  transition: color 0.3s;
}

@media (max-width: 576px) {
            .b-collapse {
              width: 50%;
              margin: 0 auto;
            }
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
</style>
