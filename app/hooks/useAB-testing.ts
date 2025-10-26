// hooks/useABTesting.ts
import { useState, useCallback } from 'react'
import { ABTestData } from '@/app/types/ab-testing'

export function useABTesting() {
  const [activeTests, setActiveTests] = useState<Set<string>>(new Set())

  const startTest = useCallback(async (linkId: string, variantBTitle: string) => {
    const response = await fetch('/api/ab-test/start', {
      method: 'POST',
      body: JSON.stringify({ linkId, variantBTitle })
    })
    if (!response.ok) throw new Error('Failed to start test')
    setActiveTests(prev => new Set(prev).add(linkId))
  }, [])

  const endTest = useCallback(async (linkId: string, applyWinner: boolean) => {
    const response = await fetch('/api/ab-test/end', {
      method: 'POST',
      body: JSON.stringify({ linkId, applyWinner })
    })
    if (!response.ok) throw new Error('Failed to end test')
    setActiveTests(prev => {
      const newSet = new Set(prev)
      newSet.delete(linkId)
      return newSet
    })
  }, [])

  const calculateWinner = useCallback((testData: ABTestData): 'A' | 'B' | null => {
    const totalClicks = (testData.clicks_A || 0) + (testData.clicks_B || 0)
    if (totalClicks < 10) return null
    const rateA = testData.clicks_A / totalClicks
    const rateB = testData.clicks_B / totalClicks
    if (rateA > rateB * 1.2) return 'A'
    if (rateB > rateA * 1.2) return 'B'
    return null
  }, [])

  const getTestProgress = useCallback((testData: ABTestData): number => {
    const totalClicks = (testData.clicks_A || 0) + (testData.clicks_B || 0)
    return Math.min((totalClicks / 50) * 100, 100)
  }, [])

  return { activeTests, startTest, endTest, calculateWinner, getTestProgress }
}