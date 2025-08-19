import { Button } from "@/components/ui/button"
import { ArrowRightLeft, RefreshCw } from "lucide-react"

interface CleanGameControlsProps {
  onSubmit: () => void
  onReset: () => void
  canSubmit: boolean
  isSubmitting: boolean
  matchCount: number
  totalMatches: number
  className?: string
}

export function CleanGameControls({ 
  onSubmit, 
  onReset, 
  canSubmit, 
  isSubmitting, 
  matchCount, 
  totalMatches, 
  className = "" 
}: CleanGameControlsProps) {
  return (
    <div className={`flex justify-center gap-4 ${className}`}>
      {!isSubmitting ? (
        <Button
          onClick={onSubmit}
          disabled={!canSubmit}
          className="px-10 py-6 bg-blue-600 hover:bg-blue-700 text-white border-none shadow-lg hover:shadow-blue-500/20 transition-all duration-300 hover:scale-[1.02] transform submit-button glow-effect disabled:opacity-50 disabled:cursor-not-allowed"
          size="lg"
        >
          Submit Answers
          <ArrowRightLeft className="ml-2 h-5 w-5" />
        </Button>
      ) : (
        <Button
          onClick={onReset}
          className="px-10 py-6 border-gray-600 text-gray-200 hover:bg-gray-700 shadow-lg hover:shadow-gray-500/10 transition-all duration-300 hover:scale-[1.02] transform submit-button"
          size="lg"
          variant="outline"
        >
          Play Again
          <RefreshCw className="ml-2 h-5 w-5" />
        </Button>
      )}
    </div>
  )
}
