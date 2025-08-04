import { useState, useEffect } from "react"
import { supabase } from "@/integrations/supabase/client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { Calendar, MapPin, Plus, Trash2 } from "lucide-react"

interface Event {
  id?: string
  title: string
  event_time: string
  address: string
  latitude: number | null
  longitude: number | null
  marker_color: string
}

interface EventSchedulerProps {
  weddingId: string
}

export function EventScheduler({ weddingId }: EventSchedulerProps) {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    fetchEvents()
  }, [weddingId])

  const fetchEvents = async () => {
    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('wedding_id', weddingId)
        .order('event_time', { ascending: true })

      if (error) throw error

      setEvents(data || [])
    } catch (error: any) {
      console.error('Error fetching events:', error)
    }
  }

  const saveEvent = async (event: Event) => {
    setLoading(true)
    try {
      const eventData = {
        wedding_id: weddingId,
        title: event.title,
        event_time: event.event_time,
        address: event.address,
        latitude: event.latitude,
        longitude: event.longitude,
        marker_color: event.marker_color
      }

      if (event.id) {
        const { error } = await supabase
          .from('events')
          .update(eventData)
          .eq('id', event.id)
        
        if (error) throw error
      } else {
        const { data, error } = await supabase
          .from('events')
          .insert(eventData)
          .select()
          .single()
        
        if (error) throw error
        
        setEvents(events.map(e => e.id === undefined ? { ...e, id: data.id } : e))
      }

      toast({
        title: "Event saved",
        description: "Your event has been updated"
      })
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to save event",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const addEvent = () => {
    const newEvent: Event = {
      title: 'New Event',
      event_time: '',
      address: '',
      latitude: null,
      longitude: null,
      marker_color: '#FF6B6B'
    }
    setEvents([...events, newEvent])
  }

  const deleteEvent = async (eventId: string) => {
    try {
      const { error } = await supabase
        .from('events')
        .delete()
        .eq('id', eventId)

      if (error) throw error

      setEvents(events.filter(e => e.id !== eventId))
      
      toast({
        title: "Event deleted",
        description: "The event has been removed"
      })
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to delete event",
        variant: "destructive"
      })
    }
  }

  const updateEvent = (index: number, updates: Partial<Event>) => {
    const updatedEvents = [...events]
    updatedEvents[index] = { ...updatedEvents[index], ...updates }
    setEvents(updatedEvents)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold mb-2">Event Schedule</h2>
          <p className="text-muted-foreground">Manage your wedding events and timeline</p>
        </div>
        <Button onClick={addEvent} size="sm" className="gap-2">
          <Plus className="h-4 w-4" />
          Add Event
        </Button>
      </div>

      <div className="space-y-4">
        {events.map((event, index) => (
          <Card key={index}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Event {index + 1}
                </div>
                {event.id && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => deleteEvent(event.id!)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Event Name</Label>
                  <Input
                    value={event.title}
                    onChange={(e) => updateEvent(index, { title: e.target.value })}
                    placeholder="e.g., Ceremony"
                  />
                </div>
                <div>
                  <Label>Date & Time</Label>
                  <Input
                    type="datetime-local"
                    value={event.event_time}
                    onChange={(e) => updateEvent(index, { event_time: e.target.value })}
                  />
                </div>
              </div>
              
              <div>
                <Label className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  Address
                </Label>
                <Input
                  value={event.address}
                  onChange={(e) => updateEvent(index, { address: e.target.value })}
                  placeholder="Enter venue address"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Marker Color</Label>
                  <Input
                    type="color"
                    value={event.marker_color}
                    onChange={(e) => updateEvent(index, { marker_color: e.target.value })}
                    className="h-10"
                  />
                </div>
                <div className="flex items-end">
                  <Button
                    onClick={() => saveEvent(event)}
                    disabled={loading}
                    className="w-full"
                  >
                    {loading ? "Saving..." : "Save Event"}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {events.length === 0 && (
          <Card>
            <CardContent className="text-center py-8">
              <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No events yet</h3>
              <p className="text-muted-foreground mb-4">
                Add your first event to get started
              </p>
              <Button onClick={addEvent} className="gap-2">
                <Plus className="h-4 w-4" />
                Add Your First Event
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}