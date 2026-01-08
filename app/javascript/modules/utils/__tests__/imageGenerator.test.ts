// Mock html2canvas before importing
const mockHtml2Canvas = jest.fn()
jest.mock('html2canvas', () => ({
  __esModule: true,
  default: (...args: unknown[]) => mockHtml2Canvas(...args),
}))

import { generateShareableImage, downloadImage } from '../imageGenerator'

describe('imageGenerator', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('generateShareableImage', () => {
    let mockElement: HTMLElement
    let mockCanvas: HTMLCanvasElement
    let mockToDataURL: jest.Mock
    let mockToBlob: jest.Mock

    beforeEach(() => {
      // Create mock element with getters for read-only properties
      mockElement = document.createElement('div')
      Object.defineProperty(mockElement, 'offsetWidth', {
        get: () => 1080,
        configurable: true,
      })
      Object.defineProperty(mockElement, 'offsetHeight', {
        get: () => 1080,
        configurable: true,
      })
      Object.defineProperty(mockElement, 'scrollWidth', {
        get: () => 1080,
        configurable: true,
      })
      Object.defineProperty(mockElement, 'scrollHeight', {
        get: () => 1080,
        configurable: true,
      })

      // Create mock canvas
      mockCanvas = document.createElement('canvas')
      mockToDataURL = jest.fn(() => 'data:image/png;base64,test-image-data')
      mockToBlob = jest.fn((callback: (blob: Blob | null) => void) => {
        callback(new Blob(['test'], { type: 'image/png' }))
      })

      mockCanvas.toDataURL = mockToDataURL
      mockCanvas.toBlob = mockToBlob

      mockHtml2Canvas.mockResolvedValue(mockCanvas)
    })

    it('generates image with default options', async () => {
      const result = await generateShareableImage(mockElement)

      expect(mockHtml2Canvas).toHaveBeenCalledWith(
        mockElement,
        expect.objectContaining({
          scale: 2,
          useCORS: true,
          logging: false,
          backgroundColor: null,
          width: 1080,
          height: 1080,
          windowWidth: 1080,
          windowHeight: 1080,
        })
      )

      expect(result.dataUrl).toBe('data:image/png;base64,test-image-data')
      expect(result.blob).toBeInstanceOf(Blob)
    })

    it('generates image with custom quality', async () => {
      const result = await generateShareableImage(mockElement, { quality: 0.8 })

      expect(mockToDataURL).toHaveBeenCalledWith('image/png', 0.8)
      expect(mockToBlob).toHaveBeenCalledWith(
        expect.any(Function),
        'image/png',
        0.8
      )
      expect(result.dataUrl).toBe('data:image/png;base64,test-image-data')
    })

    it('generates image with custom scale', async () => {
      await generateShareableImage(mockElement, { scale: 3 })

      expect(mockHtml2Canvas).toHaveBeenCalledWith(
        mockElement,
        expect.objectContaining({
          scale: 3,
        })
      )
    })

    it('handles html2canvas errors', async () => {
      const error = new Error('html2canvas failed')
      mockHtml2Canvas.mockRejectedValue(error)

      await expect(generateShareableImage(mockElement)).rejects.toThrow(
        'Failed to generate shareable image: html2canvas failed'
      )
    })

    it('handles toBlob failure', async () => {
      mockToBlob.mockImplementation((callback: (blob: Blob | null) => void) => {
        callback(null)
      })

      await expect(generateShareableImage(mockElement)).rejects.toThrow(
        'Failed to generate image blob'
      )
    })

    it('handles unknown errors in html2canvas', async () => {
      mockHtml2Canvas.mockRejectedValue('Unknown error')

      await expect(generateShareableImage(mockElement)).rejects.toThrow(
        'Failed to generate shareable image: Unknown error'
      )
    })

    it('uses correct element dimensions', async () => {
      // Create a new element with different dimensions
      const customElement = document.createElement('div')
      Object.defineProperty(customElement, 'offsetWidth', {
        get: () => 500,
        configurable: true,
      })
      Object.defineProperty(customElement, 'offsetHeight', {
        get: () => 600,
        configurable: true,
      })
      Object.defineProperty(customElement, 'scrollWidth', {
        get: () => 500,
        configurable: true,
      })
      Object.defineProperty(customElement, 'scrollHeight', {
        get: () => 600,
        configurable: true,
      })

      await generateShareableImage(customElement)

      expect(mockHtml2Canvas).toHaveBeenCalledWith(
        customElement,
        expect.objectContaining({
          width: 500,
          height: 600,
          windowWidth: 500,
          windowHeight: 600,
        })
      )
    })
  })

  describe('downloadImage', () => {
    let mockLink: HTMLAnchorElement
    let mockClick: jest.Mock
    let mockAppendChild: jest.Mock
    let mockRemoveChild: jest.Mock

    beforeEach(() => {
      // Mock DOM methods
      mockClick = jest.fn()
      mockAppendChild = jest.fn()
      mockRemoveChild = jest.fn()

      mockLink = {
        href: '',
        download: '',
        click: mockClick,
      } as unknown as HTMLAnchorElement

      jest.spyOn(document, 'createElement').mockReturnValue(mockLink)
      jest.spyOn(document.body, 'appendChild').mockImplementation(mockAppendChild)
      jest.spyOn(document.body, 'removeChild').mockImplementation(mockRemoveChild)
    })

    afterEach(() => {
      jest.restoreAllMocks()
    })

    it('creates download link and triggers click', () => {
      const dataUrl = 'data:image/png;base64,test-image'
      const filename = 'test-image.png'

      downloadImage(dataUrl, filename)

      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(document.createElement).toHaveBeenCalledWith('a')
      expect(mockLink.href).toBe(dataUrl)
      expect(mockLink.download).toBe(filename)
      expect(mockAppendChild).toHaveBeenCalledWith(mockLink)
      expect(mockClick).toHaveBeenCalledTimes(1)
      expect(mockRemoveChild).toHaveBeenCalledWith(mockLink)
    })

    it('uses default filename when not provided', () => {
      const dataUrl = 'data:image/png;base64,test-image'

      downloadImage(dataUrl)

      expect(mockLink.download).toBe('golf-style-shareable.png')
    })

    it('uses custom filename when provided', () => {
      const dataUrl = 'data:image/png;base64,test-image'
      const customFilename = 'my-custom-image.png'

      downloadImage(dataUrl, customFilename)

      expect(mockLink.download).toBe(customFilename)
    })

    it('cleans up DOM elements after download', () => {
      const dataUrl = 'data:image/png;base64,test-image'

      downloadImage(dataUrl)

      // Verify all methods were called
      expect(mockAppendChild).toHaveBeenCalledWith(mockLink)
      expect(mockClick).toHaveBeenCalledTimes(1)
      expect(mockRemoveChild).toHaveBeenCalledWith(mockLink)
      
      // Verify order: appendChild should be called before click, click before removeChild
      const appendCallOrder = mockAppendChild.mock.invocationCallOrder[0]
      const clickCallOrder = mockClick.mock.invocationCallOrder[0]
      const removeCallOrder = mockRemoveChild.mock.invocationCallOrder[0]
      
      expect(appendCallOrder).toBeLessThan(clickCallOrder)
      expect(clickCallOrder).toBeLessThan(removeCallOrder)
    })
  })
})

