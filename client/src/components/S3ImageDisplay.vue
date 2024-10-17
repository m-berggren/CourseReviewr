<template>
  <div class="image-container">
    <img
      v-if="imageUrl"
      :src="imageUrl"
      :alt="props.s3Key"
      @error="handleImageError"
    />
    <img v-else :src="placeholderImage" :alt="'Placeholder for ' + props.s3Key" />
  </div>
</template>

<script setup>
import { ref, watchEffect } from 'vue'
import placeholderImage from '@/assets/placeholder.png'
import { getS3DownloadUrl } from '@/utils/url-manager.js'

const props = defineProps({
  s3Key: String
})

const imageUrl = ref('')

const fetchDownloadUrl = async () => {
  if (props.s3Key) {
    const signedUrl = await getS3DownloadUrl(props.s3Key)
    imageUrl.value = signedUrl
  }
}

const handleImageError = () => {
  imageUrl.value = ''
}
// Use watchEffect instead of onMounted and watch
watchEffect(fetchDownloadUrl)

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
