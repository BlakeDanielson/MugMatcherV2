export interface Inmate {
  id: number
  name: string
  image: string
  crime?: string
}

export interface GameResults {
  score: number
  total: number
  percentage: number
  submitted: boolean
  correctMatches: number[]
  pointsEarned: number
}

export interface MatchResult {
  isCorrect: boolean
  timeElapsed: number
  attemptCount: number
}

export interface GameSubmitParams {
  matches: Record<string, string | null>
  shuffledCrimeDescriptions: Inmate[]
  getInmateDataById: (id: string | number) => Inmate | undefined
  attemptCounts: Record<string, number>
  gameStartTime: number
  addPointsForMatches: (correctMatches: string[]) => number
  toast: (options: any) => void
  triggerHaptic: (type: string) => void
  formatPoints: (points: number) => string
}
