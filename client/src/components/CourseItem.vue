<template>
  <div>
    <router-link :to="{ name: 'course-page', params: { id:course._id } }" class="course-link">
      <b-card :title="course.name" :img-src="course.photo" class="course-card">
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
            :increment="0.5"
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
  height: 100%; /* Ensure the link takes full height */
  display: block;
}

.course-card {
  display: flex;
  flex-direction: column;
  text-align: center;
  height: 100%; /* Make card take full height of parent */
  padding: 0.5rem;
  background-color: whitesmoke;
}

.course-card img {
  height: 150px; /* Fixed height for images */
  object-fit: cover;
  width: 100%;
}

/* Description should handle overflow with ellipsis */
.course-description {
  flex-grow: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  text-align: center;
  margin-bottom: 1rem;
}

.rating-container {
  margin-top: auto; /* Push rating to bottom */
  display: flex;
  justify-content: center;
  align-items: center;
}

/* Responsive behavior using media queries */
@media (min-width: 1024px) {
  .course-card {
    height: 400px;
  }
}

@media (max-width: 1023px) {
  .course-card {
    height: 400px;
  }

  .course-description {
    -webkit-line-clamp: 2;
  }
}

@media (max-width: 576px) {
  .course-card {
    height: 475px;
  }

  .course-description {
    -webkit-line-clamp: 2;
  }
}

</style>
