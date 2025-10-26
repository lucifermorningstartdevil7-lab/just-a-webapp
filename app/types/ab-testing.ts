// types/ab-testing.ts
export interface ABTestData {
  clicks_A: number;
  clicks_B: number;
  started_at: string | null;
  winner?: 'A' | 'B' | null;
  variantBTitle?: string;
  status?: 'running' | 'completed';
}

export interface LinkWithABTesting {
  id: string;
  title: string;
  original_title?: string;
  test_variant: 'A' | 'B' | null;
  test_data: ABTestData | null;
  is_testing: boolean;
}