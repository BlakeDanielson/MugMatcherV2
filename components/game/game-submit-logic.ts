import { GameSubmitParams, GameResults } from "./types"

export function submitGame(params: GameSubmitParams): GameResults | null {
  const {
    matches,
    shuffledCrimeDescriptions,
    getInmateDataById,
    attemptCounts,
    gameStartTime,
    addPointsForMatches,
    toast,
    triggerHaptic,
    formatPoints
  } = params

  // Check if all crime descriptions have been matched with a mugshot image
  const allDescriptionsMatched = shuffledCrimeDescriptions.length === Object.values(matches).filter(v => v !== null).length

  if (!allDescriptionsMatched) {
    toast({
      title: "Incomplete Matches",
      description: "Please match all images before submitting.",
      variant: "destructive",
    })
    return null
  }

  // Calculate score
  const correctMatches = Object.entries(matches)
    .filter(([descriptionId, matchedMugshotId]) => 
      matchedMugshotId !== null && descriptionId === matchedMugshotId
    )
    .map(([descriptionId]) => descriptionId)

  const score = correctMatches.length
  const total = shuffledCrimeDescriptions.length
  const percentage = total > 0 ? Math.round((score / total) * 100) : 0

  // Calculate points
  const totalPointsEarned = addPointsForMatches(correctMatches)

  // Trigger haptic feedback
  if (score === total && total > 0) {
    triggerHaptic('success')
  } else {
    triggerHaptic('error')
  }

  // Show toast with results
  toast({
    title: `Your Score: ${score}/${total}`,
    description: `You got ${percentage}% correct! ${totalPointsEarned > 0 ? `+${formatPoints(totalPointsEarned)} points!` : ''}`,
    variant: score === total && total > 0 ? "default" : "destructive",
  })

  return {
    score,
    total,
    percentage,
    submitted: true,
    correctMatches: correctMatches.map(id => Number(id)),
    pointsEarned: totalPointsEarned
  }
}
