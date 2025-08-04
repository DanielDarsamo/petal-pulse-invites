import { useState, useEffect } from "react"
import { supabase } from "@/integrations/supabase/client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/hooks/use-toast"
import { Music, Upload, Volume2 } from "lucide-react"

interface MusicData {
  id?: string
  file_path: string
  volume: number
  autoplay: boolean
}

interface MusicManagerProps {
  weddingId: string
}

export function MusicManager({ weddingId }: MusicManagerProps) {
  const [music, setMusic] = useState<MusicData>({
    file_path: '',
    volume: 75,
    autoplay: true
  })
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    fetchMusic()
  }, [weddingId])

  const fetchMusic = async () => {
    try {
      const { data, error } = await supabase
        .from('music')
        .select('*')
        .eq('wedding_id', weddingId)
        .maybeSingle()

      if (error) throw error

      if (data) {
        setMusic(data)
      }
    } catch (error: any) {
      console.error('Error fetching music:', error)
    }
  }

  const saveMusic = async () => {
    if (!music.file_path) {
      toast({
        title: "No music file",
        description: "Please upload a music file first",
        variant: "destructive"
      })
      return
    }

    setLoading(true)
    try {
      const musicData = {
        wedding_id: weddingId,
        file_path: music.file_path,
        volume: music.volume,
        autoplay: music.autoplay
      }

      if (music.id) {
        const { error } = await supabase
          .from('music')
          .update(musicData)
          .eq('id', music.id)
        
        if (error) throw error
      } else {
        const { data, error } = await supabase
          .from('music')
          .insert(musicData)
          .select()
          .single()
        
        if (error) throw error
        setMusic({ ...music, id: data.id })
      }

      toast({
        title: "Music saved",
        description: "Your music settings have been updated"
      })
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to save music settings",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const handleMusicUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // For now, we'll use a placeholder path
    // In a real app, you'd upload to Supabase Storage
    const filePath = `/music/${file.name}`
    setMusic({ ...music, file_path: filePath })
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-2">Music Settings</h2>
        <p className="text-muted-foreground">Add background music to your wedding invitation</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Upload Music
          </CardTitle>
          <CardDescription>
            Upload an MP3 or WAV file for your invitation background music
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="music-upload">Music File</Label>
            <Input
              id="music-upload"
              type="file"
              accept="audio/*"
              onChange={handleMusicUpload}
              className="mt-1"
            />
            {music.file_path && (
              <p className="text-sm text-muted-foreground mt-1">
                Current: {music.file_path}
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Volume2 className="h-5 w-5" />
            Playback Settings
          </CardTitle>
          <CardDescription>
            Configure how your music will play
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Label>Volume: {music.volume}%</Label>
            <Slider
              value={[music.volume]}
              onValueChange={(value) => setMusic({ ...music, volume: value[0] })}
              max={100}
              min={0}
              step={1}
              className="mt-2"
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="autoplay">Autoplay</Label>
              <p className="text-sm text-muted-foreground">
                Start playing music automatically when guests visit
              </p>
            </div>
            <Switch
              id="autoplay"
              checked={music.autoplay}
              onCheckedChange={(checked) => setMusic({ ...music, autoplay: checked })}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Music className="h-5 w-5" />
            Music Library
          </CardTitle>
          <CardDescription>
            Or choose from our royalty-free music collection
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Music library coming soon...
          </p>
        </CardContent>
      </Card>

      <Button onClick={saveMusic} disabled={loading} className="w-full">
        {loading ? "Saving..." : "Save Music Settings"}
      </Button>
    </div>
  )
}