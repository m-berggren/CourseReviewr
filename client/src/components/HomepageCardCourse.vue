<template>
  <div>
    <router-link :to="{ name: 'course-page', params: { id:course._id } }" class="course-link">
      <b-card no-body class="course-card">
        <div>
          <s3-image-display :obj="course" type="course"/>
        </div>
        <b-card-body>
          <h5 class="card-title">{{ course.name }}</h5>
          <b-card-text class="course-description">
            {{ course.description }}
          </b-card-text>
          <div class="rating-container">
            <star-rating
              :rating="course.averageRating"
              :read-only="true"
              :star-size="30"
              :show-rating="false"
              :increment="0.5"
            />
          </div>
        </b-card-body>
      </b-card>
    </router-link>
  </div>
</template>

<script setup>
import S3ImageDisplay from './BaseS3ImageDisplay.vue'

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

.card-body {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
}

.course-card:hover {
  background-color: lightgray;
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
  -webkit-line-clamp: 4;
  -webkit-box-orient: vertical;
  text-align: left; /* Better readability */
  margin-bottom: 1rem;
  max-height: 6em; /* Text cut-off (1.5em per line) */
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
    height: 450px;
  }
}

@media (max-width: 1023px) {
  .course-card {
    height: 400px;
  }

  .course-description {
    -webkit-line-clamp: 3;
    max-height: 4.5em;
  }
}

@media (max-width: 776px) {
  .course-description {
    -webkit-line-clamp: 2;
    max-height: 3em;
  }
}

@media (max-width: 576px) {
  .course-card {
    height: 475px;
  }

  .course-description {
    -webkit-line-clamp: 5;
    max-height: 7.5em;
  }
}

</style>
