"use client"

import * as React from "react"
import { Area, AreaChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer } from "recharts"
import { useTheme } from "next-themes";

interface ChartDataPoint {
  date: string
  views: number
  clicks: number
}

interface ChartAreaInteractiveProps {
  data: ChartDataPoint[]
  timeRange?: "7d" | "30d" | "90d"
  onTimeRangeChange?: (range: "7d" | "30d" | "90d") => void
}

// Utility component for the Segmented Control look
const SegmentedControl = ({ options, selected, onSelect, className = "", theme }) => (
  <div className={`inline-flex p-1 ${theme === "dark" ? "bg-gray-800" : "bg-gray-100"} rounded-lg transition duration-200 ${className}`}>
    {options.map((option) => (
      <button
        key={option.value}
        onClick={() => onSelect(option.value)}
        className={`
          px-3 py-1.5 text-xs font-medium transition-all duration-150 rounded-md
          ${selected === option.value
            ? "bg-[#0077ed] text-white shadow-sm"
            : theme === "dark"
              ? "text-gray-400 hover:text-gray-200"
              : "text-gray-500 hover:text-gray-700"
          }
        `}
      >
        {option.label}
      </button>
    ))}
  </div>
)

export default function ChartAreaInteractive({
  data,
  timeRange,
  onTimeRangeChange
}: ChartAreaInteractiveProps) {
  const [selectedMetric, setSelectedMetric] = React.useState<"views" | "clicks">("views")
  
  // Use controlled state if onTimeRangeChange is provided, otherwise use local state
  const [localTimeRange, setLocalTimeRange] = React.useState<"7d" | "30d" | "90d">("30d");
  const selectedTimeRange = onTimeRangeChange ? timeRange! : localTimeRange;
  const { theme } = useTheme();

  // Filter and process data based on time range
  const { filteredData, stats } = React.useMemo(() => {
    if (!data || !data.length) return { filteredData: [], stats: { total: 0, average: 0, change: 0 } }
    
    // --- START: ORIGINAL LOGIC PRESERVED ---
    const days = selectedTimeRange === "7d" ? 7 : selectedTimeRange === "30d" ? 30 : 90
    
    // Find the latest date in the data to determine the end point of the time range
    const latestDate = data.reduce((maxDate, item) => {
        const itemDate = new Date(item.date);
        return itemDate > maxDate ? itemDate : maxDate;
    }, new Date(0));
    
    const endDate = latestDate; 
    const startDate = new Date(endDate);
    startDate.setDate(endDate.getDate() - days + 1);
    startDate.setHours(0, 0, 0, 0); // Normalize start of day
    
    const filtered = data
      .filter(item => {
        const itemDate = new Date(item.date)
        itemDate.setHours(0, 0, 0, 0); // Normalize item date for comparison
        return itemDate >= startDate && itemDate <= endDate
      })
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

    // Calculate statistics
    const total = filtered.reduce((sum, item) => sum + item[selectedMetric], 0)
    const average = filtered.length > 0 ? Math.round(total / filtered.length) : 0
    
    // Calculate percentage change (compare first half vs second half)
    const midPoint = Math.floor(filtered.length / 2)
    const firstHalf = filtered.slice(0, midPoint)
    const secondHalf = filtered.slice(midPoint)
    
    const firstHalfAvg = firstHalf.length > 0 
      ? firstHalf.reduce((sum, item) => sum + item[selectedMetric], 0) / firstHalf.length 
      : 0
    const secondHalfAvg = secondHalf.length > 0 
      ? secondHalf.reduce((sum, item) => sum + item[selectedMetric], 0) / secondHalf.length 
      : 0
    
    const change = firstHalfAvg > 0 
      ? Math.round(((secondHalfAvg - firstHalfAvg) / firstHalfAvg) * 100) 
      : 0

    return { 
      filteredData: filtered, 
      stats: { total, average, change }
    }
    // --- END: ORIGINAL LOGIC PRESERVED ---
  }, [data, selectedTimeRange, selectedMetric, theme, localTimeRange, onTimeRangeChange])

  const formatDate = React.useCallback((dateString: string) => {
    const date = new Date(dateString)
    if (selectedTimeRange === "7d") {
      return date.toLocaleDateString("en-US", { weekday: "short" })
    }
    // For 30d/90d, show month/day
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
  }, [selectedTimeRange])

  // Apple-style primary color: System Blue
  const appleBlue = theme === "dark" ? "hsl(var(--chart-1))" : "#007AFF";
  // Apple-style secondary color: System Teal/Indigo
  const appleTeal = theme === "dark" ? "hsl(var(--chart-2))" : "#3D6DCC"; 
  
  const metricColor = selectedMetric === "views" ? appleBlue : appleTeal
  const metricLabel = selectedMetric === "views" ? "Page Views" : "Link Clicks"
  
  const rangeOptions = [
    { label: "7D", value: "7d" },
    { label: "30D", value: "30d" },
    { label: "90D", value: "90d" },
  ]

  const metricOptions = [
    { label: "Views", value: "views" },
    { label: "Clicks", value: "clicks" },
  ]

  const totalLabel = `Total ${metricLabel}`

  return (
    <div className={`w-full max-w-4xl mx-auto p-6 md:p-8 ${theme === "dark" ? "bg-card" : "bg-white"} rounded-3xl shadow-2xl ${theme === "dark" ? "shadow-gray-900/20" : "shadow-gray-200"} ${theme === "dark" ? "border border-border" : "border border-gray-100"} font-sans`}>
      
      {/* Top Header & Metric Selector */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
        <div className="mb-4 md:mb-0">
          <p className={`text-sm font-semibold ${theme === "dark" ? "text-muted-foreground" : "text-gray-500"} tracking-wider uppercase mb-1`}>
            Analytics
          </p>
          <h1 className={`text-4xl font-extrabold ${theme === "dark" ? "text-foreground" : "text-gray-900"} tracking-tight`}>
            {stats.total.toLocaleString()}
          </h1>
          <p className={`text-base ${theme === "dark" ? "text-muted-foreground" : "text-gray-500"}`}>
            {totalLabel} in the last {selectedTimeRange.replace('d', ' days')}
          </p>
        </div>
        
        {/* Metric and Time Range Controls */}
        <div className="flex flex-col sm:flex-row gap-4">
          <SegmentedControl 
            theme={theme}
            options={metricOptions} 
            selected={selectedMetric} 
            onSelect={setSelectedMetric} 
          />
          <SegmentedControl 
            theme={theme}
            options={rangeOptions} 
            selected={selectedTimeRange} 
            onSelect={(range: "7d" | "30d" | "90d") => {
              if (onTimeRangeChange) {
                onTimeRangeChange(range);
              } else {
                setLocalTimeRange(range);
              }
            }} 
          />
        </div>
      </div>

      {/* Secondary Stats Row (Minimized Apple Card Look) */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
        {/* Total/Average Card */}
        <div className={`${theme === "dark" ? "bg-muted" : "bg-gray-50"} rounded-xl p-4 flex flex-col justify-center`}>
          <p className={`text-xs ${theme === "dark" ? "text-muted-foreground" : "text-gray-500"} uppercase font-medium`}>Daily Avg</p>
          <p className={`text-xl font-bold ${theme === "dark" ? "text-foreground" : "text-gray-900"}`}>
            {stats.average.toLocaleString()}
          </p>
        </div>

        {/* Trend Card */}
        <div className={`${theme === "dark" ? "bg-muted" : "bg-gray-50"} rounded-xl p-4 flex flex-col justify-center`}>
          <p className={`text-xs ${theme === "dark" ? "text-muted-foreground" : "text-gray-500"} uppercase font-medium`}>Trend</p>
          <div className={`flex items-center gap-1.5`}>
            <span 
              className={`text-xl font-bold 
                ${stats.change >= 0 
                  ? (theme === "dark" ? "text-green-400" : "text-green-600") 
                  : (theme === "dark" ? "text-red-400" : "text-red-600")}
              `}
            >
              {stats.change >= 0 ? "+" : ""}{Math.abs(stats.change)}%
            </span>
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className={`w-5 h-5 transition-transform duration-300
                ${stats.change >= 0 
                  ? (theme === "dark" ? "text-green-400" : "text-green-600") 
                  : (theme === "dark" ? "text-red-400" : "text-red-600")}
                ${stats.change >= 0 ? "" : "rotate-180"}
              `} 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2.5" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline>
              <polyline points="17 6 23 6 23 12"></polyline>
            </svg>
          </div>
        </div>
         {/* Blank/Placeholder for mobile 2 col layout */}
        <div className="hidden md:block"></div> 
      </div>

      {/* Chart */}
      {filteredData.length > 0 ? (
        <div className="w-full h-[320px] -mx-4 md:-mx-6">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              key={`area-chart-${theme}`}  // Add key to force re-render on theme change
              data={filteredData}
              margin={{ top: 10, right: 20, left: 0, bottom: 0 }}
            >
              <defs>
                {/* Gradient for the filled area, using the selected metric color */}
                <linearGradient id="metricGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={metricColor} stopOpacity={0.4} />
                  <stop offset="95%" stopColor={metricColor} stopOpacity={0} />
                </linearGradient>
              </defs>
              
              {/* Subtle Cartesian Grid, only horizontal lines for clean look */}
              <CartesianGrid strokeDasharray="4 4" stroke={theme === "dark" ? "hsl(var(--border))" : "#e5e7eb"} vertical={false} opacity={0.7} />
              
              {/* X-Axis: Hidden line, clean ticks */}
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={12}
                tickFormatter={formatDate}
                tick={{ fill: theme === "dark" ? "hsl(var(--muted-foreground))" : "#9ca3af", fontSize: 12 }}
                minTickGap={10}
              />
              
              {/* Y-Axis: Hidden line, clean ticks */}
              <YAxis
                tickLine={false}
                axisLine={false}
                tickMargin={12}
                tick={{ fill: theme === "dark" ? "hsl(var(--muted-foreground))" : "#9ca3af", fontSize: 12 }}
                tickFormatter={(value) => value.toLocaleString()}
              />
              
              {/* Area Chart Line & Fill */}
              <Area
                type="monotone"
                dataKey={selectedMetric}
                stroke={metricColor}
                strokeWidth={3} // Thicker line for visual weight
                fill="url(#metricGradient)"
                dot={false}
                activeDot={{ 
                  r: 6, 
                  fill: metricColor, 
                  stroke: theme === "dark" ? "hsl(var(--background))" : "hsl(var(--foreground))", 
                  strokeWidth: 3 
                }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className={`h-[320px] flex items-center justify-center ${theme === "dark" ? "bg-muted" : "bg-gray-50"} rounded-2xl`}>
          <div className="text-center space-y-3">
            <svg className={`w-10 h-10 ${theme === "dark" ? "text-muted-foreground" : "text-gray-400"} mx-auto`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <p className={`text-base font-medium ${theme === "dark" ? "text-foreground" : "text-gray-900"}`}>No data available</p>
            <p className={`text-sm ${theme === "dark" ? "text-muted-foreground" : "text-gray-500"}`}>Analytics will appear once you get traffic</p>
          </div>
        </div>
      )}
    </div>
  )
}
