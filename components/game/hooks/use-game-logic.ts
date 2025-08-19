import { useState, useEffect, useRef } from "react"
import { useToast } from "@/hooks/use-toast"
import { Inmate } from "../types"

export function useGameLogic() {
  const { toast } = useToast()
  const [inmates, setInmates] = useState<Inmate[]>([])
  const [shuffledMugshotImages, setShuffledMugshotImages] = useState<Inmate[]>([])
  const [shuffledCrimeDescriptions, setShuffledCrimeDescriptions] = useState<Inmate[]>([])
  const [matches, setMatches] = useState<Record<string, string | null>>({})
  const [results, setResults] = useState<any>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState<boolean>(false)
  const [selectedMugshotId, setSelectedMugshotId] = useState<string | null>(null)
  const [selectedDescriptionId, setSelectedDescriptionId] = useState<string | null>(null)
  const [attemptCounts, setAttemptCounts] = useState<Record<string, number>>({})
  const [isMobileCrimeModalOpen, setIsMobileCrimeModalOpen] = useState<boolean>(false)
  const [selectedMugshotForModal, setSelectedMugshotForModal] = useState<Inmate | null>(null)
  
  const gameStartTimeRef = useRef<number>(Date.now())

  // Fetch inmate data from the API
  useEffect(() => {
    const fetchInmates = async () => {
      try {
        setLoading(true)
        const response = await fetch('/api/inmates')
        
        if (!response.ok) {
          throw new Error(`Failed to fetch inmates: ${response.status}`)
        }
        
        const data = await response.json()
        setInmates(data.inmates)
        resetGame(data.inmates)
        setError(null)
      } catch (err) {
        console.error('Error fetching inmate data:', err)
        setError('Failed to load inmate data. Please try again later.')
        // Use placeholder data if API fails
        const placeholderData = [
          { id: 1, name: "John Doe", image: "/placeholder.svg?key=cfqyy" },
          { id: 2, name: "Jane Smith", image: "/placeholder.svg?key=j2s7m" },
          { id: 3, name: "Mike Johnson", image: "/placeholder.svg?key=p9r4t" },
          { id: 4, name: "Sarah Williams", image: "/placeholder.svg?key=5a1tv" },
          { id: 5, name: "Robert Brown", image: "/placeholder.svg?key=k8paz" },
          { id: 6, name: "Emily Davis", image: "/placeholder.svg?key=d3xrz" },
        ]
        setInmates(placeholderData)
        resetGame(placeholderData)
      } finally {
        setLoading(false)
      }
    }

    fetchInmates()
  }, [])

  // Effect to handle matching when both a mugshot and description are selected
  useEffect(() => {
    if (selectedMugshotId && selectedDescriptionId) {
      // Track attempt count for this description
      setAttemptCounts(prev => ({
        ...prev,
        [selectedDescriptionId]: (prev[selectedDescriptionId] || 0) + 1
      }))

      // Update the matches state
      setMatches((prev) => {
        const newMatches = { ...prev }
        // Remove the mugshot if it was previously assigned to another description
        Object.keys(newMatches).forEach(key => {
          if (newMatches[key] === selectedMugshotId) {
            newMatches[key] = null;
          }
        });
        // Assign the selected mugshot to the selected description
        newMatches[selectedDescriptionId] = selectedMugshotId
        return newMatches
      })

      // Reset selections
      setSelectedMugshotId(null)
      setSelectedDescriptionId(null)
    }
  }, [selectedMugshotId, selectedDescriptionId])

  // Shuffle the mugshots and crimes
  const resetGame = (data = inmates) => {
    if (!data.length) return
    
    // Shuffle images and descriptions separately
    const shuffledImages = [...data].sort(() => Math.random() - 0.5)
    const shuffledDescriptions = [...data].sort(() => Math.random() - 0.5)

    setShuffledCrimeDescriptions(shuffledDescriptions)
    setShuffledMugshotImages(shuffledImages)
    setMatches({})
    setResults(null)
    setAttemptCounts({})
    gameStartTimeRef.current = Date.now()
  }

  // Find the mugshot data by ID
  const getInmateDataById = (id: string | number): Inmate | undefined => {
    const numericId = Number(id);
    return inmates.find((inmate) => inmate.id === numericId);
  }

  // Handle match logic
  const handleMatch = (mugshotId: string, descriptionId: string) => {
    setAttemptCounts(prev => ({
      ...prev,
      [descriptionId]: (prev[descriptionId] || 0) + 1
    }))

    setMatches((prev) => {
      const newMatches = { ...prev }
      Object.keys(newMatches).forEach(key => {
        if (newMatches[key] === mugshotId) {
          newMatches[key] = null;
        }
      });
      newMatches[descriptionId] = mugshotId
      return newMatches
    })

    setSelectedMugshotId(null)
    setSelectedDescriptionId(null)
  }

  // Handle crime click
  const handleCrimeClick = (crime: Inmate, isMobile: boolean) => {
    if (isMobile) {
      // On mobile, open the crime selection modal
      setSelectedMugshotForModal(getInmateDataById(crime.id) || null)
      setIsMobileCrimeModalOpen(true)
    } else {
      // On desktop, handle selection normally
      if (selectedMugshotId) {
        handleMatch(selectedMugshotId, crime.id.toString())
      } else {
        setSelectedDescriptionId(crime.id.toString())
        setSelectedMugshotId(null)
      }
    }
  }

  // Mobile-specific handlers
  const handleMugshotClickMobile = (mugshot: Inmate) => {
    setSelectedMugshotForModal(mugshot)
    setIsMobileCrimeModalOpen(true)
  }

  const handleMobileCrimeSelect = (crime: Inmate) => {
    if (selectedMugshotForModal) {
      handleMatch(selectedMugshotForModal.id.toString(), crime.id.toString())
      closeMobileCrimeModal()
    }
  }

  const closeMobileCrimeModal = () => {
    setIsMobileCrimeModalOpen(false)
    setSelectedMugshotForModal(null)
  }

  // Retry fetch
  const retryFetch = () => {
    window.location.reload()
  }

  // Trigger haptic feedback (placeholder for mobile)
  const triggerHaptic = (type: string) => {
    // This would integrate with mobile haptic feedback APIs
    console.log(`Haptic feedback: ${type}`)
  }

  return {
    shuffledMugshotImages,
    shuffledCrimeDescriptions,
    selectedMugshotId,
    selectedDescriptionId,
    matches,
    results,
    loading,
    error,
    submitting,
    attemptCounts,
    gameStartTimeRef,
    isMobileCrimeModalOpen,
    selectedMugshotForModal,
    setSelectedMugshotId,
    setSelectedDescriptionId,
    setResults,
    setSubmitting,
    resetGame,
    getInmateDataById,
    handleMatch,
    handleCrimeClick,
    retryFetch,
    triggerHaptic,
    handleMugshotClickMobile,
    handleMobileCrimeSelect,
    closeMobileCrimeModal,
    toast
  }
}
