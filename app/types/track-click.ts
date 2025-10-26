'use server'

import { createClient } from '@/lib/supabase/client'

export async function trackClick(linkId: string, pageId: string, variant: string = 'A') {
  const supabase = createClient()
  
  // Generate visitor ID
  const visitorId = `visitor_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  
  // Track the basic click
  await supabase.from('link_clicks').insert({
    page_id: pageId,
    link_id: linkId,
    visitor_id: visitorId,
    clicked_at: new Date().toISOString(),
    variant: variant
  })

  // Update A/B test stats if test is running
  const { data: linkData } = await supabase
    .from('links')
    .select('test_data, test_variant')
    .eq('id', linkId)
    .single()

  if (linkData?.test_data) {
    let testData
    try {
      testData = typeof linkData.test_data === 'string' 
        ? JSON.parse(linkData.test_data) 
        : linkData.test_data
    } catch (e) {
      console.error('Error parsing test data:', e)
      return
    }
    
    // Only update if test is active
    if (testData.started_at) {
      const updatedData = {
        ...testData,
        [`clicks_${variant}`]: (testData[`clicks_${variant}`] || 0) + 1
      }

      await supabase
        .from('links')
        .update({ test_data: updatedData })
        .eq('id', linkId)
    }
  }
}