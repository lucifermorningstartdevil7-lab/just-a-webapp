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


interface ChartDataPoint {
  date: string
  views: number
  clicks: number
  engagement?: number
}

interface ChartAreaInteractiveProps {
  data: ChartDataPoint[]
  timeRange?: "7d" | "30d" | "90d"
}

interface ChartTotals {
  totalViews: number
  totalClicks: number
  engagementRate: number
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

export function ChartAreaInteractive({ data, timeRange = "30d" }: ChartAreaInteractiveProps) {
  const isMobile = useIsMobile()

  // Filter data based on selected time range
  const filteredData = React.useMemo(() => {
    if (!data.length) return []
    
    const days = timeRange === "7d" ? 7 : timeRange === "30d" ? 30 : 90
    // Use the latest date from the data as the end date
    const endDate = new Date(data[data.length - 1]?.date || new Date())
    const startDate = new Date(endDate)
    startDate.setDate(endDate.getDate() - days + 1)
    
    // Filter data within the date range
    const filtered = data.filter(item => {
      const itemDate = new Date(item.date)
      return itemDate >= startDate && itemDate <= endDate
    })
    
    // Sort the filtered data by date to ensure proper display
    return filtered.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
  }, [data, timeRange])

  // Format dates for display on X-axis
  const formatDate = React.useCallback((dateString: string) => {
    const date = new Date(dateString)
    if (timeRange === "7d") {
      return date.toLocaleDateString("en-US", { weekday: "short" })
    } else if (timeRange === "30d") {
      return date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
    } else { // 90d
      return date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
    }
  }, [timeRange])

  // Calculate totals for the card header
  const totals = React.useMemo<ChartTotals>(() => {
    const totalViews = filteredData.reduce((sum, day) => sum + (day.views || 0), 0)
    const totalClicks = filteredData.reduce((sum, day) => sum + (day.clicks || 0), 0)
    const engagementRate = totalViews > 0 ? parseFloat(((totalClicks / totalViews) * 100).toFixed(1)) : 0
    
    return { totalViews, totalClicks, engagementRate }
  }, [filteredData])

  // Memoize the chart configuration to prevent unnecessary re-renders
  const memoizedChartConfig = React.useMemo(() => chartConfig, [])

  // Memoize the gradient elements to prevent unnecessary re-creation
  const memoizedGradients = React.useMemo(() => (
    <>
      <linearGradient id="fillViews" x1="0" y1="0" x2="0" y2="1">
        <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
        <stop offset="95%" stopColor="#10b981" stopOpacity={0.05} />
      </linearGradient>
      <linearGradient id="fillClicks" x1="0" y1="0" x2="0" y2="1">
        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.05} />
      </linearGradient>
    </>
  ), [])

  // Memoize the chart tooltip content
  const memoizedTooltipContent = React.useMemo(() => (
    <ChartTooltipContent
      labelFormatter={(value) => {
        const date = new Date(value)
        return date.toLocaleDateString("en-US", {
          weekday: "long",
          month: "short",
          day: "numeric",
          year: "numeric",
        })
      }}
      indicator="dot"
      className="bg-white border border-slate-200 rounded-lg shadow-sm"
    />
  ), [])

  // Memoize the legend to prevent unnecessary re-renders
  const memoizedLegend = React.useMemo(() => (
    <div className="flex justify-center gap-6 mt-4 pt-4 border-t border-slate-200">
      <div className="flex items-center gap-2">
        <div className="w-3 h-3 rounded-full bg-green-500"></div>
        <span className="text-sm text-slate-600">Page Views</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-3 h-3 rounded-full bg-blue-500"></div>
        <span className="text-sm text-slate-600">Link Clicks</span>
      </div>
    </div>
  ), [])

  return (
    <Card className="@container/card bg-white border border-slate-200 rounded-xl shadow-sm">
      <CardHeader className="pb-4">
        <div className="flex flex-col space-y-2">
          <div className="space-y-1">
            <CardTitle className="text-xl font-bold text-slate-800">Performance Analytics</CardTitle>
            <CardDescription className="text-slate-600">
              {timeRange === "7d" && "Last 7 days"}
              {timeRange === "30d" && "Last 30 days"} 
              {timeRange === "90d" && "Last 90 days"}
              <span> • {totals.totalViews.toLocaleString()} views • {totals.engagementRate}% engagement</span>
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        {filteredData.length > 0 ? (
          <ChartContainer
            config={memoizedChartConfig}
            className="aspect-auto h-[250px] w-full"
          >
            <AreaChart data={filteredData}>
              <defs>
                {memoizedGradients}
              </defs>
              <CartesianGrid 
                vertical={false} 
                stroke="#e2e8f0" 
                strokeDasharray="3 3"
              />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                minTickGap={timeRange === "7d" ? 8 : timeRange === "30d" ? 20 : 30}
                tickFormatter={formatDate}
                tick={{ fill: "#64748b", fontSize: 12 }}
              />
              <ChartTooltip
                cursor={false}
                content={memoizedTooltipContent}
              />
              <Area
                dataKey="views"
                type="monotone"
                fill="url(#fillViews)"
                stroke="#10b981"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4, fill: "#10b981", stroke: "#fff", strokeWidth: 2 }}
              />
              <Area
                dataKey="clicks"
                type="monotone"
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
        {filteredData.length > 0 && memoizedLegend}
      </CardContent>
    </Card>
  )
}