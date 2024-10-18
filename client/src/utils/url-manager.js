import { Api } from '@/Api'

const CACHE_KEY = 'S3_URL_CACHE' // Key for storing and retrieving cache data in localStorage

// Load cache from localStorage
const loadCache = () => {
  const cachedData = localStorage.getItem(CACHE_KEY)
  return cachedData ? new Map(JSON.parse(cachedData)) : new Map()
}

// Save cache to localStorage
const saveCache = (cache) => {
  localStorage.setItem(CACHE_KEY, JSON.stringify(Array.from(cache.entries())))
}

const urlCache = loadCache()

export const getS3DownloadUrl = async (fileName) => {
  const now = Date.now()
  const cachedItem = urlCache.get(fileName)

  // If file does not exist in loadCache or it has expired it will call for a new API
  if (!cachedItem || cachedItem.expiry < now) {
    try {
      const response = await Api.get('/aws/generate-download-url', {
        params: { fileName }
      })
      const signedUrl = response.data.signedUrl
      urlCache.set(fileName, {
        url: signedUrl,
        expiry: now + 12 * 60 * 60 * 1000 // 12 hours in ms
      })

      saveCache(urlCache)
      return signedUrl
    } catch (error) {
      console.log('Failed to fetch download URLs.')
    }
  } else {
    return cachedItem.url
  }
}
