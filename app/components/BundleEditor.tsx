'use client'

import { useState, useEffect } from 'react'
import { X, Hash, Palette, Move, Smile } from 'lucide-react'
import { Button } from '@/app/components/ui/button'
import { Input } from '@/app/components/ui/input'
import { Label } from '@/app/components/ui/label'
import { Card, CardContent } from '@/app/components/ui/card'

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

interface BundleEditorProps {
  bundle: Bundle
  links: Link[]
  onSave: (bundle: Bundle) => void
  onClose: () => void
}

const bundleIcons = [
  '📁', '📦', '🎯', '🚀', '💡', '🎨', '📱', '💻', 
  '🎮', '🎵', '🎬', '📚', '💼', '🛒', '🍽️', '🏠',
  '🚗', '✈️', '🏖️', '🏔️', '⚽', '🏀', '🎾', '🚴'
]

const bundleColors = [
  '#3b82f6', '#10b981', '#8b5cf6', '#ef4444', '#f59e0b',
  '#ec4899', '#06b6d4', '#84cc16', '#f97316', '#6366f1'
]

export function BundleEditor({ bundle, links, onSave, onClose }: BundleEditorProps) {
  const [editedBundle, setEditedBundle] = useState<Bundle>(bundle)
  const [selectedLinks, setSelectedLinks] = useState<string[]>(bundle.links)

  useEffect(() => {
    setEditedBundle(bundle)
    setSelectedLinks(bundle.links)
  }, [bundle])

  function handleSave() {
    onSave({
      ...editedBundle,
      links: selectedLinks
    })
    onClose()
  }

  function toggleLinkSelection(linkId: string) {
    setSelectedLinks(prev => 
      prev.includes(linkId) 
        ? prev.filter(id => id !== linkId)
        : [...prev, linkId]
    )
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-slate-800">
              {bundle.id.startsWith('bundle_') ? 'Create Bundle' : 'Edit Bundle'}
            </h2>
            <Button 
              variant="ghost" 
              size="icon"
              onClick={onClose}
              className="text-slate-500 hover:text-slate-700"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          <div className="space-y-6">
            {/* Bundle Name */}
            <div>
              <Label className="text-sm font-medium text-slate-700 mb-2 block">
                Bundle Name
              </Label>
              <Input
                value={editedBundle.name}
                onChange={(e) => setEditedBundle(prev => ({ ...prev, name: e.target.value }))}
                placeholder="e.g., Social Media"
                className="bg-slate-50 border-slate-300 text-slate-800 placeholder:text-slate-400"
              />
            </div>

            {/* Icon Selection */}
            <div>
              <Label className="text-sm font-medium text-slate-700 mb-2 block">
                Icon
              </Label>
              <div className="grid grid-cols-8 gap-2">
                {bundleIcons.map((icon) => (
                  <button
                    key={icon}
                    onClick={() => setEditedBundle(prev => ({ ...prev, icon }))}
                    className={`w-10 h-10 flex items-center justify-center rounded-lg text-xl transition-all ${
                      editedBundle.icon === icon
                        ? 'bg-blue-100 text-blue-600 ring-2 ring-blue-500'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {icon}
                  </button>
                ))}
              </div>
            </div>

            {/* Color Selection */}
            <div>
              <Label className="text-sm font-medium text-slate-700 mb-2 block">
                Color
              </Label>
              <div className="flex flex-wrap gap-2">
                {bundleColors.map((color) => (
                  <button
                    key={color}
                    onClick={() => setEditedBundle(prev => ({ ...prev, color }))}
                    className={`w-8 h-8 rounded-full transition-all ${
                      editedBundle.color === color
                        ? 'ring-2 ring-slate-400 ring-offset-2'
                        : 'hover:scale-110'
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>

            {/* Link Selection */}
            <div>
              <Label className="text-sm font-medium text-slate-700 mb-2 block">
                Links ({selectedLinks.length} selected)
              </Label>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {links.filter(link => link.active).length === 0 ? (
                  <div className="text-center py-4 text-slate-500">
                    No active links available
                  </div>
                ) : (
                  links
                    .filter(link => link.active)
                    .map((link) => (
                      <div 
                        key={link.id}
                        className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                          selectedLinks.includes(link.id)
                            ? 'border-blue-300 bg-blue-50'
                            : 'border-slate-200 hover:border-slate-300 bg-slate-50'
                        }`}
                        onClick={() => toggleLinkSelection(link.id)}
                      >
                        <div 
                          className="w-3 h-3 rounded-full border border-slate-300 flex items-center justify-center"
                        >
                          {selectedLinks.includes(link.id) && (
                            <div 
                              className="w-2 h-2 rounded-full"
                              style={{ backgroundColor: editedBundle.color }}
                            />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
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
            </div>
          </div>

          <div className="flex gap-3 pt-6">
            <Button
              onClick={handleSave}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
            >
              {bundle.id.startsWith('bundle_') ? 'Create Bundle' : 'Save Changes'}
            </Button>
            <Button
              onClick={onClose}
              variant="outline"
              className="border-slate-300 text-slate-700 hover:bg-slate-100"
            >
              Cancel
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}