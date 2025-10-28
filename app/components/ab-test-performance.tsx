// components/ab-testing-performance.tsx
'use client'

import { motion } from 'framer-motion'
import { TestTube, Target, Award, Zap, TrendingUp, Clock, BarChart3, PlayCircle, Square, Sparkles, Crown } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card'
import { Badge } from '@/app/components/ui/badge'
import { Progress } from '@/app/components/ui/progress'
import { Button } from '@/app/components/ui/button'
import { createClient } from '@/lib/supabase/client'
import { useState, useEffect } from 'react'

interface ABTestSummary {
  id: string
  title: string
  progress: number
  winner: 'A' | 'B' | null
  status: 'collecting' | 'winning' | 'close'
  daysRunning: number
  totalClicks: number
  variantAClicks: number
  variantBClicks: number
}

interface ABTestingPerformanceProps {
  pageId: string
}

const fadeIn = (i = 0) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4, delay: i * 0.1 }
})

export function ABTestingPerformance({ pageId }: ABTestingPerformanceProps) {
  const [tests, setTests] = useState<ABTestSummary[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadABTests()
  }, [pageId])

  async function loadABTests() {
    try {
      const supabase = createClient()
      
      const { data: linksData, error } = await supabase
        .from('links')
        .select('*')
        .eq('page_id', pageId)
        .not('test_variant', 'is', null)

      if (error) {
        console.error('Error loading A/B tests:', error)
        return
      }

      const testData: ABTestSummary[] = linksData.map(link => {
        const testData = link.test_data as any
        const totalClicks = (testData?.clicks_A || 0) + (testData?.clicks_B || 0)
        const progress = Math.min((totalClicks / 50) * 100, 100)
        const winner = calculateWinner(testData)
        
        const startDate = testData?.started_at ? new Date(testData.started_at) : new Date()
        const daysRunning = Math.floor((Date.now() - startDate.getTime()) / (1000 * 60 * 60 * 24))
        
        let status: 'collecting' | 'winning' | 'close' = 'collecting'
        if (winner) {
          status = 'winning'
        } else if (totalClicks > 20 && !winner) {
          status = 'close'
        }

        return {
          id: link.id,
          title: link.original_title || link.title,
          progress,
          winner,
          status,
          daysRunning,
          totalClicks,
          variantAClicks: testData?.clicks_A || 0,
          variantBClicks: testData?.clicks_B || 0
        }
      })

      setTests(testData)
    } catch (error) {
      console.error('Error loading A/B tests:', error)
    } finally {
      setLoading(false)
    }
  }

  function calculateWinner(testData: any): 'A' | 'B' | null {
    const clicksA = testData?.clicks_A || 0
    const clicksB = testData?.clicks_B || 0
    const totalClicks = clicksA + clicksB
    
    if (totalClicks < 10) return null
    
    const rateA = clicksA / totalClicks
    const rateB = clicksB / totalClicks
    
    if (rateA > rateB * 1.2) return 'A'
    if (rateB > rateA * 1.2) return 'B'
    
    return null
  }

  async function endTest(linkId: string, applyWinner: boolean) {
    try {
      const supabase = createClient()
      
      if (applyWinner) {
        const test = tests.find(t => t.id === linkId)
        if (test?.winner) {
          await supabase
            .from('links')
            .update({ 
              test_variant: null,
              test_data: null,
              original_title: null
            })
            .eq('id', linkId)
        }
      } else {
        await supabase
          .from('links')
          .update({ 
            test_variant: null,
            test_data: null,
            original_title: null
          })
          .eq('id', linkId)
      }

      await loadABTests()
    } catch (error) {
      console.error('Error ending test:', error)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'winning': return 'text-emerald-600 bg-emerald-50 border-emerald-200'
      case 'close': return 'text-amber-600 bg-amber-50 border-amber-200'
      case 'collecting': return 'text-blue-600 bg-blue-50 border-blue-200'
      default: return 'text-slate-600 bg-slate-50 border-slate-200'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'winning': return <Zap className="w-3 h-3" />
      case 'close': return <TrendingUp className="w-3 h-3" />
      case 'collecting': return <Clock className="w-3 h-3" />
      default: return <BarChart3 className="w-3 h-3" />
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'winning': return 'Clear Winner'
      case 'close': return 'Close Race'
      case 'collecting': return 'Collecting Data'
      default: return 'In Progress'
    }
  }

  const activeTests = tests.filter(test => test.progress < 100)
  const hasActiveTest = activeTests.length > 0
  const freeTierLimit = 1

  if (loading) {
    return (
      <Card className="border border-slate-200 bg-white shadow-sm">
        <CardHeader>
          <CardTitle className="text-slate-800">A/B Testing</CardTitle>
          <CardDescription>Loading tests...</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
        </CardContent>
      </Card>
    )
  }

  return (
    <motion.div {...fadeIn(0)}>
      <Card className="border border-slate-200 bg-white shadow-sm">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-purple-50">
                <TestTube className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <CardTitle className="text-slate-800">A/B Testing</CardTitle>
                <CardDescription className="text-slate-600">
                  {hasActiveTest ? '1 active test' : 'Optimize your links'}
                </CardDescription>
              </div>
            </div>
            <Badge className={
              hasActiveTest 
                ? 'bg-purple-100 text-purple-700 border-purple-200' 
                : 'bg-slate-100 text-slate-600 border-slate-200'
            }>
              {activeTests.length}/{freeTierLimit} Free
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {!hasActiveTest ? (
            // No active test - Show CTA to start one
            <div className="text-center py-6">
              <div className="w-12 h-12 mx-auto mb-3 bg-slate-100 rounded-full flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-slate-400" />
              </div>
              <h3 className="text-sm font-semibold text-slate-800 mb-2">No Active Tests</h3>
              <p className="text-slate-600 text-sm mb-4 max-w-sm mx-auto">
                Test different titles to discover which ones get more clicks from your audience.
              </p>
              <Button 
                onClick={() => window.location.href = '/protected/builder'}
                className="bg-purple-500 hover:bg-purple-600 text-white"
              >
                <PlayCircle className="w-4 h-4 mr-2" />
                Start A/B Test
              </Button>
              
              {/* Free Tier Notice */}
              <div className="mt-4 p-3 rounded-lg bg-blue-50 border border-blue-200">
                <div className="flex items-center gap-2 text-sm text-blue-700">
                  <Crown className="w-4 h-4" />
                  <span>Free tier includes 1 active A/B test</span>
                </div>
              </div>
            </div>
          ) : (
            // Has active test - Show the single test
            <>
              {/* Single Test Display */}
              {activeTests.slice(0, freeTierLimit).map((test, index) => (
                <motion.div
                  key={test.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-4 rounded-xl bg-slate-50 border border-slate-200"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <Target className="w-4 h-4 text-purple-600 flex-shrink-0" />
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold text-slate-800 truncate">{test.title}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge className={getStatusColor(test.status)}>
                            <div className="flex items-center gap-1">
                              {getStatusIcon(test.status)}
                              {getStatusText(test.status)}
                            </div>
                          </Badge>
                          <span className="text-xs text-slate-500">{test.daysRunning}d running</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <div className="text-sm font-semibold text-slate-800">{test.progress.toFixed(0)}%</div>
                      <div className="text-xs text-slate-500">{test.totalClicks}/50 clicks</div>
                    </div>
                  </div>

                  <Progress value={test.progress} className="h-2 bg-slate-200 mb-3" />

                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <span className="text-slate-600">A: {test.variantAClicks}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                        <span className="text-slate-600">B: {test.variantBClicks}</span>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button
                        onClick={() => endTest(test.id, true)}
                        disabled={!test.winner}
                        size="sm"
                        className="h-7 text-xs bg-emerald-500 hover:bg-emerald-600 text-white"
                      >
                        <Award className="w-3 h-3 mr-1" />
                        Apply Winner
                      </Button>
                      <Button
                        onClick={() => endTest(test.id, false)}
                        variant="outline"
                        size="sm"
                        className="h-7 text-xs border-slate-300 text-slate-700 bg-white hover:bg-red-400"
                      >
                        <Square className="w-3 h-3 mr-1" />
                        End Test
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}

              {/* Free Tier Limit Notice */}
              <div className="p-3 rounded-lg bg-blue-50 border border-blue-200">
                <div className="flex items-center gap-2 text-sm text-blue-700">
                  <Crown className="w-4 h-4" />
                  <span>Free tier limit: 1 active A/B test</span>
                </div>
                <p className="text-xs text-blue-600 mt-1">
                  Upgrade to test multiple links simultaneously
                </p>
              </div>
            </>
          )}

          {/* Completed Tests Summary (if any) */}
          {tests.filter(t => t.progress >= 100).length > 0 && (
            <div className="pt-4 border-t border-slate-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-slate-700">Completed Tests</span>
                <Badge variant="outline" className="text-slate-500">
                  {tests.filter(t => t.progress >= 100).length}
                </Badge>
              </div>
              <p className="text-xs text-slate-500">
                {tests.filter(t => t.winner).length} tests found clear winners
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}