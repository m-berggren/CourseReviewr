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
import { Api } from '@/Api'

const props = defineProps({
  obj: Object,
  type: String
})

const imageUrl = ref('')

const fetchDownloadUrl = async () => {
  if (props.obj.photo) {
    const now = Date.now()
    const defaultExpiration = new Date('1970-01-01T00:00:00.000+00:00').getTime()

    // Check if urlExpiration is set and not the default value and not expired
    if (props.obj.urlExpiration &&
    new Date(props.obj.urlExpiration).getTime() !== defaultExpiration &&
    new Date(props.obj.urlExpiration).getTime() > now &&
    props.obj.signedUrl) {
      imageUrl.value = props.obj.signedUrl
      return
    }

    let url = ''

    if (props.type === 'course') {
      url = `/courses/${props.obj._id}`
    } else if (props.type === 'user') {
      url = `/users/${props.obj._id}`
    } else {
      console.error('Invalid object type')
      return null
    }

    const newExpiration = now + 24 * 60 * 60 * 1000 // 24 hours in ms

    const signedUrl = await Api.getS3DownloadUrl(props.obj.photo)

    await Api.patch(url, {
      signedUrl,
      urlExpiration: new Date(newExpiration).toISOString()
    })

    imageUrl.value = signedUrl
  }
}

const handleImageError = () => {
  imageUrl.value = placeholderImage
}
// Use watchEffect instead of onMounted and watch
watchEffect(() => {
  if (props.obj.photo) {
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
