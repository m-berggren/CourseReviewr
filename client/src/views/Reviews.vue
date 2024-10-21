<template>
  <b-container fluid>
    <b-row class="top-row justify-content-center text-center">
      <b-col md="8" lg="6" xl="4">
        <h1 class="mt-3 ms-3">Reviews</h1>
      </b-col>
    </b-row>
    <b-row>
      <b-col>
        <div v-if="!reviews">
          No reviews yet.
        </div>
        <div v-else>
          <b-col v-for="review in reviews" :key="review._id">
            <router-link :to="{ name: 'course-page', params: { id: review.course._id } }" class="course-link">
              <h3 class="text-center mt-4"><u>{{ review.course.name }}</u></h3>
            </router-link>
            <review-entry :review="review" :id="'review-' + review._id" class="mt-3 mb-4"
              @review-updated="fetchReviews"></review-entry>
            <hr />
          </b-col>
        </div>
      </b-col>
    </b-row>

  </b-container>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { Api } from '@/Api'
import ReviewEntry from '@/components/ReviewEntry.vue'
import { token } from '@/token'

const reviews = ref([])

onMounted(() => {
  fetchReviews()
})

const updateReview = (updatedReview) => {
  const index = reviews.value.findIndex(r => r._id === updatedReview._id)
  if (index !== -1) {
    reviews.value[index] = updatedReview
  }
}

const fetchReviews = async () => {
  try {
    const response = await Api.get(`/users/${token.getUserId()}/reviews`)
    reviews.value = response.data
  } catch (error) {
    console.error(error)
  }
}

</script>

<style>
.course-link {
  text-decoration: none;
  color: inherit;
}

.course-link:hover {
  color: #007bff;
}
</style>
