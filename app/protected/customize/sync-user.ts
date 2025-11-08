import { createClient } from '@/lib/supabase/client'

/**
 * Syncs Supabase Auth user with the public 'users' table.
 */
export async function syncAuthUserToPublic(user: { id: string; email?: string }) {
  if (!user?.id) return

  const supabase = createClient()

  const { error } = await supabase
    .from('users')
    .upsert(
      { id: user.id, email: user.email },
      { onConflict: 'id' }
    )
    .single()

  if (error && !error.message.includes('duplicate')) {
    console.error('Error syncing user to public table:', error.message)
  }
}
