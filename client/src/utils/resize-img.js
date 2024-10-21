export class ImageResizeError extends Error {
  constructor(message) {
    super(message)
    this.name = 'ImageResizeError'
  }
}

export const resizeImage = async (file, maxWidth = 600, maxHeight = 400) => {
  if (!(file instanceof Blob || file instanceof File)) {
    throw new ImageResizeError('Invalid file type')
  }

  try {
    const img = await createImageBitmap(file)
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

    // Convert the canvas to a Blob
    return await new Promise(resolve => {
      canvas.toBlob(resolve, 'image/jpeg', 1.0) // Selected image quality
    })
  } catch (error) {
    throw new ImageResizeError(`Failed to resize: ${error.message}`)
  }
}
