import axios from 'axios'
import { token } from './token'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_ENDPOINT || 'http://localhost:3000/api/v1'
})

api.interceptors.request.use(
  (config) => {
    const accessToken = token.getToken()
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

api.resizeImage = async (file) => {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')

      // Set the canvas size to the new width and height
      canvas.width = 300
      canvas.height = 200

      // Draw the image onto the canvas, scaling it to fit
      ctx.drawImage(img, 0, 0, 300, 200)

      // Convert the canvas to a Blob
      canvas.toBlob((blob) => {
        resolve(blob)
      }, 'image/jpeg', 0.9) // Image quality, adjust for lower
    }
    img.onerror = (error) => reject(error)
    img.src = URL.createObjectURL(file)
  })
}

api.getS3UploadUrl = async (fileName, fileType) => {
  try {
    const response = await Api.get('/aws/generate-upload-url', {
      params: { fileName, fileType }
    })
    return response.data
  } catch (error) {
    console.error('Error getting S3 upload URL:', error)
    throw error
  }
}

api.getS3DownloadUrl = async (fileName) => {
  try {
    const response = await Api.get('/aws/generate-download-url', {
      params: { fileName }
    })
    return response.data.signedUrl
  } catch (error) {
    console.error('Error getting S3 download URL:', error)
    throw error
  }
}

api.uploadToS3 = async (file, uploadUrl) => {
  try {
    // Upload the file to S3
    await axios.put(uploadUrl, file, {
      headers: { 'Content-Type': file.type }
    })
  } catch (error) {
    console.error('Error uploading to S3:', error)
    throw error
  }
}

api.handleImageUpload = async (file) => {
  try {
    // Resize the image
    const resizedFile = await api.resizeImage(file)

    // Get the signed URL for upload
    const { signedUrl, imageName } = await api.getS3UploadUrl(file.name, 'image/jpeg')

    // Upload the file to S3
    await api.uploadToS3(resizedFile, signedUrl)

    return imageName
  } catch (error) {
    console.error('Upload failed:', error)
    throw error
  }
}

export const Api = api
