import { Palette, Music, Calendar, Users, Plus, LogOut } from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/hooks/useAuth"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface Wedding {
  id: string
  couple1_name: string
  couple2_name: string
  wedding_date: string | null
  copyright_text: string
}

interface DashboardSidebarProps {
  weddings: Wedding[]
  selectedWedding: Wedding | null
  onWeddingSelect: (wedding: Wedding) => void
  onCreateWedding: () => void
  activeTab: string
  onTabChange: (tab: 'design' | 'events' | 'guests' | 'music') => void
}

const navigationItems = [
  { id: 'design', title: 'Design', icon: Palette },
  { id: 'events', title: 'Events', icon: Calendar },
  { id: 'guests', title: 'Guests', icon: Users },
  { id: 'music', title: 'Music', icon: Music },
]

export function DashboardSidebar({
  weddings,
  selectedWedding,
  onWeddingSelect,
  onCreateWedding,
  activeTab,
  onTabChange
}: DashboardSidebarProps) {
  const { signOut } = useAuth()

  const handleSignOut = async () => {
    await signOut()
  }

  return (
    <Sidebar className="w-64">
      <SidebarContent>
        {/* Wedding Selection */}
        <SidebarGroup>
          <SidebarGroupLabel>Wedding</SidebarGroupLabel>
          <SidebarGroupContent>
            <div className="space-y-2">
              <Select
                value={selectedWedding?.id || ""}
                onValueChange={(value) => {
                  const wedding = weddings.find(w => w.id === value)
                  if (wedding) onWeddingSelect(wedding)
                }}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a wedding" />
                </SelectTrigger>
                <SelectContent>
                  {weddings.map((wedding) => (
                    <SelectItem key={wedding.id} value={wedding.id}>
                      {wedding.couple1_name} & {wedding.couple2_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Button 
                onClick={onCreateWedding} 
                variant="outline" 
                size="sm" 
                className="w-full gap-2"
              >
                <Plus className="h-4 w-4" />
                New Wedding
              </Button>
            </div>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Navigation */}
        <SidebarGroup>
          <SidebarGroupLabel>Customize</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton
                    onClick={() => onTabChange(item.id as any)}
                    isActive={activeTab === item.id}
                  >
                    <item.icon className="h-4 w-4" />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Account */}
        <SidebarGroup className="mt-auto">
          <SidebarGroupContent>
            <Button 
              onClick={handleSignOut}
              variant="outline" 
              size="sm" 
              className="w-full gap-2"
            >
              <LogOut className="h-4 w-4" />
              Sign Out
            </Button>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}