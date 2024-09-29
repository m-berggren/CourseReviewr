<template>
  <b-container class="d-flex justify-content-center align-items-center min-vh-100">
        <b-card class="w-100 w-md-50 mt-5">
          <b-card-header class="text-center">
            <h3>Profile</h3>
          </b-card-header>
          <b-card-body>
            <!-- Profile Picture and Username -->
            <div class="d-flex justify-content-start align-items-center mb-3">
              <img :src="user.photo" alt="Profile Picture" class="profile-picture" />
              <h4 class="ml-3">{{ user.username }}</h4>
                <div class="mb-4"></div>
            </div>

            <!-- Edit Email Form -->
            <b-form @submit.prevent="updateEmail">
              <b-form-group label="Email Address" label-for="email-input">
                <b-form-input id="email-input" v-model="email" type="email" required></b-form-input>
                <div class="mb-3"></div>
              </b-form-group>
              <b-button type="submit" variant="primary" block>Update Email</b-button>
            </b-form>

            <hr>

            <!-- Edit Password Form -->
            <b-form @submit.prevent="updatePassword">
              <b-form-group label="New Password" label-for="password-input">
                <b-form-input id="password-input" v-model="password" type="password" required></b-form-input>
                  <div class="mb-3"></div>
              </b-form-group>
              <b-button type="submit" variant="primary" block>Update Password</b-button>
            </b-form>

            <hr>

            <!-- Upload Photo Form -->
            <b-form @submit.prevent="uploadPhoto">
              <b-form-group label="Profile Picture" label-for="photo-input">
                <b-form-file id="photo-input" @change="handlePhotoUpload" required></b-form-file>
                  <div class="mb-3"></div>
              </b-form-group>
              <b-button type="submit" variant="primary" block>Upload Photo</b-button>
            </b-form>

            <hr>

            <!-- Add Interests Form -->
            <b-form @submit.prevent="addInterests">
              <b-form-group label="Interests (comma-separated)" label-for="interests-input">
                <b-form-input id="interests-input" v-model="interests" type="text" required></b-form-input>
                  <div class="mb-3"></div>
              </b-form-group>
              <b-button type="submit" variant="primary" block>Add Interests</b-button>
                <div class="mb-3"></div>
            </b-form>

          <!-- Signout Button -->
          <div class="mb-6"></div>
          <b-button variant="danger" block @click="signout">Sign Out</b-button>

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
      user: {
        username: '',
        photo: ''
      },
      email: '',
      password: '',
      interests: ''
    }
  },
  async created() {
    // Fetch user data when the component is created
    try {
      const response = await Api.get('/users/profile') // Adjust this endpoint based on your backend
      this.user = response.data
      this.email = this.user.email
    } catch (error) {
      console.error('Failed to load user data', error)
    }
  },
  methods: {
    async updateEmail() {
      try {
        const response = await Api.patch(`/users/${this.user._id}/email`, { email: this.email })
        alert('Email updated successfully')
      } catch (error) {
        console.error('Failed to update email', error)
        alert('Failed to update email: ' + error.message)
      }
    },
    async updatePassword() {
      try {
        await Api.patch(`/users/${this.user._id}/password`, { password: this.password })
        alert('Password updated successfully')
      } catch (error) {
        console.error('Failed to update password', error)
        alert('Failed to update password: ' + error.message)
      }
    },
    handlePhotoUpload(event) {
      const file = event.target.files[0]
      this.uploadedPhoto = file
    },
    async uploadPhoto() {
      try {
        const formData = new FormData()
        formData.append('photo', this.uploadedPhoto)

        const response = await Api.patch(`/users/${this.user._id}/photo`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        })
        this.user.photo = response.data.photo
        alert('Photo uploaded successfully')
      } catch (error) {
        console.error('Failed to upload photo', error)
        alert('Failed to upload photo: ' + error.message)
      }
    },
    async addInterests() {
      try {
        const interestsArray = this.interests.split(',').map(interest => interest.trim())

        await Api.patch(`/users/${this.user._id}/interests`, { interests: interestsArray })
        alert('Interests added successfully')
      } catch (error) {
        console.error('Failed to add interests', error)
        alert('Failed to add interests: ' + error.message)
      }
    },
    // Signout method
    signout() {
      // Remove the JWT token
      this.$router.push('/signin') // Redirect to login page
      token.unset()
    }
  }
}
</script>

<style scoped>
.profile-picture {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  object-fit: cover;
}
@media screen{
    .w-md-50 {
        max-width: 450px;
        margin-top: 5%;
        margin-bottom: 5%;
        margin-inline: 5%;
        width: 100%;
    }
}

  </style>
