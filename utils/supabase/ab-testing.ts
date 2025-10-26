// utils/ab-testing.ts
import { DatabaseLink, LinkWithABTesting } from '@/app/types/ab-testing'

export function transformLinkWithABTesting(dbLink: DatabaseLink): LinkWithABTesting {
  return {
    id: dbLink.id,
    title: dbLink.title,
    original_title: dbLink.original_title || undefined,
    test_variant: dbLink.test_variant,
    test_data: dbLink.test_data as ABTestData || {
      clicks_A: 0,
      clicks_B: 0,
      started_at: null
    },
    is_testing: dbLink.test_variant !== null
  }
}

// Usage in your page:
const { data: links } = await supabase
  .from('links')
  .select('*')
  .eq('page_id', pageId)

const transformedLinks = links?.map(transformLinkWithABTesting) || []