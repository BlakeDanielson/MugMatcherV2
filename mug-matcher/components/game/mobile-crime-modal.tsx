import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Inmate } from "./types"

interface MobileCrimeModalProps {
  isOpen: boolean
  onClose: () => void
  crimes: Inmate[]
  onCrimeSelect: (crime: Inmate) => void
  selectedMugshot?: Inmate
  matches: Record<string, string | null>
  getInmateDataById: (id: string | number) => Inmate | undefined
}

export function MobileCrimeModal({
  isOpen,
  onClose,
  crimes,
  onCrimeSelect,
  selectedMugshot,
  matches,
  getInmateDataById
}: MobileCrimeModalProps) {
  if (!selectedMugshot) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md w-full mx-4 bg-gray-800 border-gray-700">
        <DialogHeader>
          <DialogTitle className="text-gray-200">
            Select Crime for {selectedMugshot.name}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Selected Mugshot */}
          <div className="flex justify-center">
            <div className="relative w-32 h-32 rounded-lg overflow-hidden border-2 border-gray-600">
              <img
                src={selectedMugshot.image || "/placeholder.svg"}
                alt={selectedMugshot.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  if (target.src !== "/placeholder.svg") {
                    target.src = "/placeholder.svg";
                  }
                }}
              />
            </div>
          </div>
          
          {/* Crime Options */}
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {crimes.map((crime) => {
              const isMatched = Object.values(matches).includes(crime.id.toString())
              const isCorrectMatch = matches[crime.id.toString()] === selectedMugshot.id.toString()
              
              return (
                <button
                  key={crime.id}
                  onClick={() => onCrimeSelect(crime)}
                  disabled={isMatched}
                  className={`w-full p-4 text-left rounded-lg border transition-all ${
                    isMatched
                      ? 'border-gray-600 bg-gray-700 text-gray-400 cursor-not-allowed'
                      : 'border-gray-600 hover:border-blue-500 hover:bg-blue-900/20 text-gray-200 hover:text-white'
                  }`}
                >
                  <div className="font-medium">{crime.crime || "Unknown crime"}</div>
                  {isMatched && (
                    <div className="text-sm text-gray-500 mt-1">
                      {isCorrectMatch ? "✓ Correct match" : "Already matched"}
                    </div>
                  )}
                </button>
              )
            })}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
