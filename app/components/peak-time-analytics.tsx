
'use client'

import { motion } from 'framer-motion'
import { Clock, Zap, TrendingUp, Calendar, Settings, Target, Crown } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card'
import { Badge } from '@/app/components/ui/badge'
import { Button } from '@/app/components/ui/button'
import { Switch } from '@/app/components/ui/switch'
import { useState, useEffect } from 'react'
import { getPeakTimeData } from '@/lib/peak-time-optimization'

interface PeakTimeAnalyticsProps {
  pageId: string
  isPremium?: boolean
}

interface TimeSlot {
  hour: number
  label: string
  clicks: number
  views: number
  engagement: number
  isPeak: boolean
}

const fadeIn = (i = 0) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4, delay: i * 0.1 }
})

export function PeakTimeAnalytics({ pageId, isPremium = false }: PeakTimeAnalyticsProps) {
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([])
  const [loading, setLoading] = useState(true)
  const [autoPromote, setAutoPromote] = useState(false)
  const [peakHours, setPeakHours] = useState<number[]>([])

  useEffect(() => {
    loadPeakTimeData()
  }, [pageId])

  async function loadPeakTimeData() {
    try {
      // Use the dedicated function from the library
      const data = await getPeakTimeData(pageId)
      setTimeSlots(data)
      
      // Extract peak hours from the computed data
      const peak = data.filter(slot => slot.isPeak).map(slot => slot.hour)
      setPeakHours(peak)
    } catch (error) {
      console.error('Error loading peak time data:', error)
    } finally {
      setLoading(false)
    }
  }

  const toggleAutoPromote = async () => {
    if (!isPremium) {
      // Show upgrade prompt
      return
    }
    setAutoPromote(!autoPromote)
    // Save settings to database
  }

  const getEngagementColor = (engagement: number) => {
    if (engagement > 70) return 'bg-emerald-500'
    if (engagement > 40) return 'bg-amber-500'
    return 'bg-slate-300'
  }

  if (loading) {
    return (
      <Card className="border border-slate-200 bg-white shadow-sm">
        <CardHeader>
          <CardTitle className="text-slate-800">Peak Time Intelligence</CardTitle>
          <CardDescription>Analyzing your audience patterns...</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
        </CardContent>
      </Card>
    )
  }

  return (
    <motion.div {...fadeIn(0)}>
      <Card className="border border-slate-200 bg-white shadow-sm overflow-hidden">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-50">
                <Zap className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <CardTitle className="text-slate-800">Peak Time Intelligence</CardTitle>
                <CardDescription className="text-slate-600">
                  {isPremium ? 'Optimizing your links' : 'When your audience is most active'}
                </CardDescription>
              </div>
            </div>
            <Badge className={
              isPremium 
                ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white' 
                : 'bg-slate-100 text-slate-600 border-slate-200'
            }>
              {isPremium ? 'Premium' : 'Basic'}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Simple welcome message for first-time users */}
          {timeSlots.every(slot => slot.clicks === 0 && slot.views === 0) ? (
            <div className="text-center py-10">
              <div className="mx-auto w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center mb-4">
                <Clock className="w-8 h-8 text-blue-500" />
              </div>
              <h3 className="font-medium text-slate-800 mb-2">Ready to analyze engagement</h3>
              <p className="text-sm text-slate-500 max-w-xs mx-auto">
                Start sharing your links to gather data. We'll identify the best times to engage your audience.
              </p>
            </div>
          ) : (
            <>
              {/* Engaging Summary - only shows the top peak hour */}
              <div className="p-4 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100">
                <div className="flex items-center gap-3 mb-3">
                  <TrendingUp className="w-4 h-4 text-blue-600" />
                  <h3 className="text-sm font-semibold text-slate-800">Best Time to Engage</h3>
                </div>
                <div className="flex items-center justify-between">
                  {peakHours.length > 0 ? (
                    <>
                      <div>
                        <p className="text-lg font-bold text-slate-800">
                          {timeSlots.find(s => s.hour === peakHours[0])?.label || 'Analyzing...'}
                        </p>
                        <p className="text-xs text-slate-600">Peak engagement hour</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold text-slate-800">
                          {timeSlots.find(s => s.hour === peakHours[0])?.engagement.toFixed(1)}% engagement
                        </p>
                        <p className="text-xs text-slate-600">from {timeSlots.find(s => s.hour === peakHours[0])?.clicks || 0} clicks</p>
                      </div>
                    </>
                  ) : (
                    <p className="text-sm text-slate-600">Gathering data...</p>
                  )}
                </div>
              </div>

              {/* Simplified heatmap that focuses on key insights */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-slate-800">Engagement by Time</h3>
                  <div className="flex items-center gap-1.5 text-xs text-slate-500">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                    <span>Peak</span>
                  </div>
                </div>
                
                <div className="grid grid-cols-6 md:grid-cols-12 gap-1.5">
                  {timeSlots.map((slot, index) => (
                    <div
                      key={slot.hour}
                      className="flex flex-col items-center min-w-[20px]"
                    >
                      <div className={`w-4 h-7 rounded ${getEngagementColor(slot.engagement)} flex items-center justify-center relative ${slot.isPeak ? 'ring-1 ring-offset-1 ring-blue-300' : ''}`}>
                        {slot.isPeak && (
                          <Target className="w-1.5 h-1.5 text-white absolute -top-0.5 -right-0.5" />
                        )}
                      </div>
                      <div className="text-[0.65rem] text-slate-600 mt-0.5">{slot.label.replace('M', '').toLowerCase()}</div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Progressively revealed features */}
              {isPremium ? (
                <div className="p-4 rounded-xl bg-blue-50 border border-blue-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-semibold text-slate-800">Smart Optimization</h3>
                      <p className="text-xs text-slate-600">Auto-promote during peak hours</p>
                    </div>
                    <Switch
                      checked={autoPromote}
                      onCheckedChange={toggleAutoPromote}
                      className="data-[state=checked]:bg-blue-500"
                    />
                  </div>
                  
                  {autoPromote && (
                    <div className="mt-3 p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center gap-2">
                      <Zap className="w-4 h-4 text-emerald-600" />
                      <span className="text-xs text-emerald-700">Active: Optimizing link visibility</span>
                    </div>
                  )}
                </div>
              ) : (
                <div className="p-4 rounded-xl bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-100">
                  <div className="flex items-center gap-3 mb-2">
                    <Crown className="w-4 h-4 text-purple-600" />
                    <h3 className="text-sm font-semibold text-slate-800">Unlock Smart Features</h3>
                  </div>
                  <p className="text-xs text-slate-600 mb-3">
                    Automatically promote links during peak hours for maximum engagement
                  </p>
                  <Button size="sm" className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white">
                    Upgrade
                  </Button>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}