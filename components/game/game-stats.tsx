interface GameStatsProps {
  totalMatches: number
  correctMatches: number
  gameStartTime: number
  currentPoints: number
}

export function GameStats({ totalMatches, correctMatches, gameStartTime, currentPoints }: GameStatsProps) {
  const timeElapsed = Date.now() - gameStartTime
  const minutes = Math.floor(timeElapsed / 60000)
  const seconds = Math.floor((timeElapsed % 60000) / 1000)

  return (
    <div className="flex justify-center items-center space-x-6 mb-4">
      <div className="text-center">
        <div className="text-2xl font-bold text-blue-600">{totalMatches}</div>
        <div className="text-sm text-gray-600 dark:text-gray-400">Matches</div>
      </div>
      <div className="text-center">
        <div className="text-2xl font-bold text-green-600">{correctMatches}</div>
        <div className="text-sm text-gray-600 dark:text-gray-400">Correct</div>
      </div>
      <div className="text-center">
        <div className="text-2xl font-bold text-purple-600">{currentPoints}</div>
        <div className="text-sm text-gray-600 dark:text-gray-400">Points</div>
      </div>
      <div className="text-center">
        <div className="text-2xl font-bold text-orange-600">{minutes}:{seconds.toString().padStart(2, '0')}</div>
        <div className="text-sm text-gray-600 dark:text-gray-400">Time</div>
      </div>
    </div>
  )
}
