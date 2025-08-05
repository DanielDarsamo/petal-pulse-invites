import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { useWeddingPreview } from "@/contexts/WeddingPreviewContext"

interface QuoteCustomizerProps {
  weddingId: string
}

export function QuoteCustomizer({ weddingId }: QuoteCustomizerProps) {
  const { previewData, updateWedding } = useWeddingPreview()
  const [quote, setQuote] = useState("")
  const [author, setAuthor] = useState("")

  useEffect(() => {
    if (previewData.wedding) {
      setQuote(previewData.wedding.quote || "")
      setAuthor(previewData.wedding.quote_author || "")
    }
  }, [previewData.wedding])

  const handleQuoteChange = (value: string) => {
    setQuote(value)
    updateWedding({ quote: value })
  }

  const handleAuthorChange = (value: string) => {
    setAuthor(value)
    updateWedding({ quote_author: value })
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Quote or Verse</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="quote">Quote or Verse</Label>
            <Textarea
              id="quote"
              placeholder="Enter a meaningful quote, verse, or message..."
              value={quote}
              onChange={(e) => handleQuoteChange(e.target.value)}
              className="min-h-[100px]"
            />
          </div>
          
          <div>
            <Label htmlFor="author">Author or Source</Label>
            <Input
              id="author"
              placeholder="e.g., Shakespeare, Bible verse, etc."
              value={author}
              onChange={(e) => handleAuthorChange(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}