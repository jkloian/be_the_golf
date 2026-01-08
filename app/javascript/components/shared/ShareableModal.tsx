import { useState, useEffect, useRef, useCallback } from 'react'
import { X, Copy, Download, Share2, Check } from 'lucide-react'
import {
  FacebookShareButton,
  TwitterShareButton,
  LinkedinShareButton,
  WhatsappShareButton,
  FacebookIcon,
  TwitterIcon,
  LinkedinIcon,
  WhatsappIcon,
} from 'react-share'
import type { PublicAssessmentResponse } from '../../shared/types/assessment'
import ShareableImage from './ShareableImage'
import { generateShareableImage, downloadImage } from '../../modules/utils/imageGenerator'
import { useWebShare } from '../../modules/hooks/useWebShare'
import Button from './Button'

interface ShareableModalProps {
  isOpen: boolean
  onClose: () => void
  data: PublicAssessmentResponse
  shareUrl: string
}

export default function ShareableModal({
  isOpen,
  onClose,
  data,
  shareUrl: _shareUrl, // eslint-disable-line @typescript-eslint/no-unused-vars
}: ShareableModalProps) {
  const [imageDataUrl, setImageDataUrl] = useState<string | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [aspectRatio, setAspectRatio] = useState<'square' | 'vertical'>('square')
  const [imageCopied, setImageCopied] = useState(false)
  const imageRef = useRef<HTMLDivElement>(null)
  const { share: webShare, isSupported: isWebShareSupported } = useWebShare()

  const generateImage = useCallback(async () => {
    if (!imageRef.current) return

    setIsGenerating(true)
    setError(null)

    try {
      const result = await generateShareableImage(imageRef.current, {
        aspectRatio,
        quality: 0.95,
        scale: 2,
      })
      setImageDataUrl(result.dataUrl)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate image')
    } finally {
      setIsGenerating(false)
    }
  }, [aspectRatio])

  // Generate image when modal opens or aspect ratio changes
  useEffect(() => {
    if (isOpen && imageRef.current) {
      // Reset image when aspect ratio changes
      setImageDataUrl(null)
      // Small delay to ensure DOM is ready
      const timer = setTimeout(() => {
        void generateImage()
      }, 100)
      return () => clearTimeout(timer)
    }
  }, [isOpen, aspectRatio, generateImage])

  const handleDownload = () => {
    if (imageDataUrl) {
      // Convert persona name to kebab-case for filename
      const styleName = data.assessment.persona.name
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9-]/g, '')
      downloadImage(imageDataUrl, `bethegolf-playing-style-${styleName}.png`)
    }
  }

  const handleCopyImage = async () => {
    if (!imageDataUrl) {
      setError('Image not generated yet. Please wait for image generation.')
      return
    }

    try {
      // Check if ClipboardItem is supported
      if (typeof ClipboardItem === 'undefined') {
        setError('Copying images is not supported in this browser. Please use the download button instead.')
        return
      }

      // Convert data URL to blob using a more reliable method
      const dataUrl = imageDataUrl
      const byteString = atob(dataUrl.split(',')[1])
      const mimeString = dataUrl.split(',')[0].split(':')[1].split(';')[0]
      const ab = new ArrayBuffer(byteString.length)
      const ia = new Uint8Array(ab)
      for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i)
      }
      const blob = new Blob([ab], { type: mimeString })
      
      // Use Clipboard API to copy image
      const clipboardItem = new ClipboardItem({ [blob.type]: blob })
      await navigator.clipboard.write([clipboardItem])
      
      // Set copied state for feedback
      setImageCopied(true)
      setTimeout(() => {
        setImageCopied(false)
      }, 2000)
    } catch (err) {
      console.error('Copy image error:', err)
      setError(err instanceof Error ? err.message : 'Failed to copy image to clipboard')
    }
  }

  const handleWebShare = async () => {
    let currentImageDataUrl = imageDataUrl

    // Generate image if not already generated
    if (!currentImageDataUrl) {
      setIsGenerating(true)
      setError(null)
      try {
        if (!imageRef.current) {
          setError('Image element not found')
          setIsGenerating(false)
          return
        }
        const result = await generateShareableImage(imageRef.current, {
          aspectRatio,
          quality: 0.95,
          scale: 2,
        })
        currentImageDataUrl = result.dataUrl
        setImageDataUrl(result.dataUrl)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to generate image')
        setIsGenerating(false)
        return
      } finally {
        setIsGenerating(false)
      }
    }

    try {
      // Convert data URL to File for sharing
      const response = await fetch(currentImageDataUrl)
      const blob = await response.blob()
      // Convert persona name to kebab-case for filename
      const styleName = data.assessment.persona.name
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9-]/g, '')
      const file = new File([blob], `bethegolf-playing-style-${styleName}.png`, {
        type: 'image/png',
      })

      await webShare({
        title: `I'm the ${data.assessment.persona.name}`,
        text: `${data.assessment.persona.display_example_pro} shares my playing style. Discover your golf style!`,
        files: [file],
      })
    } catch (err) {
      // User cancelled or error - don't show error for cancellation
      if (err instanceof Error && err.name !== 'AbortError') {
        setError('Failed to share')
      }
    }
  }

  const shareTitle = `I'm the ${data.assessment.persona.name}`
  const shareText = `${data.assessment.persona.display_example_pro} shares my playing style. Discover your golf style!`

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative bg-neutral-surface rounded-2xl shadow-2xl max-w-4xl w-full mx-4 max-h-[90vh] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with close button */}
        <div className="flex-shrink-0 flex items-center justify-between px-6 pt-6 pb-4 border-b border-neutral-border">
          <h2 className="text-3xl font-display font-bold text-golf-deep">
            Share Your Golf Style
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-neutral-surface hover:bg-neutral-offwhite transition-colors shadow-lg border border-neutral-border flex-shrink-0"
            aria-label="Close modal"
          >
            <X className="w-6 h-6 text-neutral-text" />
          </button>
        </div>

        {/* Scrollable content area */}
        <div className="overflow-y-auto flex-1 min-h-0">
          <div className="px-6 sm:px-8 py-6">
            {/* Aspect ratio toggle */}
          <div className="flex justify-center gap-4 mb-6">
            <button
              onClick={() => {
                setAspectRatio('square')
                setImageDataUrl(null)
              }}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                aspectRatio === 'square'
                  ? 'bg-golf-emerald text-white'
                  : 'bg-neutral-offwhite text-neutral-text hover:bg-golf-light'
              }`}
            >
              Square
            </button>
            <button
              onClick={() => {
                setAspectRatio('vertical')
                setImageDataUrl(null)
              }}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                aspectRatio === 'vertical'
                  ? 'bg-golf-emerald text-white'
                  : 'bg-neutral-offwhite text-neutral-text hover:bg-golf-light'
              }`}
            >
              Vertical
            </button>
          </div>

          {/* Preview area */}
          <div className="mb-6 flex justify-center">
            {isGenerating ? (
              <div className="flex flex-col items-center justify-center p-12 bg-neutral-offwhite rounded-xl">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-golf-emerald mb-4" />
                <p className="text-neutral-textSecondary">Generating image...</p>
              </div>
            ) : error ? (
              <div className="p-12 bg-red-50 rounded-xl text-center">
                <p className="text-red-600 mb-4">{error}</p>
                <Button onClick={() => void generateImage()} variant="outline">
                  Try Again
                </Button>
              </div>
            ) : (
              <div className="relative">
                {/* Hidden component for image generation */}
                <div ref={imageRef} className="absolute -left-[9999px] -top-[9999px]">
                  <ShareableImage data={data} aspectRatio={aspectRatio} />
                </div>

                {/* Preview */}
                {imageDataUrl ? (
                  <div className="border-2 border-neutral-border rounded-xl overflow-hidden">
                    <img
                      src={imageDataUrl}
                      alt="Shareable golf style"
                      className="w-full h-auto max-h-[400px] object-contain"
                    />
                  </div>
                ) : (
                  <div className="p-12 bg-neutral-offwhite rounded-xl text-center">
                    <p className="text-neutral-textSecondary">Click generate to create your shareable image</p>
                    <Button onClick={() => void generateImage()} variant="primary" className="mt-4">
                      Generate Image
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Sharing options */}
          <div className="space-y-4">
            {/* Social media buttons */}
            <div className="flex flex-wrap justify-center gap-3">
              <FacebookShareButton url="" quote={shareText}>
                <div className="flex items-center gap-2 px-4 py-2 bg-[#1877F2] text-white rounded-lg hover:bg-[#166FE5] transition-colors">
                  <FacebookIcon size={24} round={false} />
                  <span className="font-medium">Facebook</span>
                </div>
              </FacebookShareButton>

              <TwitterShareButton url="" title={shareTitle}>
                <div className="flex items-center gap-2 px-4 py-2 bg-[#1DA1F2] text-white rounded-lg hover:bg-[#1a91da] transition-colors">
                  <TwitterIcon size={24} round={false} />
                  <span className="font-medium">Twitter</span>
                </div>
              </TwitterShareButton>

              <LinkedinShareButton url="" title={shareTitle} summary={shareText}>
                <div className="flex items-center gap-2 px-4 py-2 bg-[#0077B5] text-white rounded-lg hover:bg-[#006399] transition-colors">
                  <LinkedinIcon size={24} round={false} />
                  <span className="font-medium">LinkedIn</span>
                </div>
              </LinkedinShareButton>

              <WhatsappShareButton url="" title={shareTitle}>
                <div className="flex items-center gap-2 px-4 py-2 bg-[#25D366] text-white rounded-lg hover:bg-[#20BA5A] transition-colors">
                  <WhatsappIcon size={24} round={false} />
                  <span className="font-medium">WhatsApp</span>
                </div>
              </WhatsappShareButton>
            </div>

            {/* Action buttons */}
            <div className="flex flex-wrap justify-center gap-3">
              <Button
                onClick={() => void handleCopyImage()}
                variant="outline"
                icon={imageCopied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                disabled={!imageDataUrl || isGenerating}
                className="min-h-[48px] text-base"
              >
                {imageCopied ? 'Copied!' : 'Copy Image'}
              </Button>

              <Button
                onClick={handleDownload}
                variant="outline"
                icon={<Download className="w-5 h-5" />}
                disabled={!imageDataUrl || isGenerating}
                className="min-h-[48px] text-base"
              >
                Download Image
              </Button>

              {isWebShareSupported && (
                <Button
                  onClick={() => void handleWebShare()}
                  variant="primary"
                  icon={<Share2 className="w-5 h-5" />}
                  disabled={!imageDataUrl || isGenerating}
                  className="min-h-[48px] text-base"
                >
                  Share
                </Button>
              )}
            </div>
          </div>
          </div>
        </div>
      </div>
    </div>
  )
}

