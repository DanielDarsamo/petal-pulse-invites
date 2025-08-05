import { useState } from "react"
import { Sidebar, SidebarContent, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { DashboardSidebar } from "./DashboardSidebar"
import { BackgroundCustomizer } from "./BackgroundCustomizer"
import { MusicManager } from "./MusicManager"
import { EventScheduler } from "./EventScheduler"
import { GuestManager } from "./GuestManager"
import { WeddingPreview } from "./WeddingPreview"
import { QuoteCustomizer } from "./QuoteCustomizer"
import { GiftRegistry } from "./GiftRegistry"
import { SeatingManager } from "./SeatingManager"
import { WeddingPreviewProvider } from "@/contexts/WeddingPreviewContext"

interface Wedding {
  id: string
  couple1_name: string
  couple2_name: string
  wedding_date: string | null
  copyright_text: string
}

interface DashboardLayoutProps {
  weddings: Wedding[]
  selectedWedding: Wedding | null
  onWeddingSelect: (wedding: Wedding) => void
  onCreateWedding: () => void
}

type ActiveTab = 'design' | 'events' | 'guests' | 'music' | 'quotes' | 'gifts' | 'seating'

export function DashboardLayout({ 
  weddings, 
  selectedWedding, 
  onWeddingSelect, 
  onCreateWedding 
}: DashboardLayoutProps) {
  const [activeTab, setActiveTab] = useState<ActiveTab>('design')

  const renderActiveTab = () => {
    if (!selectedWedding) return null

    switch (activeTab) {
      case 'design':
        return <BackgroundCustomizer weddingId={selectedWedding.id} />
      case 'music':
        return <MusicManager weddingId={selectedWedding.id} />
      case 'events':
        return <EventScheduler weddingId={selectedWedding.id} />
      case 'guests':
        return <GuestManager weddingId={selectedWedding.id} />
      case 'quotes':
        return <QuoteCustomizer weddingId={selectedWedding.id} />
      case 'gifts':
        return <GiftRegistry weddingId={selectedWedding.id} />
      case 'seating':
        return <SeatingManager weddingId={selectedWedding.id} />
      default:
        return <BackgroundCustomizer weddingId={selectedWedding.id} />
    }
  }

  return (
    <WeddingPreviewProvider weddingId={selectedWedding?.id}>
      <SidebarProvider>
        <div className="min-h-screen flex w-full">
          <DashboardSidebar
            weddings={weddings}
            selectedWedding={selectedWedding}
            onWeddingSelect={onWeddingSelect}
            onCreateWedding={onCreateWedding}
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />
          
          <main className="flex-1 flex">
            {/* Controls Panel */}
            <div className="w-1/2 border-r border-border p-6 overflow-y-auto">
              <div className="mb-6">
                <SidebarTrigger className="mb-4" />
                <h1 className="text-2xl font-bold mb-2">
                  {selectedWedding ? `${selectedWedding.couple1_name} & ${selectedWedding.couple2_name}` : 'Wedding Dashboard'}
                </h1>
                <p className="text-muted-foreground">
                  Customize your wedding invitation
                </p>
              </div>
              
              {renderActiveTab()}
            </div>
            
            {/* Preview Panel */}
            <div className="w-1/2 bg-muted/50">
              <WeddingPreview wedding={selectedWedding} />
            </div>
          </main>
        </div>
      </SidebarProvider>
    </WeddingPreviewProvider>
  )
}