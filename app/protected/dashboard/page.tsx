'use client'

import { motion } from 'framer-motion'
import { PlusCircle, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function DashboardPage() {
  const [hasPage] = useState(false)
  const router = useRouter()

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
            You don’t have a bio page yet. Build your creator link page to share your socials and projects in one clean place.
          </p>

          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              onClick={() => router.push('pages/builder')}
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
