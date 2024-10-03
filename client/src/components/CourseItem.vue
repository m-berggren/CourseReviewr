<template>
  <div>
    <router-link :to="{ name: 'course-page', params: { id:course._id } }" class="course-link">
      <b-card :title="course.name" :img-src="course.photo" class="course-card my-3">
        <!-- Description -->
        <b-card-text class="course-description">
          {{ course.description }}
        </b-card-text>
        <!-- Rating at consistent distance from description -->
        <div class="rating-container">
          <star-rating
            :rating="course.averageRating"
            :read-only="true"
            :star-size="30"
            :show-rating="false"
            />
        </div>
      </b-card>
    </router-link>
  </div>
</template>

<script setup>
defineProps({
  course: Object
})
</script>

<style scoped>

.course-link {
  text-decoration: none;
  color: inherit;
}

/* Max size for the card */
.course-card {
  height: 475px;
  overflow: hidden;
  display: flex;
  position: relative;
  flex-direction: column;
  justify-content: space-between;
  padding-bottom: 10px;
}

.course-card img {
  max-height: 200px;
  object-fit: cover;
  width: 100%;
}

/* Description should handle overflow with ellipsis */
.course-description {
  height: 75px;           /* Keep this aligned with line-clamp */
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 3;  /* Limit to 3 lines */
  -webkit-box-orient: vertical;
}

.rating-container {
  margin-top: 10px;
  position: absolute;
  bottom: 10px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
