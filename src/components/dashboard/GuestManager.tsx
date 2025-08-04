import { useState, useEffect } from "react"
import { supabase } from "@/integrations/supabase/client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { Users, Plus, Copy, Download, Upload } from "lucide-react"

interface Guest {
  id?: string
  full_name: string
  invitation_code: string
  rsvp_status: 'pending' | 'confirmed' | 'declined'
  meal_preference: string | null
  allergies: string | null
  plus_one: boolean
}

interface GuestManagerProps {
  weddingId: string
}

export function GuestManager({ weddingId }: GuestManagerProps) {
  const [guests, setGuests] = useState<Guest[]>([])
  const [newGuestName, setNewGuestName] = useState('')
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    fetchGuests()
  }, [weddingId])

  const fetchGuests = async () => {
    try {
      const { data, error } = await supabase
        .from('guests')
        .select('*')
        .eq('wedding_id', weddingId)
        .order('created_at', { ascending: true })

      if (error) throw error

      setGuests((data || []).map(guest => ({
        ...guest,
        rsvp_status: guest.rsvp_status as 'pending' | 'confirmed' | 'declined'
      })))
    } catch (error: any) {
      console.error('Error fetching guests:', error)
    }
  }

  const generateInvitationCode = () => {
    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789'
    let result = ''
    for (let i = 0; i < 8; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return result
  }

  const addGuest = async () => {
    if (!newGuestName.trim()) {
      toast({
        title: "Name required",
        description: "Please enter a guest name",
        variant: "destructive"
      })
      return
    }

    setLoading(true)
    try {
      const guestData = {
        wedding_id: weddingId,
        full_name: newGuestName.trim(),
        invitation_code: generateInvitationCode(),
        rsvp_status: 'pending' as const,
        meal_preference: null,
        allergies: null,
        plus_one: false
      }

      const { data, error } = await supabase
        .from('guests')
        .insert(guestData)
        .select()
        .single()

      if (error) throw error

      setGuests([...guests, { ...data, rsvp_status: data.rsvp_status as 'pending' | 'confirmed' | 'declined' }])
      setNewGuestName('')
      
      toast({
        title: "Guest added",
        description: `${newGuestName} has been added to your guest list`
      })
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to add guest",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const copyInvitationLink = (guest: Guest) => {
    const baseUrl = window.location.origin
    const invitationUrl = `${baseUrl}/invitation/${guest.invitation_code}`
    
    navigator.clipboard.writeText(invitationUrl).then(() => {
      toast({
        title: "Link copied",
        description: `Invitation link for ${guest.full_name} copied to clipboard`
      })
    })
  }

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'default'
      case 'declined':
        return 'destructive'
      default:
        return 'secondary'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'Confirmed'
      case 'declined':
        return 'Declined'
      default:
        return 'Pending'
    }
  }

  const exportGuestList = () => {
    const csvContent = [
      'Name,Invitation Code,RSVP Status,Meal Preference,Allergies,Plus One',
      ...guests.map(guest => 
        `"${guest.full_name}","${guest.invitation_code}","${guest.rsvp_status}","${guest.meal_preference || ''}","${guest.allergies || ''}","${guest.plus_one ? 'Yes' : 'No'}"`
      )
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'guest-list.csv'
    a.click()
    window.URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold mb-2">Guest Management</h2>
          <p className="text-muted-foreground">Manage your wedding guest list and RSVPs</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={exportGuestList} className="gap-2">
            <Download className="h-4 w-4" />
            Export CSV
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Add Guest
          </CardTitle>
          <CardDescription>
            Add guests to your wedding invitation list
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Input
              placeholder="Enter guest name"
              value={newGuestName}
              onChange={(e) => setNewGuestName(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addGuest()}
            />
            <Button onClick={addGuest} disabled={loading}>
              {loading ? "Adding..." : "Add Guest"}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Guest List ({guests.length})
          </CardTitle>
          <CardDescription>
            Manage individual guests and their invitation links
          </CardDescription>
        </CardHeader>
        <CardContent>
          {guests.length === 0 ? (
            <div className="text-center py-8">
              <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No guests yet</h3>
              <p className="text-muted-foreground">
                Add your first guest to get started
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {guests.map((guest) => (
                <div
                  key={guest.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <h4 className="font-medium">{guest.full_name}</h4>
                      <Badge variant={getStatusBadgeVariant(guest.rsvp_status)}>
                        {getStatusText(guest.rsvp_status)}
                      </Badge>
                      {guest.plus_one && (
                        <Badge variant="outline">+1</Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      Code: {guest.invitation_code}
                    </p>
                    {guest.meal_preference && (
                      <p className="text-sm text-muted-foreground">
                        Meal: {guest.meal_preference}
                      </p>
                    )}
                    {guest.allergies && (
                      <p className="text-sm text-muted-foreground">
                        Allergies: {guest.allergies}
                      </p>
                    )}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyInvitationLink(guest)}
                    className="gap-2"
                  >
                    <Copy className="h-4 w-4" />
                    Copy Link
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}