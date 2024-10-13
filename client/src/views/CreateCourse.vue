<template>
  <div>
    <b-row class="top-row text-center justify-content-center">
      <h2 class="my-1">Create course - then review</h2>
    </b-row>

    <b-row class="justify-content-center">
      <b-col xl="6" lg="8" md="10" sm="8" xs="8">
        <!-- Form for creating course -->
        <b-form @submit="onSubmit" @reset="onReset">

          <!-- Course name -->
          <b-form-group label-cols="3" label="Course name:*" label-for="input-1" class="label-font mt-1 ms-2">
            <b-form-input
            id="input-1"
            v-model="form.name"
            placeholder="Enter course name"
            :state="getFieldState(nameState)"
            class="ms-2"
            ></b-form-input>
            <b-form-invalid-feedback :state="getFieldState(nameState)">
              Please type in a course name longer than 3 letters.
            </b-form-invalid-feedback>
            <b-form-valid-feedback :state="getFieldState(nameState)"></b-form-valid-feedback>
          </b-form-group>

          <!-- Description -->
          <b-form-group label-cols="3" label="Description:" label-for="input-2" class="label-font mt-3  ms-2">
            <b-form-textarea
              id="textarea"
              v-model="form.description"
              placeholder="Enter a description..."
              rows="2"
              max-rows="5"
              class="ms-2"
            ></b-form-textarea>
          </b-form-group>

          <!-- Topics -->
          <b-form-group label-cols="3" label="Topics:*" label-for="input-3" class="label-font mt-3  ms-2">
            <b-form-tags
              input-id="topics-list"
              v-model="form.topics"
              :state="getFieldState(topicsState)"
              remove-on-delete
              separator=","
              class="ms-2"
            ></b-form-tags>
            <!-- Custom validation feedback -->
            <b-form-invalid-feedback :state="getFieldState(topicsState)">Please type in topic(s) suitable for this course.</b-form-invalid-feedback>
            <b-form-valid-feedback :state="getFieldState(topicsState)"></b-form-valid-feedback>
          </b-form-group>

          <!-- Difficulty -->
          <b-form-group label-cols="3" label="Difficulty:*" label-for="input-4" class="label-font mt-3  ms-2">
            <b-form-select
              v-model="form.difficulty"
              :options="difficultyOptions"
              size="sm"
              :state="getFieldState(difficultyState)"
              class="ms-2"
            ></b-form-select>
            <!-- Custom validation feedback -->
            <b-form-invalid-feedback :state="getFieldState(difficultyState)">Please choose a difficulty.</b-form-invalid-feedback>
            <b-form-valid-feedback :state="getFieldState(difficultyState)"></b-form-valid-feedback>
          </b-form-group>

          <!-- Provider -->
          <b-form-group label-cols="3" label="Provider:*" label-for="input-5" class="label-font mt-3  ms-2">
            <b-form-input
            id="input-5"
            v-model="form.provider"
            placeholder="Enter provider"
            :state="getFieldState(providerState)"
            class="ms-2"
            ></b-form-input>
            <!-- Custom validation feedback -->
            <b-form-invalid-feedback :state="getFieldState(providerState)">Please type in a provider longer than 1 letter.</b-form-invalid-feedback>
            <b-form-valid-feedback :state="getFieldState(providerState)"></b-form-valid-feedback>
          </b-form-group>

          <!-- Description -->
          <b-form-group label-cols="3" label="Url:" label-for="input-6" class="label-font mt-3  ms-2">
            <b-form-input
            id="input-6"
            v-model="form.url"
            placeholder="Enter url..."
            class="ms-2"
            ></b-form-input>
          </b-form-group>

          <!-- Instructor -->
          <b-form-group label-cols="3" label="Instructor:" label-for="input-7" class="label-font mt-3  ms-2">
            <b-form-input
            id="input-7"
            v-model="form.instructor"
            placeholder="Enter instructor..."
            class="ms-2"
            ></b-form-input>
          </b-form-group>

          <!-- Photo -->
          <b-form-group label-cols="3" label="Photo:*" label-for="input-8" class="label-font mt-3  ms-2">
            <b-form-file
              v-model="form.photo"
              :state="getFieldState(photoState)"
              placeholder="Choose a file or drop it here..."
              drop-placeholder="Drop file here..."
              class="ms-2"
            ></b-form-file>
            <!-- Custom validation feedback -->
            <b-form-invalid-feedback :state="getFieldState(photoState)">Please select a photo file.</b-form-invalid-feedback>
            <b-form-valid-feedback :state="getFieldState(photoState)"></b-form-valid-feedback>
          </b-form-group>

          <!-- Access Type -->
          <b-form-group label-cols="3" label="Access type:*" label-for="input-8" class="label-font mt-3 ms-2">
            <b-form-select
              v-model="form.accessType"
              :options="accessOptions"
              size="sm"
              :state="getFieldState(accessState)"
              class="ms-2"
            ></b-form-select>
            <!-- Custom validation feedback -->
            <b-form-invalid-feedback :state="getFieldState(accessState)">Please choose an access type.</b-form-invalid-feedback>
            <b-form-valid-feedback :state="getFieldState(accessState)"></b-form-valid-feedback>
          </b-form-group>

          <!-- Release Year -->
          <b-form-group label-cols="3" label="Release year:" label-for="input-9" class="label-font mt-3  ms-2">
            <b-form-input
            id="input-9"
            v-model="form.releaseYear"
            placeholder="Enter release year..."
            class="ms-2"
            ></b-form-input>
          </b-form-group>

          <!-- Certificate -->
          <b-form-group label-cols="3" label="Certificate:*" label-for="input-10" class="label-font mt-3  ms-2">
            <b-form-select
              v-model="form.certificate"
              :options="certificateOptions"
              size="sm"
              :state="getFieldState(certificateState)"
              class="ms-2"
            ></b-form-select>
            <!-- Custom validation feedback -->
            <b-form-invalid-feedback :state="getFieldState(certificateState)">Please choose a type of certificate.</b-form-invalid-feedback>
            <b-form-valid-feedback :state="getFieldState(certificateState)"></b-form-valid-feedback>
          </b-form-group>

          <b-form-group class="my-1">
            <b-row>
              <b-col md-2>
                <b-button v-if="!formCreated" type="submit" variant="primary" class="left">Submit</b-button>
                <router-link v-else to="/course/review/create">
                  <b-button variant="success">Next: Create Review</b-button>
                </router-link>
              </b-col>
              <b-col class="text-right">
                <b-button v-if="!formCreated" type="reset" variant="danger" class="ml-auto">Reset</b-button>
              </b-col>
            </b-row>
          </b-form-group>

        </b-form>
      </b-col>
    </b-row>

    <b-row class="justify-content-center">
      <b-col md-6>
      <!-- Success message -->
      <BAlert
        v-if="successMessage"
        variant="success"
        :model-value="true"
      >
        Course Created!
      </BAlert>
    </b-col>
    </b-row>

  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue'
import { Api } from '@/Api'
import { token } from '../token.js'

/* Constants */

// Tracking submission state
const formCreated = ref(false)
const successMessage = ref('')

// Token
const bearerToken = token.getOrThrow()

// Reactive variables to track changes of state
const nameValid = ref(true)
const providerValid = ref(true)
const photoValid = ref(true)
const topicsValid = ref(true)
const difficultyValid = ref(true)
const accessValid = ref(true)
const certificateValid = ref(true)
const formSubmitted = ref(false) // Track if the form has been touched to enable validation feedback

/* Methods */

const getFieldState = (fieldState) => {
  if (!formSubmitted.value) {
    return fieldState ? true : null
  }
  return !!fieldState
}

// Computed properties for validation states
const nameState = computed(() => form.name.length > 3)
const topicsState = computed(() => form.topics.length > 0)
const providerState = computed(() => form.provider.length > 1)
const photoState = computed(() => form.photo !== null)
const difficultyState = computed(() => form.difficulty !== null)
const accessState = computed(() => form.accessType !== null)
const certificateState = computed(() => form.certificate !== null)

// Form submission to update the reactive value of topicsValid
const onSubmit = async (event) => {
  event.preventDefault() // Force page to not update after submission

  // Mark the form as touched to enable validation feedback
  formSubmitted.value = true

  // Check if form is valid
  const isFormValid = topicsValid.value && form.difficulty !== null && photoValid.value && difficultyValid.value && accessValid.value && certificateValid.value

  if (!isFormValid) {
    console.log('Form is invalid')
    return
  }

  let createdTopics = [] // Keep track of successfully created topic IDs

  try {
    // Step 1: Create topics and store their IDs
    const topicPromises = form.topics.map(topic => createTopic(topic))
    createdTopics = await Promise.all(topicPromises)
    form.topics = createdTopics

    console.log(form.photo)

    // Step 2: Upload photo to AWS S3 bucket
    if (form.photo) {
      try {
        const uploadedPhotoName = await Api.handleImageUpload(form.photo)
        console.log(form.photo, uploadedPhotoName)
        form.photo = uploadedPhotoName
      } catch (uploadError) {
        console.error('Error uploading image:', uploadError)
        throw new Error(`Failed to upload image: ${uploadError.message}`)
      }
    }

    if (form.releaseYear === null) form.releaseYear = 0

    // Step3: Create course and show message
    await createCourse()
    formCreated.value = true
    successMessage.value = 'Course created successfully!'
    onReset()
  } catch (error) {
    console.error('Error creating course:', error)
    successMessage.value = ''

    // If course creation fails, remove created topic(s)
    if (createdTopics.length > 0) {
      const removePromises = createdTopics.map(id => removeTopic(id))
      try {
        await Promise.all(removePromises)
      } catch (removeError) {
        console.error('Error removing ropics after course creation failure:', removeError)
      }
    }
  }
}

const createTopic = async (topic) => {
  try {
    const response = await Api.post('/topics', { name: topic }, {
      headers: {
        Authorization: `Bearer ${bearerToken}`
      }
    })
    return response.data.topic._id
  } catch (error) {
    console.error(`Error creating topic with name ${topic}: `, error)
  }
}

const createCourse = async () => {
  try {
    const response = await Api.post('/courses', form, {
      headers: {
        Authorization: `Bearer ${bearerToken}`
      }
    })
    return response.data
  } catch (error) {
    console.error(`Error creating course with name ${form.name}: `, error)
  }
}

const removeTopic = async (id) => {
  try {
    const response = await Api.delete(`/topics/${id}`)
    return response.data
  } catch (error) {
    console.error(`Deleting a course with ID ${id} did not work: `, error)
  }
}

// Reset form input
const onReset = () => {
  form.name = ''
  form.description = ''
  form.topics = []
  form.difficulty = null
  form.provider = ''
  form.url = ''
  form.instructor = ''
  form.photo = null
  form.imageName = ''
  form.accessType = null
  form.releaseYear = null
  form.certificate = null

  nameValid.value = true
  providerValid.value = true
  topicsValid.value = true
  photoValid.value = true
  difficultyValid.value = true
  accessValid.value = true
  certificateValid.value = true
  formSubmitted.value = false // Reset the touched state so validation messages are hidden
}

/* Data structures */

const difficultyOptions = [
  { value: null, text: 'Please select an option' },
  { value: 'Beginner', text: 'Beginner' },
  { value: 'Intermediate', text: 'Intermediate' },
  { value: 'Advanced', text: 'Advanced' }
]

const accessOptions = [
  { value: null, text: 'Please select an option' },
  { value: 'Free', text: 'Free' },
  { value: 'Paid', text: 'Paid' },
  { value: 'Enrollment', text: 'Enrollment' }
]

const certificateOptions = [
  { value: null, text: 'Please select an option' },
  { value: 'Yes', text: 'Yes' },
  { value: 'No', text: 'No' }
]

const form = reactive({
  name: '',
  description: '',
  topics: [],
  difficulty: null,
  provider: '',
  url: '',
  instructor: '',
  photo: null,
  imageName: '',
  accessType: null,
  releaseYear: null,
  certificate: null
})

onMounted(() => {
  onReset()
})

</script>

<style>
.top-row {
  background-color: cornflowerblue;
}
.label-font {
  font-weight: bold;
}
</style>
