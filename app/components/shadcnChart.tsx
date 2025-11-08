"use client"

import * as React from "react"
import { Area, AreaChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts"
import { useTheme } from "next-themes";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select"
import { createClient } from '@/lib/supabase/client'


// Segmented Control for Metric Selection (Apple-style visual)
const MetricSelector = ({ options, selected, onSelect, theme }) => (
  <div className={`inline-flex p-1 rounded-lg transition duration-200 ${theme === "dark" ? "bg-gray-800" : "bg-gray-100"}`}>
    {options.map((option) => (
      <button
        key={option.value}
        onClick={() => onSelect(option.value)}
        className={`
          px-3 py-1.5 text-xs font-medium transition-all duration-150 rounded-md
          ${selected === option.value
            ? theme === "dark" 
              ? "bg-gray-700 text-white shadow-sm" 
              : "bg-white text-gray-900 shadow-sm"
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
);

interface AnalyticsData {
  date: string;
  views: number;
  clicks: number;
}

// Main Component
export default function AnalyticsChart() {
  const [selectedMetric, setSelectedMetric] = React.useState<"views" | "clicks">("views")
  const [timeRange, setTimeRange] = React.useState<"7d" | "30d" | "90d">("90d")
  const [analyticsData, setAnalyticsData] = React.useState<AnalyticsData[]>([]);
  const [loading, setLoading] = React.useState(true);
  const { theme } = useTheme();

  // Fetch analytics data from Supabase
  React.useEffect(() => {
    async function fetchAnalyticsData() {
      try {
        setLoading(true);
        const supabase = createClient();
        
        // Get views data
        const { data: viewsData, error: viewsError } = await supabase
          .from('page_views')
          .select('viewed_at')
          .gte('viewed_at', new Date(Date.now() - (timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 90) * 24 * 60 * 60 * 1000).toISOString());

        if (viewsError) throw viewsError;

        // Get clicks data
        const { data: clicksData, error: clicksError } = await supabase
          .from('link_clicks')
          .select('clicked_at')
          .gte('clicked_at', new Date(Date.now() - (timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 90) * 24 * 60 * 60 * 1000).toISOString());

        if (clicksError) throw clicksError;

        // Generate analytics data grouped by date
        const days = timeRange === "7d" ? 7 : timeRange === "30d" ? 30 : 90;
        const data: AnalyticsData[] = [];
        
        for (let i = 0; i < days; i++) {
          const date = new Date();
          date.setDate(date.getDate() - (days - 1 - i));
          const dateStr = date.toISOString().split("T")[0];
          
          // Filter for the specific date
          const dayViews = viewsData?.filter(v => v.viewed_at?.startsWith?.(dateStr)).length || 0;
          const dayClicks = clicksData?.filter(c => c.clicked_at?.startsWith?.(dateStr)).length || 0;
          
          data.push({
            date: dateStr,
            views: dayViews,
            clicks: dayClicks,
          });
        }
        
        setAnalyticsData(data);
      } catch (error) {
        console.error('Error fetching analytics data:', error);
        setAnalyticsData([]); // Set empty array in case of error
      } finally {
        setLoading(false);
      }
    }

    fetchAnalyticsData();
  }, [timeRange]); // Re-run when time range changes

  // Process data for the chart based on selected time range and metric
  const { filteredData, stats } = React.useMemo(() => {
    if (!analyticsData || !analyticsData.length) {
      return { filteredData: [], stats: { total: 0, average: 0, change: 0 } };
    }

    // Calculate statistics
    const total = analyticsData.reduce((sum, item) => sum + item[selectedMetric], 0);
    const average = analyticsData.length > 0 ? Math.round(total / analyticsData.length) : 0;

    // Calculate percentage change (compare first half vs second half)
    const midPoint = Math.floor(analyticsData.length / 2);
    const firstHalf = analyticsData.slice(0, midPoint);
    const secondHalf = analyticsData.slice(midPoint);

    const firstHalfSum = firstHalf.reduce((sum, item) => sum + item[selectedMetric], 0);
    const firstHalfAvg = firstHalf.length > 0 ? firstHalfSum / firstHalf.length : 0;
    
    const secondHalfSum = secondHalf.reduce((sum, item) => sum + item[selectedMetric], 0);
    const secondHalfAvg = secondHalf.length > 0 ? secondHalfSum / secondHalf.length : 0;

    const change = firstHalfAvg > 0
      ? Math.round(((secondHalfAvg - firstHalfAvg) / firstHalfAvg) * 100)
      : 0;

    return {
      filteredData: analyticsData,
      stats: { total, average, change }
    };
  }, [analyticsData, selectedMetric]);


  const formatDate = React.useCallback((dateString: string) => {
    const date = new Date(dateString)
    if (timeRange === "7d") {
      return date.toLocaleDateString("en-US", { weekday: "short" })
    }
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
  }, [timeRange])

  const metricLabel = selectedMetric === "views" ? "Page Views" : "Link Clicks"
  // Use different colors based on the theme
  const metricColor = selectedMetric === "views" ? (theme === "dark" ? "#0A84FF" : "#007AFF") : (theme === "dark" ? "#A29BFE" : "#3D6DCC") // Apple-style Blue/Teal with dark theme variants

  const MetricOptions = [
    { label: "Views", value: "views" },
    { label: "Clicks", value: "clicks" },
  ];
  
  // Define theme-aware colors
  const themeColors = {
    light: {
      gridStroke: "#e5e7eb",
      text: "#6b7280",
      tooltipBg: "white",
      tooltipBorder: "#e5e7eb",
      metricLabel: "#1f2937",
      trendUp: "#10b981",
      trendDown: "#ef4444",
      cardBg: "white",
      cardBorder: "#e5e7eb",
      cardText: "#6b7280",
      cardTitle: "#1f2937",
      background: "#f9fafb"
    },
    dark: {
      gridStroke: "#374151",
      text: "#9ca3af",
      tooltipBg: "#1f2937",
      tooltipBorder: "#374151",
      metricLabel: "#f9fafb",
      trendUp: "#34d399",
      trendDown: "#f87171",
      cardBg: "#111827",
      cardBorder: "#374151",
      cardText: "#9ca3af",
      cardTitle: "#f9fafb",
      background: "#030712"
    }
  };

  const currentTheme = themeColors[theme || "light"];

  // Custom Recharts Tooltip Content for better display
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        const value = payload[0].value.toLocaleString();
        return (
            <div className={`p-3 border rounded-lg shadow-md text-sm ${theme === "dark" ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`}>
                <p className={`${theme === "dark" ? "text-gray-300" : "text-gray-500"} font-medium mb-1`}>{formatDate(label)}</p>
                <p className={`font-bold ${theme === "dark" ? "text-white" : "text-gray-900"}`} style={{ color: payload[0].stroke }}>
                    {metricLabel}: {value}
                </p>
            </div>
        );
    }
    return null;
  };
  
  // Format date for display
  const formatDate = React.useCallback((dateString: string) => {
    const date = new Date(dateString)
    if (timeRange === "7d") {
      return date.toLocaleDateString("en-US", { weekday: "short" })
    }
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
  }, [timeRange])

  const metricLabel = selectedMetric === "views" ? "Page Views" : "Link Clicks"
  // Use different colors based on the theme
  const metricColor = selectedMetric === "views" ? (theme === "dark" ? "#0A84FF" : "#007AFF") : (theme === "dark" ? "#A29BFE" : "#3D6DCC") // Apple-style Blue/Teal with dark theme variants

  const MetricOptions = [
    { label: "Views", value: "views" },
    { label: "Clicks", value: "clicks" },
  ];
  
  // Define theme-aware colors
  const themeColors = {
    light: {
      gridStroke: "#e5e7eb",
      text: "#6b7280",
      tooltipBg: "white",
      tooltipBorder: "#e5e7eb",
      metricLabel: "#1f2937",
      trendUp: "#10b981",
      trendDown: "#ef4444",
      cardBg: "white",
      cardBorder: "#e5e7eb",
      cardText: "#6b7280",
      cardTitle: "#1f2937",
      background: "#f9fafb"
    },
    dark: {
      gridStroke: "#374151",
      text: "#9ca3af",
      tooltipBg: "#1f2937",
      tooltipBorder: "#374151",
      metricLabel: "#f9fafb",
      trendUp: "#34d399",
      trendDown: "#f87171",
      cardBg: "#111827",
      cardBorder: "#374151",
      cardText: "#9ca3af",
      cardTitle: "#f9fafb",
      background: "#030712"
    }
  };

  const currentTheme = themeColors[theme || "light"];

  // Custom Recharts Tooltip Content for better display
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        const value = payload[0].value.toLocaleString();
        return (
            <div className={`p-3 border rounded-lg shadow-md text-sm ${theme === "dark" ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`}>
                <p className={`${theme === "dark" ? "text-gray-300" : "text-gray-500"} font-medium mb-1`}>{formatDate(label)}</p>
                <p className={`font-bold ${theme === "dark" ? "text-white" : "text-gray-900"}`} style={{ color: payload[0].stroke }}>
                    {metricLabel}: {value}
                </p>
            </div>
        );
    }
    return null;
  };
  
  return (
    <div className={`p-4 sm:p-6 md:p-8 ${theme === "dark" ? "bg-gray-900 min-h-screen" : "bg-gray-50 min-h-screen"}`}>
      <Card className="max-w-4xl mx-auto pt-0">
        
        {/* Card Header (Merging title, description, and time select) */}
        <CardHeader className="flex items-center gap-4 sm:gap-2 space-y-0 py-5 sm:flex-row">
          <div className="grid flex-1 gap-1">
            <CardTitle>Website Analytics</CardTitle>
            <CardDescription>
              Showing total {metricLabel.toLowerCase()} for the last {timeRange.replace('d', ' days')}
            </CardDescription>
          </div>
          
          {/* Time Range Select (from UI snippet 2) */}
          <Select 
            value={timeRange} 
            onValueChange={(v: string) => setTimeRange(v as "7d" | "30d" | "90d")}
            className="w-full sm:w-[160px]"
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="90d">Last 3 months</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="7d">Last 7 days</SelectItem>
            </SelectContent>
          </Select>
        </CardHeader>
        
        <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
          
          {/* Stats Row (from original component logic) */}
          <div className="grid grid-cols-3 gap-4 mb-6">
             <MetricSelector
                options={MetricOptions}
                selected={selectedMetric}
                onSelect={setSelectedMetric}
                theme={theme}
                className="col-span-3 sm:col-span-1 mb-2 sm:mb-0"
              />

            {/* Daily Average */}
            <div className="flex flex-col justify-center rounded-xl p-3 border">
              <p className={`text-xs uppercase font-medium ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>
                Daily Avg
              </p>
              <p className={`text-xl font-bold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                {stats.average.toLocaleString()}
              </p>
            </div>

            {/* Trend */}
            <div className="flex flex-col justify-center rounded-xl p-3 border">
              <p className={`text-xs uppercase font-medium ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>
                Trend
              </p>
              <div className={`text-xl font-bold flex items-center gap-1.5 ${
                stats.change >= 0 ? (theme === "dark" ? "text-green-400" : "text-green-600") : (theme === "dark" ? "text-red-400" : "text-red-600")
              }`}>
                {stats.change >= 0 ? "↑" : "↓"} {Math.abs(stats.change)}%
              </div>
            </div>
          </div>
          
          {/* Chart Area */}
          <div className="aspect-auto h-[250px] w-full">
            {loading ? (
              <div className="h-full flex items-center justify-center">
                <p className={`${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>Loading analytics...</p>
              </div>
            ) : filteredData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  key={`area-chart-${theme}`}  // Add key to force re-render on theme change
                  data={filteredData}
                  margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="metricGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={metricColor} stopOpacity={0.4} />
                      <stop offset="95%" stopColor={metricColor} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  
                  <CartesianGrid vertical={false} stroke={currentTheme.gridStroke} strokeDasharray="3 3" />
                  
                  <XAxis
                    dataKey="date"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    minTickGap={32}
                    tickFormatter={formatDate}
                    tick={{ fill: currentTheme.text, fontSize: 12 }}
                  />
                  
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    tickMargin={12}
                    tickFormatter={(value) => value.toLocaleString()}
                    tick={{ fill: currentTheme.text, fontSize: 12 }}
                  />

                  <Tooltip cursor={{ stroke: metricColor, strokeDasharray: '3 3', strokeWidth: 1 }} content={<CustomTooltip />} />
                  
                  <Area
                    dataKey={selectedMetric}
                    type="monotone"
                    fill={`url(#metricGradient)`}
                    stroke={metricColor}
                    strokeWidth={3}
                    activeDot={{ 
                        r: 6, 
                        fill: metricColor, 
                        stroke: theme === "dark" ? "rgba(30, 30, 30, 0.9)" : "rgba(255, 255, 255, 0.9)", 
                        strokeWidth: 3 
                    }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
                <div className={`h-full flex items-center justify-center ${theme === "dark" ? "text-gray-400" : "text-gray-500"} border border-dashed rounded-lg`}>
                    No data available for the selected period.
                </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
