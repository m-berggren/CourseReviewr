<template>
  <b-container class="d-flex justify-content-center">
    <b-card class="w-100 w-md-50 mt-5">
      <b-card-header class="text-canter">
        <h3>Register</h3>
      </b-card-header>

      <b-card-body>
        <b-form @submit.prevent="onSubmit">
          <b-form-group label="Username" label-for="username-input">
            <b-form-input id="username-input" v-model="username" type="username" required class="mb-3"></b-form-input>
          </b-form-group>
          <b-form-group label="Email" label-for="email-input">
            <b-form-input id="email-input" v-model="email" type="email" required class="mb-3"></b-form-input>
          </b-form-group>
          <b-form-group label="Password" label-for="password-input">
            <b-form-input id="password-input" v-model="password" type="password" required class="mb-3"></b-form-input>
          </b-form-group>
          <b-form-group label="Confirm Password" label-for="confirm-password-input">
            <b-form-input id="confirm-password-input" v-model="confirmPassword" type="password" required
              class="mb-3"></b-form-input>
          </b-form-group>
          <!-- BootstrapVue alert component to display message -->
          <b-alert v-model="showMessage" :variant="messageVariant" dismissible fade class="mt-3 w-75 mx-auto">
            {{ message }}
          </b-alert>
          <br><b-button type="submit" style="background-color: #6B91B8;" block>
            Register
          </b-button>
        </b-form>
        <p class="mt-3 text-center">
          <br><br><br>&nbsp;Already have an account? <b-link @click="$router.push('/signin')">Sign in here</b-link>
        </p>
      </b-card-body>
    </b-card>
  </b-container>
</template>

<script>
import { Api } from '@/Api'
export default {
  data() {
    return {
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
      message: '',
      showMessage: false,
      messageVariant: 'info'

    }
  },
  methods: {
    async onSubmit() {
      if (this.username.length > 20) {
        this.message = 'Username cannot be longer than 20 characters'
        this.messageVariant = 'danger'
        this.showMessage = true
        return
      }
      if (this.password !== this.confirmPassword) {
        this.message = 'Passwords do not match'
        this.messageVariant = 'danger'
        this.showMessage = true
        return
      }
      try {
        const userData = {
          username: this.username,
          email: this.email,
          password: this.password
        }

        const response = await Api.post('/auth/register', userData)
        this.message = response.data.message
        if (response.status === 201) {
          this.message = response.data.message
          this.messageVariant = 'success'
          this.showMessage = true
          setTimeout(() => {
            this.$router.push('/signin')
          }, 2000)
        } else {
          throw new Error(response.data.message)
        }
      } catch (error) {
        if (error.response && error.response.data) {
          this.message = error.response.data.message
        } else {
          this.message = 'An error occurred while registering'
        }
        this.messageVariant = 'danger'
        this.showMessage = true
      }
    }
  }
}

</script>
<style lang="css" scoped>
@media screen {
  .w-md-50 {
    max-width: 450px;
    margin-top: 5%;
    margin-bottom: 5%;
    margin-inline: 5%;
    width: 100%;
  }
}
</style>
