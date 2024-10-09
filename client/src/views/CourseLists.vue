<template>
  <b-container class="d-flex flex-column">
    <!-- Header with the title "Course Lists" and button to create a new course list -->
    <div class="d-flex justify-content-between mt-4 mb-4">
      <h1>Course Lists</h1>
      <b-button @click="toggleNewCourseListForm" variant="primary">
        {{ showNewCourseListForm ? "Cancel" : "Create New Course List" }}
      </b-button>
    </div>

    <!-- Alert component to display messages -->
    <b-alert :show="showMessage" :variant="messageVariant" dismissible @dismissed="showMessage = false">
      {{ message }}
    </b-alert>

    <!-- Form to create a new course list -->
    <b-form v-if="showNewCourseListForm" @submit.prevent="onSubmit">
      <b-form-group label="Name:" label-for="input-name">
        <b-form-input id="input-name" v-model="name" required></b-form-input>
      </b-form-group>

      <b-form-group label="Description:" label-for="input-description">
        <b-form-input id="input-description" v-model="description" required />
      </b-form-group>

      <b-button type="submit" variant="primary">Submit Course List</b-button>
    </b-form>

    <!-- List of course lists fetched from the database -->
    <!-- Safe check added: courseLists && courseLists.length > 0 -->
    <b-list-group v-if="courseLists && courseLists.length > 0" class="mt-3">
      <b-list-group-item v-for="courseList in courseLists" :key="courseList._id">
        <b-row>
          <b-col>
            <b-button @click="toggleCourses(courseList)" variant="link">
              {{ courseList.name }}
            </b-button>

            <!-- Courses within the course list -->
            <b-list-group v-if="courseList.showCourses">
              <b-list-group-item v-for="course in courseList.courses" :key="course._id"
                class="d-flex justify-content-between align-items-center">
                <div>
                  <h5>{{ course.name }}</h5>
                </div>
                <b-button variant="danger" size="sm" @click="deleteCourse(courseList._id, course._id)">
                  <b-icon icon="trash" aria-hidden="true"></b-icon> Delete
                </b-button>
              </b-list-group-item>
            </b-list-group>
          </b-col>
          <b-col>{{ new Date(courseList.creationDate).toLocaleDateString() }}</b-col>
          <b-col>
            <b-form @submit.prevent="addCourseToCourseList(courseList)">
              <b-form-group label="Add Course:" label-for="input-course">
                <b-form-input id="input-course" v-model="courseList.newCourse" @input="fetchCourses(courseList)"
                  placeholder="Type to search courses" required></b-form-input>
                <b-list-group v-if="allCourses && allCourses.length">
                  <b-list-group-item v-for="course in allCourses" :key="course._id"
                    @click="selectCourse(courseList, course)" class="d-flex justify-content-between align-items-center">
                    {{ course.name }}
                  </b-list-group-item>
                </b-list-group>
              </b-form-group>
              <b-button type="submit" variant="primary">Add Course</b-button>
            </b-form>
          </b-col>
          <b-col>
            <b-button variant="danger" size="sm" @click="deleteCourseList(courseList._id)">
              <b-icon icon="trash" aria-hidden="true"></b-icon> Delete
            </b-button>
          </b-col>

        </b-row>
        <!-- Description row for the course list -->
        <b-row>
          <b-col>Description:</b-col>
          <b-col>{{ courseList.description }}</b-col>
        </b-row>
      </b-list-group-item>
    </b-list-group>

    <!-- Safe check added: Show this alert only when courseLists is initialized as an array -->
    <b-alert v-else-if="courseLists && courseLists.length === 0" variant="info" show>
      No course lists available. Create a new one.
    </b-alert>

    <!-- Prevent errors when courseLists is not yet defined -->
    <b-alert v-else variant="info" show>
      Loading course lists...
    </b-alert>
  </b-container>
</template>

<script>
import { Api } from '@/Api'
import { token } from '../token.js'

export default {
  data() {
    return {
      courseLists: [], // Ensure it's initialized as an array
      name: '',
      description: '',
      showNewCourseListForm: false,
      showMessage: false,
      messageVariant: 'info',
      message: '',
      isMounted: false // To track if component is mounted
    }
  },
  async created() {
    this.isMounted = true // Mark component as mounted
    await this.fetchCourseLists()
  },
  beforeUnmount() {
    this.isMounted = false // Mark component as unmounted
  },
  methods: {
    // Fetch the user's course lists from the backend
    async fetchCourseLists() {
      try {
        const response = await Api.get(`/users/${token.getUserId()}/course-lists`)
        if (this.isMounted) {
          this.courseLists = response.data.map((courseList) => ({
            ...courseList,
            showCourses: false
          }))
        }
      } catch (error) {
        this.showAlert('Failed to load course lists: ' + error.message, 'danger')
      }
    },

    // Toggle the display of courses within a course list
    toggleCourses(courseList) {
      courseList.showCourses = !courseList.showCourses
    },

    // Toggle the display of the course creation form
    toggleNewCourseListForm() {
      this.showNewCourseListForm = !this.showNewCourseListForm
      this.resetForm()
    },

    // Reset the form fields for creating a new course list
    resetForm() {
      this.name = ''
      this.description = ''
    },

    // Handle form submission for creating a new course list
    async onSubmit() {
      try {
        const response = await Api.post(`/users/${token.getUserId()}/course-lists`, {
          name: this.name,
          description: this.description
        })

        this.courseLists.push({ ...response.data, showCourses: false })
        this.showNewCourseListForm = false
        this.showAlert('Course list created successfully', 'success')
        this.resetForm()
      } catch (error) {
        this.showAlert('Failed to create course list: ' + error.message, 'danger')
      }
    },

    // Delete a course list by ID
    async deleteCourseList(courseListId) {
      try {
        await Api.delete(`/users/${token.getUserId()}/course-lists/${courseListId}`)
        this.courseLists = this.courseLists.filter((list) => list._id !== courseListId)
        this.showAlert('Course list deleted successfully', 'success')
      } catch (error) {
        this.showAlert('Failed to delete course list: ' + error.message, 'danger')
      }
    },

    // Delete a course from a course list
    async deleteCourse(courseListId, courseId) {
      try {
        await Api.patch(`users/${token.getUserId()}/course-lists/${courseListId}`, {
          removeCourseId: courseId
        })
        const courseList = this.courseLists.find((list) => list._id === courseListId)
        courseList.courses = courseList.courses.filter((course) => course._id !== courseId)
        this.showAlert('Course deleted successfully', 'success')
      } catch (error) {
        this.showAlert('Failed to delete course: ' + error.message, 'danger')
      }
    },
    fetchCourses(courseList) {
      // Fetch courses from the API

    },

    // Show an alert with a custom message
    showAlert(message, variant) {
      this.message = message
      this.messageVariant = variant
      this.showMessage = true
    }
  }
}
</script>

<style scoped>
/* Scoped styles for course list */
</style>
