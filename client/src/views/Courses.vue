<template>
  <div>
    <b-container fluid>
      <b-row class="custom-background justify-content-center align-items-center">
        <!-- Search bar, Clear All button, and Menu toggle -->
        <b-col xl="4" lg="6" md="8" sm="8" xs="8" class="my-2 position-relative">
          <b-input-group>
            <b-form-input v-model="searchInput" placeholder="Search course" size="sm" class="search-input"></b-form-input>
            <b-input-group-append>
              <b-button @click="clearButton" variant="dark" size="sm" class="clear-button">Clear All</b-button>
            </b-input-group-append>
          </b-input-group>
          <!-- Menu toggle button, visible only on md screens and smaller -->
          <b-button v-b-toggle.button-collapse class="d-inline-block d-lg-none position-absolute options-toggle" variant="dark">
            <b-icon-list />Options
          </b-button>
        </b-col>

        <!-- Provider, Topic dropdowns, and Create course button -->
        <b-col xl="8" lg="6" md="12" sm="12" xs="12">
          <b-collapse id="button-collapse" class="d-lg-flex justify-content-lg-start">
            <div class="d-flex flex-column flex-lg-row">
              <b-dropdown :text="providerDropdownText" size="sm" class="ms-2 mt-1 collapsable-button" variant="dark">
                <b-dropdown-item v-for="provider in providers" :key="provider" @click="selectProvider(provider)">
                  {{ provider }}
                </b-dropdown-item>
                <b-dropdown-divider></b-dropdown-divider>
                <b-dropdown-item @click="clearProvider">Clear Provider</b-dropdown-item>
              </b-dropdown>
              <b-dropdown :text="topicDropdownText" size="sm" class="ms-2 mt-1 collapsable-button" variant="dark">
                <b-dropdown-item v-for="topic in topics" :key="topic._id" @click="selectTopic(topic)">
                  {{ topic.name }}
                </b-dropdown-item>
                <b-dropdown-divider></b-dropdown-divider>
                <b-dropdown-item @click="clearTopic">Clear Topic</b-dropdown-item>
              </b-dropdown>
              <router-link to="/courses/create" class="course-button ms-2 mb-2 mt-1">
                <b-button v-if="isSignedIn" size="sm" variant="dark" class="collapsable-button">Create course & review</b-button>
              </router-link>
            </div>
          </b-collapse>
        </b-col>
      </b-row>
    </b-container>

    <!-- Table with sortable headers and responsive columns using Bootstrap -->
  <b-row class="mt-1 justify-content-center mx-3">
    <b-col md="12">
      <div class="table-responsive">
        <table class="table table-hover">
          <thead>
            <tr>
              <th @click="sortTable('name')" class="col-11 col-md-6 col-sm-8">
                <sortable-header column="name" :current-sort="sortBy" :current-order="sortOrder" text="Name" />
              </th>
              <th @click="sortTable('provider')" class="col-md-2 d-none d-md-table-cell">
                <sortable-header column="provider" :current-sort="sortBy" :current-order="sortOrder" text="Provider" />
              </th>
              <th @click="sortTable('difficulty')" class="col-lg-2 d-none d-lg-table-cell">
                <sortable-header column="difficulty" :current-sort="sortBy" :current-order="sortOrder" text="Difficulty" />
              </th>
              <th @click="sortTable('averageRating')" class="col-2 col-md-1">
                <sortable-header column="averageRating" :current-sort="sortBy" :current-order="sortOrder" text="Rating" />
              </th>
              <th @click="sortTable('reviewCount')" class="col-xl-1 d-none d-sm-table-cell">
                <sortable-header column="reviewCount" :current-sort="sortBy" :current-order="sortOrder" text="Review" />
              </th>
              <th @click="sortTable('releaseYear')" class="col-xl-1 d-none d-xl-table-cell">
                <sortable-header column="releaseYear" :current-sort="sortBy" :current-order="sortOrder" text="Year" />
              </th>
            </tr>
          </thead>
            <tbody>
              <tr v-for="item in tableData" :key="item._id">
                <td class="col-4 col-md-3">
                  <router-link :to="`/courses/${item._id}`" class="course-link">
                    {{ item.name }}
                  </router-link>
                </td>
                <td class="col-md-2 d-none d-md-table-cell">{{ item.provider }}</td>
                <td class="col-lg-2 d-none d-lg-table-cell">{{ item.difficulty }}</td>
                <td class="col-1 col-md-1">{{ item.averageRating.toFixed(1) }}</td>
                <td class="col-xl-1 d-none d-sm-table-cell">{{ item.reviewCount }}</td>
                <td class="col-xl-1 d-none d-xl-table-cell">{{ item.releaseYear }}</td>
              </tr>
            </tbody>
        </table>
      </div>
      <b-pagination
        v-model="courses.currentPage"
        :total-rows="courses.totalCourses"
        :per-page="courses.limit"
        @change="fetchCourses"
        align="center"
      ></b-pagination>
    </b-col>
  </b-row>
  </div>
</template>

<script setup>
import { Api } from '@/Api'
import { ref, onMounted, watch } from 'vue'
import { token } from '../token.js'
import { debounce } from 'lodash'
import SortableHeader from '@/components/BaseSortableHeader.vue'

// Reactive data
const tableData = ref([])
const searchInput = ref('')
const selectedProvider = ref('')
const selectedTopic = ref('')
const providers = ref([])
const topics = ref([])

const courses = ref({
  totalCourses: 0,
  totalPages: 0,
  currentPage: 1,
  limit: 12,
  hasPrevPage: false,
  hasNextPage: false,
  prevPage: null,
  nextPage: null,
  courses: []
})

const itemsPerPage = ref(12)
const sortBy = ref('reviewCount')
const sortOrder = ref('desc')

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

const fetchProviders = async () => {
  try {
    const response = await Api.get('/courses/providers')
    const data = response.data.providers

    providers.value = data
  } catch (error) {
    console.error('Error fetching providers: ', error)
  }
}

// Fetch courses from the API
const fetchCourses = async () => {
  try {
    const params = new URLSearchParams({
      limit: itemsPerPage.value,
      sortBy: sortBy.value,
      order: sortOrder.value,
      page: courses.value.currentPage
    })

    if (selectedProvider.value) params.append('provider', selectedProvider.value)
    if (selectedTopic.value) params.append('topic', selectedTopic.value)
    if (searchInput.value) params.append('search', searchInput.value)

    const response = await Api.get(`/courses?${params.toString()}`)
    courses.value = response.data
    tableData.value = courses.value.courses
  } catch (error) {
    console.error('Error fetching courses:', error)
  }
}

const sortTable = (column) => {
  if (sortBy.value === column) {
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortBy.value = column
    sortOrder.value = 'desc' // Default to descending when changing columns
  }
  fetchCourses()
}

// Update selected provider and dropdown text
const selectProvider = (provider) => {
  selectedProvider.value = provider
  providerDropdownText.value = provider
  courses.value.currentPage = 1
  fetchCourses()
}

// Update selected topic and dropdown text
const selectTopic = (topic) => {
  selectedTopic.value = topic._id
  topicDropdownText.value = topic.name
  courses.value.currentPage = 1
  fetchCourses()
}

const clearProvider = () => {
  selectedProvider.value = ''
  providerDropdownText.value = 'Providers'
  courses.value.currentPage = 1
  fetchCourses()
}

const clearTopic = () => {
  selectedTopic.value = ''
  topicDropdownText.value = 'Topics'
  courses.value.currentPage = 1
  fetchCourses()
}

const clearButton = () => {
  selectedProvider.value = ''
  providerDropdownText.value = 'Providers'
  selectedTopic.value = ''
  topicDropdownText.value = 'Topics'
  searchInput.value = ''
  courses.value.currentPage = 1
  fetchCourses()
}

// Debounce delays execution of an event
const debouncedFetchCourses = debounce(fetchCourses, 300)

// Watch for changes in search input
watch(searchInput, () => {
  courses.value.currentPage = 1
  debouncedFetchCourses()
})

watch(() => courses.value.currentPage, fetchCourses)

onMounted(() => {
  fetchTopics()
  fetchCourses()
  fetchProviders()
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

.clear-button:hover {
  background-color: #007bff;
  color: #383024;
  border-color: #383024 !important;
}

.table th {
  cursor: pointer;
}

.course-link {
  text-decoration: none;
  color: inherit;
}

.course-link:hover {
  text-decoration: underline;
  color: #007bff;
}

.options-toggle {
  right: -80px; /* Adjusted to move the button further right */
  top: 50%;
  transform: translateY(-50%);
  z-index: 1000;
}

/* Responsive styles: move buttons down during resizing */
@media (max-width: 992px) {
  #button-collapse.show {
    display: flex;
    flex-direction: column;
    align-items: stretch;
  }
  .options-toggle {
    font-size: 0.8rem;
  }
}

@media (min-width: 992px) {
  #button-collapse {
    display: flex !important;
  }

  .options-toggle {
    display: none !important;
  }
}

@media (max-width: 576px) {
  .clear-button {
    margin-right: 80px;
    padding-left: -50px;
  }

  .search-input, clear-button, .options-toggle, .collapsable-button {
    font-size: 0.8rem;
  }

  .options-toggle {
    right: 5px;
  }
}

</style>
