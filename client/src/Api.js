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

export const getS3DownloadUrl = async (object, objectType) => {
  const now = Date.now()
  const defaultExpiration = new Date('1970-01-01T00:00:00.000+00:00').getTime()

  // Check if urlExpiration is set and not the default value and not expired
  if (object.urlExpiration &&
    new Date(object.urlExpiration).getTime() !== defaultExpiration &&
    new Date(object.urlExpiration).getTime() > now &&
    object.signedUrl) {
    return object.signedUrl
  }

  try {
    const response = await Api.get('/aws/generate-download-url', {
      params: { fileName: object.photo }
    })
    const signedUrl = response.data.signedUrl
    let url = ''

    if (objectType === 'course') {
      url = `/courses/${object._id}`
    } else if (objectType === 'user') {
      url = `/users/${object._id}`
    } else {
      console.error('Invalid object type')
      return null
    }

    const newExpiration = now + 12 * 60 * 60 * 1000 // 12 hours in ms

    await Api.patch(url, {
      signedUrl,
      urlExpiration: new Date(newExpiration).toISOString()
    })

    return signedUrl
  } catch (error) {
    console.error('Failed to fetch download URL:', error)
    return null
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
