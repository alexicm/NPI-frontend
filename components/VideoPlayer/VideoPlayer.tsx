"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { Loader2, AlertCircle } from "lucide-react"
import { cn } from "@/lib/utils"

interface VideoPlayerProps {
  videoUrl: string
  className?: string
}

export default function VideoPlayer({ videoUrl, className }: VideoPlayerProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    // This effect runs when videoUrl changes OR when the component mounts.
    // Due to key={videoUrl} on <video>, videoRef.current will refer to a new DOM element
    // each time videoUrl changes, so its internal state is fresh.

    setIsLoading(true)
    setError(null)

    const videoElement = videoRef.current // Capture for cleanup

    // The browser will attempt to load the source of the new keyed <video> element automatically.
    // Event handlers (onLoadedData, onError) will manage isLoading and error states.

    // Cleanup function:
    // This will run when videoUrl changes (cleaning up the *old* video element because it's unmounted)
    // OR when the VideoPlayer component itself unmounts (cleaning up the current video element).
    return () => {
      if (videoElement) {
        videoElement.pause()
        // Setting src to empty string can help stop any ongoing download/streaming
        // and release resources, especially if the browser doesn't do it immediately on unmount.
        videoElement.src = ""
        // Detach event handlers to prevent memory leaks if they were manually added,
        // though React handles props-based listeners well.
      }
    }
  }, [videoUrl]) // Re-run this effect if videoUrl changes.

  const handleLoadedData = useCallback(() => {
    setIsLoading(false)
    setError(null)
  }, [])

  const handleError = useCallback(() => {
    const currentVideoElement = videoRef.current
    let errorMessage = "Erro ao carregar o vídeo." // Default error

    if (currentVideoElement && currentVideoElement.error) {
      switch (currentVideoElement.error.code) {
        case MediaError.MEDIA_ERR_ABORTED:
          errorMessage = "A reprodução do vídeo foi abortada."
          break
        case MediaError.MEDIA_ERR_NETWORK:
          errorMessage = "Ocorreu um erro de rede ao carregar o vídeo."
          break
        case MediaError.MEDIA_ERR_DECODE:
          errorMessage = "Ocorreu um erro ao decodificar o vídeo."
          break
        case MediaError.MEDIA_ERR_SRC_NOT_SUPPORTED:
          errorMessage = "O formato do vídeo não é suportado ou a fonte é inválida."
          break
        default:
          errorMessage = "Ocorreu um erro desconhecido ao tentar carregar o vídeo."
      }
    } else if (!videoUrl) {
      errorMessage = "Nenhuma URL de vídeo fornecida."
    } else if (currentVideoElement && !currentVideoElement.currentSrc && videoUrl) {
      // This case might be covered by MEDIA_ERR_SRC_NOT_SUPPORTED if URL is bad
      errorMessage = "Fonte do vídeo inválida ou não encontrada."
    }

    setError(errorMessage)
    setIsLoading(false)
  }, [videoUrl]) // Include videoUrl if error logic depends on it

  return (
    <div
      className={cn(
        "relative w-full max-w-3xl mx-auto",
        "bg-gray-100 dark:bg-gray-800",
        "rounded-lg overflow-hidden",
        "shadow-md",
        className,
      )}
    >
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-800">
          <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
          <span className="sr-only">Carregando vídeo...</span>
        </div>
      )}

      {error &&
        !isLoading && ( // Show error only if not loading
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-red-50 dark:bg-red-900/20 p-4">
            <AlertCircle className="w-8 h-8 text-red-500 mb-2" />
            <p className="text-red-600 dark:text-red-400 text-sm sm:text-base text-center">{error}</p>
          </div>
        )}

      <video
        // Force re-mount on URL change by using a unique key.
        // Use a placeholder if videoUrl is null/undefined to ensure key always exists.
        key={videoUrl || "no-video-source"}
        ref={videoRef}
        controls
        className={cn(
          "w-full h-auto",
          "max-h-[70vh]",
          "bg-black",
          // Hide video element if loading or if there's an error (and not simultaneously loading)
          isLoading || (error && !isLoading) ? "invisible" : "visible",
        )}
        onLoadedData={handleLoadedData}
        onError={handleError}
        playsInline // Important for iOS and improves user experience on mobile
        preload="metadata" // Browser hint: load metadata (duration, dimensions) quickly
      >
        {/* Conditionally render source only if videoUrl is valid */}
        {videoUrl && <source src={videoUrl} type="video/mp4" />}
        {/* For accessibility, provide text tracks if available */}
        <track kind="captions" />
        <p className="text-center p-4 bg-gray-100 dark:bg-gray-800 text-foreground">
          Seu navegador não suporta a reprodução de vídeos.
        </p>
      </video>
    </div>
  )
}
