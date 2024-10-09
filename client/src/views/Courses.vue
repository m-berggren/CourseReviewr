<template>
  <div>
    <b-container fluid>
      <b-row class="custom-background justify-content-center">

        <!-- Top filters: Search bar, Provider, Topic -->
        <b-col md="3" class="my-4">
          <b-form-input v-model="searchInput" placeholder="Search Course" class="mx-3"></b-form-input >
        </b-col>
        <b-col md="2" class="my-4">
          <b-dropdown :text="providerDropdownText" class="" variant="dark">
            <b-dropdown-item v-for="provider in providers" :key="provider" @click="selectProvider(provider)">
              {{ provider }}
            </b-dropdown-item>
            <b-dropdown-divider></b-dropdown-divider>
            <b-dropdown-item @click="clearProvider">Clear Provider</b-dropdown-item>
          </b-dropdown>
        </b-col>
        <b-col md="2" class="my-4">
          <b-dropdown :text="topicDropdownText" class="" variant="dark">
            <b-dropdown-item v-for="topic in topics" :key="topic._id" @click="selectTopic(topic)">
              {{ topic.name }}
            </b-dropdown-item>
            <b-dropdown-divider></b-dropdown-divider>
            <b-dropdown-item @click="clearTopic">Clear Topic</b-dropdown-item>
          </b-dropdown>
        </b-col>
        <b-col md="2" class="my-4">
          <router-link to="/courses/create" class="course-button">
            <b-button v-if="isSignedIn" variant="dark" class="create-course-button">Create course & review</b-button>
          </router-link>
        </b-col>

      </b-row>
    </b-container>

    <!-- Table with sortable headers -->
    <b-row class="mt-1 justify-content-center">
      <b-col md="10">
        <BTable :sort-by="[{key: 'reviewCount', order: 'desc',}]" :items="filteredItems" :fields="sortFields">
          <template #cell(name)="data">
            <!-- Link to course details page using router-link -->
            <router-link :to="`/courses/${data.item.id}`" class="course-link">
              {{ data.item.name }}
            </router-link>
          </template>
        </BTable>
        <b-pagination class="justify-content-center"
          v-model="currentPage"
          :total-rows="totalPages * itemsPerPage"
          :per-page="itemsPerPage"
          @change="changePage"
        ></b-pagination>
      </b-col>
    </b-row>
  </div>
</template>

<script setup>
import { Api } from '@/Api'
import { ref, onMounted, computed } from 'vue'
import { token } from '../token.js'

// Define fields for the table (sortable columns)
const sortFields = [
  { key: 'name', label: 'Name', sortable: true },
  { key: 'provider', label: 'Provider', sortable: true },
  { key: 'difficulty', label: 'Difficulty', sortable: true },
  { key: 'averageRating', label: 'Rating', sortable: true },
  { key: 'reviewCount', label: 'Reviews', sortable: true },
  { key: 'releaseYear', label: 'Year', sortable: true }
]

// Reactive data
const sortItems = ref([])
const searchInput = ref('')
const selectedProvider = ref('')
const selectedTopic = ref('')
const providers = ref([])
const topics = ref([])

const isSignedIn = token.isSignedIn()

// Dropdown texts
const providerDropdownText = ref('Providers')
const topicDropdownText = ref('Topics')

const fetchTopics = async () => {
  try {
    const response = await Api.get('/topics?sortBy=courseCount')
    const data = response.data.topics

    topics.value = data
  } catch (error) {
    console.error('Error fetching topics: ', error)
  }
}

// Fetch courses from the API
const fetchCourses = async () => {
  try {
    const response = await Api.get('/courses')
    const courses = response.data.courses

    sortItems.value = courses.map(course => ({
      id: course._id,
      name: course.name,
      provider: course.provider,
      difficulty: course.difficulty,
      averageRating: course.averageRating,
      reviewCount: course.reviewCount,
      releaseYear: course.releaseYear,
      topics: course.topics
    }))
    console.log(response.data.courses)
    // Populate list of sorted, unique providers from the courses, disregarding uppercase letters
    providers.value = [...new Set(courses.map(course => course.provider))]
      .sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()))
  } catch (error) {
    console.error('Error fetching courses:', error)
  }
}

// Update selected provider and dropdown text
const selectProvider = (provider) => {
  selectedProvider.value = provider
  providerDropdownText.value = provider
}

// Update selected topic and dropdown text
const selectTopic = (topic) => {
  selectedTopic.value = topic._id
  topicDropdownText.value = topic.name
}

const clearProvider = () => {
  selectedProvider.value = ''
  providerDropdownText.value = 'Providers'
}

const clearTopic = (topic) => {
  selectedTopic.value = ''
  topicDropdownText.value = 'Topics'
}

// Computed property to filter the table data based on search input, selected provider, and selected topic
const filteredItems = computed(() => {
  return sortItems.value.filter(course => {
    // Filter by search input (case-insensitive)
    const matchesSearch = course.name.toLowerCase().includes(searchInput.value.toLowerCase())

    // Filter by selected provider (if a provider is selected)
    const matchesProvider = !selectedProvider.value || course.provider === selectedProvider.value

    // Filter by selected topic (if a topic is selected)
    const matchesTopic = !selectedTopic.value || course.topics.some(topic => topic._id === selectedTopic.value)

    // Return true if all conditions match
    return matchesSearch && matchesProvider && matchesTopic
  })
})

onMounted(() => {
  fetchTopics()
  fetchCourses()
})

</script>

<style scoped>
.custom-background{
  background-color: cornflowerblue;
}
.course-link {
  text-decoration: none;
  color: inherit;
  cursor: pointer;
}

.course-link:hover {
  text-decoration: underline;
  color: #007bff;
}

</style>
