import { createClient } from '@/lib/supabase/server';

/**
 * Checks if the user has completed the initial onboarding flow
 */
export async function hasCompletedOnboarding(userId: string): Promise<boolean> {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('user_preferences')
    .select('value')
    .eq('user_id', userId)
    .eq('key', 'onboarding_completed')
    .single();

  if (error) {
    // Handle cases where the user_preferences table doesn't exist yet
    // This might happen if the database hasn't been set up with the table
    if (error.code === '42P01' || error.message.includes('does not exist')) {
      // Table doesn't exist, so user hasn't completed onboarding
      return false;
    }
    
    console.error('Error checking onboarding status:', error);
    return false;
  }

  return data?.value === 'true';
}

/**
 * Marks the user's onboarding as completed
 */
export async function markOnboardingCompleted(userId: string): Promise<boolean> {
  const supabase = await createClient();
  
  const { error } = await supabase
    .from('user_preferences')
    .upsert({
      user_id: userId,
      key: 'onboarding_completed',
      value: 'true'
    }, { onConflict: ['user_id', 'key'] });

  if (error) {
    // Handle cases where the user_preferences table doesn't exist yet
    if (error.code === '42P01' || error.message.includes('does not exist')) {
      console.error('user_preferences table does not exist:', error);
      return false;
    }
    
    console.error('Error marking onboarding as completed:', error);
    return false;
  }

  return true;
}

/**
 * Checks if the user has created their first page
 */
export async function hasCreatedPage(userId: string): Promise<boolean> {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('pages')
    .select('id')
    .eq('user_id', userId)
    .single();

  if (error) {
    // If no pages exist, the error will be 'PGRST116: no rows returned'
    // We also handle cases where the table doesn't exist yet
    if (error.code === 'PGRST116') {
      // No rows found is expected when user hasn't created a page
      return false;
    } else if (error.code === '42P01' || error.message.includes('does not exist')) {
      // Table doesn't exist, so user hasn't created a page
      return false;
    }
    
    console.error('Error checking if user has created page:', error);
    return false;
  }

  return !!data?.id;
}