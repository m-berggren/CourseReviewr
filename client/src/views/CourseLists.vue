<template>
  <b-container class="d-flex flex-column">

    <!-- Header with the title "Course Lists" and button to create a new course list -->
    <div class="d-flex justify-content-between mt-4 mb-4">
      <h1>Course Lists</h1>
      <b-button @click="toggleNewCourseListForm" variant="primary" size="sm">
        {{ showNewCourseListForm ? "Cancel" : "Create New Course List" }}
      </b-button>
    </div>

    <!-- Alert component to display messages -->
    <BAlert v-model="showMessage" :variant="messageVariant" dismissible @dismissed="showMessage = false" fade
      class="mt-3">
      {{ message }}
    </BAlert>

    <!-- Form to create a new course list -->
    <b-form v-if="showNewCourseListForm" @submit.prevent="onSubmit" class="mb-5">
      <b-form-group label="Name:" label-for="input-name">
        <b-form-input id="input-name" v-model="name" required></b-form-input>
      </b-form-group>

      <b-form-group label="Description:" label-for="input-description">
        <b-form-input id="input-description" v-model="description" required />
      </b-form-group>
      <hr>
      <b-button type="submit" variant="primary" size="sm">Submit Course List</b-button>
    </b-form>

    <!-- List of course lists fetched from the database -->
    <div v-if="courseLists && courseLists.length > 0" class="mt-3">
      <div v-for="courseList in courseLists" :key="courseList._id" class="course-list-item mb-5 p-4">

        <!-- Course List Name and Delete Button Row -->
        <b-row class="align-items-center mb-2">
          <b-col class="d-flex align-items-center">
            <h3 class="font-weight-bold mb-0">{{ courseList.name }}</h3>
            <b-button v-b-tooltip.hover title="Delete this course list" variant="danger" size="sm" class="ml-3"
              @click="deleteCourseList(courseList._id)">
              <b-icon-trash aria-hidden="true"></b-icon-trash>
            </b-button>
          </b-col>
          <!-- Add Course Button on the far right -->
          <b-col /> <b-col />
          <b-col class="text-right">
            <b-button variant="primary" size="sm"
              @click="courseList.showAddCourseSection = !courseList.showAddCourseSection">
              {{ courseList.showAddCourseSection ? "Cancel" : "Add Course" }}
            </b-button>
          </b-col>
        </b-row>
        <hr>

        <!-- Course List Creation Date -->
        <b-row>
          <b-col class="text-muted">Created on: {{ new Date(courseList.creationDate).toLocaleDateString() }}</b-col>
        </b-row>
        <!-- Course List Description -->
        <b-row class="mb-2">
          <b-col>Description: {{ courseList.description }}</b-col>
        </b-row>

        <!-- Courses in the Course List -->
        <b-row class="mt-3">
          <b-col>
            <div v-if="courseList.courses.length > 0">
              <div v-for="course in courseList.courses" :key="course._id" class="course-item mb-2">
                <div class="d-flex justify-content-between align-items-center">
                  <div>
                    <h6 class="mb-0">{{ course.name }}</h6>
                  </div>
                  <b-button variant="danger" size="sm" v-b-tooltip.hover title="Delete this course" class="ml-3"
                    @click="deleteCourse(courseList._id, course._id)">
                    <b-icon-trash aria-hidden="true"></b-icon-trash>
                  </b-button>
                </div>
              </div>
            </div>

            <!-- Show message when no courses are present in the list -->
            <BAlert v-show="courseList.courses.length === 0" variant="info" show>
              No courses in this list. Click "Add Course" to add a course.
            </BAlert>
          </b-col>
        </b-row>

        <!-- Search and Add Course Section -->
        <b-row class="mt-3" v-if="courseList.showAddCourseSection">
          <b-col>
            <b-form @submit.prevent="addCourseToCourseList(courseList)">
              <!-- Search bar for courses -->
              <b-form-input v-model="courseList.newCourse" placeholder="Type to search courses"
                @input="filterCourses(courseList)" />

              <!-- Display filtered courses with scrollable list and "More" link -->
              <div v-if="courseList.filteredCourses && courseList.filteredCourses.length"
                class="scrollable-course-list mt-2">
                <b-list-group>
                  <b-list-group-item v-for="course in courseList.filteredCourses" :key="course._id"
                    class="d-flex justify-content-between">
                    <span @click="selectCourse(courseList, course)">{{ course.name }}</span>
                    <router-link :to="'/courses/' + course._id" class="ml-auto">More</router-link>
                  </b-list-group-item>
                </b-list-group>
              </div>

              <!-- Always show the Add Course button -->
              <b-button type="submit" variant="primary" class="mt-2" size="sm">Add Course</b-button>
            </b-form>
          </b-col>
        </b-row>
      </div>
    </div>

    <!-- Safe check added: Show this alert only when courseLists is initialized as an array -->
    <BAlert v-show="courseLists && courseLists.length === 0" variant="info" show>
      No course lists available. Create a new one.
    </BAlert>
  </b-container>
</template>

<script>
import { Api } from '@/Api'
import { token } from '../token.js'

export default {
  data() {
    return {
      courseLists: [],
      filteredCourses: [],
      allCourses: [],
      name: '',
      description: '',
      showNewCourseListForm: false,
      showMessage: false,
      messageVariant: 'info',
      message: ''
    }
  },
  async created() {
    try {
      await this.fetchCourseLists()
      await this.fetchAllCourses()
    } catch (error) {
      console.error('Error loading data', error)
    }
  },
  methods: {
    // Fetch the user's course lists from the backend
    async fetchCourseLists() {
      try {
        const response = await Api.get(`/users/${token.getUserId()}/course-lists`)
        this.courseLists = response.data.map((courseList) => ({
          ...courseList,
          showCourses: false,
          newCourse: '',
          selectedCourseId: '',
          filteredCourses: [],
          showAddCourseSection: false // This flag controls the visibility of the add course section
        }))
      } catch (error) {
        this.showAlert('Failed to load course lists: ' + error.message, 'danger')
      }
    },
    async fetchAllCourses() {
      try {
        const response = await Api.get('/courses')
        this.allCourses = response.data.courses
      } catch (error) {
        this.showAlert('Failed to load courses: ' + error.message, 'danger')
      }
    },

    // Filter courses based on the user's input in the search bar
    filterCourses(courseList) {
      courseList.filteredCourses = this.allCourses.filter(course =>
        course.name.toLowerCase().includes(courseList.newCourse.toLowerCase())
      )
    },
    selectCourse(courseList, course) {
      // Show the course name in the input field and store the course ID separately
      courseList.newCourse = course.name
      courseList.selectedCourseId = course._id
      courseList.filteredCourses = [] // Clear the search results after selection
    },

    goToCoursePage(courseId) {
      this.$router.push(`/courses/${courseId}`)
    },

    async addCourseToCourseList(courseList) {
      // Check if the course is already in the course list
      const isCourseAlreadyInList = courseList.courses.some(c => c._id === courseList.selectedCourseId)

      if (isCourseAlreadyInList) {
        this.showAlert('Course is already in the list', 'danger')
        return
      }

      try {
        await Api.patch(`/users/${token.getUserId()}/course-lists/${courseList._id}`, {
          courses: [...courseList.courses.map(c => c._id), courseList.selectedCourseId]
        })
        this.showAlert('Course added successfully', 'success')
        courseList.newCourse = ''
        courseList.selectedCourseId = '' // Reset after adding the course
        await this.fetchCourseLists()
      } catch (error) {
        this.showAlert('Failed to add course: ' + error.message, 'danger')
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

    // Show an alert with a custom message
    showAlert(message, variant = 'info', timeout = 3000) {
      this.message = message
      this.messageVariant = variant
      this.showMessage = true
      // Auto-hide the alert after the timeout if its not a danger alert
      if (timeout && this.messageVariant !== 'danger') {
        setTimeout(() => {
          this.showMessage = false
        }, timeout)
      }
    }
  }
}
</script>

<style scoped>
/* Scoped styles for course list */

/* Scrollable container for the course list */
.scrollable-course-list {
  max-height: 200px;
  overflow-y: auto;
}

/* Additional styling for vertical gaps, borders, and text sizes */
.course-list-item {
  margin-bottom: 40px;
}

h3.font-weight-bold {
  font-size: 1.75rem;
}

h6 {
  font-size: 1rem;
}
</style>
