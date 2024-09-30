<template>
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
                    <div class="review-button mt-4">
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
</template>

<script>
import StarRating from 'vue-star-rating'
import Api from '@/api'

export default {
  name: 'CourseDetails',
  components: {
    'star-rating': StarRating
  },
  data() {
    return {
      course: {},
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
    const courseId = this.$route.params.id

    try {
      const courseResponse = await Api.get(`/courses/${courseId}`)
      this.course = courseResponse.data.course
      this.loading = false
    } catch (error) {
      this.errorMessage = 'Failed to load course details. Please try again later.'
      this.loading = false
      console.log(error)
    }

    try {
      const ratingsResponse = await Api.get(`/courses/${courseId}/ratings`)
      this.aggregatedRatings = ratingsResponse.data
      this.loading = false
    } catch (error) {
      this.errorMessage = 'Failed to load course ratings. Please try again later.'
      this.loading = false
      console.log(error)
    }
  }
}
</script>
