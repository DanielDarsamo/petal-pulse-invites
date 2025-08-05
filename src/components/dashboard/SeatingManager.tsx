import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { Search, Users, Download } from "lucide-react"
import { useWeddingPreview, Guest } from "@/contexts/WeddingPreviewContext"

interface SeatingManagerProps {
  weddingId: string
}

export function SeatingManager({ weddingId }: SeatingManagerProps) {
  const { previewData, updateGuests } = useWeddingPreview()
  const [guests, setGuests] = useState<Guest[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [filterTable, setFilterTable] = useState<string>("all")

  useEffect(() => {
    setGuests(previewData.guests)
  }, [previewData.guests])

  const updateGuest = (id: string, updates: Partial<Guest>) => {
    const updatedGuests = guests.map(guest => 
      guest.id === id ? { ...guest, ...updates } : guest
    )
    setGuests(updatedGuests)
    updateGuests(updatedGuests)
  }

  const filteredGuests = guests.filter(guest => {
    const matchesSearch = guest.full_name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesTable = filterTable === "all" || 
      (filterTable === "unassigned" && !guest.table_number) ||
      (filterTable !== "unassigned" && guest.table_number?.toString() === filterTable)
    return matchesSearch && matchesTable
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'attending': return 'default'
      case 'not_attending': return 'destructive'
      case 'pending': return 'secondary'
      default: return 'outline'
    }
  }

  const tableNumbers = [...new Set(guests.map(g => g.table_number).filter(Boolean))].sort((a, b) => (a || 0) - (b || 0))
  const unassignedCount = guests.filter(g => !g.table_number).length
  const totalGuests = guests.length
  const plusOnesAllowed = guests.filter(g => g.plus_one).length

  const exportSeatingChart = () => {
    const csv = [
      ['Name', 'Table', 'Plus One', 'RSVP Status', 'Meal Preference', 'Dietary Restrictions'].join(','),
      ...guests.map(guest => [
        guest.full_name,
        guest.table_number || 'Unassigned',
        guest.plus_one ? 'Yes' : 'No',
        guest.rsvp_status,
        guest.meal_preference || '',
        guest.dietary_restrictions || ''
      ].join(','))
    ].join('\n')

    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'seating-chart.csv'
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Seating & Guest Management</h2>
        <Button onClick={exportSeatingChart}>
          <Download className="w-4 h-4 mr-2" />
          Export Chart
        </Button>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <Users className="w-8 h-8 mx-auto mb-2 text-primary" />
            <div className="text-2xl font-bold">{totalGuests}</div>
            <div className="text-sm text-muted-foreground">Total Guests</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold">{plusOnesAllowed}</div>
            <div className="text-sm text-muted-foreground">Plus Ones Allowed</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold">{tableNumbers.length}</div>
            <div className="text-sm text-muted-foreground">Tables Assigned</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold">{unassignedCount}</div>
            <div className="text-sm text-muted-foreground">Unassigned</div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter */}
      <div className="flex gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search guests..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        <Select value={filterTable} onValueChange={setFilterTable}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by table" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Tables</SelectItem>
            <SelectItem value="unassigned">Unassigned</SelectItem>
            {tableNumbers.map(table => (
              <SelectItem key={table} value={table.toString()}>
                Table {table}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Guest List */}
      <div className="space-y-4">
        {filteredGuests.map((guest) => (
          <Card key={guest.id}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <h3 className="font-semibold">{guest.full_name}</h3>
                  <Badge variant={getStatusColor(guest.rsvp_status)}>
                    {guest.rsvp_status}
                  </Badge>
                  {guest.plus_one && (
                    <Badge variant="outline">Plus One</Badge>
                  )}
                </div>
                <div className="text-sm text-muted-foreground">
                  Code: {guest.invitation_code}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor={`table-${guest.id}`}>Table Number</Label>
                  <Input
                    id={`table-${guest.id}`}
                    type="number"
                    value={guest.table_number || ""}
                    onChange={(e) => updateGuest(guest.id, { 
                      table_number: e.target.value ? parseInt(e.target.value) : undefined 
                    })}
                    placeholder="Table #"
                  />
                </div>
                <div>
                  <Label htmlFor={`meal-${guest.id}`}>Meal Preference</Label>
                  <Input
                    id={`meal-${guest.id}`}
                    value={guest.meal_preference || ""}
                    onChange={(e) => updateGuest(guest.id, { meal_preference: e.target.value })}
                    placeholder="e.g., Chicken, Vegetarian"
                  />
                </div>
                <div className="flex items-center space-x-2 pt-6">
                  <Switch
                    id={`plus-one-${guest.id}`}
                    checked={guest.plus_one}
                    onCheckedChange={(checked) => updateGuest(guest.id, { plus_one: checked })}
                  />
                  <Label htmlFor={`plus-one-${guest.id}`}>Plus One Allowed</Label>
                </div>
              </div>

              <div className="mt-4">
                <Label htmlFor={`dietary-${guest.id}`}>Dietary Restrictions</Label>
                <Textarea
                  id={`dietary-${guest.id}`}
                  value={guest.dietary_restrictions || ""}
                  onChange={(e) => updateGuest(guest.id, { dietary_restrictions: e.target.value })}
                  placeholder="Any dietary restrictions or special requirements..."
                  rows={2}
                />
              </div>
            </CardContent>
          </Card>
        ))}

        {filteredGuests.length === 0 && (
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-muted-foreground">
                {searchTerm ? 'No guests match your search.' : 'No guests found.'}
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}