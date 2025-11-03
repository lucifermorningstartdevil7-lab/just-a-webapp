// lib/benchmark-calculations.ts
import { createClient } from '@/lib/supabase/client'

interface BenchmarkStats {
  yourPerformance: number
  categoryAverage: number
  percentile: number // top 20%, etc.
  category?: string
  insights?: string[]
  recommendations?: string[]
}

export async function getBenchmarkData(userId: string, pageId: string, isPremium: boolean = false): Promise<BenchmarkStats> {
  const supabase = createClient()
  
  // Get user's profile data
  const { data: user, error: userError } = await supabase
    .from('users')
    .select('creator_type, follower_tier')
    .eq('id', userId)
    .single()

  // If user is not found, use a default creator type
  const creatorType = user?.creator_type || 'Creator'
  const followerTier = user?.follower_tier || 'medium'

  // Calculate user's current performance
  const userStats = await calculateUserPerformance(pageId)
  
  // Get benchmark data for their category (or default if user not found)
  const benchmark = await getCategoryBenchmarks(creatorType, followerTier)
  
  // Calculate percentile
  const percentile = calculatePercentile(userStats.clickRate, benchmark)
  
  // For free users, only return basic data
  if (!isPremium) {
    return {
      yourPerformance: userStats.clickRate,
      categoryAverage: benchmark.averageClickRate,
      percentile,
      category: creatorType
    }
  }
  
  // For premium users, include insights and recommendations
  const insights = generateInsights(userStats, benchmark, percentile, creatorType)
  const recommendations = generateRecommendations(userStats, benchmark, creatorType)

  return {
    yourPerformance: userStats.clickRate,
    categoryAverage: benchmark.averageClickRate,
    percentile,
    category: creatorType,
    insights,
    recommendations
  }
}

async function calculateUserPerformance(pageId: string) {
  const supabase = createClient()
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()

  // Get total views and clicks
  const { data: views } = await supabase
    .from('page_views')
    .select('id')
    .eq('page_id', pageId)
    .gte('viewed_at', thirtyDaysAgo)

  const { data: clicks } = await supabase
    .from('link_clicks') 
    .select('id')
    .eq('page_id', pageId)
    .gte('clicked_at', thirtyDaysAgo)

  const totalViews = views?.length || 0
  const totalClicks = clicks?.length || 0
  const clickRate = totalViews > 0 ? (totalClicks / totalViews) * 100 : 0

  return { totalViews, totalClicks, clickRate }
}

async function getCategoryBenchmarks(creator_type: string, follower_tier: string) {
  const supabase = createClient()
  
  // Get performance data for users in the same category and tier
  const { data: benchmarkData } = await supabase
    .from('page_performance')
    .select('click_rate')
    .eq('creator_type', creator_type)
    .eq('follower_tier', follower_tier)
    .gte('calculated_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()) // Last 30 days

  if (!benchmarkData || benchmarkData.length === 0) {
    // Default fallback values if no category data available
    return {
      averageClickRate: 5.0,
      allRates: [] as number[]
    }
  }

  const allRates = benchmarkData.map(item => item.click_rate)
  const averageClickRate = allRates.reduce((sum, rate) => sum + rate, 0) / allRates.length

  return {
    averageClickRate,
    allRates
  }
}

function calculatePercentile(yourRate: number, benchmark: { allRates: number[]; averageClickRate: number }) {
  if (!benchmark.allRates || benchmark.allRates.length === 0) {
    return 50 // Default to 50th percentile if no data
  }

  // Calculate what percentage of competitors have a lower rate than yours
  const lowerRates = benchmark.allRates.filter(rate => rate < yourRate)
  const percentile = (lowerRates.length / benchmark.allRates.length) * 100
  
  // Ensure percentile is between 1 and 100
  return Math.min(100, Math.max(1, Math.round(percentile)))
}

function generateInsights(
  userStats: { totalViews: number; totalClicks: number; clickRate: number }, 
  benchmark: { averageClickRate: number; allRates: number[] }, 
  percentile: number,
  category: string
) {
  const insights = []
  
  // Performance comparison insight
  if (userStats.clickRate > benchmark.averageClickRate) {
    insights.push(`Your click-through rate (${userStats.clickRate.toFixed(2)}%) is above the category average (${benchmark.averageClickRate.toFixed(2)}%)`)
  } else {
    insights.push(`Your click-through rate (${userStats.clickRate.toFixed(2)}%) is below the category average (${benchmark.averageClickRate.toFixed(2)}%)`)
  }
  
  // Percentile insight
  insights.push(`You're in the top ${percentile}% of creators in ${category}`)
  
  // Additional insights based on data availability
  if (benchmark.allRates && benchmark.allRates.length > 0) {
    const top25Percentile = Math.round(benchmark.allRates.length * 0.75)
    const topQuartileRate = [...benchmark.allRates].sort((a, b) => b - a)[top25Percentile] || benchmark.averageClickRate
    if (userStats.clickRate >= topQuartileRate) {
      insights.push(`You're in the top 25% of performers in your category`)
    } else {
      insights.push(`To join the top 25%, aim for a click-through rate of ${topQuartileRate.toFixed(2)}%`)
    }
  }
  
  // Engagement insight
  if (userStats.totalViews > 0) {
    insights.push(`You've received ${userStats.totalClicks} clicks from ${userStats.totalViews} views`)
  }

  return insights
}

function generateRecommendations(
  userStats: { totalViews: number; totalClicks: number; clickRate: number }, 
  benchmark: { averageClickRate: number; allRates: number[] }, 
  category: string
) {
  const recommendations = []
  
  // Recommendation based on performance gap
  if (userStats.clickRate < benchmark.averageClickRate) {
    const improvementNeeded = ((benchmark.averageClickRate - userStats.clickRate) / userStats.clickRate) * 100
    recommendations.push(`To reach category average, aim to improve click-through rate by ${improvementNeeded.toFixed(0)}%`)
  }
  
  // Content recommendations based on category
  if (category.toLowerCase().includes('gamer') || category.toLowerCase().includes('gaming')) {
    recommendations.push('Try using more action words in your link titles - they perform 15% better in gaming')
    recommendations.push('Share content during peak gaming hours (18:00-22:00) for maximum visibility')
  } else if (category.toLowerCase().includes('tech') || category.toLowerCase().includes('developer')) {
    recommendations.push('Add more technical keywords to your links - they perform better with tech audiences')
    recommendations.push('Include trending tech topics in your link descriptions for more clicks')
  } else if (category.toLowerCase().includes('creator') || category.toLowerCase().includes('content')) {
    recommendations.push('Use power words in your link titles - they increase clicks by an average of 20%')
    recommendations.push('Add emojis to your links - they increase engagement by 25% in creative categories')
  } else {
    recommendations.push('Use more compelling link titles - strong titles perform 20-30% better across categories')
    recommendations.push('Include emojis in your links - they generally improve engagement by 15-25%')
  }
  
  // Timing recommendation
  recommendations.push('Test sharing during different times of day to find when your audience is most active')
  
  return recommendations
}
