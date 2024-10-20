<template>

  <b-container fluid>
    <b-row class="top-row">
      <b-col>
        <h1 class="mt-3 ms-3">{{ course.name }}</h1>
      </b-col>
    </b-row>

    <!-- Row for course name, rating and tags -->
    <b-row class="justify-content-center">
      <!-- Column for course name, rating and tags -->
      <b-col md="6" class="order-last order-md-first">
        <b-card class="card-box card-description my-4">
          <p class="mt-3">{{ course.description }}</p>
        </b-card>
      </b-col>

      <!-- Column for course photo and 'Write a review' button -->
      <b-col md="4" class="order-first order-md-last">
        <div class="image-placeholder mt-4">
          <s3-image-display :imageObject="course" type="course" class="image-container" />
        </div>
        <div class="review-button mt-2">
          <b-button class="btn-sm" @click="goToWriteReview">Write a review</b-button>
        </div>
      </b-col>
    </b-row>

    <b-row class="my-5 ms-2 justify-content-center">
      <b-col xl="4" md="5" sm="8" class="my-2">
        <h2>Rating</h2>
        <star-rating :rating="aggregatedRatings.averageRating" :read-only="true" :star-size="40" />
      </b-col>
      <b-col xl="4" md="4" sm="8">
        <div class="tags-container mt-">
          <span v-for="topic in course.topics" :key="topic._id" class="tag-bubble">
            {{ topic.name }}
          </span>
        </div>
      </b-col>
    </b-row>

    <!-- Row for course detailed rating -->
    <b-row class="justify-content-center">
      <b-col md="4" class="my-3">
        <b-card class="card-box">
          <h3>Detailed Rating</h3>
          <ul class="detailed-rating-list">

            <li><b>Engagement Level:</b>
              <star-rating class="mb-1" :rating="aggregatedRatings.averageEngagementLevel" :read-only="true"
                :star-size="30">
              </star-rating>
            </li>
            <li><b>Practical Value:</b>
              <star-rating class="mb-1" :rating="aggregatedRatings.averagePracticalValue" :read-only="true"
                :star-size="30">
              </star-rating>
            </li>
            <li><b>Instructor Quality:</b>
              <star-rating class="mb-1" :rating="aggregatedRatings.averageInstructorQuality" :read-only="true"
                :star-size="30">
              </star-rating>
            </li>
            <li><b>Difficulty Level:</b>
              <star-rating class="mb-1" :rating="aggregatedRatings.averageDifficultyLevel" :read-only="true"
                :star-size="30">
              </star-rating>
            </li>
          </ul>
        </b-card>
      </b-col>

          <b-col md="4" class="my-3">
            <b-card class="card-box">
              <p><strong>Provider: </strong>{{ course.provider }}</p>
              <p><strong>Difficulty: </strong>{{ course.difficulty }}</p>
              <p><strong>Instructor: </strong>{{ course.instructor }}</p>
              <p><strong>Release Year:</strong> {{ course.releaseYear }}</p>
              <p><strong>Access Type: </strong>{{ course.accessType }}</p>
              <p><strong>Certificate: </strong>{{ course.certificate }}</p>
              <p><strong>Course page: </strong><a :href="course.url" target="_blank">{{ course.url }}</a></p>
            </b-card>
          </b-col>
      </b-row>

    <!-- Row for course review -->
    <b-row>
      <b-col>
        <div class="reviews-container">
          <h3 class="review-header">Reviews</h3>
          <div v-if="!reviews.length" class="alert alert-info mt-3">
            No reviews yet
          </div>

          <div v-else>
            <b-col v-for="review in reviews" :key="review._id">
              <review-entry v-bind:review="review" :id="'review-' + review._id" class="mb-3"
                @review-updated="handleReviewUpdated" />
            </b-col>
          </div>
        </div>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import StarRating from 'vue-star-rating'
import { Api } from '@/Api'
import { token } from '@/token'
import ReviewEntry from '@/components/ReviewEntry.vue'
import S3ImageDisplay from '@/components/BaseS3ImageDisplay.vue'

export default {
  name: 'CourseDetails',
  components: {
    'star-rating': StarRating,
    'review-entry': ReviewEntry,
    's3-image-display': S3ImageDisplay
  },
  data() {
    return {
      course: {},
      reviews: [],
      aggregatedRatings: {
        averageEngagementLevel: 0,
        averagePracticalValue: 0,
        averageInstructorQuality: 0,
        averageDifficultyLevel: 0
      },
      loading: true,
      errorMessage: '',
      isSignedIn: token.isSignedIn(),
      reviewEdit: false
    }
  },
  methods: {
    goToWriteReview() {
      const courseID = this.$route.params.id
      this.$router.push(`/courses/${courseID}/write`)
    },
    async handleReviewUpdated() {
      this.reviewEdit = true
      await this.fetchData()
    },
    async fetchData() {
      this.loading = true
      const courseID = this.$route.params.id
      const reviewID = this.$route.query.reviewID

      try {
        const courseResponse = await Api.get(`/courses/${courseID}`)
        this.course = courseResponse.data.course
        this.loading = false
      } catch (error) {
        this.errorMessage = 'Failed to load course details. Please try again later.'
        this.loading = false
        console.log(error)
      }

      try {
        const ratingsResponse = await Api.get(`/courses/${courseID}/ratings`)
        this.aggregatedRatings = ratingsResponse.data
        this.loading = false
      } catch (error) {
        this.errorMessage = 'Failed to load course ratings. Please try again later.'
        this.loading = false
        console.log(error)
      }

      try {
        const reviewResponse = await Api.get(`/courses/${courseID}/reviews`)
        this.reviews = reviewResponse.data.reviews
        this.loading = false
      } catch (error) {
        this.errorMessage = 'Failed to load course reviews. Please try again later.'
        this.loading = false
        console.log(error)
      }

      this.$nextTick(() => {
        if (this.reviewEdit) return // Early return to not scroll to the top if editing a review

        if (reviewID) {
          const reviewElement = document.getElementById(`review-${reviewID}`)
          if (reviewElement) {
            reviewElement.scrollIntoView({ behavior: 'smooth', block: 'center' })
          }
        } else {
          window.scrollTo({ top: '0', behavior: 'smooth' })
        }
      })
    }
  },
  mounted() {
    this.fetchData()
  }
}
</script>

<style scoped>
.card-description {
  height: 300px;
}

.top-row {
  background-color: cornflowerblue;
}

.course-info-container {
  padding: 2rem;
  background-color: white;
  border-radius: 1vw;
}

.review-description {
  background-color: f8f8f8;
  margin-bottom: 3vw;
}

.tag-bubble {
  background-color: #e0e0e0;
  color: #333;
  padding: 0.4rem 0.8rem;
  border-radius: 999px;
  font-size: 0.9rem;
  display: inline-block;
  margin: 0.2rem;
  font-weight: normal;
  text-transform: none;
  text-decoration: none;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  transition: background-color 0.2s ease;
}

.tags-container {
  border-radius: 1vw;
  display: flex;
  flex-wrap: wrap;
  background-color: transparent;
}

.image-placeholder img {
  width: 100%;
  height: auto;
  max-width: 280px;
}

.review-button {
  text-align: center;
  margin-top: 2rem;
}

.review-button .btn {
  background-color: cornflowerblue;
  color: black;
  font-size: 1rem;
  padding: 0.7rem 1.5rem;
  border-radius: 1vw;
}

.review-button .btn:hover {
  background-color: #007bff !important;
  border-color: #007bff !important;
  text-align: center;
}

.detailed-rating-list {
  list-style: none;
}

.reviews-container {
  padding: 1rem;
  border-radius: 1rem;
}

.review-header {
  font-size: 1.8rem;
  font-weight: bold;
  margin-bottom: 1rem;
  text-align: center;
}

.card-box {
  background-color: #f8f8f8;
}
</style>
