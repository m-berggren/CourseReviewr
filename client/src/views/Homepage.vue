<template>
  <div>
      <b-container fluid>

        <!-- Row for welcome text, search bar and tags -->
        <b-row class="top-row justify-content-center text-center">
          <b-col md="4" lg="4">
            <h1 class="mt-2">Welcome!</h1>
            <p>Find your perfect course or add your own course with review.</p>

            <div class="search-container">
              <!-- Typeahead input with Bootstrap width control -->
              <vue3-simple-typeahead
                v-model="searchQuery"
                :items="courses"
                :minInputLength="1"
                placeholder="Search for a course..."
                input-class="form-control simple-typeahead-input"
                @selectItem="selectCourse"
                :itemProjection="(item) => item.name"
              ></vue3-simple-typeahead>
                <b-button variant="dark" class="search-button" @click="handleSearch" :disabled="!selectedCourse">Search</b-button>
            </div>

          </b-col>
        </b-row>

        <!-- Row for tags inside a container -->
        <b-row class="top-row mb-4 justify-content-center text-center">
          <b-col md="4">
            <div class="tags-container p-3 mt-2 mb-4">
              <b-badge v-for="topic in topics" :key="topic._id" variant="dark" class="tag-badge mx-1" @click="handleTopicClick(topic)">
                {{ topic.name }}
              </b-badge>
            </div>
          </b-col>
        </b-row>

        <!-- Rows for course header and courses (4x3 layout) -->
         <b-row class="justify-content-center text-center">
          <b-col md="8">
            <h2 class="">Recommended courses</h2>
          </b-col>
         </b-row>

        <b-row class="justify-content-center">
          <b-col md="3" v-for="course in courses" :key="course._id">
            <course-item v-bind:course="course"></course-item>
          </b-col>
        </b-row>

        <!-- Rows for review header and reviews (4x3 layout)-->
         <b-row class="justify-content-center text-center">
          <b-col md="8">
            <h2 class="mt-1">Latest reviews</h2>
          </b-col>
         </b-row>

        <b-row class="justify-content-center">
          <b-col md="3" v-for="review in reviews" :key="review._id">
            <review-item v-bind:review="review"></review-item>
          </b-col>
        </b-row>
      </b-container>
  </div>

</template>

<script setup>
import { ref, onMounted } from 'vue'
import CourseItem from '../components/CourseItem.vue'
import ReviewItem from '../components/ReviewItem.vue'
import { Api } from '@/Api'
import { useRouter } from 'vue-router'

// Setup the router
const router = useRouter()

// Reactive cariables
const courses = ref([])
const topics = ref([])
const reviews = ref([])
const searchQuery = ref('')
const selectedCourse = ref(null)

// Fetch data on mount
onMounted(() => {
  fetchTopics()
  fetchCourses()
  fetchReviews()
})

/* Methods */

// Fetch topics
const fetchTopics = async () => {
  try {
    const response = await Api.get('/topics')
    topics.value = response.data.topics
  } catch (error) {
    topics.value = []
    console.error(error)
  }
}

// Fetch courses
const fetchCourses = async () => {
  try {
    const response = await Api.get('/courses')
    courses.value = response.data.courses
  } catch (error) {
    courses.value = []
    console.error(error)
  }
}

// Fetch reviews
const fetchReviews = async () => {
  try {
    const response = await Api.get('/reviews')
    reviews.value = response.data.reviews
  } catch (error) {
    reviews.value = []
    console.error(error)
  }
}

// Select course from the typeahead dropdown
const selectCourse = (course) => {
  selectedCourse.value = course
  searchQuery.value = course.name
  console.log('Selected course:', course)
}

// Handle search button click
const handleSearch = () => {
  if (selectedCourse.value) {
    router.push(`/courses/${selectedCourse.value._id}`)
  }
}

const handleTopicClick = (topic) => {
  console.log(`Clicked on topic: ${topic.name} with ID: ${topic._id}`)
}
</script>

<style>
.tags-container {
  background-color: lightgrey;
  border-radius: 1vw;
}

.top-row {
  background-color: cornflowerblue;
}

.tag-badge {
  background-color: darkslategray !important;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.3s ease;
}

.tag-badge:hover {
  background-color: #007bff !important; /* Change background on hover */
  transform: scale(1.03); /* Slightly enlarge the badge */
}

.search-container {
  display: flex;
  align-items: stretch;
}

.simple-typeahead-input {
  flex-grow: 1;
  width: 100%;
  height: 40px;
  border-radius: 7px 0 0 7px !important;
  border-right: none !important;
  border-color: cornflowerblue;
}

.search-button {
  height: 40px;
  border-radius: 0 7px 7px 0 !important;
}

.search-button:hover {
  height: 40px;
  border-radius: 0 7px 7px 0 !important;
}

@media (max-width: 768px) {
  .search-container {
    flex-direction: column;
  }
  .simple-typeahead-input,
  .search-button {
    width: 100%;
    border-radius: 7px !important;
    margin-bottom: 10px;
  }
}
</style>
