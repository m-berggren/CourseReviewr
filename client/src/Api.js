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

api.handleImageUpload = async (resizedFile, file) => {
  try {
    // Get the signed URL for upload
    const { signedUrl, imageName } = await api.getS3UploadUrl(file.name, 'image/jpeg')

    // Upload the file to S3
    await api.uploadToS3(resizedFile, signedUrl)

    return imageName
  } catch (error) {
    console.error('Upload failed:', error.message)
  }
}

export const Api = api
