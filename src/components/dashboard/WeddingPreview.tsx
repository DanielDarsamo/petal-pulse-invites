import { useState, useEffect } from "react"
import { supabase } from "@/integrations/supabase/client"
import { useWeddingPreview } from "@/contexts/WeddingPreviewContext"

interface Wedding {
  id: string
  couple1_name: string
  couple2_name: string
  wedding_date: string | null
  copyright_text: string
}

interface Background {
  image_url: string | null
  opacity: number
  blur: number
  overlay_color: string
}

interface Event {
  id: string
  title: string
  event_time: string
  address: string
  marker_color: string
}

interface WeddingPreviewProps {
  wedding: Wedding | null
}

export function WeddingPreview({ wedding }: WeddingPreviewProps) {
  const { previewData } = useWeddingPreview()
  
  // Use real-time preview data when available, fallback to props
  const displayWedding = previewData.wedding || wedding
  const background = previewData.background
  const events = previewData.events
  const quote = previewData.wedding?.quote
  const quoteAuthor = previewData.wedding?.quote_author

  const generateMonogram = () => {
    if (!displayWedding) return 'A&B'
    const initial1 = displayWedding.couple1_name.charAt(0).toUpperCase()
    const initial2 = displayWedding.couple2_name.charAt(0).toUpperCase()
    return `${initial1}&${initial2}`
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return null
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const formatEventTime = (timeString: string) => {
    const date = new Date(timeString)
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    })
  }

  if (!wedding) {
    return (
      <div className="h-full flex items-center justify-center bg-muted">
        <p className="text-muted-foreground">Select a wedding to preview</p>
      </div>
    )
  }

  const backgroundStyle = background ? {
    backgroundImage: background.image_url ? `url(${background.image_url})` : undefined,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    filter: background.image_url ? `blur(${background.blur}px)` : undefined,
    opacity: background.image_url ? background.opacity / 100 : 1,
  } : {}

  const overlayStyle = background ? {
    backgroundColor: background.overlay_color,
  } : {}

  return (
    <div className="h-full relative overflow-hidden">
      {/* Background */}
      {background?.image_url && (
        <div
          className="absolute inset-0"
          style={backgroundStyle}
        />
      )}
      
      {/* Overlay */}
      {background && (
        <div
          className="absolute inset-0"
          style={overlayStyle}
        />
      )}

      {/* Content */}
      <div className="relative h-full flex flex-col items-center justify-center p-8 text-center">
        {/* Monogram */}
        <div className="mb-8">
          <div className="w-24 h-24 rounded-full border-4 border-white/80 flex items-center justify-center bg-white/20 backdrop-blur-sm">
            <span className="text-2xl font-bold text-white">
              {generateMonogram()}
            </span>
          </div>
        </div>

        {/* Names */}
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 drop-shadow-lg">
          {wedding.couple1_name}
          <span className="text-pink-200 mx-4">&</span>
          {wedding.couple2_name}
        </h1>

        {/* Date */}
        {wedding.wedding_date && (
          <p className="text-xl text-white/90 mb-8 drop-shadow">
            {formatDate(wedding.wedding_date)}
          </p>
        )}

        {/* Welcome Message */}
        <div className="bg-white/90 backdrop-blur-sm rounded-lg p-6 mb-8 max-w-md">
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">
            You're Invited!
          </h2>
          <p className="text-gray-600">
            Join us as we celebrate our special day
          </p>
        </div>

        {/* Events Preview */}
        {events.length > 0 && (
          <div className="bg-white/90 backdrop-blur-sm rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Event Schedule
            </h3>
            <div className="space-y-3">
              {events.slice(0, 3).map((event) => (
                <div key={event.id} className="flex items-center gap-3">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: event.marker_color }}
                  />
                  <div className="flex-1 text-left">
                    <p className="font-medium text-gray-800">{event.title}</p>
                    <p className="text-sm text-gray-600">
                      {formatEventTime(event.event_time)}
                    </p>
                  </div>
                </div>
              ))}
              {events.length > 3 && (
                <p className="text-sm text-gray-500 text-center">
                  +{events.length - 3} more events
                </p>
              )}
            </div>
          </div>
        )}

        {/* Copyright */}
        <div className="mt-auto">
          <p className="text-white/60 text-sm drop-shadow">
            {wedding.copyright_text}
          </p>
        </div>
      </div>
    </div>
  )
}