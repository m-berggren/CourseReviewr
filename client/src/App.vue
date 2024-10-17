<template>
  <div id="app">
    <div id="nav">

      <!-- Navigation bar: passing isSignedIn as property -->
      <navbar :isSignedIn="isSignedIn" :username="username"></navbar>

      <!-- Render the content of the current page view -->
      <router-view @signin="handleSignin" />
    </div>
  </div>
</template>

<script>
import { token } from '@/token'
import Navbar from './components/NavigationBar.vue'

export default {
  data() {
    return {
      isSignedIn: false,
      username: '',
      userId: ''
    }
  },
  created() {
    const usertoken = token.getToken()
    if (usertoken) {
      // Check the sign-in status when the component is created
      this.isSignedIn = token.isSignedIn()
      this.username = token.getUsername()
      this.userId = token.getUserId()
    } else {
      this.isSignedIn = false
      this.username = ''
    }
  },
  components: {
    Navbar
  },
  methods: {
    handleSignin() {
      // Update the sign-in state based on the token when user signs in
      this.isSignedIn = token.isSignedIn()
      this.username = token.getUsername()
    }
  },
  watch: {
    // Add a watcher to reactively track token changes when route changes
    '$route'() {
      this.isSignedIn = token.isSignedIn()
      this.username = token.getUsername()
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
}
</style>
