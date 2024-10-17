<template>
  <div>
      <form ref="form" @submit.stop.prevent="handleSubmit">
        <label for="engagementLevel">Engagement Level</label>
              <star-rating :rating="engagementLevel" @update:rating="setEngagementLevel" :star-size="40"
                :show-rating="true" :read-only="false"></star-rating>
        <b-form-group
          label="Comment"
          label-for="comment-input"
          invalid-feedback="Name is required"
        >
          <b-form-input
            id="comment-input"
            required
          ></b-form-input>
        </b-form-group>
      </form>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'

const props = defineProps({
  review: Object
})

const engagementLevel = ref(0)

onMounted(() => {
  getEngagementLevel()
})

const setEngagementLevel = (newRating) => {
  engagementLevel.value = newRating
}
const getEngagementLevel = () => {
  engagementLevel.value = props.review.engagementLevel
}

</script>
