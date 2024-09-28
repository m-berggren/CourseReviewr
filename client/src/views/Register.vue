<template>
<b-container class="d-flex justify-content-center">
    <b-card class="w-50 mt-5">
        <b-card-header class="text-canter">
            <h3>Register</h3>
        </b-card-header>
        <b-card-body>
            <b-form @submit.prevent="onSubmit">
                <b-form-group label="Username" label-for="username-input">
                    <b-form-input id="username-input" v-model="username" type="username"
                        required></b-form-input>
                </b-form-group>
                <b-form-group label="Email" label-for="email-input">
                    <b-form-input id="email-input" v-model="email" type="email"
                        required></b-form-input>
                </b-form-group>
                <b-form-group label="Password" label-for="password-input">
                    <b-form-input id="password-input" v-model="password" type="password"
                        required></b-form-input>
                </b-form-group>
                <b-form-group label="Confirm Password" label-for="confirm-password-input">
                    <b-form-input id="confirm-password-input" v-model="confirmPassword" type="password"
                        required></b-form-input>
                </b-form-group>
                <br><b-button type="submit" style="background-color: #6B91B8;" block>
                    Register
                </b-button>
            </b-form>
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
      confirmPassword: ''
    }
  },
  methods: {
    async onSubmit() {
      if (this.password !== this.confirmPassword) {
        alert('Passwords do not match')
        return
      }

      try {
        const userData = {
          username: this.username,
          email: this.email,
          password: this.password
        }

        const response = await Api.post('/auth/register', userData)

        if (response.status !== 201) {
          throw new Error(response.data.message)
        }

        alert('Registration successful')
        this.$router.push('/signin')
      } catch (error) {
        console.error('There was a problem with the registration request:', error)
        alert(`Registration failed: ${error.message}`)
      }
    }
  }
}
</script>
