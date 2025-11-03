export interface PeakTimeData {
  hour: number
  day: number
  clicks: number
  views: number
  engagementRate: number
  isPeak: boolean
}

export interface TimeSlot {
  hour: number
  label: string
  clicks: number
  engagement: number
  isPeak: boolean
}

export interface PeakTimeSettings {
  autoPromote: boolean
  peakHours: number[]
  importantLinks: string[]
  timezone: string
}