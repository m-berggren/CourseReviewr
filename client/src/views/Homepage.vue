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
      topics: [],
      searchQuery: '',
      selectedCourse: null,
      selectedTopic: '',
      currentCoursePage: 1,
      allCourses: [],
      topicLimit: 10,
      topicSortBy: 'courseCount',
      reviews: {
        totalReviews: 0,
        totalPages: 0,
        currentPage: 1,
        limit: 8,
        hasPrevPage: false,
        hasNextPage: false,
        prevPage: null,
        nextPage: null,
        reviews: []
      }
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
      const start = (this.currentCoursePage - 1) * this.coursesPerPage
      const end = Math.min(start + this.coursesPerPage, this.allCourses.length)
      return this.allCourses.slice(start, end)
    },
    coursesPerPage() {
      return this.itemsPerRow.course * 2
    },
    totalCoursePages() {
      return Math.ceil(this.allCourses.length / this.coursesPerPage)
    },
    totalCourses() {
      return this.allCourses.length
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
      this.currentCoursePage = Math.min(page, this.totalCoursePages)
    },
    async fetchCourses() {
      try {
        let url = `/courses?page=${this.currentCoursePage}`
        if (this.selectedTopic) {
          url += `/courses?page=${this.currentCoursePage}&topic=${this.selectedTopic}` // Set page to 1 to properly show the topics if current page is another page
        }
        const response = await Api.get(url)
        this.allCourses = response.data.courses
        this.courses = response.data.courses
        this.currentCoursePage = Math.min(this.currentCoursePage, this.totalCoursePages)
      } catch (error) {
        console.error(error)
      }
    },
    async fetchReviews() {
      try {
        const url = `/reviews?page=${this.reviews.currentPage}&limit=${this.reviews.limit}`
        const response = await Api.get(url)
        this.reviews = response.data
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
