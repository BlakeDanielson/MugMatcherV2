import { Card } from "@/components/ui/card"

export function GameSkeleton() {
  return (
    <div className="w-full max-w-4xl">
      <Card className="p-6 shadow-lg bg-gray-800 border-gray-700 flex items-center justify-center">
        <div className="text-center py-12">
          <div className="animate-spin h-8 w-8 border-4 border-gray-600 border-t-blue-400 rounded-full mx-auto mb-4"></div>
          <p className="text-lg text-gray-300">Loading mugshot data...</p>
        </div>
      </Card>
    </div>
  )
}
