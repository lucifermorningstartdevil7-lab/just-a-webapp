// lib/peak-time-calculations.ts
import { createClient } from '@/lib/supabase/client'

export async function getPeakTimeData(pageId: string, days: number = 30) {
  const supabase = createClient()
  const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString()

  // Get clicks data with timestamps
  const { data: clicksData, error: clicksError } = await supabase
    .from('link_clicks')
    .select('clicked_at')
    .eq('page_id', pageId)
    .gte('clicked_at', startDate)

  if (clicksError) {
    console.error('Error fetching clicks:', clicksError)
    return []
  }

  // Get views data with timestamps
  const { data: viewsData, error: viewsError } = await supabase
    .from('page_views')
    .select('viewed_at')
    .eq('page_id', pageId)
    .gte('viewed_at', startDate)

  if (viewsError) {
    console.error('Error fetching views:', viewsError)
    return []
  }

  // Calculate hourly aggregates
  const hourlyData = calculateHourlyEngagement(clicksData, viewsData)
  return hourlyData
}

function calculateHourlyEngagement(clicks: any[], views: any[]) {
  const hourlyStats: { [key: number]: { clicks: number; views: number } } = {}

  // Initialize all hours
  for (let hour = 0; hour < 24; hour++) {
    hourlyStats[hour] = { clicks: 0, views: 0 }
  }

  // Count clicks by hour
  clicks.forEach(click => {
    const hour = new Date(click.clicked_at).getHours()
    hourlyStats[hour].clicks++
  })

  // Count views by hour  
  views.forEach(view => {
    const hour = new Date(view.viewed_at).getHours()
    hourlyStats[hour].views++
  })

  // Convert to array format and calculate engagement
  const result = Object.entries(hourlyStats).map(([hour, stats]) => {
    const engagement = stats.views > 0 ? (stats.clicks / stats.views) * 100 : 0
    
    return {
      hour: parseInt(hour),
      label: getHourLabel(parseInt(hour)),
      clicks: stats.clicks,
      views: stats.views,
      engagement,
      isPeak: false // Will calculate below
    }
  })

  // Calculate peak hours (top 25% by engagement)
  return calculatePeakHours(result)
}

function getHourLabel(hour: number): string {
  if (hour === 0) return '12AM'
  if (hour < 12) return `${hour}AM`
  if (hour === 12) return '12PM'
  return `${hour - 12}PM`
}

function calculatePeakHours(timeSlots: any[]) {
  // Filter out hours with significant data
  const activeHours = timeSlots.filter(slot => slot.views > 5)
  
  if (activeHours.length === 0) return timeSlots

  // Sort by engagement rate
  const sorted = [...activeHours].sort((a, b) => b.engagement - a.engagement)
  const peakThreshold = sorted[Math.floor(sorted.length * 0.25)]?.engagement || 0

  // Mark peak hours
  return timeSlots.map(slot => ({
    ...slot,
    isPeak: slot.engagement >= peakThreshold && slot.views > 5
  }))
}