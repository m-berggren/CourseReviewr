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
              <s3-image-display :s3Key="course.photo" class="image-container"/>
          </div>
          <div class="review-button mt-4">
              <b-button v-if="isSignedIn" variant="dark" @click="goToWriteReview">Write a review</b-button>
          </div>
        </b-col>

      </b-row>

      <b-row class="my-5 ms-2 justify-content-center">
        <b-col md="6">
          <h2>Rating</h2>
          <star-rating :rating="aggregatedRatings.averageRating" :read-only="true" star-size="40"/>
        </b-col>
        <b-col md="4">
          <div class="tags-container mt-2">
              <b-badge v-for="topic in course.topics" :key="topic._id" variant="dark" class="tag-badge ms-2 my-2 p-2">
                  {{ topic.name }}
              </b-badge>
          </div>
        </b-col>
      </b-row>

      <!-- Row for course detailed rating -->
        <b-row class="justify-content-center">
          <b-col md="6">
            <b-card class="card-box">
              <h3>Detailed Rating</h3>
              <ul class="detailed-rating-list">

                  <li>Engagement Level:
                      <star-rating
                      :rating="aggregatedRatings.averageEngagementLevel"
                      :read-only="true"
                      :star-size="30">
                  </star-rating>
                  </li>
                  <li>Practical Value:
                      <star-rating
                      :rating="aggregatedRatings.averagePracticalValue"
                      :read-only="true"
                      :star-size="30">
                  </star-rating>
                  </li>
                  <li>Instructor Quality:
                      <star-rating
                      :rating="aggregatedRatings.averageInstructorQuality"
                      :read-only="true"
                      :star-size="30">
                  </star-rating>
                  </li>
                  <li>Difficulty Level:
                      <star-rating
                      :rating="aggregatedRatings.averageDifficultyLevel"
                      :read-only="true"
                      :star-size="30">
                  </star-rating>
                  </li>
              </ul>
          </b-card>
          </b-col>

          <b-col md="4">
            <b-card class="card-box">
                  <p><strong>Release Year:</strong> {{ course.releaseYear }}</p>
                  <p><strong>Provider: </strong>{{ course.provider }}</p>
                  <p><strong>Instructor: </strong>{{ course.instructor }}</p>
                  <p><strong>Certificate: </strong>{{ course.certificate }}</p>
                  <p><strong>Access Type: </strong>{{ course.accessType }}</p>
            </b-card>
          </b-col>
      </b-row>

      <!-- Row for course info -->
        <b-row>
        <b-col>
          <div class="reviews-container">
            <h3>Reviews</h3>
            <div v-if="!reviews.length" class="alert alert-info mt-3">
              No reviews yet
            </div>

            <div v-else>
              <b-card v-for="review in reviews" :key="review._id" class="reviews-cards mb-3">
                <b-row>
                  <b-col md="10">
                    <p><b>{{ review.user.username }}</b></p>
                    <p>Reviewed on {{ new Date(review.date).toLocaleDateString() }}</p>
                    <div>
                      <b-badge v-if="review.hasCompleted" variant="success">Completed the course</b-badge>
                      <b-badge v-else variant="secondary">Not completed</b-badge>
                    </div>
                  </b-col>
                </b-row>

                <b-row class="mt-2">
                  <b-col md="6">
                    <p>{{ review.comment }}</p>
                  </b-col>
                  <b-col></b-col>
                  <b-col md="4">
                    <ul class="review-rating-list">
                      <li>Engagement Level: {{ review.engagementLevel }}/5</li>
                      <li>Practical Value: {{ review.practicalValue }}/5</li>
                      <li>Instructor Quality: {{ review.instructorQuality }}/5</li>
                      <li>Difficulty Level: {{ review.difficultyLevel }}/5</li>
                    </ul>
                  </b-col>
                </b-row>
              </b-card>
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

export default {
  name: 'CourseDetails',
  components: {
    'star-rating': StarRating
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
      isSignedIn: token.isSignedIn()
    }
  },
  methods: {
    goToWriteReview() {
      const courseID = this.$route.params.id
      this.$router.push(`/courses/${courseID}/write`)
    }
  },
  async mounted() {
    const courseID = this.$route.params.id

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

  h1 {
    font-weight: bold;
    margin-bottom: 1rem;
  }

  .tags-container {
    background-color: lightgrey;
    border-radius: 1vw;
  }
  .tag-badge {
    cursor: pointer;
    transition: background-color 0.3s ease, transform 0.3s ease;
  }

  .tag-badge:hover {
    background-color: #007bff !important; /* Change background on hover */
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
    font-size: 2rem;
    padding: 0.7rem 1.5rem;
    border-radius: 1vw;
  }

  .review-button .btn:hover {
    background-color: #007bff !important;
  }

  p {
    font-size: 1.2rem;
    line-height: 1.6;
    color: black;
    margin-bottom: 1.5rem;
  }

  .detailed-rating-list {
    list-style: none;
  }

  .reviews-container {
    background-color: #f9f9f9;
    padding: 2rem;
    border-radius: 1rem;
  }

  h3 {
    font-size: 1.8rem;
    font-weight: bold;
    margin-bottom: 1rem;
    text-align: center;
  }

  .reviews-cards {
    background-color: #f8f8f8;
    padding: 1.5rem;
    border-radius: 1.5rem;
  }

  .reviews-cards p {
    font-size: 1.1rem;
    color: black;
  }

  .reviews-cards .review-rating-list {
    list-style: none;
  }

  .reviews-cards .review-rating-list li {
    margin-bottom: 0.5rem;
    font-size: 1rem;
  }

  .card-box {
    background-color: #f8f8f8;
  }
  </style>
