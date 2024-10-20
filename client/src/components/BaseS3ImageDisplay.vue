<template>
  <div class="image-container">
    <img
      v-if="imageUrl"
      :src="imageUrl"
      @error="handleImageError"
    />
    <img v-else :src="placeholderImage"/>
  </div>
</template>

<script setup>
import { ref, watchEffect } from 'vue'
import placeholderImage from '@/assets/placeholder.png'
import { getS3DownloadUrl } from '@/Api'

const props = defineProps({
  imageObject: Object,
  type: String
})

const imageUrl = ref('')

const fetchDownloadUrl = async () => {
  if (props.imageObject.photo) {
    const signedUrl = await getS3DownloadUrl(props.imageObject, props.type)
    imageUrl.value = signedUrl
  }
}

const handleImageError = () => {
  imageUrl.value = placeholderImage
}
// Use watchEffect instead of onMounted and watch
watchEffect(() => {
  if (props.imageObject.photo) {
    fetchDownloadUrl()
  }
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
