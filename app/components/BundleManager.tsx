'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Trash2, Edit3, Folder, Link2, Sparkles, X, Search, Check, Palette } from 'lucide-react'
import { Button } from '@/app/components/ui/button'
import { Input } from '@/app/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card'
import { Label } from '@/app/components/ui/label'
import { Badge } from '@/app/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/app/components/ui/tabs'
import { createClient } from '@/lib/supabase/client'

interface Bundle {
  id: string
  name: string
  icon: string
  color: string
  position: number
  links: any[]
  user_id: string
  is_collapsed?: boolean
  created_at?: string
  updated_at?: string
}

interface Link {
  id: string
  title: string
  url: string
  description?: string
  icon?: string
  pinned: boolean
  position: number
  schedule?: any
  is_active?: boolean
  bundle_id?: string | null
}

interface BundleManagerProps {
  pageId: string
  links: Link[]
}

const ICON_LIBRARY = [
  '📱', '🎮', '💼', '🎵', '🎨', '📷', '🎥', '📚', '🏀', '✈️',
  '💻', '🎤', '📊', '🛍️', '🍕', '☕', '🚀', '🌟', '💎', '🎯'
]

const COLOR_PRESETS = [
  '#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6',
  '#06b6d4', '#84cc16', '#f97316', '#ec4899', '#6366f1'
]

export function BundleManager({ pageId, links }: BundleManagerProps) {
  const [bundles, setBundles] = useState<Bundle[]>([])
  const [loading, setLoading] = useState(true)
  const [editingBundle, setEditingBundle] = useState<Bundle | null>(null)
  const [isEditorOpen, setIsEditorOpen] = useState(false)
  const [ungroupedLinks, setUngroupedLinks] = useState<Link[]>([])
  const [userId, setUserId] = useState<string>('')
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    if (pageId) {
      loadBundlesAndSetUserId()
    }
  }, [pageId])

  useEffect(() => {
    const groupedLinkIds = bundles.flatMap(bundle => bundle.links || [])
    const ungrouped = links.filter(link => {
      const isActive = link.is_active !== false
      const isNotInBundle = !groupedLinkIds.includes(link.id)
      return isActive && isNotInBundle
    })
    setUngroupedLinks(ungrouped)
  }, [bundles, links])

  async function syncAuthUserToPublic() {
    try {
      const supabase = createClient()
      
      // Get the current auth user
      const { data: { user }, error: authError } = await supabase.auth.getUser()
      
      if (authError || !user) {
        console.error('No authenticated user found')
        return null
      }

      // Check if user exists in public.users
      const { data: existingUser, error: checkError } = await supabase
        .from('users')
        .select('id')
        .eq('id', user.id)
        .single()

      // Handle case where the table doesn't exist
      if (checkError && (checkError.code === '42P01' || checkError.message.includes('does not exist'))) {
        console.warn('Users table does not exist in public schema. Using auth user ID directly.')
        return user.id
      } 
      else if (checkError && checkError.code === 'PGRST116') {
        // User doesn't exist in public table - create it
        console.log('Creating user in public.users table...')
        const { data: newUser, error: createError } = await supabase
          .from('users')
          .insert({
            id: user.id,
            email: user.email,
            subscription_tier: 'free',
            creator_type: 'creator',
            follower_tier: 'micro'
          })
          .select()
          .single()

        if (createError) {
          console.error('Error creating user in public table:', createError)
          // If creation fails, return the auth user ID as fallback
          return user.id
        }

        console.log('User created in public table:', newUser)
        return newUser.id
      } else if (existingUser) {
        console.log('User already exists in public table')
        return existingUser.id
      }

      // If no error but no existing user, return auth user ID as fallback
      return user.id
    } catch (error: any) {
      console.error('Error syncing auth user:', error)
      // In case of any error, return the auth user ID as fallback
      return user.id
    }
  }

  async function loadBundlesAndSetUserId() {
    try {
      setLoading(true)
      const supabase = createClient()
      
      // First sync the auth user
      const authUserId = await syncAuthUserToPublic()
      if (!authUserId) {
        console.error('Failed to sync auth user to public table')
        return
      }

      // Then get the page's user_id
      const { data: pageData, error } = await supabase
        .from('pages')
        .select('user_id')
        .eq('id', pageId)
        .single()

      if (error) {
        console.error('Error fetching page:', error)
        // Use the auth user ID directly as fallback
        setUserId(authUserId)
        return
      }

      // Set the user ID
      const userIdToUse = pageData.user_id || authUserId;
      setUserId(userIdToUse)
      
      // Now fetch bundles for this user
      const { data: bundleData, error: bundleError } = await supabase
        .from('bundles')
        .select('*')
        .eq('user_id', userIdToUse)
        .order('position', { ascending: true })

      if (bundleError) {
        console.error('Error loading bundles:', bundleError)
        setBundles([])
      } else {
        const processedBundles = (bundleData || []).map(bundle => ({
          ...bundle,
          links: Array.isArray(bundle.links) ? bundle.links : []
        }))
        setBundles(processedBundles)
      }
    } catch (error) {
      console.error('Unexpected error loading bundles and user:', error)
      setBundles([])
    } finally {
      setLoading(false)
    }
  }

  async function createBundle() {
    if (!userId) {
      alert('User not found. Please try again.')
      return
    }

    const newBundle: Bundle = {
      id: `bundle_${Date.now()}`,
      name: 'New Bundle',
      icon: '📁',
      color: '#3b82f6',
      position: bundles.length,
      links: [],
      user_id: userId
    }
    
    setEditingBundle(newBundle)
    setIsEditorOpen(true)
  }

  async function saveBundle(bundle: Bundle) {
    try {
      if (!userId) {
        alert('User not found. Please try again.')
        return
      }

      const supabase = createClient()
      
      console.log('Saving bundle:', { bundle, userId })

      if (bundle.id.startsWith('bundle_')) {
        const tempBundle = { ...bundle }
        setBundles(prev => [...prev, tempBundle])
        
        const { data, error } = await supabase
          .from('bundles')
          .insert({
            user_id: userId,
            name: bundle.name,
            icon: bundle.icon,
            color: bundle.color,
            position: bundle.position,
            links: bundle.links || [],
            is_collapsed: false
          })
          .select()
          .single()

        if (error) {
          console.error('Supabase insert error:', error)
          setBundles(prev => prev.filter(b => b.id !== tempBundle.id))
          throw new Error(`Failed to create bundle: ${error.message}`)
        }
        
        setBundles(prev => prev.map(b => b.id === tempBundle.id ? data : b))
      } else {
        const { error } = await supabase
          .from('bundles')
          .update({
            name: bundle.name,
            icon: bundle.icon,
            color: bundle.color,
            position: bundle.position,
            links: bundle.links || [],
            is_collapsed: bundle.is_collapsed || false
          })
          .eq('id', bundle.id)

        if (error) {
          console.error('Supabase update error:', error)
          throw new Error(`Failed to update bundle: ${error.message}`)
        }
        
        setBundles(prev => prev.map(b => b.id === bundle.id ? bundle : b))
      }
      
      setIsEditorOpen(false)
      setEditingBundle(null)
    } catch (error) {
      console.error('Error saving bundle:', error)
      alert(`Failed to save bundle: ${error.message}`)
    }
  }

  async function deleteBundle(bundleId: string) {
    if (!confirm('Are you sure you want to delete this bundle? Links will not be deleted.')) {
      return
    }

    try {
      const supabase = createClient()
      const { error } = await supabase
        .from('bundles')
        .delete()
        .eq('id', bundleId)

      if (error) throw error
      
      setBundles(prev => prev.filter(b => b.id !== bundleId))
    } catch (error) {
      console.error('Error deleting bundle:', error)
      alert('Failed to delete bundle. Please try again.')
    }
  }

  const filteredLinks = ungroupedLinks.filter(link =>
    link.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    link.url.toLowerCase().includes(searchQuery.toLowerCase())
  )

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center py-12 space-y-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        <p className="text-muted-foreground text-sm">Loading bundles...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header Card */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <Card className="border-border bg-card shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600">
                  <Folder className="w-5 h-5 text-white" />
                </div>
                <div>
                  <CardTitle className="text-lg text-foreground">Link Bundles</CardTitle>
                  <CardDescription className="text-muted-foreground">
                    Organize your links into beautiful collections
                  </CardDescription>
                </div>
              </div>
              <Button 
                onClick={createBundle}
                className="bg-gradient-to-br from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white transition-all"
                disabled={!userId}
              >
                <Plus className="w-4 h-4 mr-2" />
                New Bundle
              </Button>
            </div>
          </CardHeader>
        </Card>
      </motion.div>

      {/* Bundles Grid */}
      {bundles.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {bundles.map((bundle) => (
            <motion.div
              key={bundle.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ y: -3 }}
              className="group"
            >
              <Card className="border-border bg-card hover:shadow-md transition-all duration-200 h-full flex flex-col">
                <CardContent className="p-5 flex-grow">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-10 h-10 rounded-xl flex items-center justify-center text-white"
                        style={{ backgroundColor: bundle.color }}
                      >
                        <span className="text-sm">{bundle.icon}</span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground text-sm">
                          {bundle.name}
                        </h3>
                        <Badge variant="secondary" className="mt-1 text-xs">
                          {bundle.links?.length || 0} links
                        </Badge>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setEditingBundle(bundle)}
                        className="h-8 w-8 p-0 hover:bg-accent"
                      >
                        <Edit3 className="w-3 h-3 text-muted-foreground" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteBundle(bundle.id)}
                        className="h-8 w-8 p-0 hover:bg-red-50 hover:text-red-600"
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>

                  {bundle.links && bundle.links.length > 0 ? (
                    <div className="space-y-2 flex-grow">
                      {bundle.links.slice(0, 3).map((linkId: string) => {
                        const link = links.find(l => l.id === linkId)
                        return link ? (
                          <div key={linkId} className="flex items-center gap-2 text-xs text-muted-foreground p-2 bg-muted/30 rounded-lg">
                            <Link2 className="w-3 h-3 text-muted-foreground/70" />
                            <span className="truncate">{link.title}</span>
                          </div>
                        ) : null
                      })}
                      {bundle.links.length > 3 && (
                        <div className="text-xs text-muted-foreground/70 text-center">
                          +{bundle.links.length - 3} more links
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-4 text-muted-foreground/60 flex-grow flex flex-col items-center justify-center">
                      <div className="w-8 h-8 mx-auto mb-2 bg-muted rounded-lg flex items-center justify-center">
                        <Link2 className="w-4 h-4" />
                      </div>
                      <p className="text-xs">No links added yet</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {bundles.length === 0 && !loading && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Card className="border-2 border-dashed border-border bg-muted/20">
            <CardContent className="text-center py-12">
              <div className="w-16 h-16 mx-auto mb-4 bg-muted rounded-2xl flex items-center justify-center">
                <Folder className="w-6 h-6 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">No bundles yet</h3>
              <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
                Create bundles to organize your links into beautiful collections that visitors will love.
              </p>
              <Button 
                onClick={createBundle}
                className="bg-gradient-to-br from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white transition-all"
                disabled={!userId}
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Your First Bundle
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Ungrouped Links Alert */}
      {ungroupedLinks.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <Card className="border-blue-200 bg-blue-50/20 dark:bg-blue-950/20 border-blue-500/30">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/50">
                  <Sparkles className="w-4 h-4 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-semibold text-blue-700 dark:text-blue-300 mb-1">
                    Organize your links
                  </h4>
                  <p className="text-sm text-blue-600 dark:text-blue-400">
                    You have {ungroupedLinks.length} ungrouped {ungroupedLinks.length === 1 ? 'link' : 'links'}. 
                    Create bundles to make your page more organized and engaging.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Professional Bundle Editor Modal */}
      <AnimatePresence>
        {isEditorOpen && editingBundle && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-background rounded-xl shadow-lg w-full max-w-4xl max-h-[90vh] flex flex-col border-border"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-border">
                <div className="flex items-center gap-3">
                  <div 
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-white"
                    style={{ backgroundColor: editingBundle.color }}
                  >
                    <span className="text-lg">{editingBundle.icon}</span>
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-foreground">
                      {editingBundle.id.startsWith('bundle_') ? 'Create Bundle' : 'Edit Bundle'}
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      Organize your links into a beautiful collection
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setIsEditorOpen(false)
                    setEditingBundle(null)
                  }}
                  className="h-8 w-8 p-0 hover:bg-accent"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-hidden">
                <Tabs defaultValue="setup" className="h-full">
                  <div className="border-b border-border">
                    <TabsList className="h-12 px-6 bg-transparent">
                      <TabsTrigger value="setup" className="text-sm font-medium data-[state=active]:bg-primary/10 data-[state=active]:text-primary data-[state=inactive]:text-muted-foreground">
                        Bundle Setup
                      </TabsTrigger>
                      <TabsTrigger value="links" className="text-sm font-medium data-[state=active]:bg-primary/10 data-[state=active]:text-primary data-[state=inactive]:text-muted-foreground">
                        Add Links
                        {editingBundle.links.length > 0 && (
                          <Badge variant="secondary" className="ml-2">
                            {editingBundle.links.length}
                          </Badge>
                        )}
                      </TabsTrigger>
                    </TabsList>
                  </div>

                  <div className="p-6 overflow-y-auto max-h-[60vh]">
                    {/* Setup Tab */}
                    <TabsContent value="setup" className="space-y-6 m-0">
                      <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <div>
                            <Label htmlFor="bundle-name" className="text-sm font-medium text-foreground mb-2 block">
                              Bundle Name *
                            </Label>
                            <Input
                              id="bundle-name"
                              value={editingBundle.name}
                              onChange={(e) => setEditingBundle({...editingBundle, name: e.target.value})}
                              placeholder="e.g., Social Media, Projects"
                              className="h-11 border-border focus:border-primary focus:ring-1 focus:ring-primary"
                            />
                          </div>

                          <div>
                            <Label className="text-sm font-medium text-foreground mb-3 block">
                              Choose Icon
                            </Label>
                            <div className="grid grid-cols-6 gap-2">
                              {ICON_LIBRARY.map((icon) => (
                                <button
                                  key={icon}
                                  type="button"
                                  onClick={() => setEditingBundle({...editingBundle, icon})}
                                  className={`h-10 rounded-lg border border-border flex items-center justify-center text-lg transition-all ${
                                    editingBundle.icon === icon 
                                      ? 'border-primary bg-primary/10 scale-110' 
                                      : 'hover:border-accent hover:bg-accent'
                                  }`}
                                >
                                  {icon}
                                </button>
                              ))}
                            </div>
                            <div className="mt-3">
                              <Label htmlFor="custom-icon" className="text-sm font-medium text-foreground mb-2 block">
                                Custom Icon
                              </Label>
                              <Input
                                id="custom-icon"
                                value={editingBundle.icon}
                                onChange={(e) => setEditingBundle({...editingBundle, icon: e.target.value})}
                                placeholder="Enter any emoji"
                                className="h-11 border-border focus:border-primary focus:ring-1 focus:ring-primary"
                              />
                            </div>
                          </div>
                        </div>

                        <div className="space-y-4">
                          <div>
                            <Label className="text-sm font-medium text-foreground mb-3 block">
                              Bundle Color
                            </Label>
                            <div className="grid grid-cols-5 gap-2 mb-3">
                              {COLOR_PRESETS.map((color) => (
                                <button
                                  key={color}
                                  type="button"
                                  onClick={() => setEditingBundle({...editingBundle, color})}
                                  className={`h-8 rounded-lg border transition-all ${
                                    editingBundle.color === color 
                                      ? 'border-foreground scale-110 ring-2 ring-ring ring-offset-1' 
                                      : 'border-border hover:border-accent'
                                  }`}
                                  style={{ backgroundColor: color }}
                                />
                              ))}
                            </div>
                            <Label htmlFor="custom-color" className="text-sm font-medium text-foreground mb-2 block">
                              Custom Color
                            </Label>
                            <div className="flex gap-2">
                              <Input
                                id="custom-color"
                                type="color"
                                value={editingBundle.color}
                                onChange={(e) => setEditingBundle({...editingBundle, color: e.target.value})}
                                className="w-full h-11 border-border focus:border-primary focus:ring-1 focus:ring-primary"
                              />
                              <Input
                                value={editingBundle.color}
                                onChange={(e) => setEditingBundle({...editingBundle, color: e.target.value})}
                                placeholder="#3b82f6"
                                className="h-11 border-border focus:border-primary focus:ring-1 focus:ring-primary font-mono"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </TabsContent>

                    {/* Links Tab */}
                    <TabsContent value="links" className="space-y-4 m-0">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h3 className="text-lg font-semibold text-foreground">Add Links to Bundle</h3>
                          <p className="text-sm text-muted-foreground">
                            Select links to include in this bundle
                          </p>
                        </div>
                        <div className="relative">
                          <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                          <Input
                            placeholder="Search links..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-9 h-9 w-64 border-border focus:border-primary focus:ring-1 focus:ring-primary"
                          />
                        </div>
                      </div>

                      <div className="grid gap-3">
                        {filteredLinks.map((link) => (
                          <Card key={link.id} className="border-border hover:border-primary/50 transition-colors">
                            <CardContent className="p-3">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                  <div className="w-8 h-8 bg-muted rounded-lg flex items-center justify-center">
                                    <Link2 className="w-4 h-4 text-muted-foreground" />
                                  </div>
                                  <div>
                                    <div className="font-medium text-foreground text-sm">
                                      {link.title}
                                    </div>
                                    <div className="text-xs text-muted-foreground truncate max-w-xs">
                                      {link.url}
                                    </div>
                                  </div>
                                </div>
                                <Button
                                  size="sm"
                                  variant={editingBundle.links.includes(link.id) ? "default" : "outline"}
                                  onClick={() => {
                                    const newLinks = editingBundle.links.includes(link.id)
                                      ? editingBundle.links.filter(id => id !== link.id)
                                      : [...editingBundle.links, link.id]
                                    setEditingBundle({...editingBundle, links: newLinks})
                                  }}
                                  className={editingBundle.links.includes(link.id) 
                                    ? "bg-primary hover:bg-primary/90 text-primary-foreground" 
                                    : "border-border text-foreground hover:bg-accent"
                                  }
                                >
                                  {editingBundle.links.includes(link.id) ? (
                                    <Check className="w-4 h-4 mr-1" />
                                  ) : (
                                    <Plus className="w-4 h-4 mr-1" />
                                  )}
                                  {editingBundle.links.includes(link.id) ? 'Added' : 'Add'}
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>

                      {filteredLinks.length === 0 && (
                        <div className="text-center py-8 text-muted-foreground">
                          <Link2 className="w-12 h-12 mx-auto mb-3 text-muted-foreground/50" />
                          <p>No available links to add</p>
                          <p className="text-sm">All your links are already in bundles</p>
                        </div>
                      )}
                    </TabsContent>


                  </div>
                </Tabs>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between p-6 border-t border-border bg-muted/10">
                <div className="text-sm text-muted-foreground">
                  {editingBundle.links.length} links selected
                </div>
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsEditorOpen(false)
                      setEditingBundle(null)
                    }}
                    className="border-border text-foreground hover:bg-accent"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={() => saveBundle(editingBundle)}
                    disabled={!editingBundle.name.trim()}
                    className="bg-gradient-to-br from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white transition-all px-6"
                  >
                    {editingBundle.id.startsWith('bundle_') ? 'Create Bundle' : 'Save Changes'}
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}