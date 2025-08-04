import { useState, useEffect } from "react"
import { supabase } from "@/integrations/supabase/client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { useToast } from "@/hooks/use-toast"
import { Upload, Palette } from "lucide-react"

interface BackgroundData {
  id?: string
  image_url: string | null
  opacity: number
  blur: number
  overlay_color: string
}

interface BackgroundCustomizerProps {
  weddingId: string
}

export function BackgroundCustomizer({ weddingId }: BackgroundCustomizerProps) {
  const [background, setBackground] = useState<BackgroundData>({
    image_url: null,
    opacity: 85,
    blur: 3,
    overlay_color: '#FFFFFF33'
  })
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    fetchBackground()
  }, [weddingId])

  const fetchBackground = async () => {
    try {
      const { data, error } = await supabase
        .from('backgrounds')
        .select('*')
        .eq('wedding_id', weddingId)
        .maybeSingle()

      if (error) throw error

      if (data) {
        setBackground(data)
      }
    } catch (error: any) {
      console.error('Error fetching background:', error)
    }
  }

  const saveBackground = async () => {
    setLoading(true)
    try {
      const backgroundData = {
        wedding_id: weddingId,
        image_url: background.image_url,
        opacity: background.opacity,
        blur: background.blur,
        overlay_color: background.overlay_color
      }

      if (background.id) {
        const { error } = await supabase
          .from('backgrounds')
          .update(backgroundData)
          .eq('id', background.id)
        
        if (error) throw error
      } else {
        const { data, error } = await supabase
          .from('backgrounds')
          .insert(backgroundData)
          .select()
          .single()
        
        if (error) throw error
        setBackground({ ...background, id: data.id })
      }

      toast({
        title: "Background saved",
        description: "Your background settings have been updated"
      })
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to save background settings",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // For now, we'll use a placeholder URL
    // In a real app, you'd upload to Supabase Storage
    const imageUrl = URL.createObjectURL(file)
    setBackground({ ...background, image_url: imageUrl })
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-2">Background Design</h2>
        <p className="text-muted-foreground">Customize the background and visual style of your invitation</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Background Image
          </CardTitle>
          <CardDescription>
            Upload a custom background image for your invitation
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="background-upload">Upload Image</Label>
            <Input
              id="background-upload"
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="mt-1"
            />
          </div>
          
          {background.image_url && (
            <div className="space-y-4">
              <div>
                <Label>Opacity: {background.opacity}%</Label>
                <Slider
                  value={[background.opacity]}
                  onValueChange={(value) => setBackground({ ...background, opacity: value[0] })}
                  max={100}
                  min={0}
                  step={1}
                  className="mt-2"
                />
              </div>
              
              <div>
                <Label>Blur: {background.blur}px</Label>
                <Slider
                  value={[background.blur]}
                  onValueChange={(value) => setBackground({ ...background, blur: value[0] })}
                  max={20}
                  min={0}
                  step={1}
                  className="mt-2"
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="h-5 w-5" />
            Color Overlay
          </CardTitle>
          <CardDescription>
            Add a color overlay to enhance readability
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div>
            <Label htmlFor="overlay-color">Overlay Color</Label>
            <Input
              id="overlay-color"
              type="color"
              value={background.overlay_color.substring(0, 7)}
              onChange={(e) => setBackground({ ...background, overlay_color: e.target.value + '33' })}
              className="mt-1 h-10"
            />
          </div>
        </CardContent>
      </Card>

      <Button onClick={saveBackground} disabled={loading} className="w-full">
        {loading ? "Saving..." : "Save Changes"}
      </Button>
    </div>
  )
}