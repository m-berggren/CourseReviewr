<template>
  <b-container class="d-flex justify-content-center align-items-center min-vh-100">
    <b-card class="w-100 w-md-50 mt-5 p-4 max-width-550">
      <b-card-body>
        <!-- Profile Picture, Upload, and Username -->
        <div class="d-flex flex-column align-items-center">
          <div class="profile-container d-flex justify-content-start align-items-center">
            <!-- Profile Picture -->
            <div class="position-relative">
              <img :src="photo" alt="Profile Picture" class="profile-picture mb-2" />
              <div class="d-flex justify-content-center w-100">
                <b-button @click="showUpload = !showUpload" variant="link" class="p-0">
                  <small>Change Photo</small>
                </b-button>
              </div>
            </div>

            <!-- Username on the right of photo -->
            <div class="ml-3">
              <h4>{{ user.username }}</h4>
              <span v-if="user.role === 'admin'" class="text-danger">(Admin)</span>
            </div>
          </div>

          <!-- Upload Photo Form - Shown when Upload is clicked -->
          <b-form @submit.prevent="uploadPhoto" v-if="showUpload" class="mt-2">
            <b-form-group label="Upload Profile Picture" label-for="photo-input">
              <b-form-file id="photo-input" @change="handlePhotoUpload" required></b-form-file>
            </b-form-group>
            <b-button type="submit" variant="primary" block>Upload Photo</b-button>
          </b-form>
        </div>

        <hr />

        <!-- Email Update -->
        <b-form @submit.prevent="updateEmail">
          <b-form-group label="Email Address" label-for="email-input">
            <b-form-input id="email-input" v-model="email" type="email" required></b-form-input>
          </b-form-group>
          <b-button type="submit" variant="primary" block>Update Email</b-button>
        </b-form>

        <hr />

        <!-- Interests Section -->
        <div>
          <b-form-group label="Your Interests">
            <div class="interest-bubbles">
              <span v-for="interest in interests" :key="interest.id" class="interest-bubble">
                {{ interest.name }}
                <b-button size="sm" variant="link" @click="removeInterest(interest.id)">
                  <b-icon icon="x"></b-icon>
                </b-button>
              </span>
            </div>
          </b-form-group>

          <!-- Add Interest -->
          <b-form @submit.prevent="addInterest">
            <b-form-group label="Add New Interest">
              <b-form-select v-model="selectedInterestId" :options="availableInterests" class="mt-2"
                placeholder="Select an interest" :value-field="'id'" :text-field="'name'"></b-form-select>
            </b-form-group>
            <b-button type="submit" variant="primary" block>Add Interest</b-button>
          </b-form>
        </div>

        <hr />

        <!-- Password Update Section -->
        <div>
          <b-button v-if="!showPasswordFields" @click="showPasswordFields = true" variant="primary" block>
            Update Password
          </b-button>

          <div v-if="showPasswordFields">
            <b-form @submit.prevent="updatePassword">
              <b-form-group label="New Password" label-for="new-password-input">
                <b-input-group>
                  <b-form-input id="new-password-input" v-model="password" :type="showPassword ? 'text' : 'password'"
                    placeholder="Enter new password" required></b-form-input>
                  <b-input-group-append>
                    <b-button @click="togglePasswordVisibility" variant="outline-secondary">
                      <b-icon :icon="showPassword ? 'eye-slash-fill' : 'eye'"></b-icon>
                    </b-button>
                  </b-input-group-append>
                </b-input-group>
              </b-form-group>

              <b-form-group label="Confirm Password" label-for="confirm-password-input">
                <b-input-group>
                  <b-form-input id="confirm-password-input" v-model="confirmPassword"
                    :type="showConfirmPassword ? 'text' : 'password'" placeholder="Confirm new password" required>
                  </b-form-input>
                  <b-input-group-append>
                    <b-button @click="toggleConfirmPasswordVisibility" variant="outline-secondary">
                      <b-icon :icon="showConfirmPassword ? 'eye-slash' : 'eye'"></b-icon>
                    </b-button>
                  </b-input-group-append>
                </b-input-group>
              </b-form-group>

              <b-button type="submit" variant="primary" block>Submit New Password</b-button>
              <b-button @click="cancelPasswordUpdate" variant="secondary" block class="mt-2">Cancel</b-button>
            </b-form>
          </div>
        </div>

        <hr />

        <!-- Signout Button -->
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
      user: {},
      email: '',
      password: '',
      confirmPassword: '',
      photo: '',
      uploadedPhoto: null,
      showPasswordFields: false,
      showPassword: false,
      showConfirmPassword: false,
      showUpload: false,
      interests: [],
      selectedInterest: '',
      availableInterests: [],
      selectedInterestId: ''
    }
  },
  async created() {
    try {
      const response = await Api.get(`/users/${token.getUserId()}`)
      this.user = { ...response.data }
      this.email = this.user.email
      this.photo = this.user.photo

      if (Array.isArray(this.user.interests)) {
        this.interests = this.user.interests.map(interest => ({
          id: interest._id,
          name: interest.name
        }))
      } else {
        this.interests = []
      }

      const topicsResponse = await Api.get('/topics')
      if (Array.isArray(topicsResponse.data.topics)) {
        this.availableInterests = topicsResponse.data.topics.map(topic => ({
          id: topic._id,
          name: topic.name
        }))
      }
    } catch (error) {
      console.error('Failed to load user data or topics:', error)
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
      if (this.password !== this.confirmPassword) {
        alert('Passwords do not match!')
        return
      }

      try {
        await Api.patch(`/users/${token.getUserId()}`, { password: this.password })
        alert('Password updated successfully')
        this.cancelPasswordUpdate()
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

        await Api.patch(`/users/${token.getUserId()}`, formData, {
          headers: {
            Authorization: `Bearer ${token.getToken()}`,
            'Content-Type': 'multipart/form-data'
          }
        })

        const response = await Api.get(`/users/${token.getUserId()}`)
        this.user = { ...response.data }
        this.photo = this.user.photo
        alert('Photo uploaded successfully')
      } catch (error) {
        console.error('Failed to upload photo', error)
        alert('Failed to upload photo: ' + error.message)
      }
    },
    async addInterest() {
      if (!this.selectedInterestId) {
        alert('Please select an interest')
        return
      }

      if (this.interests.some(interest => interest.id === this.selectedInterestId)) {
        alert('Interest already added')
        return
      }

      try {
        await Api.patch(`/users/${token.getUserId()}`, {
          interests: [...this.interests.map(i => i.id), this.selectedInterestId]
        })

        const newInterest = this.availableInterests.find(interest => interest.id === this.selectedInterestId)
        this.interests.push(newInterest)
        this.selectedInterestId = null
        alert('Interest added successfully')
      } catch (error) {
        console.error('Failed to add interest:', error)
        alert('Failed to add interest: ' + error.message)
      }
    },
    async removeInterest(interestId) {
      try {
        await Api.patch(`/users/${token.getUserId()}`, {
          removeInterestId: interestId
        })

        this.interests = this.interests.filter(interest => interest.id !== interestId)
        alert('Interest removed successfully')
      } catch (error) {
        console.error('Failed to remove interest:', error)
        alert('Failed to remove interest: ' + error.message)
      }
    },
    signout() {
      this.$router.push('/signin')
      token.unset()
    }
  }
}
</script>

<style scoped>
/* General Styles */
.profile-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  max-width: 500px;
}

.profile-picture {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  object-fit: cover;
}

.interest-bubbles {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.interest-bubble {
  background-color: #f0f0f0;
  padding: 8px 12px;
  border-radius: 50px;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 16px;
}

.max-width-550 {
  max-width: 550px;
}
</style>
