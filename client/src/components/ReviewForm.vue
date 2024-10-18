<template>
  <div>
    <form ref="form" @submit.stop.prevent="handleSubmit">
      <label for="engagementLevel">Engagement Level</label>
      <star-rating :rating="engagementLevel" @update:rating="setEngagementLevel" :star-size="40" :show-rating="true"
        :read-only="false"></star-rating>

      <label for="practicalValue">Practical Value</label>
      <star-rating :rating="practicalValue" @update:rating="setPracticalValue" :star-size="40" :show-rating="true"
        :read-only="false">
      </star-rating>

      <label for="instructorQuality">Instructor Quality</label>
      <star-rating :rating="instructorQuality" @update:rating="setInstructorQuality" :star-size="40" :show-rating="true"
        :read-only="false">
      </star-rating>

      <label for="difficultyLevel">Difficulty Level</label>
      <star-rating :rating="difficultyLevel" @update:rating="setDifficultyLevel" :star-size="40" :show-rating="true"
        :read-only="false">
      </star-rating>

      <b-form-group label="Comment" label-for="comment-input" invalid-feedback="Name is required">
        <b-form-input id="comment-input" v-model="comment" required></b-form-input>
      </b-form-group>

      <!-- Course Completion -->
      <div class="completion-section mt-4">
        <p>Have you completed this course?</p>
        <select v-model="hasCompleted" class="form-control">
          <option :value="true">Yes</option>
          <option :value="false">No</option>
        </select>
      </div>

    </form>
  </div>
</template>

<script setup>
import { onMounted, ref, watch } from 'vue'
import { Api } from '@/Api'

const props = defineProps({
  review: Object
})

const emit = defineEmits(['review-updated'])

const engagementLevel = ref(0)
const difficultyLevel = ref(0)
const instructorQuality = ref(0)
const practicalValue = ref(0)
const comment = ref('')
const hasCompleted = ref(0)

watch(
  () => props.review,
  (newReview) => {
    if (newReview) {
      engagementLevel.value = newReview.engagementLevel || 0
      difficultyLevel.value = newReview.difficultyLevel || 0
      instructorQuality.value = newReview.instructorQuality || 0
      practicalValue.value = newReview.practicalValue || 0
      comment.value = newReview.comment || ''
      hasCompleted.value = newReview.hasCompleted || false
    }
  },
  { immediate: true }
)

onMounted(() => {
  getEngagementLevel()
  getDifficultyLevel()
  getInstructorQuality()
  getPracticalValue()
  getComment()
  getHasCompleted()
})

const setEngagementLevel = (newRating) => {
  engagementLevel.value = newRating
}
const getEngagementLevel = () => {
  engagementLevel.value = props.review.engagementLevel
}
const setDifficultyLevel = (newRating) => {
  difficultyLevel.value = newRating
}
const getDifficultyLevel = () => {
  difficultyLevel.value = props.review.difficultyLevel
}
const setInstructorQuality = (newRating) => {
  instructorQuality.value = newRating
}
const getInstructorQuality = () => {
  instructorQuality.value = props.review.instructorQuality
}
const setPracticalValue = (newRating) => {
  practicalValue.value = newRating
}
const getPracticalValue = () => {
  practicalValue.value = props.review.practicalValue
}
const getComment = () => {
  comment.value = props.review.comment
}
const getHasCompleted = () => {
  hasCompleted.value = props.review.hasCompleted
}

const handleSubmit = async () => {
  try {
    const updatedReview = {
      engagementLevel: engagementLevel.value,
      difficultyLevel: difficultyLevel.value,
      instructorQuality: instructorQuality.value,
      practicalValue: practicalValue.value,
      comment: comment.value,
      hasCompleted: hasCompleted.value
    }
    await Api.put(`/reviews/${props.review._id}`, updatedReview)
    emit('review-updated')
  } catch (error) {
    throw error('Failed to update review')
  }
}

defineExpose({ handleSubmit })
</script>
