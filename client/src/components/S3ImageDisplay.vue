<template>
  <div class="image-container">
    <img
      v-if="imageUrl"
      :src="imageUrl"
      alt="Uploaded image"
      @error="handleImageError"
    />
    <p v-else>{{ errorMessage || 'No image available' }}</p>
  </div>
</template>

<script setup>
import { ref, watchEffect, onUnmounted } from 'vue'
import { Api } from '@/Api'

const props = defineProps({
  s3Key: String
})

const imageUrl = ref('')
const errorMessage = ref('')

const fetchDownloadUrl = async () => {
  if (props.s3Key) {
    try {
      imageUrl.value = await Api.getS3DownloadUrl(props.s3Key)
    } catch (error) {
      console.error('Failed to fetch download URL:', error)
      errorMessage.value = `Failed to load image: ${error.message}`
    }
  } else {
    errorMessage.value = 'No image key provided'
  }
}

const handleImageError = (error) => {
  console.error('Error loading image:', error)
  console.error('Failed URL:', error.target.src)
  errorMessage.value = `Failed to load image: ${error.target.src}`
}

// Use watchEffect instead of onMounted and watch
watchEffect(fetchDownloadUrl)

const refreshInterval = setInterval(fetchDownloadUrl, 60 * 60 * 1000) // 1 hour

onUnmounted(() => {
  clearInterval(refreshInterval)
})
</script>

<style scoped>
.image-container {
  width: 100%;
  max-width: 300px;
  aspect-ratio: 3 / 2;
  overflow: hidden;
  position: relative;
}
.image-container img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
}
</style>
