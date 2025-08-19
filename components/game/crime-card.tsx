import { cn } from "@/lib/utils"
import { CheckCircle2, XCircle } from "lucide-react"
import { Inmate } from "./types"

interface CleanCrimeCardProps {
  crime: Inmate
  index: number
  isSelected: boolean
  isMatched: boolean
  matchedMugshot: Inmate | null
  onClick: () => void
  results?: any
}

export function CleanCrimeCard({ 
  crime, 
  index, 
  isSelected, 
  isMatched, 
  matchedMugshot, 
  onClick, 
  results 
}: CleanCrimeCardProps) {
  return (
    <div
      className={cn(
        "p-5 rounded-lg border transition-all shadow-md min-h-[150px] flex flex-col justify-between cursor-pointer",
        isSelected
          ? "border-blue-500 ring-2 ring-blue-500/50"
          : results?.submitted && results.correctMatches.includes(crime.id)
            ? "border-green-500 bg-green-900/20"
            : results?.submitted
              ? "border-red-500 bg-red-900/20"
              : "border-gray-700 hover:border-gray-600 bg-gradient-to-b from-gray-900/80 to-gray-800/50 hover:shadow-lg"
      )}
      onClick={onClick}
    >
      <div className="flex-grow">
        <div className="text-lg font-medium text-gray-200 break-words whitespace-normal leading-relaxed mb-4">
          {crime.crime || "Unknown crime"}
        </div>
      </div>

      <div className="mt-auto pt-2 border-t border-gray-700/50 flex items-center justify-between min-h-[40px]">
        {matchedMugshot ? (
          <div className="flex items-center gap-2 text-sm text-gray-300">
            <img 
              src={matchedMugshot.image} 
              alt={matchedMugshot.name} 
              className="h-8 w-8 rounded-full object-cover border border-gray-600"
            />
            <span>{matchedMugshot.name}</span>
          </div>
        ) : (
          <div className="text-sm text-gray-500 italic">
            {isSelected ? "Selected" : "Click to select"}
          </div>
        )}

        {results?.submitted && (
          results.correctMatches.includes(crime.id) ? (
            <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0" />
          ) : (
            <XCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
          )
        )}
      </div>
    </div>
  )
}
