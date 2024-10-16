<template>
  <div class="image-container">
    <img
      :src="imageUrl || placeholderImage"
      :alt="placeholderImage"
      @error="handleImageError"
    />
  </div>
</template>

<script setup>
import { ref, watchEffect, onUnmounted } from 'vue'
import { Api } from '@/Api'
import placeholderImage from '@/assets/placeholder.png'

const props = defineProps({
  s3Key: String
})

const imageUrl = ref('')

const fetchDownloadUrl = async () => {
  if (props.s3Key) {
    try {
      imageUrl.value = await Api.getS3DownloadUrl(props.s3Key)
    } catch (error) {
      console.error('Failed to fetch download URL')
    }
  }
}

const handleImageError = () => {
  imageUrl.value = ''
}

// Use watchEffect instead of onMounted and watch
watchEffect(fetchDownloadUrl)

const refreshInterval = setInterval(fetchDownloadUrl, 60 * 60 * 1000) // 1 hour

onUnmounted(() => {
  clearInterval(refreshInterval)
})
</script>

<style>
.image-container {
  width: 100%;
  max-width: 450px;
  aspect-ratio: 3 / 2;
  overflow: hidden;
  position: relative;
  margin-left: auto;
  margin-right: auto;
}
.image-container img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  border-radius: 2%;
}
</style>
