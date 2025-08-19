import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { AlertCircle, RefreshCw } from "lucide-react"

interface GameErrorProps {
  error: string
  onRetry: () => void
}

export function GameError({ error, onRetry }: GameErrorProps) {
  return (
    <div className="w-full max-w-4xl">
      <Card className="p-6 shadow-lg bg-gray-800 border-gray-700">
        <div className="text-center py-8">
          <AlertCircle className="h-12 w-12 text-red-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-red-400 mb-2">Error Loading Data</h2>
          <p className="text-gray-300 mb-6">{error}</p>
          <Button onClick={onRetry} variant="outline" className="border-gray-600 text-gray-200 hover:bg-gray-700">
            Try Again
            <RefreshCw className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </Card>
    </div>
  )
}
