'use client'

import { motion } from 'framer-motion'
import { TrendingUp, Users, Target, Award, Zap, ArrowUp, ArrowDown, BarChart3, Activity } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card'
import { Badge } from '@/app/components/ui/badge'
import { Button } from '@/app/components/ui/button'
import { useState, useEffect } from 'react'
import { getBenchmarkData } from '@/lib/benchmark-calculations'

interface BenchmarkData {
  yourPerformance: number
  categoryAverage: number
  percentile: number
  category?: string
  insights?: string[]
  recommendations?: string[]
}

interface CompetitorBenchmarkProps {
  userId: string
  pageId: string
  isPremium?: boolean
}

export function CompetitorBenchmark({ userId, pageId, isPremium = false }: CompetitorBenchmarkProps) {
  const [benchmarkData, setBenchmarkData] = useState<BenchmarkData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadBenchmarkData()
  }, [userId, pageId, isPremium])

  async function loadBenchmarkData() {
    try {
      // Fetch actual benchmark data from the library
      const benchmarkData = await getBenchmarkData(userId, pageId, isPremium)
      setBenchmarkData(benchmarkData)
    } catch (error) {
      console.error('Error loading benchmark data:', error)
      // Fallback to a basic response if there's an error
      const errorData: BenchmarkData = {
        yourPerformance: 0,
        categoryAverage: 0,
        percentile: 0,
        category: "Creator"
      }
      setBenchmarkData(errorData)
    } finally {
      setLoading(false)
    }
  }

  const getPercentileColor = (percentile: number) => {
    if (percentile >= 80) return 'text-indigo-600 bg-indigo-100'
    if (percentile >= 60) return 'text-blue-600 bg-blue-100'
    return 'text-slate-600 bg-slate-100'
  }

  const getPerformanceIndicator = (your: number, average: number) => {
    const difference = your - average
    if (difference > 5) return { icon: ArrowUp, color: 'text-indigo-600', text: 'Well above average' }
    if (difference > 0) return { icon: ArrowUp, color: 'text-indigo-600', text: 'Above average' }
    if (difference > -5) return { icon: ArrowDown, color: 'text-slate-600', text: 'Slightly below average' }
    return { icon: ArrowDown, color: 'text-rose-600', text: 'Below average' }
  }

  if (loading) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <Card className="border border-slate-200 bg-white shadow-sm overflow-hidden">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-purple-50 animate-pulse">
                  <Users className="w-5 h-5 text-purple-600" />
                </div>
                <div className="space-y-2">
                  <CardTitle className="text-slate-800">Competitor Benchmark</CardTitle>
                  <CardDescription className="text-slate-600">Analyzing your performance...</CardDescription>
                </div>
              </div>
              <Badge className="animate-pulse bg-slate-100 text-slate-600 border-slate-200">Loading</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4 py-8">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 animate-pulse"></div>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 animate-pulse"></div>
            </div>
            <div className="p-3 rounded-lg bg-slate-50 animate-pulse"></div>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 animate-pulse"></div>
          </CardContent>
        </Card>
      </motion.div>
    )
  }

  if (!benchmarkData) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <Card className="border border-slate-200 bg-white shadow-sm overflow-hidden">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-purple-50">
                  <Users className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <CardTitle className="text-slate-800">Competitor Benchmark</CardTitle>
                  <CardDescription className="text-slate-600">No data available yet</CardDescription>
                </div>
              </div>
              <Badge className="bg-slate-100 text-slate-600 border-slate-200">{isPremium ? 'Premium' : 'Basic'}</Badge>
            </div>
          </CardHeader>
          <CardContent className="py-8 text-center text-slate-500">
            <Activity className="w-12 h-12 mx-auto mb-3 text-slate-300" />
            <p className="text-sm">Start sharing to gather comparison data</p>
          </CardContent>
        </Card>
      </motion.div>
    )
  }

  const performanceInfo = getPerformanceIndicator(benchmarkData.yourPerformance, benchmarkData.categoryAverage)
  const PerformanceIcon = performanceInfo.icon

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="h-full">
      <Card className="border border-slate-200 bg-white shadow-sm overflow-hidden h-full flex flex-col">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-purple-50">
                <BarChart3 className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <CardTitle className="text-slate-800">Competitor Benchmark</CardTitle>
                <CardDescription className="text-slate-600">
                  {benchmarkData.category ? `Compared to other ${benchmarkData.category}` : 'Anonymous creator comparison'}
                </CardDescription>
              </div>
            </div>
            <Badge className={
              isPremium 
                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white' 
                : 'bg-slate-100 text-slate-600 border-slate-200'
            }>
              {isPremium ? 'Premium' : 'Basic'}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="space-y-5 flex-1 flex flex-col">
          {/* Performance Summary */}
          <div className="grid grid-cols-2 gap-4 flex-1 min-h-[100px]">
            <div className="text-center p-4 rounded-lg bg-slate-50 border border-slate-200 flex flex-col items-center justify-center">
              <div className="text-2xl font-bold text-slate-800">{benchmarkData.yourPerformance}%</div>
              <div className="text-xs text-slate-600 mt-1">Your Performance</div>
            </div>
            <div className="text-center p-4 rounded-lg bg-blue-50 border border-blue-200 flex flex-col items-center justify-center">
              <div className="text-2xl font-bold text-slate-800">{benchmarkData.categoryAverage}%</div>
              <div className="text-xs text-slate-600 mt-1">Category Average</div>
            </div>
          </div>

          {/* Performance Indicator */}
          <div className={`flex items-center gap-2 p-3 rounded-lg ${performanceInfo.color.replace('text', 'bg')} bg-opacity-10 border ${performanceInfo.color.replace('text', 'border-')}`}>
            <PerformanceIcon className={`w-4 h-4 ${performanceInfo.color}`} />
            <span className={`text-sm font-medium ${performanceInfo.color}`}>
              {performanceInfo.text}
            </span>
          </div>

          {/* Percentile Ranking */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-slate-50 to-purple-50 border border-slate-200 flex-1 min-h-[100px] flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-purple-600" />
                <span className="text-sm font-semibold text-slate-800">Top {benchmarkData.percentile}%</span>
              </div>
              <Badge className={getPercentileColor(benchmarkData.percentile)}>
                {benchmarkData.percentile >= 80 ? 'Excellent' : 
                 benchmarkData.percentile >= 60 ? 'Good' : 'Needs Work'}
              </Badge>
            </div>
            <p className="text-xs text-slate-600 mt-auto">
              Among similar {benchmarkData.category ? benchmarkData.category.toLowerCase() : 'creators'}
            </p>
          </div>

          {/* Insights & Recommendations */}
          {isPremium ? (
            <div className="space-y-4 pt-2 flex-1">
              {benchmarkData.insights && benchmarkData.insights.length > 0 && (
                <div className="pt-1">
                  <h4 className="text-sm font-semibold text-slate-800 mb-2 flex items-center gap-2">
                    <Target className="w-4 h-4 text-purple-600" />
                    Key Insights
                  </h4>
                  <ul className="text-sm text-slate-600 space-y-1 pl-1">
                    {benchmarkData.insights.map((insight, index) => (
                      <li key={index} className="flex items-start gap-1.5">
                        <span className="text-purple-500 mt-0.5">•</span>
                        <span>{insight}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {benchmarkData.recommendations && benchmarkData.recommendations.length > 0 && (
                <div className="pt-1">
                  <h4 className="text-sm font-semibold text-slate-800 mb-2 flex items-center gap-2">
                    <Zap className="w-4 h-4 text-amber-600" />
                    Actionable Tips
                  </h4>
                  <ul className="text-sm text-slate-600 space-y-1 pl-1">
                    {benchmarkData.recommendations.map((rec, index) => (
                      <li key={index} className="flex items-start gap-1.5">
                        <span className="text-amber-500 mt-0.5">•</span>
                        <span>{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ) : (
            // Free Tier - Focus on simple comparison data
            <div className="p-4 rounded-xl bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 flex-1 flex flex-col justify-between">
              <div className="space-y-2 mb-3">
                <h3 className="text-sm font-semibold text-slate-800 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-purple-600" />
                  Unlock Detailed Insights
                </h3>
                <p className="text-xs text-slate-600">
                  Compare with similar creators and get personalized tips to improve your performance
                </p>
              </div>
              <div className="space-y-1 text-xs text-slate-600 mb-3">
                <div className="flex items-center gap-1.5 mb-1.5">
                  <Users className="w-3 h-3 text-purple-500 flex-shrink-0" />
                  <span>Detailed category comparisons</span>
                </div>
                <div className="flex items-center gap-1.5 mb-1.5">
                  <Target className="w-3 h-3 text-purple-500 flex-shrink-0" />
                  <span>Personalized improvement tips</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Zap className="w-3 h-3 text-purple-500 flex-shrink-0" />
                  <span>Performance tracking</span>
                </div>
              </div>
              <Button size="sm" className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white mt-auto">
                Upgrade to Premium
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}