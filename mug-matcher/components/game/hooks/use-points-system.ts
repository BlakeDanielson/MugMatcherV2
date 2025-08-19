import { useState, useEffect, useRef } from "react"

export function usePointsSystem() {
  const [currentPoints, setCurrentPoints] = useState<number>(0)
  const [highScore, setHighScore] = useState<number>(0)

  // Load points from localStorage on mount
  useEffect(() => {
    try {
      const savedPoints = localStorage.getItem('mugshot-game-points')
      const savedHighScore = localStorage.getItem('mugshot-game-high-score')
      
      if (savedPoints) {
        setCurrentPoints(parseInt(savedPoints, 10))
      }
      
      if (savedHighScore) {
        setHighScore(parseInt(savedHighScore, 10))
      }
    } catch (error) {
      console.error('Failed to load points from localStorage:', error)
    }
  }, [])

  // Save points to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem('mugshot-game-points', currentPoints.toString())
    } catch (error) {
      console.error('Failed to save points to localStorage:', error)
    }
  }, [currentPoints])

  // Save high score to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem('mugshot-game-high-score', highScore.toString())
    } catch (error) {
      console.error('Failed to save high score to localStorage:', error)
    }
  }, [highScore])

  // Add points for correct matches
  const addPointsForMatches = (correctMatches: string[]): number => {
    let totalPointsEarned = 0
    
    correctMatches.forEach(() => {
      // Base points for each correct match
      const basePoints = 10
      totalPointsEarned += basePoints
    })
    
    const newTotal = currentPoints + totalPointsEarned
    setCurrentPoints(newTotal)
    
    // Update high score if necessary
    if (newTotal > highScore) {
      setHighScore(newTotal)
    }
    
    return totalPointsEarned
  }

  // Reset points for current session
  const resetPoints = () => {
    setCurrentPoints(0)
  }

  // Format points for display
  const formatPoints = (points: number): string => {
    return points.toString()
  }

  return {
    currentPoints,
    highScore,
    resetPoints,
    addPointsForMatches,
    formatPoints
  }
}
