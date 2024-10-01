<template>
  <b-container class="d-flex justify-content-center align-items-center min-vh-100">
        <b-card class="w-100 w-md-50 mt-5">
          <b-card-header class="text-center">
            <h3>My Profile</h3>
          </b-card-header>
          <b-card-body>
            <!-- Profile Picture and Username -->
            <div class="d-flex justify-content-start align-items-center mb-3">
              <img :src="user.photo" alt="Profile Picture" class="profile-picture" />
                <div class="ml-3">
                  <h4>{{ user.username }}</h4>
                    <!-- Display 'Admin' if user role is admin -->
                    <span v-if="user.role === 'admin'" class="text-danger">(Admin)</span>
                </div>
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
  <!-- Password Update Section -->
<div>
  <!-- Show the 'Update Password' button initially -->
  <b-button v-if="!showPasswordFields" @click="showPasswordFields = true" variant="primary" block>Update Password</b-button>

  <!-- Show these fields only when 'Update Password' button is clicked -->
  <div v-if="showPasswordFields">
    <b-form @submit.prevent="updatePassword">
      <!-- New Password Input -->
      <b-form-group label="New Password" label-for="new-password-input">
        <b-input-group>
          <b-form-input
            id="new-password-input"
            v-model="password"
            :type="showPassword ? 'text' : 'password'"
            placeholder="Enter new password"
            required
          ></b-form-input>
          <b-input-group-append>
            <b-button @click="togglePasswordVisibility" variant="outline-secondary">
              <b-icon :icon="showPassword ? 'eye-slash' : 'eye'"></b-icon>
            </b-button>
          </b-input-group-append>
        </b-input-group>
      </b-form-group>

      <!-- Confirm Password Input -->
      <b-form-group label="Confirm Password" label-for="confirm-password-input">
        <b-input-group>
          <b-form-input
            id="confirm-password-input"
            v-model="confirmPassword"
            :type="showConfirmPassword ? 'text' : 'password'"
            placeholder="Confirm new password"
            required
          ></b-form-input>
          <b-input-group-append>
            <b-button @click="toggleConfirmPasswordVisibility" variant="outline-secondary">
              <b-icon :icon="showConfirmPassword ? 'eye-slash' : 'eye'" class="text-dark"></b-icon>
            </b-button>
          </b-input-group-append>
        </b-input-group>
      </b-form-group>

      <!-- Submit Button -->
      <b-button type="submit" variant="primary" block>Submit New Password</b-button>

      <!-- Cancel Button to hide the password fields -->
      <b-button @click="cancelPasswordUpdate" variant="secondary" block class="mt-2">Cancel</b-button>
    </b-form>
  </div>
</div>

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
            <b-form-group label = "Your Interests">
              <!--Display current interests as removable tahgs   -->
              <b-form-tags
                v-model="userInterests"
                @remove="removeInterest"
                place-holder="No interests added yet"
                tag-variant="primary"
                class="mb-2"
              ></b-form-tags >
            </b-form-group>
              <hr>

            <b-form @submit.prevent="addInterests">
              <b-form-group label="Add New Interests">
                <b-form-select
                v-model = "selectedInterest"
                :options="availableTopics">
                class="mt-2"
                placeholder="Select an interest"
                ></b-form-select>
              </b-form-group>
              <b-button type="submit" variant="primary" block>Add Interests</b-button>
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
        username: token.getUsername(),
        role: token.getRole,
        photo: ''
      },
      email: '',
      showPasswordFields: false, // Controls visibility of password fields
      password: '',
      confirmPassword: '',
      showPassword: false, // Controls visibility for new password input
      showConfirmPassword: false, // Controls visibility for confirm password input
      interests: [],
      selectedInterest: '',
      availableInterests: ['Coding', 'Design', 'Marketing', 'Photography']
    }
  },
  async created() {
    // Fetch user data when the component is created
    try {
      const response = await Api.get(`/users/${token.getUserId()}`) // Adjust this endpoint based on your backend
      this.user = { ...this.user, ...response.data }
      this.email = this.user.email
    } catch (error) {
      console.error('Failed to load user data', error)
    }
  },
  methods: {
    togglePasswordVisibility() {
      this.showPassword = !this.showPassword
    },
    toggleConfirmPasswordVisibility() {
      this.showConfirmPassword = !this.showConfirmPassword
    },
    cancelPasswordUpdate() {
      this.showPasswordFields = false
      this.password = ''
      this.confirmPassword = ''
    },
    async updateEmail() {
      try {
        await Api.patch(`/users/${token.getUserId()}`, { email: this.email })
        alert('Email updated successfully')
      } catch (error) {
        console.error('Failed to update email', error)
        alert('Failed to update email: ' + error.message)
      }
    },
    async updatePassword() {
      // Check if the passwords match
      if (this.password !== this.confirmPassword) {
        alert('Passwords do not match!')
        return
      }

      try {
        await Api.patch(`/users/${token.getUserId()}`, { password: this.password })
        alert('Password updated successfully')
        // Reset fields and hide password form after successful update
        this.password = ''
        this.confirmPassword = ''
        this.showPasswordFields = false
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

        const response = await Api.patch(`/users/${this.user._id}`, formData, {
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
