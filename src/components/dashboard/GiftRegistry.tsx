import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Plus, Trash2, MapPin } from "lucide-react"
import { useWeddingPreview, GiftItem } from "@/contexts/WeddingPreviewContext"

interface GiftRegistryProps {
  weddingId: string
}

export function GiftRegistry({ weddingId }: GiftRegistryProps) {
  const { previewData, updateGifts } = useWeddingPreview()
  const [gifts, setGifts] = useState<GiftItem[]>([])

  useEffect(() => {
    setGifts(previewData.gifts)
  }, [previewData.gifts])

  const addGift = () => {
    const newGift: GiftItem = {
      id: Date.now().toString(),
      name: "",
      description: "",
      price_range: "",
      priority: 'medium',
      status: 'available',
      category: 'home'
    }
    const updatedGifts = [...gifts, newGift]
    setGifts(updatedGifts)
    updateGifts(updatedGifts)
  }

  const updateGift = (id: string, updates: Partial<GiftItem>) => {
    const updatedGifts = gifts.map(gift => 
      gift.id === id ? { ...gift, ...updates } : gift
    )
    setGifts(updatedGifts)
    updateGifts(updatedGifts)
  }

  const deleteGift = (id: string) => {
    const updatedGifts = gifts.filter(gift => gift.id !== id)
    setGifts(updatedGifts)
    updateGifts(updatedGifts)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'default'
      case 'reserved': return 'secondary'
      case 'purchased': return 'destructive'
      default: return 'default'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'destructive'
      case 'medium': return 'secondary'
      case 'low': return 'outline'
      default: return 'default'
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Gift Registry</h2>
        <Button onClick={addGift}>
          <Plus className="w-4 h-4 mr-2" />
          Add Gift
        </Button>
      </div>

      <div className="space-y-4">
        {gifts.map((gift) => (
          <Card key={gift.id}>
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div className="flex gap-2">
                  <Badge variant={getStatusColor(gift.status)}>
                    {gift.status}
                  </Badge>
                  <Badge variant={getPriorityColor(gift.priority)}>
                    {gift.priority} priority
                  </Badge>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => deleteGift(gift.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor={`name-${gift.id}`}>Gift Name</Label>
                  <Input
                    id={`name-${gift.id}`}
                    value={gift.name}
                    onChange={(e) => updateGift(gift.id, { name: e.target.value })}
                    placeholder="e.g., Coffee Maker"
                  />
                </div>
                <div>
                  <Label htmlFor={`price-${gift.id}`}>Price Range</Label>
                  <Input
                    id={`price-${gift.id}`}
                    value={gift.price_range}
                    onChange={(e) => updateGift(gift.id, { price_range: e.target.value })}
                    placeholder="e.g., $50-100"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor={`description-${gift.id}`}>Description</Label>
                <Textarea
                  id={`description-${gift.id}`}
                  value={gift.description}
                  onChange={(e) => updateGift(gift.id, { description: e.target.value })}
                  placeholder="Describe the gift item..."
                  rows={2}
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label>Priority</Label>
                  <Select
                    value={gift.priority}
                    onValueChange={(value: 'high' | 'medium' | 'low') => 
                      updateGift(gift.id, { priority: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Status</Label>
                  <Select
                    value={gift.status}
                    onValueChange={(value: 'available' | 'reserved' | 'purchased') => 
                      updateGift(gift.id, { status: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="available">Available</SelectItem>
                      <SelectItem value="reserved">Reserved</SelectItem>
                      <SelectItem value="purchased">Purchased</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor={`category-${gift.id}`}>Category</Label>
                  <Input
                    id={`category-${gift.id}`}
                    value={gift.category || ""}
                    onChange={(e) => updateGift(gift.id, { category: e.target.value })}
                    placeholder="e.g., home, experience"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor={`store-${gift.id}`}>Store Name</Label>
                  <Input
                    id={`store-${gift.id}`}
                    value={gift.store_name || ""}
                    onChange={(e) => updateGift(gift.id, { store_name: e.target.value })}
                    placeholder="e.g., Target, Amazon"
                  />
                </div>
                <div>
                  <Label htmlFor={`url-${gift.id}`}>Store URL</Label>
                  <Input
                    id={`url-${gift.id}`}
                    value={gift.store_url || ""}
                    onChange={(e) => updateGift(gift.id, { store_url: e.target.value })}
                    placeholder="https://..."
                  />
                </div>
              </div>

              {gift.store_name && (
                <Button variant="outline" size="sm">
                  <MapPin className="w-4 h-4 mr-2" />
                  View Store Locations
                </Button>
              )}
            </CardContent>
          </Card>
        ))}

        {gifts.length === 0 && (
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-muted-foreground mb-4">No gifts added yet</p>
              <Button onClick={addGift}>
                <Plus className="w-4 h-4 mr-2" />
                Add Your First Gift
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}