<template>
    <b-container class="d-flex justify-content-center">
        <b-card class="w-50 mt-5">
            <b-card-header class="text-center">
                <h3>Sign In</h3>
            </b-card-header>
            <b-card-body>
                <b-form @submit.prevent="onSubmit">
                    <b-form-group label="Username" label-for="username-input">
                        <b-form-input id="username-input" v-model="username" type="username"
                            required></b-form-input>
                    </b-form-group>

                    <b-form-group label="Password" label-for="password-input">
                        <b-form-input id="password-input" v-model="password" type="password"
                            required></b-form-input>
                    </b-form-group>
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
      password: ''
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

        // store the token in local storage
        const responseToken = response.data.token
        if (!responseToken) {
          throw new Error('Invalid signin credentials')
        }
        token.set(responseToken)
        // update the UI to reflect the signin state
        this.$emit('signin')
        // redirect to the home page
        this.$router.push('/')
      } catch (error) {
        console.error('Signin failed', error)
        alert('Signin failed: ' + error.message)
      }
    }
  }
}
</script>

<style scoped>
@media screen and (min-width: 768px) {
    .w-50 {
        max-width: 400px;
    }
}
.w-50 {
    max-width: 400px;
}
</style>
