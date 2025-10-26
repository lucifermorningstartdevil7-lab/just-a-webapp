'use client'

import { motion } from 'framer-motion'
import { PlusCircle, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { once } from 'events'

export default function DashboardPage() {
  const [hasPage, setHasPage] = useState<boolean | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    checkUserPage()
  }, [])

  async function checkUserPage() {
    try {
      const supabase = createClient()
      
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        router.push('/auth/login')
        return
      }

      
      const { data, error } = await supabase
        .from('pages')
        .select('id')
        .eq('user_id', user.id)
        .limit(1)

      if (error && error.code !== 'PGRST116') {
        console.error('Error checking page:', error)
      }

      setHasPage(data && data.length > 0)
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{duration: 0.4}}
        >
          <Sparkles className="w-8 h-8 text-neutral-400" />
        </motion.div>
      </div>
    )
  }

  if (!hasPage) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-6 max-w-md"
        >
          <div className="flex justify-center">
            <div className="p-5 bg-neutral-800 rounded-2xl">
              <Sparkles className="w-12 h-12 text-neutral-50" />
            </div>
          </div>

          <h1 className="text-3xl font-bold text-neutral-50">
            Welcome, Creator !
          </h1>
          <p className="text-neutral-400 text-sm">
            You don't have a bio page yet. Build your creator link page to share your socials and projects in one clean place.
          </p>

          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              onClick={() => router.push('/dashboard/pages/builder')}
              className="bg-neutral-200 hover:bg-neutral-700 text-neutral-900 border hover:text-neutral-200 border-neutral-700 hover:border-neutral-200 rounded-xl px-6 py-5"
            >
              <PlusCircle className="mr-2 h-5 w-5" />
              Create Your Page
            </Button>
          </motion.div>

          <p className="text-xs text-neutral-500">
            It only takes a minute to set up your first page.
          </p>
        </motion.div>
      </div>
    )
  }

  // when page exists
  return (
    <div className="p-8">
      <h1 className="text-2xl font-semibold text-neutral-100 mb-6">Your Creator Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          { label: 'Total Views', value: '1,240' },
          { label: 'Link Clicks', value: '512' },
          { label: 'Engagement Rate', value: '41%' },
        ].map((item, i) => (
          <motion.div
            key={i}
            whileHover={{ scale: 1.02 }}
            className="bg-neutral-900 border border-neutral-800 rounded-xl p-5"
          >
            <span className="text-sm text-neutral-400">{item.label}</span>
            <span className="text-2xl font-semibold text-neutral-100">{item.value}</span>
          </motion.div>
        ))}
      </div>
    </div>
  )
}