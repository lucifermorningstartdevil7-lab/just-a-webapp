'use client'
import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import LinkItem from '../[username]/components/LinkItem'


interface BundleDisplayProps {
  title: string
  links: { id: string; title: string; url: string; icon?: string }[]
}

export default function BundleDisplay({ title, links }: BundleDisplayProps) {
  const [open, setOpen] = useState(false)

  return (
    <div className="w-full">
      <motion.div
        onClick={() => setOpen(!open)}
        whileHover={{ scale: 1.01 }}
        className="w-full cursor-pointer rounded-2xl bg-gradient-to-r from-indigo-900/60 to-purple-800/60 
                   border border-indigo-700/40 backdrop-blur-lg shadow-xl 
                   px-5 py-4 flex items-center justify-between text-white font-semibold tracking-wide"
      >
        <span>{title}</span>
        <motion.svg
          animate={{ rotate: open ? 90 : 0 }}
          transition={{ duration: 0.2 }}
          xmlns="http://www.w3.org/2000/svg"
          fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"
          className="w-5 h-5 text-white/80"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </motion.svg>
      </motion.div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden mt-3 pl-3 border-l-2 border-indigo-700/40 space-y-3"
          >
            {links.map((link) => (
              <LinkItem key={link.id} title={link.title} url={link.url} icon={link.icon} />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
