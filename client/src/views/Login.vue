<template>
    <b-container class="d-flex justify-content-center">
        <b-card class="w-50 mt-5">
            <b-card-header class="text-center">
                <h3>Logga in</h3>
            </b-card-header>
            <b-card-body>
                <b-form @submit.prevent="onSubmit">
                    <b-form-group label="Email" label-for="email-input">
                        <b-form-input id="email-input" v-model="email" type="email" placeholder="Enter email"
                            required></b-form-input>
                    </b-form-group>

                    <b-form-group label="Password" label-for="password-input">
                        <b-form-input id="password-input" v-model="password" type="password"
                            placeholder="Enter password" required></b-form-input>
                    </b-form-group>

                    <b-button type="submit" variant="primary" block>
                        Log in
                    </b-button>
                </b-form>
            </b-card-body>
        </b-card>
    </b-container>
</template>

<script>
export default {
  data() {
    return {
      email: '',
      password: ''
    }
  },
  methods: {
    async onSubmit() {
      // Simulera en API-inloggning
      try {
        const response = await this.$apiClient.post('/api/v1/auth/login', {
          email: this.email,
          password: this.password
        })

        // Spara token om inloggningen lyckas
        const token = response.data.token
        localStorage.setItem('token', token)

        // Omdirigera till skyddad ruta efter inloggning
        this.$router.push('/')
      } catch (error) {
        console.error('Login failed', error)
      }
    }
  }
}
</script>

<style scoped>
.w-50 {
    max-width: 400px;
}
</style>