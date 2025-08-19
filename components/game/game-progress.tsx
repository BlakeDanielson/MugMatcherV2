interface GameProgressProps {
  totalMatches: number
  maxMatches: number
}

export function GameProgress({ totalMatches, maxMatches }: GameProgressProps) {
  const percentage = maxMatches > 0 ? (totalMatches / maxMatches) * 100 : 0

  return (
    <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
      <div 
        className="bg-blue-600 h-2.5 rounded-full transition-all duration-300 ease-out"
        style={{ width: `${percentage}%` }}
      ></div>
    </div>
  )
}
