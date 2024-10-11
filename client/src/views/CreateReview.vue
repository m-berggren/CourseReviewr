<template>
  <div>
    <div class="review-form-container">
      <h2>Your opinion matters!</h2>
      <form @submit.prevent="submitReview" @reset="onReset">

        <!-- Rating List-->
        <div class="rating-section">
          <ul class="rating-list">
            <li>
              <label for="engagementLevel">Engagement Level</label>
              <star-rating
                v-model="engagementLevel"
                :star-size="40"
                :show-rating="true"
                :read-only="false">
              </star-rating>
            </li>

            <li>
              <label for="practicalValue">Practical Value</label>
              <star-rating
                v-model="practicalValue"
                :star-size="40"
                :show-rating="true"
                :read-only="false">
              </star-rating>
            </li>

            <li>
              <label for="instructorQuality">Instructor Quality</label>
              <star-rating
                v-model="instructorQuality"
                :star-size="40"
                :show-rating="true"
                :read-only="false">
              </star-rating>
            </li>

            <li>
              <label for="difficultyLevel">Difficulty Level</label>
              <star-rating
                v-model="difficultyLevel"
                :star-size="40"
                :show-rating="true"
                :read-only="false">
              </star-rating>
            </li>
          </ul>
        </div>

        <!-- Comment -->
        <div class="comment-section mt-4">
          <h3>Comment</h3>
          <textarea v-model="comment" class="form-control" rows="4" placeholder="Write your comments"></textarea>
        </div>

        <!-- Course Completion -->
        <div class="completion-section mt-4">
          <h3>Have you completed this course?</h3>
          <select v-model="hasCompleted" class="form-control">
            <option :value="true">Yes</option>
            <option :value="false">No</option>
          </select>
        </div>

        <!-- Submit and Cancel Buttons -->
        <div class="button-container">
          <b-button variant="primary" type="submit">Submit</b-button>
          <b-button variant="secondary" type="button" @click="goBack">Cancel</b-button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import StarRating from 'vue-star-rating'
import { Api } from '@/Api'
import { token } from '@/token'

export default {
  components: {
    'star-rating': StarRating
  },
  data() {
    return {
      user: {},
      engagementLevel: 0,
      practicalValue: 0,
      instructorQuality: 0,
      difficultyLevel: 0,
      comment: '',
      hasCompleted: null,
      formSubmitted: false
    }
  },
  methods: {
    async submitReview() {
      const courseID = this.$route.params.id

      try {
        const response = await Api.get(`/users/${token.getUserId()}`)
        this.user = { ...response.data }
        const userID = this.user._id

        if (!userID) {
          alert('You must be logged in to submit a review')
          return
        }

        if (
          this.engagementLevel < 1 ||
          this.practicalValue < 1 ||
          this.instructorQuality < 1 ||
          this.difficultyLevel < 1
        ) {
          alert('Rating cannot be empty')
          return
        }

        const reviewData = {
          engagementLevel: this.engagementLevel,
          practicalValue: this.practicalValue,
          instructorQuality: this.instructorQuality,
          difficultyLevel: this.difficultyLevel,
          comment: this.comment || '',
          hasCompleted: this.hasCompleted == null ? false : this.hasCompleted
        }

        await Api.post(`${userID}/courses/${courseID}/reviews/`, reviewData)
        alert('Your review has been submitted')
        this.$router.push(`/courses/${courseID}`)
      } catch (error) {
        console.log(error)
        alert('Submission Failed')
      }
    },

    onReset() {
      this.engagementLevel = 0
      this.practicalValue = 0
      this.instructorQuality = 0
      this.difficultyLevel = 0
      this.comment = ''
      this.hasCompleted = null
      this.formSubmitted = false
    },
    goBack() {
      this.$router.go(-1)
    }
  }
}
</script>

<style scoped>
.review-form-container {
  padding: 2rem;
  background-color: #f9f9f9;
}

h3 {
  margin-bottom: 0.7rem;
}

.rating-section ul {
  list-style-type: none;
  padding: 0;
}

.rating-section li {
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
}

.rating-section label {
  font-weight: 600;
  margin-right: 1rem;
}

textarea.form-control {
  width: 100%;
}

.button-container {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  margin-top: 2rem;
}
</style>
