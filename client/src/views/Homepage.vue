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
            <div class="tags-container p-3 my-2">
              <b-badge v-for="topic in topics" :key="topic.id" variant="dark" class="tag-badge mx-1">
                {{ tag.name }}
              </b-badge>
            </div>
          </b-col>
          <b-col></b-col>
        </b-row>

        <!-- Rows for course header and courses (4x3 layout) -->
         <b-row class="">
          <b-col></b-col>
          <b-col>
            <h2 class="">Courses</h2>
          </b-col>
          <b-col></b-col>
         </b-row>

        <b-row>
          <b-col md="3" v-for="course in courses" :key="course.id">
            <b-card :title="course.name" :img-src="course.photo" class="my-3 ">
              <b-card-text>
                {{ course.description }}
              </b-card-text>
            </b-card>
          </b-col>
        </b-row>

        <!-- Rows for review header and reviews (4x3 layout)-->
         <b-row class="">
          <b-col></b-col>
          <b-col>
            <h2 class="mt-1">Reviews</h2>
          </b-col>
          <b-col></b-col>
         </b-row>

        <b-row>
          <b-col md="3" v-for="review in reviews" :key="review.id">
            <b-card class="my-3">
              <b-card-text>
                {{ review.text }}
              </b-card-text>
            </b-card>
          </b-col>

        </b-row>
      </b-container>
  </div>

</template>

<script>
import { ref } from 'vue'

export default {
  setup() {
    const tags = ref([
      { id: 1, name: 'JavaScript' },
      { id: 2, name: 'Python' },
      { id: 3, name: 'Machine Learning' },
      { id: 4, name: 'Web Development' },
      { id: 5, name: 'Data Science' },
      { id: 5, name: 'Knitting' },
      { id: 5, name: 'Theology' },
      { id: 5, name: 'Psychology' },
      { id: 5, name: 'History' },
      { id: 5, name: 'Pottery' },
      { id: 5, name: 'Archeology' },
      { id: 5, name: 'Public Speaking' },
      { id: 5, name: 'Accounting' }
    ])

    const courses = ref([
      { id: 1, name: 'Course 1', photo: 'https://picsum.photos/id/237/300/200', description: 'Description of course 1' },
      { id: 2, name: 'Course 2', photo: 'https://picsum.photos/id/238/300/200', description: 'Description of course 2' },
      { id: 3, name: 'Course 3', photo: 'https://picsum.photos/id/239/300/200', description: 'Description of course 3' },
      { id: 4, name: 'Course 4', photo: 'https://picsum.photos/id/240/300/200', description: 'Description of course 4' },
      { id: 5, name: 'Course 5', photo: 'https://picsum.photos/id/241/300/200', description: 'Description of course 5' },
      { id: 6, name: 'Course 6', photo: 'https://picsum.photos/id/242/300/200', description: 'Description of course 6' },
      { id: 7, name: 'Course 7', photo: 'https://picsum.photos/id/243/300/200', description: 'Description of course 7' },
      { id: 8, name: 'Course 8', photo: 'https://picsum.photos/id/244/300/200', description: 'Description of course 8' },
      { id: 9, name: 'Course 9', photo: 'https://picsum.photos/id/253/300/200', description: 'Description of course 9' },
      { id: 10, name: 'Course 10', photo: 'https://picsum.photos/id/250/300/200', description: 'Description of course 10' },
      { id: 11, name: 'Course 11', photo: 'https://picsum.photos/id/251/300/200', description: 'Description of course 11' },
      { id: 12, name: 'Course 12', photo: 'https://picsum.photos/id/248/300/200', description: 'Description of course 12' }
    ])

    const reviews = ref([
      { id: 1, text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.' },
      { id: 2, text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.' },
      { id: 3, text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.' },
      { id: 4, text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.' },
      { id: 5, text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.' },
      { id: 6, text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.' },
      { id: 7, text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.' },
      { id: 8, text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.' },
      { id: 9, text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.' },
      { id: 10, text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.' },
      { id: 11, text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.' },
      { id: 12, text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.' }
    ])

    return {
      tags,
      courses,
      reviews
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
