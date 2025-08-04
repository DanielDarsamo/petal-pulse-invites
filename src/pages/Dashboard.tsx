import { useEffect, useState } from "react"
import { useAuth } from "@/hooks/useAuth"
import { supabase } from "@/integrations/supabase/client"
import { DashboardLayout } from "@/components/dashboard/DashboardLayout"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Wedding {
  id: string
  couple1_name: string
  couple2_name: string
  wedding_date: string | null
  copyright_text: string
}

export default function Dashboard() {
  const { user } = useAuth()
  const [weddings, setWeddings] = useState<Wedding[]>([])
  const [selectedWedding, setSelectedWedding] = useState<Wedding | null>(null)
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    if (user) {
      fetchWeddings()
    }
  }, [user])

  const fetchWeddings = async () => {
    try {
      const { data, error } = await supabase
        .from('weddings')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false })

      if (error) throw error

      setWeddings(data || [])
      if (data && data.length > 0 && !selectedWedding) {
        setSelectedWedding(data[0])
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to load weddings",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const createWedding = async () => {
    try {
      const { data, error } = await supabase
        .from('weddings')
        .insert({
          user_id: user?.id,
          couple1_name: 'Partner 1',
          couple2_name: 'Partner 2',
          wedding_date: null,
          copyright_text: '© 2025 YourBrand'
        })
        .select()
        .single()

      if (error) throw error

      setWeddings([data, ...weddings])
      setSelectedWedding(data)
      
      toast({
        title: "Wedding created",
        description: "Your new wedding invitation has been created"
      })
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to create wedding",
        variant: "destructive"
      })
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  if (weddings.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 to-purple-50 dark:from-gray-900 dark:to-gray-800">
        <div className="text-center space-y-6 p-8">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold">Welcome to WebInvite</h1>
            <p className="text-muted-foreground text-lg">Create your first wedding invitation</p>
          </div>
          <Button onClick={createWedding} size="lg" className="gap-2">
            <Plus className="h-5 w-5" />
            Create Your First Wedding
          </Button>
        </div>
      </div>
    )
  }

  return (
    <DashboardLayout 
      weddings={weddings}
      selectedWedding={selectedWedding}
      onWeddingSelect={setSelectedWedding}
      onCreateWedding={createWedding}
    />
  )
}