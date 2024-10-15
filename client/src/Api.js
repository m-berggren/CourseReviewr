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

api.resizeImage = async (file, maxWidth = 300, maxHeight = 200) => {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')

      // Calculate aspect ratio
      const aspectRatio = img.width / img.height
      let newWidth = maxWidth
      let newHeight = maxWidth / aspectRatio

      if (newHeight > maxHeight) {
        newHeight = maxHeight
        newWidth = maxHeight * aspectRatio
      }

      // Set the canvas size to the new width and height
      canvas.width = newWidth
      canvas.height = newHeight

      // Draw the image onto the canvas, scaling it to fit
      ctx.drawImage(img, 0, 0, newWidth, newHeight)

      // Determine the output format
      let outputFormat = 'image/jpeg'
      if (file.type === 'image/png') {
        outputFormat = 'image/png'
      } else if (file.type === 'image/webp') {
        outputFormat = 'image/webp'
      }

      // Convert the canvas to a Blob
      canvas.toBlob((blob) => {
        resolve(blob)
      }, outputFormat, 0.9) // Image quality
    }
    img.onerror = (error) => reject(error)

    if (file instanceof Blob || file instanceof File) {
      const reader = new FileReader()
      reader.onload = (e) => img.src = e.target.result
      reader.onerror = (error) => reject(error)
      reader.readAsDataURL(file)
    } else {
      reject(new Error('Invalid file type'))
    }
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

api.deleteFromS3 = async (fileName) => {
  try {
    const response = await api.delete('/aws/delete-object', {
      params: { fileName }
    })
    return response.data
  } catch (error) {
    console.error('Error deleting object from S3:', error)
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
