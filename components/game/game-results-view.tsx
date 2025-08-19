import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Trophy, RefreshCw } from "lucide-react"
import { Inmate } from "./types"

interface GameResultsViewProps {
  results: any
  shuffledMugshotImages: Inmate[]
  shuffledCrimeDescriptions: Inmate[]
  matches: Record<string, string | null>
  getInmateDataById: (id: string | number) => Inmate | undefined
  onReset: () => void
  currentPoints: number
  highScore: number
  formatPoints: (points: number) => string
  gameStartTime: number
}

export function GameResultsView({
  results,
  shuffledMugshotImages,
  shuffledCrimeDescriptions,
  matches,
  getInmateDataById,
  onReset,
  currentPoints,
  highScore,
  formatPoints,
  gameStartTime
}: GameResultsViewProps) {
  const timeElapsed = Date.now() - gameStartTime
  const minutes = Math.floor(timeElapsed / 60000)
  const seconds = Math.floor((timeElapsed % 60000) / 1000)

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          Game Results
        </h1>
        
        {/* Results Summary */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 mb-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">{results.score}/{results.total}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Correct Matches</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">{results.percentage}%</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Accuracy</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">{formatPoints(currentPoints)}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Total Points</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600">{minutes}:{seconds.toString().padStart(2, '0')}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Time</div>
            </div>
          </div>
          
          {results.pointsEarned > 0 && (
            <div className="text-center mb-4">
              <div className="text-2xl font-bold text-green-600">+{results.pointsEarned} Points Earned!</div>
            </div>
          )}
          
          {currentPoints >= highScore && currentPoints > 0 && (
            <div className="text-amber-600 mt-4 flex items-center justify-center">
              <Trophy className="h-5 w-5 mr-2" />
              New High Score!
            </div>
          )}
        </div>

        {/* Action Button */}
        <Button
          onClick={onReset}
          className="px-10 py-6 bg-blue-600 hover:bg-blue-700 text-white border-none shadow-lg hover:shadow-blue-500/20 transition-all duration-300 hover:scale-[1.02] transform"
          size="lg"
        >
          Play Again
          <RefreshCw className="ml-2 h-5 w-5" />
        </Button>
      </div>
    </div>
  )
}
