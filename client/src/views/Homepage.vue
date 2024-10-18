<template>
  <div>
      <b-container fluid>

        <!-- Row for welcome text, search bar and tags -->
        <b-row class="top-row justify-content-center text-center">
          <b-col md="8" lg="6" xl="4">
            <h1 class="mt-2">Welcome!</h1>
            <p class="ms-3">Find your perfect course or add your own course with review.</p>

            <div class="search-container mx-3">
              <!-- Typeahead with third party library -->
              <vue3-simple-typeahead
                v-model="searchQuery"
                :items="courses"
                :minInputLength="1"
                placeholder="Search for a course..."
                input-class="form-control simple-typeahead-input"
                @selectItem="selectCourse"
                :itemProjection="(item) => item.name"
              ></vue3-simple-typeahead>
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
              :per-page="courseLimit"
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
              v-for="review in displayedReviews"
              :key="review._id">
            <review-item v-bind:review="review"></review-item>
          </b-col>
        </b-row>

        <!-- Pagination controls for reviews -->
        <b-row class="justify-content-center">
          <b-col cols="auto">
            <PaginationItem
              v-model="currentReviewPage"
              :total-rows="totalReviews"
              :per-page="reviewLimit"
              @pageChange="handleReviewPageChange"
            ></PaginationItem>
          </b-col>
        </b-row>
      </b-container>
  </div>

</template>

<script>
import CourseItem from '@/components/HomepageCardCourse.vue'
import ReviewItem from '@/components/HomepageCardReview.vue'
import PaginationItem from '@/components/BasePaginationItem.vue'
import { Api } from '@/Api'

export default {
  name: 'HomeView',
  components: {
    CourseItem,
    ReviewItem,
    PaginationItem
  },
  data() {
    return {
      courses: [],
      reviews: [],
      topics: [],
      searchQuery: '',
      selectedCourse: null,
      selectedTopic: '',
      currentCoursePage: 1,
      currentReviewPage: 1,
      courseLimit: 12,
      reviewLimit: 8,
      topicLimit: 10,
      topicSortBy: 'courseCount'
    }
  },
  computed: {
    // Adjust how many course cards are being shown based on window size
    itemsPerRow() {
      if (window.innerWidth >= 1200) return { course: 6, review: 4 } // xl
      if (window.innerWidth >= 992) return { course: 4, review: 3 } // lg
      if (window.innerWidth >= 768) return { course: 3, review: 2 } // md
      if (window.innerWidth >= 576) return { course: 2, review: 2 } // sm
      return { course: 1, review: 1 } // xs
    },
    displayedCourses() {
      const start = (this.currentCoursePage - 1) * this.courseLimit
      const end = Math.min(start + this.courseLimit, this.courses.length)
      return this.courses.slice(start, end)
    },
    displayedReviews() {
      const start = (this.currentReviewPage - 1) * this.reviewLimit
      const end = Math.min(start + this.reviewLimit, this.reviews.length)
      return this.reviews.slice(start, end)
    },
    totalCoursePages() {
      return Math.ceil(this.courses.length / this.courseLimit)
    },
    totalReviewPages() {
      return Math.ceil(this.reviews.length / this.reviewLimit)
    },
    totalCourses() {
      return this.courses.length
    },
    totalReviews() {
      return this.reviews.length
    }
  },
  methods: {
    async fetchTopics() {
      try {
        const response = await Api.get(`/topics?sortBy=${this.topicSortBy}&limit=${this.topicLimit}`)
        this.topics = response.data.topics
      } catch (error) {
        console.error(error)
      }
    },
    handleCoursePageChange(page) {
      this.currentCoursePage = page
      this.fetchCourses()
    },
    handleReviewPageChange(page) {
      this.currentReviewPage = page
      this.fetchReviews()
    },
    async fetchCourses() {
      try {
        let url = `/courses?page=${this.currentCoursePage}`
        if (this.selectedTopic) {
          url += `&topic=${this.selectedTopic}` // Set page to 1 to properly show the topics if current page is another page
        }
        const response = await Api.get(url)
        this.courses = response.data.courses
      } catch (error) {
        console.error(error)
      }
    },
    async fetchReviews() {
      try {
        const url = `/reviews?page=${this.reviews.currentReviewPage}`
        const response = await Api.get(url)
        this.reviews = response.data.reviews
      } catch (error) {
        console.error(error)
      }
    },
    selectCourse(course) {
      this.selectedCourse = course
      this.searchQuery = course.name
      this.$router.push(`/courses/${this.selectedCourse._id}`)
    },
    handleTopicClick(topic) {
      if (this.selectedTopic === topic._id.toString()) { // Enables deselecting topics to show all courses again
        this.selectedTopic = ''
      } else {
        this.selectedTopic = topic._id.toString()
      }
      this.currentCoursePage = 1 // Reset to first page when topic changes
      this.fetchCourses()
    }
  },
  watch: {
    selectedTopic() {
      this.fetchCourses()
    },
    coursesPerPage() {
      this.currentCoursePage = Math.min(this.currentCoursePage, this.totalCoursePages)
    },
    reviewsPerPage() {
      this.currentReviewPage = Math.min(this.currentReviewPage, this.totalReviewPages)
    }
  },
  mounted() {
    this.fetchTopics()
    this.fetchCourses()
    this.fetchReviews()
  }
}
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
  border-radius: 7px !important;
  border-right: none !important;
  border-color: cornflowerblue;
}
.mb-4 {
  margin-bottom: 1.5rem !important;
}
</style>
