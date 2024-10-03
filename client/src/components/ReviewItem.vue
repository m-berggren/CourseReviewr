<template>
  <div>
    <b-card class="review-card my-3">
      <b-card-text class="review-text">
        {{ review.comment }}
      </b-card-text>
      <b-card-text class="text-center">
        {{ review.user.username }}
      </b-card-text>
      <div class="rating-container">
        <star-rating
          :rating="review.averageRating"
          :read-only="true"
          :star-size="30"
          :show-rating="false"
          />
      </div>
    </b-card>
  </div>

</template>

<script setup>
defineProps({
  review: Object
})
</script>

<style>
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
  height: 125px;           /* Keep this aligned with line-clamp */
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 5;  /* Limit to 5 lines */
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
