<template>
  <b-container class="d-flex justify-content-center">
    <b-card class="w-100 w-md-50 mt-5">
      <b-card-header class="text-center">
        <h3>Sign In</h3>
      </b-card-header>
      <b-card-body>
        <b-form @submit.prevent="onSubmit">
          <b-form-group label="Username" label-for="username-input">
            <b-form-input id="username-input" v-model="username" type="username" required class="mb-3"></b-form-input>
          </b-form-group>

          <b-form-group label="Password" label-for="password-input">
            <b-form-input id="password-input" v-model="password" type="password" required class="mb-3"></b-form-input>
          </b-form-group>
          <!-- BootstrapVue alert component to display message -->
          <b-alert v-model="showMessage" :variant="messageVariant" dismissible fade class="mt-3">
            {{ message }}
          </b-alert>
          <br><b-button type="submit" style="background-color: #6B91B8;" block>
            Sign in
          </b-button>
          <p class="mt-3 text-center">
            <br><br><br>&nbsp;Not having an account? <b-link @click="$router.push('/register')">Register here</b-link>
          </p>
        </b-form>
      </b-card-body>
    </b-card>
  </b-container>
</template>

<script>
import { Api } from '@/Api'
import { token } from '@/token'

export default {
  data() {
    return {
      username: '',
      password: '',
      message: '',
      showMessage: false,
      messageVariant: 'info'
    }
  },
  methods: {
    async onSubmit() {
      try {
        // send a POST request to the server
        const response = await Api.post('/auth/signin', {
          username: this.username,
          password: this.password
        })
        this.message = response.data.message

        // store the token in local storage
        const responseToken = response.data.token
        if (!responseToken) {
          this.message = 'Invalid signin credentials'
          this.messageVariant = 'danger'
          this.showMessage = true
          return
        }
        token.set(responseToken)
        this.$emit('signin')
        // redirect to the home page
        this.$router.push('/')
      } catch (error) {
        this.message = 'Signin failed: ' + (error.response?.data?.message || error.message)
        this.messageVariant = 'danger'
        this.showMessage = true
      }
    }
  }
}
</script>

<style scoped>
@media screen {
  .w-md-50 {
    max-width: 450px;
    margin-top: 5%;
    max-height: 700px;
    margin-bottom: 5%;
    margin-inline: 5%;
    width: 100%;
  }
}
</style>
