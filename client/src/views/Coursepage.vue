<template>
  <div class="course-details-wrapper">
    <div class="course-info-container">
        <b-container fluid>
            <!-- Loading and Error Handling -->
            <div v-if="loading" class="text-center">
                <b-spinner label="Loading..."></b-spinner>
                <p>Loading ...</p>
            </div>

            <div v-else-if="errorMessage" class="alert alert-danger">
                {{ errorMessage }}
            </div>

            <!-- Row for course name, rating and tags -->
             <b-row>
                <!-- Column for course name, rating and tags -->
                <b-col md="3">
                    <h1>{{ course.name }}</h1>
                    <div class="rating-container">
                        <star-rating
                          :rating="course.averageRating"
                          :read-only="true"
                          star-size="40">
                        </star-rating>
                        <div class="tags-container mt-2">
                            <b-badge v-for="topic in topics" :key="topic._id" variant="dark" class="tag-badge mx-1">
                                {{ topic.name }}
                            </b-badge>
                        </div>
                    </div>
                </b-col>

                <b-col></b-col>

                <!-- Column for course photo and 'Write a review' button -->
                 <b-col md="4">
                    <div class="image-placeholder">
                        <img :src="course.photo || 'client\src\assets\placeholder.png'" alt="Course Photo" class="img-fluid" />
                    </div>
                    <div class="review-button mt-3">
                        <b-button variant="secondary">Write a review</b-button>
                    </div>
                 </b-col>
             </b-row>

            <!-- Row for course description -->
             <b-row>
                <b-col md="6">
                    <p>{{ course.description }}</p>
                </b-col>
             </b-row>

            <!-- Row for course detailed rating -->
             <b-row>
                <b-col md="4">
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
                </b-col>
            </b-row>

            <!-- Row for course info -->
             <b-row>
                <b-col md="3">
                    <div class="course-info">
                        <p>Release Year: {{ course.releaseYear }}</p>
                        <p>Provider: {{ course.provider }}</p>
                        <p>Instructor: {{ course.instructor }}</p>
                        <p>Certificate: {{ course.certificate }}</p>
                    </div>
                </b-col>
             </b-row>
        </b-container>
    </div>

    <!-- Reviews List -->
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
  </div>
</template>

<script>
import StarRating from 'vue-star-rating'
import { Api } from '@/Api'

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
      errorMessage: ''
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
  background-color: darkslategray !important;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.3s ease;
}

.tag-badge:hover {
  background-color: #007bff !important; /* Change background on hover */
  transform: scale(1.03); /* Slightly enlarge the badge */
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
  background-color: #f8f8f8;
  color: black;
  font-size: 2rem;
  padding: 0.7rem 1.5rem;
  border-radius: 1vw;
}

p {
  font-size: 1.2rem;
  line-height: 1.6;
  color: gray;
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
</style>
