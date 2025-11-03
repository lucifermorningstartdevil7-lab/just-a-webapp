'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { GripVertical, Trash2, Edit3, ChevronDown, ChevronRight } from 'lucide-react'
import { Button } from '@/app/components/ui/button'

interface Bundle {
  id: string
  name: string
  icon: string
  color: string
  position: number
  links: string[]
}

interface Link {
  id: string
  title: string
  url: string
  type: string
  active: boolean
}

interface BundleDragDropProps {
  bundles: Bundle[]
  links: Link[]
  onBundlesUpdate: (bundles: Bundle[]) => void
  onSaveBundle: (bundle: Bundle) => void
  onDeleteBundle: (bundleId: string) => void
  onEditBundle: (bundle: Bundle) => void
}

export function BundleDragDrop({ 
  bundles, 
  links, 
  onBundlesUpdate,
  onSaveBundle,
  onDeleteBundle,
  onEditBundle
}: BundleDragDropProps) {
  const [draggedBundleId, setDraggedBundleId] = useState<string | null>(null)
  const [expandedBundles, setExpandedBundles] = useState<Record<string, boolean>>({})

  function handleDragStart(bundleId: string) {
    setDraggedBundleId(bundleId)
  }

  function handleDragOver(e: React.DragEvent, targetBundleId: string) {
    e.preventDefault()
    if (!draggedBundleId || draggedBundleId === targetBundleId) return

    const draggedIndex = bundles.findIndex(b => b.id === draggedBundleId)
    const targetIndex = bundles.findIndex(b => b.id === targetBundleId)

    if (draggedIndex === -1 || targetIndex === -1) return

    // Reorder bundles
    const newBundles = [...bundles]
    const [removed] = newBundles.splice(draggedIndex, 1)
    newBundles.splice(targetIndex, 0, removed)

    // Update positions
    const updatedBundles = newBundles.map((bundle, index) => ({
      ...bundle,
      position: index
    }))

    onBundlesUpdate(updatedBundles)
  }

  function toggleBundleExpansion(bundleId: string) {
    setExpandedBundles(prev => ({
      ...prev,
      [bundleId]: !prev[bundleId]
    }))
  }

  function getBundleLinks(bundle: Bundle) {
    return links.filter(link => 
      bundle.links.includes(link.id) && link.active
    )
  }

  return (
    <div className="space-y-3">
      {bundles.map((bundle, index) => {
        const bundleLinks = getBundleLinks(bundle)
        const isExpanded = expandedBundles[bundle.id] ?? true
        
        return (
          <motion.div
            key={bundle.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            draggable
            onDragStart={() => handleDragStart(bundle.id)}
            onDragOver={(e) => handleDragOver(e, bundle.id)}
            className="bg-white border border-slate-200 rounded-xl shadow-sm"
          >
            {/* Bundle Header */}
            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div 
                  className="p-1.5 rounded cursor-grab active:cursor-grabbing hover:bg-slate-100 transition-colors"
                  draggable
                >
                  <GripVertical className="w-4 h-4 text-slate-400" />
                </div>
                
                <div 
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-lg flex-shrink-0"
                  style={{ backgroundColor: `${bundle.color}20`, color: bundle.color }}
                >
                  {bundle.icon}
                </div>
                
                <div className="min-w-0 flex-1">
                  <h3 className="font-semibold text-slate-800 truncate">{bundle.name}</h3>
                  <p className="text-xs text-slate-500">
                    {bundleLinks.length} link{bundleLinks.length !== 1 ? 's' : ''}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleBundleExpansion(bundle.id)}
                  className="text-slate-500 hover:text-slate-700 hover:bg-slate-100"
                >
                  {isExpanded ? (
                    <ChevronDown className="w-4 h-4" />
                  ) : (
                    <ChevronRight className="w-4 h-4" />
                  )}
                </Button>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onEditBundle(bundle)}
                  className="text-slate-500 hover:text-slate-700 hover:bg-slate-100"
                >
                  <Edit3 className="w-4 h-4" />
                </Button>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDeleteBundle(bundle.id)}
                  className="text-slate-500 hover:text-red-600 hover:bg-red-50"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
            
            {/* Expanded Bundle Content */}
            {isExpanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden border-t border-slate-200"
              >
                <div className="p-4 space-y-3">
                  {bundleLinks.length === 0 ? (
                    <div className="text-center py-4 text-slate-500 text-sm">
                      No links in this bundle
                    </div>
                  ) : (
                    bundleLinks.map((link) => (
                      <div 
                        key={link.id}
                        className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg border border-slate-200"
                      >
                        <div className="w-2 h-2 rounded-full bg-slate-400 flex-shrink-0"></div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium text-slate-800 truncate">
                            {link.title}
                          </p>
                          <p className="text-xs text-slate-500 truncate">
                            {link.url}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </motion.div>
            )}
          </motion.div>
        )
      })}
    </div>
  )
}