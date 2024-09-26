<template>
  <div id="app">
    <div id="nav">
      <b-navbar toggleable="lg" type="dark" variant="dark">

        <!-- Brand with link to homepage -->
        <b-navbar-brand href="#">
          <router-link to="/" class="navbar-logo-link">
            <img src="@/assets/logo/courseReviewr-48pt-i.webp" class="navbar-logo">
          </router-link>
        </b-navbar-brand>

        <!-- Toggler for collapse -->
        <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

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
          <router-link to="/login" class="nav-link-button">
            <b-button pill variant="outline-secondary" class="login-button">Login</b-button>
          </router-link>
        </b-navbar-nav>

      </b-navbar>

      <!-- Render the content of the current page view -->
      <router-view/>
    </div>
  </div>
</template>

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
.login-button {
  border: 2px solid #D9D9D9 !important;
  color: #D9D9D9 !important;
  padding: 0.5vh 2vw;
  transition: 0.3s;
  border-radius: 2vw;
}

/* Hover effect for the login button */
.login-button:hover {
  background-color: #6B91B8 !important;
  color: #383024;
  border-color: #D9D9D9 !important;
}
</style>
