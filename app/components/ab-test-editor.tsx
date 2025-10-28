

'use client'
import { Button } from "@/app/components/ui/button"
import { Input } from "@/app/components/ui/input"
import { Label } from "@/app/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card"
import { Play, Square, Award } from "lucide-react"
import { ABTestData } from "@/app/types/ab-testing"
import { useState } from "react"

interface ABTestEditorProps {
  linkId: string
  currentTitle: string
  testVariant: 'A' | 'B' | null
  testData: ABTestData | null
  isTesting: boolean
  onStartTest: (linkId: string, variantBTitle: string) => void
  onEndTest: (linkId: string, applyWinner: boolean) => void
}

export function ABTestEditor({ 
  linkId, 
  currentTitle, 
  testVariant, 
  testData, 
  isTesting,
  onStartTest, 
  onEndTest
}: ABTestEditorProps) {
  const [variantBTitle, setVariantBTitle] = useState(currentTitle)
  const safeTestData = testData || { clicks_A: 0, clicks_B: 0, started_at: null }
  const winner = safeTestData.winner
  
  const totalClicks = safeTestData.clicks_A + safeTestData.clicks_B
  const progress = Math.min((totalClicks / 50) * 100, 100)
  const conversionRateA = totalClicks > 0 ? (safeTestData.clicks_A / totalClicks * 100).toFixed(1) : '0'
  const conversionRateB = totalClicks > 0 ? (safeTestData.clicks_B / totalClicks * 100).toFixed(1) : '0'

  const handleStartTest = () => {
    if (variantBTitle.trim() && variantBTitle !== currentTitle) {
      onStartTest(linkId, variantBTitle)
    }
  }

  const handleEndTest = (applyWinner: boolean) => {
    onEndTest(linkId, applyWinner)
  }

  return (
    <Card className="bg-neutral-800/50 border-neutral-700">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg text-neutral-100">A/B Test</CardTitle>
        <CardDescription className="text-neutral-400">
          Test different titles to see which gets more clicks
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {!isTesting ? (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-neutral-300 text-sm">Variant A (Current)</Label>
                <Input value={currentTitle} disabled className="bg-neutral-700 border-neutral-600 text-neutral-300" />
              </div>
              <div className="space-y-2">
                <Label className="text-neutral-300 text-sm">Variant B (Test)</Label>
                <Input
                  value={variantBTitle}
                  onChange={(e) => setVariantBTitle(e.target.value)}
                  className="bg-neutral-700 border-neutral-600 text-neutral-100"
                />
                <div className="text-xs text-neutral-500">
                  {variantBTitle === currentTitle ? "⚠️ Titles should be different" : "✅ Good to test"}
                </div>
              </div>
            </div>
            <Button
              onClick={handleStartTest}
              disabled={!variantBTitle.trim() || variantBTitle === currentTitle}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Play className="w-4 h-4 mr-2" />
              Start A/B Test
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-neutral-300">Test Progress</span>
                <span className="text-neutral-400">{progress.toFixed(0)}%</span>
              </div>
              <div className="w-full h-2 bg-neutral-700 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className={`p-3 rounded-lg border-2 ${winner === 'A' ? 'border-yellow-500 bg-yellow-500/10' : 'border-neutral-600 bg-neutral-700/50'}`}>
                <div className="text-center space-y-2">
                  <div className="text-sm font-medium text-neutral-300">Variant A</div>
                  <div className="text-xs text-neutral-400 truncate">{currentTitle}</div>
                  <div className="text-lg font-bold text-white">{safeTestData.clicks_A}</div>
                  <div className="text-xs text-green-400">{conversionRateA}%</div>
                  {winner === 'A' && (
                    <div className="flex items-center justify-center gap-1 text-xs text-yellow-400">
                      <Award className="w-3 h-3" />
                      <span>Winner!</span>
                    </div>
                  )}
                </div>
              </div>
              
              <div className={`p-3 rounded-lg border-2 ${winner === 'B' ? 'border-yellow-500 bg-yellow-500/10' : 'border-neutral-600 bg-neutral-700/50'}`}>
                <div className="text-center space-y-2">
                  <div className="text-sm font-medium text-neutral-300">Variant B</div>
                  <div className="text-xs text-neutral-400 truncate">{safeTestData.variantBTitle}</div>
                  <div className="text-lg font-bold text-white">{safeTestData.clicks_B}</div>
                  <div className="text-xs text-green-400">{conversionRateB}%</div>
                  {winner === 'B' && (
                    <div className="flex items-center justify-center gap-1 text-xs text-yellow-400">
                      <Award className="w-3 h-3" />
                      <span>Winner!</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                onClick={() => handleEndTest(true)}
                disabled={!winner}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white"
              >
                <Award className="w-4 h-4 mr-2" />
                Apply Winner
              </Button>
              <Button
                onClick={() => handleEndTest(false)}
                variant="outline"
                className="border-neutral-600 text-neutral-300 hover:bg-neutral-700"
              >
                <Square className="w-4 h-4 mr-2" />
                End Test
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}