<template>
  <div>
      <b-card :title="course.name" :img-src="course.photo" class="my-3 ">
        <b-card-text>
          {{ course.description }}
        </b-card-text>
        <div class="rating-container">
        <star-rating
          :rating="course.averageRating"
          :read-only="true"
          :star-size="30"
          :show-rating="false">
        </star-rating>
      </div>
      </b-card>
  </div>
</template>

<script>

export default {
  name: 'course-item',
  props: ['course']
}
</script>

<style scoped>
.rating-container {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  margin-top: 10px;
}
</style>
