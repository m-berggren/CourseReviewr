<template>
  <b-container class="mx-auto min-vh-100 ">
    <b-container class="w-100 w-md-50 mt-5 p-4 max-width-550 border border-light-subtle">

      <!-- Profile Picture, Upload, and Username -->
      <div class="d-flex justify-content-start align-items-center gap-3 flex-wrap">
        <!-- Profile Picture -->
        <div class="d-flex flex-column">
          <s3-image-display :obj="user" type="user" class="image-container"/>
          <b-button @click="showUpload = !showUpload" variant="link" class="p-0">
            <small>Change Photo</small>
          </b-button>
        </div>

        <!-- Username on the right of photo -->
        <div class="ml-3">
          <h4 class="usernamedisplay">{{ user.username }}</h4>
          <span v-if="user.role === 'admin'" class="text-danger">(Admin)</span>
        </div>
      </div>

      <!-- Upload Photo Form - Shown when Upload is clicked -->
      <b-form @submit.prevent="uploadPhoto" v-if="showUpload" class="mt-2">
        <b-form-group label="Upload Profile Picture" label-for="photo-input" class="label-font">
          <b-form-file id="photo-input" @change="handlePhotoUpload" required></b-form-file>
        </b-form-group>
        <b-button size="sm" type="submit" variant="primary" class="mt-2">Upload Photo</b-button>
      </b-form>

      <hr />

      <!-- BootstrapVue alert component to display message -->
      <b-alert v-model="showMessage" :variant="messageVariant" dismissible fade class="mt-3">
        {{ message }}
      </b-alert>

      <!-- Email Update -->
      <b-form @submit.prevent="updateEmail">
        <b-form-group label="Email Address" label-for="email-input" class="label-font">
          <b-form-input id="email-input" v-model="email" type="email" required></b-form-input>
        </b-form-group>
        <b-button class="mt-2" type="submit" size="sm" variant="primary" block>Update Email</b-button>
      </b-form>

      <hr />

      <!-- Interests Section -->
      <div class="d-flex flex-column align-items-left gap-3">
        <b-form-group label="Your Interests" class="label-font">
          <div class="interest-bubbles">
            <span v-for="interest in interests" :key="interest.id" class="interest-bubble">
              {{ interest.name }}
              <b-button variant="link" @click="removeInterest(interest.id)" size="sm">
                <b-icon-x v-b-tooltip.hover title="Delete"></b-icon-x>
              </b-button>
            </span>
          </div>
        </b-form-group>

        <!-- Add Interest -->
        <b-form @submit.prevent="addInterest">
          <b-form-group label="Add New Interest" label-for="select-interest" class="label-font mb-2">
            <b-form-select id="select-interest" v-model="selectedInterestId" :options="availableInterests" class="mt-2"
              placeholder="Select an interest" :value-field="'id'" :text-field="'name'"></b-form-select>
          </b-form-group>
          <b-button type="submit" variant="primary" size="sm">Add Interest</b-button>
        </b-form>
      </div>

      <hr />

      <!-- Password Update Section -->
      <div>
        <b-button v-if="!showPasswordFields" @click="showPasswordFields = true" size="sm" variant="primary">
          Update Password
        </b-button>

        <div v-if="showPasswordFields">
          <b-form @submit.prevent="updatePassword">
            <b-form-group label="New Password" label-for="new-password-input" class="label-font mb-2">
              <b-input-group size="sm">
                <b-form-input id="new-password-input" v-model="password" :type="showPassword ? 'text' : 'password'"
                  placeholder="Enter new password" required></b-form-input>
                <template #append>
                  <b-button @click="togglePasswordVisibility" size="sm" class="btn-light">
                    <b-icon-eye-fill v-if="showPassword"></b-icon-eye-fill>
                    <b-icon-eye-slash-fill v-if="!showPassword"></b-icon-eye-slash-fill>
                  </b-button>
                </template>
              </b-input-group>
            </b-form-group>

            <b-form-group label="Confirm Password" label-for="confirm-password-input" class="label-font">
              <b-input-group size="sm">
                <b-form-input id="confirm-password-input" v-model="confirmPassword"
                  :type="showConfirmPassword ? 'text' : 'password'" placeholder="Confirm new password" required>
                </b-form-input>
                <template #append>
                  <b-button @click="toggleConfirmPasswordVisibility" size="sm" class="btn-light">
                    <b-icon-eye-fill v-if="showConfirmPassword"></b-icon-eye-fill>
                    <b-icon-eye-slash-fill v-if="!showConfirmPassword"></b-icon-eye-slash-fill>
                  </b-button>
                </template>
              </b-input-group>
            </b-form-group>
            <div class="d-flex gap-2 mt-2">
              <b-button size="sm" type="submit" variant="primary">Submit New Password</b-button>
              <b-button size="sm" @click="cancelPasswordUpdate">Cancel</b-button>
            </div>
          </b-form>
        </div>
      </div>

      <hr />

      <!-- Signout Button -->
      <b-button variant="danger" block @click="signout">Sign Out</b-button>
    </b-container>
  </b-container>
</template>

<script>
import { Api } from '@/Api'
import { token } from '@/token'
import S3ImageDisplay from '@/components/BaseS3ImageDisplay.vue'
import { resizeImage } from '@/utils/resize-img'

export default {
  components: {
    's3-image-display': S3ImageDisplay
  },
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
      selectedInterestId: '',
      message: '',
      showMessage: false,
      messageVariant: 'info'
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
      this.showAlert('Failed to load user data or topics: ' + error.message, 'danger')
    }
  },
  methods: {
    showAlert(message, variant = 'info', timeout = 5000) {
      this.message = message
      this.messageVariant = variant
      this.showMessage = true
      // Auto-hide the alert after the timeout if its not a danger alert
      if (timeout && this.messageVariant !== 'danger') {
        setTimeout(() => {
          this.showMessage = false
        }, timeout)
      }
    },
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
        this.showAlert('Email updated successfully', 'success')
      } catch (error) {
        console.error('Failed to update email', error)
        if (error.response && error.response.status === 409) {
          this.showAlert('Email already in use', 'danger')
        } else {
          this.showAlert('Failed to update email: ' + error.message, 'danger')
        }
      }
    },
    async updatePassword() {
      if (this.password !== this.confirmPassword) {
        this.showAlert('Passwords do not match', 'danger')
        return
      }

      try {
        await Api.patch(`/users/${token.getUserId()}`, { password: this.password })
        this.showAlert('Password updated successfully', 'success')
        this.cancelPasswordUpdate()
      } catch (error) {
        this.showAlert('Failed to update password: ' + error.message, 'danger')
      }
    },
    async handlePhotoUpload(event) {
      try {
        const file = event.target.files[0]
        this.uploadedPhoto = file
      } catch (error) {
        this.showAlert('Failed to upload image: ' + error.message, 'danger')
      }
    },
    async uploadPhoto() {
      try {
        const resizedFile = await resizeImage(this.uploadedPhoto)

        const data = await Api.getS3UploadUrl(this.uploadedPhoto.name, 'image/jpeg') // Get valid url for uploading to S3

        const newFileName = data.imageName
        const uploadUrl = data.signedUrl

        await Api.uploadToS3(resizedFile, uploadUrl) // Upload the resized file with the valid url

        const signedUrl = await Api.getS3DownloadUrl(newFileName) // Get the signed URL for downloading the photo

        const urlExpiration = Date.now() + 24 * 60 * 60 * 1000 // 24 hours in ms

        const formData = new FormData()
        formData.append('photo', newFileName)
        formData.append('signedUrl', signedUrl)
        formData.append('urlExpiration', urlExpiration)

        await Api.patch(`/users/${token.getUserId()}`, formData, {
          headers: {
            Authorization: `Bearer ${token.getToken()}`,
            'Content-Type': 'multipart/form-data'
          }
        })
        const currentPhoto = this.photo // It's still the old photo
        if (currentPhoto) {
          await Api.deleteFromS3(currentPhoto) // Delete old photo
        }

        const response = await Api.get(`/users/${token.getUserId()}`)
        this.user = { ...response.data }
        this.photo = this.user.photo
        this.showUpload = false
        this.showAlert('Photo uploaded successfully', 'success')
      } catch (error) {
        console.error('Failed to upload photo', error)
        this.showAlert('Failed to upload photo: ' + error.message, 'danger')
      }
    },
    async addInterest() {
      if (!this.selectedInterestId) {
        this.showAlert('Please select an interest', 'danger')
        return
      }

      if (this.interests.some(interest => interest.id === this.selectedInterestId)) {
        this.showAlert('Interest already added', 'danger')
        return
      }

      try {
        await Api.patch(`/users/${token.getUserId()}`, {
          interests: [...this.interests.map(i => i.id), this.selectedInterestId]
        })

        const newInterest = this.availableInterests.find(interest => interest.id === this.selectedInterestId)
        this.interests.push(newInterest)
        this.selectedInterestId = null
        this.showAlert('Interest added successfully', 'success')
      } catch (error) {
        console.error('Failed to add interest:', error)
        this.showAlert('Failed to add interest: ' + error.message, 'danger')
      }
    },
    async removeInterest(interestId) {
      try {
        await Api.patch(`/users/${token.getUserId()}`, {
          removeInterestId: interestId
        })

        this.interests = this.interests.filter(interest => interest.id !== interestId)
        this.showAlert('Interest removed successfully', 'success')
      } catch (error) {
        console.error('Failed to remove interest:', error)
        this.showAlert('Failed to remove interest: ' + error.message, 'danger')
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
.image-container {
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

.label-font {
  font-size: 0.875rem;
  font-weight: 500;
}

.usernamedisplay {
  word-wrap: break-word;
  overflow-wrap: break-word;
  white-space: normal;
  max-width: 300px;
  display: inline-block;
}
</style>
