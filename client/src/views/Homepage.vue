<template>
  <div>
      <b-container fluid>

        <!-- Row for welcome text, search bar and tags -->
        <b-row class="top-row justify-content-center text-center">
          <b-col md="8" lg="6" xl="4">
            <h1 class="mt-2">Welcome!</h1>
            <p class="ms-3">Find your perfect course or add your own course with review.</p>

            <div class="search-container mx-3">
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
          <b-col md="8" lg="6" xl="4">
            <div class="tags-container p-3 mt-2 mb-4 mx-3">
              <b-badge
                v-for="topic in topics"
                :key="topic._id"
                variant="dark"
                class="tag-badge mx-1"
                :class="{ 'selected-tag': selectedTopic === topic._id.toString() }"
                @click="handleTopicClick(topic)"
              >
                {{ topic.name }}
              </b-badge>
            </div>
          </b-col>
        </b-row>

        <!-- Rows for course header and courses (4x2 layout) -->
         <b-row class="justify-content-center text-center">
          <b-col md="8">
            <h2 class="">Recommended courses</h2>
          </b-col>
         </b-row>

        <!-- Adjusts amount course cards depending on screen size. Gutter size 'g-' to adjust the margin between objects-->
        <b-row class="justify-content-center g-2 ms-4 me-2">
          <b-col xl="2" lg="3" md="4" sm="6" xs="12" v-for="course in displayedCourses" :key="course._id" class="mb-4">
            <course-item v-bind:course="course"></course-item>
          </b-col>
        </b-row>

        <!-- Pagination controls -->
        <b-row class="justify-content-center">
          <b-col cols="auto">
            <PaginationItem
              v-model="currentCoursePage"
              :total-rows="totalCourses"
              :per-page="coursesPerPage"
              @pageChange="handleCoursePageChange"
            ></PaginationItem>
          </b-col>
        </b-row>

        <hr />

        <!-- Rows for review header and reviews (4x2 layout) -->
         <b-row class="justify-content-center text-center g-2">
          <b-col md="8">
            <h2 class="mt-1">Latest reviews</h2>
          </b-col>
         </b-row>

        <!-- Gutter size 'g-' to adjust the margin between objects -->
        <b-row class="justify-content-center g-2 mx-3">
          <b-col xl="3" lg="4" md="6" sm="6" xs="12"
              v-for="review in (reviews.reviews || [])"
              :key="review._id">
            <review-item v-bind:review="review"></review-item>
          </b-col>
        </b-row>

        <!-- Pagination controls for reviews -->
        <b-row class="justify-content-center">
          <b-col cols="auto">
            <PaginationItem
              v-model="reviews.currentPage"
              :total-rows="reviews.totalReviews"
              :per-page="reviews.limit"
              @pageChange="fetchReviews"
            ></PaginationItem>
          </b-col>
        </b-row>
      </b-container>
  </div>

</template>

<script setup>
import { ref, onMounted, onUnmounted, watch, computed } from 'vue'
import CourseItem from '@/components/CourseItem.vue'
import ReviewItem from '@/components/ReviewItem.vue'
import PaginationItem from '@/components/PaginationItem.vue'
import { Api } from '@/Api'
import { useRouter } from 'vue-router'

// Setup the router
const router = useRouter()

// Reactive variables
const courses = ref([])
const topics = ref([])
const searchQuery = ref('')
const selectedCourse = ref(null)
const selectedTopic = ref('')

const currentCoursePage = ref(1)
const allCourses = ref([])
const windowWidth = ref(window.innerWidth)

const topicLimit = 10
const topicSortBy = 'courseCount'

const reviews = ref({
  totalReviews: 0,
  totalPages: 0,
  currentPage: 1,
  limit: 8,
  hasPrevPage: false,
  hasNextPage: false,
  prevPage: null,
  nextPage: null,
  reviews: []
})

/**
 * onMounted & unMounted
 */

onMounted(() => {
  window.addEventListener('resize', handleResize)
  fetchTopics()
  fetchCourses()
  fetchReviews()
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})

/* General methods */

const itemsPerRow = computed(() => {
  if (windowWidth.value >= 1200) return { course: 6, review: 4 } // xl
  if (windowWidth.value >= 992) return { course: 4, review: 3 } // lg
  if (windowWidth.value >= 768) return { course: 3, review: 2 } // md
  if (windowWidth.value >= 576) return { course: 2, review: 2 } // sm
  return { course: 1, review: 1 } // xs
})

const handleResize = () => {
  windowWidth.value = window.innerWidth
  currentCoursePage.value = 1
}

const displayedCourses = computed(() => {
  const start = (currentCoursePage.value - 1) * coursesPerPage.value
  const end = Math.min(start + coursesPerPage.value, allCourses.value.length)
  return allCourses.value.slice(start, end)
})

const coursesPerPage = computed(() => itemsPerRow.value.course * 2)

const totalCoursePages = computed(() => Math.ceil(allCourses.value.length / coursesPerPage.value))

const totalCourses = computed(() => allCourses.value.length)

// Fetch topics
const fetchTopics = async () => {
  try {
    const response = await Api.get(`/topics?sortBy=${topicSortBy}&limit=${topicLimit}`)
    topics.value = response.data.topics
  } catch (error) {
    topics.value = []
    console.error(error)
  }
}

const handleCoursePageChange = (page) => {
  currentCoursePage.value = Math.min(page, totalCoursePages.value)
}

// Fetch courses
const fetchCourses = async () => {
  try {
    const pageLimit = coursesPerPage.value
    let url = `/courses?limit=${pageLimit}&page=${currentCoursePage.value}`

    if (selectedTopic.value) {
      url += `&topic=${selectedTopic.value}`
    }

    const response = await Api.get(url)

    allCourses.value = response.data.courses
    courses.value = response.data.courses
    currentCoursePage.value = Math.min(currentCoursePage.value, totalCoursePages.value)
  } catch (error) {
    allCourses.value = []
    courses.value = []
    console.error(error)
  }
}

// Fetch reviews
const fetchReviews = async () => {
  try {
    const url = `/reviews?page=${reviews.value.currentPage}&limit=${reviews.value.limit}`
    const response = await Api.get(url)
    reviews.value = response.data
  } catch (error) {
    console.error(error)
    reviews.value = {
      totalReviews: 0,
      totalPages: 0,
      currentPage: 1,
      limit: 8,
      hasPrevPage: 0,
      hasNextPage: 0,
      prevPage: null,
      nextPage: null,
      reviews: []
    }
  }
}

// Select course from the typeahead dropdown
const selectCourse = (course) => {
  selectedCourse.value = course
  searchQuery.value = course.name
}

// Handle search button click
const handleSearch = () => {
  if (selectedCourse.value) {
    router.push(`/courses/${selectedCourse.value._id}`)
  }
}

const handleTopicClick = (topic) => {
  if (selectedTopic.value === topic._id.toString()) {
    selectedTopic.value = ''
  } else {
    selectedTopic.value = topic._id.toString()
  }

  fetchCourses()
}

/**
 * Watch functions to observe and react to changes in reactive data
 */
watch(selectedTopic, () => {
  currentCoursePage.value = 1 // Reset to first page when topic changes
  fetchCourses()
})

watch(coursesPerPage, () => {
  currentCoursePage.value = Math.min(currentCoursePage.value, totalCoursePages.value)
})

watch(() => reviews.value.currentPage, fetchReviews)

</script>

<style>

.course-container {
  display: flex;
  flex-wrap: wrap;
}

.tags-container {
  background-color: whitesmoke;
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

/* Hover effect for tags */
.tag-badge:hover {
  background-color: #007bff !important;
}

/* Style for the selected tag */
.tag-badge.selected-tag {
  background-color: #007bff !important; /* Force selected color */
}

.search-container {
  display: flex;
  align-items: stretch;
}

/* Search bar styles */
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

.mb-4 {
  margin-bottom: 1.5rem !important;
}
</style>
