import { createContext, useContext, useState, useEffect, ReactNode } from "react"

export interface WeddingData {
  id: string
  couple1_name: string
  couple2_name: string
  wedding_date: string | null
  copyright_text: string
  quote?: string
  quote_author?: string
}

export interface Background {
  image_url: string | null
  opacity: number
  blur: number
  overlay_color: string
}

export interface Event {
  id: string
  title: string
  event_time: string
  address: string
  marker_color: string
  description?: string
  latitude?: number
  longitude?: number
}

export interface GiftItem {
  id: string
  name: string
  description: string
  price_range: string
  priority: 'high' | 'medium' | 'low'
  store_name?: string
  store_url?: string
  image_url?: string
  status: 'available' | 'reserved' | 'purchased'
  category?: string
}

export interface Guest {
  id: string
  full_name: string
  invitation_code: string
  rsvp_status: 'pending' | 'attending' | 'not_attending'
  meal_preference?: string
  allergies?: string
  plus_one: boolean
  table_number?: number
  dietary_restrictions?: string
}

export interface WeddingPreviewData {
  wedding: WeddingData | null
  background: Background | null
  events: Event[]
  gifts: GiftItem[]
  guests: Guest[]
  music: {
    file_path?: string
    volume: number
    autoplay: boolean
  } | null
}

interface WeddingPreviewContextType {
  previewData: WeddingPreviewData
  updateWedding: (wedding: Partial<WeddingData>) => void
  updateBackground: (background: Partial<Background>) => void
  updateEvents: (events: Event[]) => void
  updateGifts: (gifts: GiftItem[]) => void
  updateGuests: (guests: Guest[]) => void
  updateMusic: (music: Partial<WeddingPreviewData['music']>) => void
  setInitialData: (data: WeddingPreviewData) => void
}

const WeddingPreviewContext = createContext<WeddingPreviewContextType | undefined>(undefined)

interface WeddingPreviewProviderProps {
  children: ReactNode
  weddingId?: string
}

export function WeddingPreviewProvider({ children, weddingId }: WeddingPreviewProviderProps) {
  const [previewData, setPreviewData] = useState<WeddingPreviewData>({
    wedding: null,
    background: null,
    events: [],
    gifts: [],
    guests: [],
    music: null
  })

  // Load data from localStorage on mount
  useEffect(() => {
    if (weddingId) {
      const savedData = localStorage.getItem(`wedding-preview-${weddingId}`)
      if (savedData) {
        try {
          const parsedData = JSON.parse(savedData)
          setPreviewData(parsedData)
        } catch (error) {
          console.error('Error loading saved wedding data:', error)
        }
      }
    }
  }, [weddingId])

  // Save data to localStorage whenever previewData changes
  useEffect(() => {
    if (weddingId && previewData.wedding) {
      localStorage.setItem(`wedding-preview-${weddingId}`, JSON.stringify(previewData))
    }
  }, [previewData, weddingId])

  const updateWedding = (wedding: Partial<WeddingData>) => {
    setPreviewData(prev => ({
      ...prev,
      wedding: prev.wedding ? { ...prev.wedding, ...wedding } : null
    }))
  }

  const updateBackground = (background: Partial<Background>) => {
    setPreviewData(prev => ({
      ...prev,
      background: prev.background ? { ...prev.background, ...background } : background as Background
    }))
  }

  const updateEvents = (events: Event[]) => {
    setPreviewData(prev => ({
      ...prev,
      events
    }))
  }

  const updateGifts = (gifts: GiftItem[]) => {
    setPreviewData(prev => ({
      ...prev,
      gifts
    }))
  }

  const updateGuests = (guests: Guest[]) => {
    setPreviewData(prev => ({
      ...prev,
      guests
    }))
  }

  const updateMusic = (music: Partial<WeddingPreviewData['music']>) => {
    setPreviewData(prev => ({
      ...prev,
      music: prev.music ? { ...prev.music, ...music } : music as WeddingPreviewData['music']
    }))
  }

  const setInitialData = (data: WeddingPreviewData) => {
    setPreviewData(data)
  }

  return (
    <WeddingPreviewContext.Provider value={{
      previewData,
      updateWedding,
      updateBackground,
      updateEvents,
      updateGifts,
      updateGuests,
      updateMusic,
      setInitialData
    }}>
      {children}
    </WeddingPreviewContext.Provider>
  )
}

export function useWeddingPreview() {
  const context = useContext(WeddingPreviewContext)
  if (!context) {
    throw new Error('useWeddingPreview must be used within a WeddingPreviewProvider')
  }
  return context
}