import html2canvas from 'html2canvas'

export interface ImageGenerationOptions {
  aspectRatio?: 'square' | 'vertical'
  quality?: number
  scale?: number
}

export interface ImageGenerationResult {
  dataUrl: string
  blob: Blob
}

/**
 * Generate image from ShareableImage component using html2canvas
 * Returns both DataURL and Blob for different use cases
 */
export async function generateShareableImage(
  element: HTMLElement,
  options: ImageGenerationOptions = {}
): Promise<ImageGenerationResult> {
  const { quality = 0.95, scale = 2 } = options

  try {
    const canvas = await html2canvas(element, {
      scale,
      useCORS: true,
      logging: false,
      backgroundColor: null,
      width: element.offsetWidth,
      height: element.offsetHeight,
      windowWidth: element.scrollWidth,
      windowHeight: element.scrollHeight,
    })

    // Convert canvas to blob and data URL
    const dataUrl = canvas.toDataURL('image/png', quality)

    return new Promise((resolve, reject) => {
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            reject(new Error('Failed to generate image blob'))
            return
          }
          resolve({ dataUrl, blob })
        },
        'image/png',
        quality
      )
    })
  } catch (error) {
    throw new Error(`Failed to generate shareable image: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

/**
 * Download image as file
 */
export function downloadImage(dataUrl: string, filename: string = 'golf-style-shareable.png'): void {
  const link = document.createElement('a')
  link.href = dataUrl
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

