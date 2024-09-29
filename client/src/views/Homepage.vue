<template>
  <div>
      <b-container fluid>

        <!-- Row for welcome text, search bar and tags -->
        <b-row class="top-row">
          <b-col></b-col>
          <b-col>
            <h1 class="mt-2">Welcome!</h1>
            <p>Find your perfect course or add your own course with review.</p>
            <b-input-group>
              <b-form-input placeholder="Search course"></b-form-input>
              <b-input-group-append>
                <b-button variant="primary">Search</b-button>
              </b-input-group-append>
            </b-input-group>
          </b-col>
          <b-col></b-col>
        </b-row>

        <!-- Row for tags inside a container -->
        <b-row class="top-row mb-4">
          <b-col></b-col>
          <b-col md="4">
            <div class="tags-container p-3 mt-2 mb-4">
              <b-badge v-for="topic in topics" :key="topic._id" variant="dark" class="tag-badge mx-1">
                {{ topic.name }}
              </b-badge>
            </div>
          </b-col>
          <b-col></b-col>
        </b-row>

        <!-- Rows for course header and courses (4x3 layout) -->
         <b-row class="">
          <b-col></b-col>
          <b-col>
            <h2 class="">Recommended courses</h2>
          </b-col>
          <b-col></b-col>
         </b-row>

        <b-row>
          <b-col md="3" v-for="course in courses" :key="course._id">
            <course-item v-bind:course="course"></course-item>
          </b-col>
        </b-row>

        <!-- Rows for review header and reviews (4x3 layout)-->
         <b-row class="">
          <b-col></b-col>
          <b-col>
            <h2 class="mt-1">Latest reviews</h2>
          </b-col>
          <b-col></b-col>
         </b-row>

        <b-row>
          <b-col md="3" v-for="review in reviews" :key="review._id">
            <b-card class="my-3">
              <b-card-text>
                {{ review.comment }}
              </b-card-text>
            </b-card>
          </b-col>
        </b-row>
      </b-container>
  </div>

</template>

<script>
import CourseItem from '../components/CourseItem.vue'
import { Api } from '@/Api'

export default {
  name: 'topics-courses-and-reviews',
  components: {
    'course-item': CourseItem
  },
  mounted() {
    Api.get('/topics')
      .then(response => {
        this.topics = response.data.topics
      })
      .catch(error => {
        this.topics = []
        console.log(error)
        // Additional error checking
      })

    Api.get('/courses')
      .then(response => {
        this.courses = response.data.courses
      })
      .catch(error => {
        this.courses = []
        console.log(error)
        // Additional error checking
      })

    Api.get('/reviews')
      .then(response => {
        this.reviews = response.data.reviews
      })
      .catch(error => {
        this.reviews = []
        console.log(error)
        // Additional error checking
      })
  },

  methods: {

  },
  data() {
    return {
      courses: [],
      topics: [],
      reviews: []
    }
  }
}
</script>

<style>
.tags-container {
  background-color: lightgrey;
  border-radius: 1vw;
}
.top-row {
  background-color: cornflowerblue;
}
.tag-badge {
  background-color: darkslategray !important;
}
</style>
