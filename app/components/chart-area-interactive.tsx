"use client"

import * as React from "react"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"
import { useIsMobile } from "@/hooks/use-mobile"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/app/components/ui/chart"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select"
import { createClient } from "@/lib/supabase/client"

interface ChartAreaInteractiveProps {
  data: Array<{
    date: string
    views: number
    clicks: number
  }>
  timeRange: "7d" | "30d" | "90d"
  onTimeRangeChange: (range: "7d" | "30d" | "90d") => void
}

const chartConfig = {
  views: {
    label: "Page Views",
    color: "var(--color-views)",
  },
  clicks: {
    label: "Link Clicks", 
    color: "var(--color-clicks)",
  },
} satisfies ChartConfig

export function ChartAreaInteractive({ data, timeRange, onTimeRangeChange }: ChartAreaInteractiveProps) {
  const isMobile = useIsMobile()

  React.useEffect(() => {
    if (isMobile && timeRange !== "7d") {
      onTimeRangeChange("7d")
    }
  }, [isMobile, timeRange, onTimeRangeChange])

  // Filter data based on selected time range
  const filteredData = React.useMemo(() => {
    if (!data.length) return []
    
    const days = timeRange === "7d" ? 7 : timeRange === "30d" ? 30 : 90
    const endDate = new Date(data[data.length - 1]?.date || new Date())
    const startDate = new Date(endDate)
    startDate.setDate(startDate.getDate() - days + 1)
    
    return data.filter(item => {
      const itemDate = new Date(item.date)
      return itemDate >= startDate && itemDate <= endDate
    })
  }, [data, timeRange])

  // Format dates for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    if (timeRange === "7d") {
      return date.toLocaleDateString("en-US", { weekday: "short" })
    } else if (timeRange === "30d") {
      return date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
    } else {
      return date.toLocaleDateString("en-US", { month: "short" })
    }
  }

  // Calculate totals for the card header
  const totals = React.useMemo(() => {
    const totalViews = filteredData.reduce((sum, day) => sum + day.views, 0)
    const totalClicks = filteredData.reduce((sum, day) => sum + day.clicks, 0)
    const engagementRate = totalViews > 0 ? ((totalClicks / totalViews) * 100).toFixed(1) : 0
    
    return { totalViews, totalClicks, engagementRate }
  }, [filteredData])

  return (
    <Card className="@container/card bg-white border border-gray-200 rounded-2xl shadow-sm">
      <CardHeader className="pb-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="space-y-1">
            <CardTitle className="text-xl font-bold text-gray-900">Performance Analytics</CardTitle>
            <CardDescription className="text-gray-600">
              {timeRange === "7d" && "Last 7 days"}
              {timeRange === "30d" && "Last 30 days"} 
              {timeRange === "90d" && "Last 90 days"}
              <span className="hidden sm:inline"> • {totals.totalViews.toLocaleString()} views • {totals.engagementRate}% engagement</span>
            </CardDescription>
          </div>
          <CardAction>
            <Select value={timeRange} onValueChange={onTimeRangeChange}>
              <SelectTrigger
                className="w-32 **:data-[slot=select-value]:block **:data-[slot=select-value]:truncate border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500/20 focus:border-green-500"
                size="sm"
                aria-label="Select time range"
              >
                <SelectValue placeholder="Select range" />
              </SelectTrigger>
              <SelectContent className="rounded-xl border border-gray-200 bg-white">
                <SelectItem value="7d" className="rounded-lg focus:bg-green-50">
                  Last 7 days
                </SelectItem>
                <SelectItem value="30d" className="rounded-lg focus:bg-green-50">
                  Last 30 days
                </SelectItem>
                <SelectItem value="90d" className="rounded-lg focus:bg-green-50">
                  Last 90 days
                </SelectItem>
              </SelectContent>
            </Select>
          </CardAction>
        </div>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        {filteredData.length > 0 ? (
          <ChartContainer
            config={chartConfig}
            className="aspect-auto h-[250px] w-full"
          >
            <AreaChart data={filteredData}>
              <defs>
                <linearGradient id="fillViews" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0.05} />
                </linearGradient>
                <linearGradient id="fillClicks" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.05} />
                </linearGradient>
              </defs>
              <CartesianGrid 
                vertical={false} 
                stroke="#f3f4f6" 
                strokeDasharray="3 3"
              />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                minTickGap={timeRange === "7d" ? 0 : timeRange === "30d" ? 3 : 10}
                tickFormatter={formatDate}
                tick={{ fill: "#6b7280", fontSize: 12 }}
              />
              <ChartTooltip
                cursor={false}
                content={
                  <ChartTooltipContent
                    labelFormatter={(value) => {
                      return new Date(value).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })
                    }}
                    indicator="dot"
                    className="bg-white border border-gray-200 rounded-lg shadow-lg"
                  />
                }
              />
              <Area
                dataKey="views"
                type="natural"
                fill="url(#fillViews)"
                stroke="#10b981"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4, fill: "#10b981", stroke: "#fff", strokeWidth: 2 }}
              />
              <Area
                dataKey="clicks"
                type="natural"
                fill="url(#fillClicks)"
                stroke="#3b82f6"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4, fill: "#3b82f6", stroke: "#fff", strokeWidth: 2 }}
              />
            </AreaChart>
          </ChartContainer>
        ) : (
          <div className="h-[250px] flex items-center justify-center text-gray-500">
            <div className="text-center space-y-2">
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
                <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <p className="text-sm font-medium">No data available</p>
              <p className="text-xs text-gray-400">Analytics will appear here once you get traffic</p>
            </div>
          </div>
        )}
        
        {/* Legend */}
        {filteredData.length > 0 && (
          <div className="flex justify-center gap-6 mt-4 pt-4 border-t border-gray-100">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <span className="text-sm text-gray-600">Page Views</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-blue-500"></div>
              <span className="text-sm text-gray-600">Link Clicks</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}