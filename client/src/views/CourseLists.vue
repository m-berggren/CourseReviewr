<template>
  <b-container class="d-flex flex-column">

    <!-- Header with the title "Course Lists" and button to create a new course list -->
    <div class="d-flex justify-content-between mt-4 mb-4">
      <h1>Course Lists</h1>
      <b-button @click="toggleNewCourseListForm" :variant="showNewCourseListForm ? 'danger' : 'primary'" size="sm">
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
    <b-list-group v-if="courseLists && courseLists.length > 0" class="mt-1">
      <b-list-group-item v-for="courseList in courseLists" :key="courseList._id" class="course-list-item mt-4 mb-3 p-4">

        <!-- Course List Name and Delete Button Row -->
        <b-row class="align-items-center mb-3">
          <b-col class="d-flex align-items-center">
            <h3 v-if="!courseList.isEditing" class="font-weight-bold mb-0">{{ courseList.name }}</h3>
            <b-form-input v-else v-model="courseList.newName" size="sm" />


            <!-- Edit Button -->
            <b-button v-if="!courseList.isEditing" variant="light" size="sm" class="ml-3"
              @click="toggleEdit(courseList)">
              <b-icon-pencil-square></b-icon-pencil-square>
            </b-button>

            <!-- Save Button -->
            <b-button v-else variant="success" size="sm" class="ml-3" @click="saveEdit(courseList)">
              Save
            </b-button>
            <!-- Cancel Button -->
            <b-button v-if="courseList.isEditing" variant="danger" size="sm" class="ml-2"
              @click="cancelEdit(courseList)">
              Cancel
            </b-button>
            <b-col />
            <b-col /> <b-col /><b-col /><b-col />
            <b-col class=" text-right">
              <b-button variant="primary" size="sm"
                @click="courseList.showAddCourseSection = !courseList.showAddCourseSection">
                {{ courseList.showAddCourseSection ? "Cancel" : "Add Course" }}
              </b-button>
            </b-col>
          </b-col>

        </b-row>

        <!-- Description Field -->
        <b-row v-if="!courseList.isEditing" class="mb-2">
          <b-col>Description: {{ courseList.description }}</b-col>
        </b-row>
        <b-row v-else class="mb-2">
          <b-col>
            <b-form-input v-model="courseList.newDescription" placeholder="Edit Description" size="sm" />
          </b-col>
        </b-row>

        <b-row class="mb-2">
        </b-row>

        <!-- Course List Creation Date -->
        <b-row>
          <b-col class="d-flex align-items-center text-muted">Created on: {{ new
            Date(courseList.creationDate).toLocaleDateString()
            }}
            <b-button v-b-tooltip.hover variant="light" title="Delete" size="sm" class="ml-3"
              @click="showDeleteCourseListModal(courseList)">
              <b-icon-trash></b-icon-trash>
            </b-button>
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
                    class="course-list-group-item d-flex justify-content-between" @mouseenter="highlightCourse"
                    @mouseleave="unhighlightCourse" @click="selectCourse(courseList, course)">
                    <span>{{ course.name }}</span>
                    <router-link :to="'/courses/' + course._id" class="ml-auto">More</router-link>
                  </b-list-group-item>
                </b-list-group>
              </div>

              <!-- Always show the Add Course button -->
              <b-button type="submit" variant="primary" class="mt-2" size="sm">Add Course</b-button>
            </b-form>
          </b-col>
        </b-row>

        <!-- Courses in the Course List -->
        <b-row class="mt-4 mb-4">
          <b-col>
            <b-list-group v-if="courseList.courses.length > 0">
              <b-list-group-item v-for="course in courseList.courses" :key="course._id"
                class="d-flex justify-content-between align-items-center">
                <div>
                  <h6 class="mb-0">
                    <router-link :to="'/courses/' + course._id">{{ course.name }}</router-link>
                  </h6>
                  <small class="text-muted">Provider: {{ course.provider }}</small>
                </div>
                <b-button variant="light" size="sm" v-b-tooltip.hover title="Delete" class="ml-3"
                  @click="showDeleteCourseModal(courseList._id, course._id, course.name)">
                  <b-icon-trash aria-hidden="true"></b-icon-trash>
                </b-button>
              </b-list-group-item>
            </b-list-group>
            <!-- Show message when no courses are present in the list -->
            <div v-if="courseList.courses && courseList.courses.length === 0" class="d-flex align-items-center mt-3">
              <b-icon-info class="text-info mr-3"></b-icon-info>
              <span>No courses in this list. Click "Add Course" to add a course.</span>
            </div>
          </b-col>
        </b-row>
      </b-list-group-item>
    </b-list-group>

    <!-- Safe check added: Show this alert only when courseLists is initialized as an array -->
    <div v-if="courseLists && courseLists.length === 0" class="d-flex align-items-center mt-3">
      <b-icon-info class="text-info mr-3" font-scale="5"></b-icon-info>
      <span>No course lists available. Create a new one.</span>
    </div>

    <!-- Delete Course List Confirmation Modal -->
    <b-modal ref="deleteCourseListModal" hide-footer title="Confirm Deletion">
      <p class="my-4">Are you sure you want to delete the course list "{{ courseListToDelete?.name }}"?</p>
      <b-button variant="danger" @click="confirmDeleteCourseList">Yes, Delete</b-button>
      <b-button variant="secondary" @click="closeDeleteCourseListModal">Cancel</b-button>
    </b-modal>

    <!-- Delete Course Confirmation Modal -->
    <b-modal ref="deleteCourseModal" hide-footer title="Confirm Deletion">
      <p class="my-4">Are you sure you want to delete the course "{{ courseToDeleteName }}"?</p>
      <b-button variant="danger" @click="confirmDeleteCourse">Yes, Delete</b-button>
      <b-button variant="secondary" @click="closeDeleteCourseModal">Cancel</b-button>
    </b-modal>

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
      message: '',
      courseListToDelete: null,
      courseToDeleteId: null,
      courseToDeleteName: '',
      courseListIdForCourseDelete: null
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
          courses: courseList.courses || [],
          showCourses: false,
          newCourse: '',
          selectedCourseId: '',
          filteredCourses: [],
          showAddCourseSection: false,
          isEditing: false,
          newName: '',
          newDescription: ''
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
      courseList.filteredCourses = []
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
    toggleEdit(courseList) {
      // Store the original values in case user cancels the edit
      courseList.isEditing = true
      courseList.newName = courseList.name
      courseList.newDescription = courseList.description
    },
    async saveEdit(courseList) {
      try {
        const updatedData = {
          name: courseList.newName,
          description: courseList.newDescription
        }

        // Call your API to update the course list
        await Api.patch(`/users/${token.getUserId()}/course-lists/${courseList._id}`, updatedData)

        // Apply the changes to the courseList after saving
        courseList.name = courseList.newName
        courseList.description = courseList.newDescription
        courseList.isEditing = false
        this.showAlert('Course list updated successfully', 'success')
      } catch (error) {
        this.showAlert('Failed to update course list: ' + error.message, 'danger')
      }
    },
    cancelEdit(courseList) {
      courseList.isEditing = false
      courseList.newName = ''
      courseList.newDescription = ''
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

    // Show delete confirmation modal for course list
    showDeleteCourseListModal(courseList) {
      this.courseListToDelete = courseList
      this.$refs.deleteCourseListModal.show()
    },

    // Close delete confirmation modal for course list
    closeDeleteCourseListModal() {
      this.$refs.deleteCourseListModal.hide()
    },

    // Confirm course list deletion
    async confirmDeleteCourseList() {
      if (!this.courseListToDelete) return
      try {
        await Api.delete(`/users/${token.getUserId()}/course-lists/${this.courseListToDelete._id}`)
        this.courseLists = this.courseLists.filter((list) => list._id !== this.courseListToDelete._id)
        this.showAlert('Course list deleted successfully', 'success')
        this.$refs.deleteCourseListModal.hide() // Close the modal
      } catch (error) {
        this.showAlert('Failed to delete course list: ' + error.message, 'danger')
      }
    },

    // Show delete confirmation modal for course
    showDeleteCourseModal(courseListId, courseId, courseName) {
      this.courseListIdForCourseDelete = courseListId
      this.courseToDeleteId = courseId
      this.courseToDeleteName = courseName
      this.$refs.deleteCourseModal.show()
    },

    // Close delete confirmation modal for course
    closeDeleteCourseModal() {
      this.$refs.deleteCourseModal.hide()
    },

    // Confirm course deletion
    async confirmDeleteCourse() {
      if (!this.courseListIdForCourseDelete || !this.courseToDeleteId) return
      try {
        await Api.patch(`users/${token.getUserId()}/course-lists/${this.courseListIdForCourseDelete}`, {
          removeCourseId: this.courseToDeleteId
        })
        const courseList = this.courseLists.find((list) => list._id === this.courseListIdForCourseDelete)
        courseList.courses = courseList.courses.filter((course) => course._id !== this.courseToDeleteId)
        this.showAlert('Course deleted successfully', 'success')
        this.$refs.deleteCourseModal.hide() // Close the modal
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

/* Additional styling */
.course-list-item {
  margin-bottom: 10px;
  border-top: none !important;
  border-bottom: 1px solid #dee2e6;
  border-left: none !important;
  border-right: none !important;
}

h3.font-weight-bold {
  font-size: 1.75rem;
}

h6 {
  font-size: 1rem;
}

.course-list-group-item {
  cursor: pointer;
  transition: background-color 0.3s ease;

}

/* Add hover effect */
.course-list-group-item:hover {
  background-color: #f0f0f0;
}
</style>
