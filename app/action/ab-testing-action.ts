// app/actions/ab-testing-actions.ts
'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function startABTest(linkId: string, variantBTitle: string) {
  const supabase = await createClient()
  
  // Check free tier limit (1 active test)
  const { data: activeTests } = await supabase
    .from('links')
    .select('id')
    .not('test_variant', 'is', null)

  if (activeTests && activeTests.length >= 1) {
    throw new Error('Free tier limited to 1 active A/B test')
  }

  // Get current link
  const { data: link } = await supabase
    .from('links')
    .select('*')
    .eq('id', linkId)
    .single()

  if (!link) throw new Error('Link not found')

  // Start A/B test
  const { error } = await supabase
    .from('links')
    .update({
      test_variant: 'A',
      test_data: {
        variantBTitle,
        clicks_A: 0,
        clicks_B: 0,
        started_at: new Date().toISOString(),
        status: 'running'
      },
      original_title: link.title
    })
    .eq('id', linkId)

  if (error) throw new Error('Failed to start A/B test')
  revalidatePath('/dashboard/links')
}

export async function endABTest(linkId: string, applyWinner: boolean) {
  const supabase = await createClient()

  const { data: link } = await supabase
    .from('links')
    .select('test_data, original_title')
    .eq('id', linkId)
    .single()

  if (!link) throw new Error('Link not found')

  const testData = link.test_data as any

  if (applyWinner && testData?.winner) {
    const winningTitle = testData.winner === 'A' 
      ? link.original_title 
      : testData.variantBTitle

    await supabase
      .from('links')
      .update({ 
        title: winningTitle,
        test_variant: null,
        test_data: null,
        original_title: null
      })
      .eq('id', linkId)
  } else {
    await supabase
      .from('links')
      .update({ 
        test_variant: null,
        test_data: { ...testData, status: 'completed', ended_at: new Date().toISOString() },
        original_title: null
      })
      .eq('id', linkId)
  }

  revalidatePath('/dashboard/links')
}