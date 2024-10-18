<template>
  <div>
    <b-card class="review-card">
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
        <b-col md="8">
          <b-card class="review-description">
            <p>{{ review.comment }}</p>
          </b-card>
        </b-col>
        <b-col md="4">
          <b-button v-if="userReview === userToken" v-b-modal="'modal-edit-review-' + review._id"
            class="ms-4 mt-3 edit-button">Edit
            review</b-button>
          <ul class="review-rating-list mt-3">
            <li><b style="font-weight: 900;">Overall Rating:</b> {{ (Math.round(review.averageRating * 2) /
              2).toFixed(1) }}/5</li>
            <li><b>Engagement Level:</b> {{ review.engagementLevel }}/5</li>
            <li><b>Practical Value:</b> {{ review.practicalValue }}/5</li>
            <li><b>Instructor Quality:</b> {{ review.instructorQuality }}/5</li>
            <li><b>Difficulty Level:</b> {{ review.difficultyLevel }}/5</li>
          </ul>
        </b-col>
      </b-row>
      <!-- Modal component -->
      <!-- Pass a reference to ReviewForm to access its methods -->
      <b-modal :id="'modal-edit-review-' + review._id" title="Edit Review" @ok="handleSaveChanges">
        <ReviewForm ref="reviewFormRef" :review="review" @review-updated="emitUpdatedEvent" />
      </b-modal>

    </b-card>
  </div>
</template>

<script setup>
import { ref, defineEmits } from 'vue'
import ReviewForm from './ReviewForm.vue'
import { token } from '@/token.js'

const props = defineProps({
  review: Object
})
const emit = defineEmits(['review-updated'])
const editReviewModal = ref(null)
const reviewFormRef = ref(null)

const emitUpdatedEvent = () => {
  emit('review-updated')
}

const userToken = token.getUserId()
const userReview = props.review.user._id || props.review.user

const handleSaveChanges = async () => {
  const reviewForm = reviewFormRef.value
  if (reviewForm) {
    await reviewForm.handleSubmit()
      .then(() => {
        if (editReviewModal.value) {
          editReviewModal.value.hide()
        }
        emitUpdatedEvent()
      })
      .catch((error) => {
        console.error(error)
      })
  }
}

</script>

<style scoped>
.review-card {
  background-color: #f8f8f8;
  padding: 1.5rem;
  border-radius: 1.5rem;
}

.review-card p {
  font-size: 1.1rem;
  color: black;
}

.review-card .review-rating-list {
  list-style: none;
}

.review-card .review-rating-list li {
  margin-bottom: 0.5rem;
  font-size: 1rem;
}

.edit-button:hover {
  background-color: #007bff !important;
}
</style>
