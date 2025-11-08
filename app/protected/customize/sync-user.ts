import { createClient } from '@/lib/supabase/client'

/**
 * Synchronizes the authenticated user with a public 'users' table.
 * Creates a new user record if one doesn't exist.
 *
 * @param {object} user - The authenticated user object from Supabase Auth.
 * @param {string} user.id - The user's unique ID.
 * @param {string} [user.email] - The user's email address.
 */
export async function syncAuthUserToPublic(user: {
  id: string
  email?: string
}) {
  if (!user) return

  const supabase = createClient()
  const { error } = await supabase.from('users').upsert(
    {
      id: user.id,
      email: user.email,
    },
    { onConflict: 'id' }
  )

  if (error) {
    console.error('Error creating user in public table:', error)
  }
}