<template>
  <div>
    <router-link :to="{ name: 'course-page', params: { id:review.course._id }, query: { reviewID: review._id} }" class="course-link">
      <b-card class="review-card my-3">
        <b-card-text class="review-text">
          {{ review.comment }}
        </b-card-text>
        <b-card-text class="text-center">
          <p v-if="review.user">{{ review.user.username }}</p>
          <p v-else>Anonymous</p>
        </b-card-text>
        <div class="rating-container">
          <star-rating
            :rating="review.averageRating"
            :read-only="true"
            :star-size="30"
            :show-rating="false"
            :increment="0.5"
            />
        </div>
      </b-card>
    </router-link>
  </div>

</template>

<script setup>
defineProps({
  review: Object
})
</script>

<style>
.course-link {
  text-decoration: none;
  color: inherit;
  height: 100%; /* Ensure the link takes full height */
  display: block;
}
/* Max size for the card */
.review-card {
  height: 200px;
  overflow: hidden;
  display: flex;
  position: relative;
  flex-direction: column;
  justify-content: space-between;
  padding-bottom: 10px;
}

/* Text should handle overflow with ellipsis */
.review-text {
  height: 125px;
  /* Keep this aligned with line-clamp */
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 5;
  /* Limit to 5 lines */
  -webkit-box-orient: vertical;
}

.rating-container {
  position: absolute;
  bottom: 10px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
