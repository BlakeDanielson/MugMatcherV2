import { cn } from "@/lib/utils"
import { CheckCircle2, XCircle, Info } from "lucide-react"
import { Inmate } from "./types"

interface CleanMugshotCardProps {
  mugshot: Inmate
  index: number
  isSelected: boolean
  isMatched: boolean
  onClick: () => void
  results?: any
  matches: Record<string, string | null>
  getInmateDataById: (id: string | number) => Inmate | undefined
}

export function CleanMugshotCard({ 
  mugshot, 
  index, 
  isSelected, 
  isMatched, 
  onClick, 
  results, 
  matches, 
  getInmateDataById 
}: CleanMugshotCardProps) {
  const isCorrectlyMatched = results?.submitted && 
    Object.entries(matches).some(
      ([descriptionId, matchedImageId]) =>
        matchedImageId === mugshot.id.toString() && descriptionId === mugshot.id.toString()
    )

  return (
    <div className="space-y-2 cursor-pointer" onClick={onClick}>
      <div
        className={cn(
          "relative rounded-lg overflow-hidden border-2 aspect-square transition-all duration-300 shadow-md hover:shadow-lg hover:scale-[1.02] transform",
          isSelected || (isMatched && !results?.submitted)
            ? "border-blue-500 ring-2 ring-blue-500/50"
            : "border-gray-700 hover:border-gray-600",
          results?.submitted && !isCorrectlyMatched ? "opacity-50" : ""
        )}
      >
        <img
          src={mugshot.image || "/placeholder.svg"}
          alt={`Mugshot ${index + 1}`}
          className="w-full h-full object-cover"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            if (target.src !== "/placeholder.svg") {
              target.src = "/placeholder.svg";
            }
          }}
        />
        <div className="absolute top-2 left-2 bg-black/70 text-white px-2 py-1 rounded-md text-sm backdrop-blur-sm shadow-sm">
          {mugshot.name}
        </div>
        
        {/* Info button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            // Handle info display
          }}
          className="absolute top-2 right-2 bg-blue-600/80 hover:bg-blue-600 text-white p-1.5 rounded-md text-sm backdrop-blur-sm shadow-sm transition-colors"
          title="View details"
        >
          <Info className="h-3 w-3" />
        </button>

        {results?.submitted && (
          <div
            className={cn(
              "absolute bottom-0 inset-x-0 p-2 text-white text-center",
              isCorrectlyMatched
                ? "bg-green-500/90 backdrop-blur-sm"
                : "bg-red-500/90 backdrop-blur-sm"
            )}
          >
            {isCorrectlyMatched ? (
              <div className="flex items-center justify-center">
                <CheckCircle2 className="h-4 w-4 mr-1" />
                Correct!
              </div>
            ) : (
              <div className="flex items-center justify-center text-xs">
                <XCircle className="h-4 w-4 mr-1" />
                {getInmateDataById(mugshot.id)?.crime || "Unknown"}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
