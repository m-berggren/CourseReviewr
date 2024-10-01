<template>
  <div>
    <b-row class="top-row text-center justify-content-center">
      <h1 class="my-4">Create course</h1>
    </b-row>
    <b-row class="justify-content-center">
    <b-col md="6">
    <!-- Form for creating course -->
    <b-form @submit="onSubmit" @reset="onReset">

      <!-- Course name -->
      <b-form-group label-cols="2" label="Course name:" label-for="input-1" class="label-font mt-3">
        <b-form-input
        id="input-1"
        v-model="form.name"
        placeholder="Enter course name"
        required
        ></b-form-input>
      </b-form-group>

      <!-- Description -->
      <b-form-group label-cols="2" label="Description:" label-for="input-2" class="label-font mt-3">
        <b-form-textarea
          id="textarea"
          v-model="form.description"
          placeholder="Enter a description..."
          rows="3"
          max-rows="6"
        ></b-form-textarea>
      </b-form-group>

      <!-- Topics -->
      <b-form-group label-cols="2" label="Topics:" label-for="input-3" class="label-font mt-3">
        <b-form-tags
          input-id="topics-list"
          v-model="form.topics"
          :state="form.topics.length > 0"
          remove-on-delete
          separator=","
          @input="handleTopicInput"
        ></b-form-tags>
        <!-- Custom validation feedback -->
        <b-form-invalid-feedback v-if="!topicsValid">Please type in topic(s) suitable for this course.</b-form-invalid-feedback>
      </b-form-group>

      <!-- Difficulty -->
      <b-form-group label-cols="2" label="Difficulty:" label-for="input-4" class="label-font mt-3">
        <b-form-select
          v-model="form.difficulty"
          :options="difficultyOptions"
          size="sm"
          :state="Boolean(form.difficulty)"
          @input="handleDifficultyInput"
        ></b-form-select>
        <!-- Custom validation feedback -->
        <b-form-invalid-feedback v-if="!difficultyValid">Please choose a difficulty.</b-form-invalid-feedback>
      </b-form-group>

      <!-- Provider -->
      <b-form-group label-cols="2" label="Provider:" label-for="input-5" class="label-font mt-3">
        <b-form-input
        id="input-5"
        v-model="form.provider"
        placeholder="Enter provider"
        required
        ></b-form-input>
      </b-form-group>

      <!-- Description -->
      <b-form-group label-cols="2" label="Url:" label-for="input-6" class="label-font mt-3">
        <b-form-input
        id="input-6"
        v-model="form.url"
        placeholder="Enter url..."
        ></b-form-input>
      </b-form-group>

      <!-- Instructor -->
      <b-form-group label-cols="2" label="Instructor:" label-for="input-7" class="label-font mt-3">
        <b-form-input
        id="input-7"
        v-model="form.instructor"
        placeholder="Enter instructor..."
        ></b-form-input>
      </b-form-group>

      <!-- Photo -->
      <b-form-group label-cols="2" label="Photo:" label-for="input-8" class="label-font mt-3">
        <b-form-file
          v-model="form.photo"
          :state="Boolean(form.photo)"
          placeholder="Choose a file or drop it here..."
          drop-placeholder="Drop file here..."
          @input="handleFileInput"
        ></b-form-file>
        <!-- Custom validation feedback -->
        <b-form-invalid-feedback v-if="!photoValid">Please select a photo file.</b-form-invalid-feedback>
      </b-form-group>

      <!-- Access Type -->
      <b-form-group label-cols="2" label="Access type:" label-for="input-8" class="label-font mt-3">
        <b-form-select
          v-model="form.accessType"
          :options="accessOptions"
          size="sm"
          :state="form.accessType !== null"
          @input="handleAccessInput"
        ></b-form-select>
         <!-- Custom validation feedback -->
         <b-form-invalid-feedback v-if="!accessValid">Please choose an access type.</b-form-invalid-feedback>
      </b-form-group>

      <!-- Release Year -->
      <b-form-group label-cols="2" label="Release year:" label-for="input-9" class="label-font mt-3">
        <b-form-input
        id="input-9"
        v-model="form.releaseYear"
        placeholder="Enter release year..."
        ></b-form-input>
      </b-form-group>

      <!-- Certificate -->
      <b-form-group label-cols="2" label="Certificate:" label-for="input-10" class="label-font mt-3">
        <b-form-select
          v-model="form.certificate"
          :options="certificateOptions"
          size="sm"
          :state="form.certificate !== null"
          @input="handleCertificateInput"
        ></b-form-select>
        <!-- Custom validation feedback -->
        <b-form-invalid-feedback v-if="!certificateValid">Please choose a type of certificate.</b-form-invalid-feedback>
      </b-form-group>

      <b-form-group class="mt-4">
        <b-row>
          <b-col>
            <b-button type="submit" variant="primary" class="left">Submit</b-button>
          </b-col>
          <b-col class="text-right">
            <b-button type="reset" variant="danger" class="ml-auto">Reset</b-button>
          </b-col>
          <b-col>
            <router-link v-if="isSubmitted" to="/course/review/create" variant="primary">
              <b-button>Next (create Review)</b-button>
            </router-link>
          </b-col>
        </b-row>
      </b-form-group>

    </b-form>
  </b-col>
</b-row>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { Api } from '@/Api'

const isSubmitted = ref(false)

const difficultyOptions = [
  { value: null, text: 'Please select an option' },
  { value: 'Beginner', text: 'Beginner' },
  { value: 'Advanced', text: 'Advanced' },
  { value: 'Expert', text: 'Expert' }
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
  accessType: null,
  releaseYear: null,
  certificate: null
})

// Reactive variable to track if a photo is selected
const photoValid = ref(true)
const topicsValid = ref(true)
const difficultyValid = ref(true)
const accessValid = ref(true)
const certificateValid = ref(true)
const formTouched = ref(false) // Track if the form has been touched to enable validation feedback

// Handle topic input and validation
const handleTopicInput = () => {
  topicsValid.value = form.topics.length > 0
}

// Handle file input and validation
const handleFileInput = (event) => {
  photoValid.value = form.photo !== null // Check if a file has been selected
}

// Handle difficulty input and validation
const handleDifficultyInput = () => {
  difficultyValid.value = form.difficulty !== null // Check if a file has been selected
}

// Handle accessType input and validation
const handleAccessInput = () => {
  accessValid.value = form.accessType !== null // Check if a file has been selected
}

// Handle certificate input and validation
const handleCertificateInput = () => {
  certificateValid.value = form.certificate !== null // Check if a file has been selected
}

// Form submission to update the reactive value of topicsValid
const onSubmit = async (event) => {
  // Mark the form as touched to enable validation feedback
  formTouched.value = true

  // Validate if a photo and topics are valid (boolean)
  topicsValid.value = form.topics.length > 0
  photoValid.value = form.photo !== null
  difficultyValid.value = form.difficulty !== null
  accessValid.value = form.accessType !== null
  certificateValid.value = form.certificate !== null

  // Check if form is valid
  const isFormValid = topicsValid.value && form.difficulty !== null && photoValid.value && difficultyValid.value && accessValid.value && certificateValid.value

  if (!isFormValid) {
    event.preventDefault() // Stop the form from being submitted
  }

  /**
   * Loop over list of topics, create them in DB and replace names with IDs.
   * Then wait for all topics to be created and resolved, and assign the array of topic IDs
   */
  try {
    const topicPromises = form.topics.map(topic => createTopic(topic))
    const topics = await Promise.all(topicPromises)
    form.topics = topics
  } catch (error) {
    console.error('Error creating topics:', error)
  }

  // Adjust the form data when needed
  form.photo = form.photo.name
  if (form.releaseYear === null) { form.releaseYear = 0 }

  try {
    await createCourse(form)
    isSubmitted.value = true
  } catch (error) {
    console.error('Error creating course:', error)
  }
}

const createTopic = async (topic) => {
  try {
    const response = await Api.post('/topics', { name: topic })
    return response.data.topic._id
  } catch (error) {
    console.error(`Error creating topic with name ${topic}: `, error)
  }
}

const createCourse = async () => {
  try {
    const response = await Api.post('/courses', form)
    return response.data
  } catch (error) {
    console.error(`Error creating course with name ${form.name}: `, error)
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
  form.accessType = null
  form.releaseYear = null
  form.certificate = null

  topicsValid.value = ref(true)
  photoValid.value = ref(true)
  difficultyValid.value = ref(true)
  accessValid.value = ref(true)
  certificateValid.value = ref(true)
  formTouched.value = ref(false) // Reset the touched state so validation messages are hidden
}

</script>

<style>
.top-row {
  background-color: cornflowerblue;
}
.label-font {
  font-weight: bold;
}
</style>
