'use client'

import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/app/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/app/components/ui/card'
import { Badge } from '@/app/components/ui/badge'
import { Alert, AlertDescription } from '@/app/components/ui/alert'
import { Loader2, Palette, Type, Layout, Eye, Save, CheckCircle2, Image } from 'lucide-react'
import { Label } from '@/app/components/ui/label'
import { Switch } from '@radix-ui/react-switch'


interface ThemeConfig {
  backgroundColor: string
  cardColor: string
  textColor: string
  accentColor: string
  buttonStyle: 'rounded' | 'square' | 'pill'
  font: string
  showAvatar: boolean
  showBio: boolean
  avatarShape: 'circle' | 'square' | 'rounded'
}

const defaultTheme: ThemeConfig = {
  backgroundColor: '#ffffff',
  cardColor: '#f8fafc',
  textColor: '#1e293b',
  accentColor: '#3b82f6',
  buttonStyle: 'rounded',
  font: 'inter',
  showAvatar: true,
  showBio: true,
  avatarShape: 'circle'
}

export default function CustomizePage() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [pageId, setPageId] = useState<string | null>(null)
  const [theme, setTheme] = useState<ThemeConfig>(defaultTheme)
  const [previewData, setPreviewData] = useState({
    title: 'Your Name',
    bio: 'Your bio description',
    avatar_url: null
  })
  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)

  useEffect(() => {
    loadCustomization()
  }, [])

  // Clean up the object URL when component unmounts or when avatarPreview changes
  useEffect(() => {
    return () => {
      if (avatarPreview && !avatarPreview.startsWith('http')) {
        URL.revokeObjectURL(avatarPreview)
      }
    }
  }, [avatarPreview])

  async function loadCustomization() {
    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) return

      const { data: pageData } = await supabase
        .from('pages')
        .select('id, theme, title, bio, avatar_url')
        .eq('user_id', user.id)
        .single()

      if (pageData) {
        setPageId(pageData.id)
        setPreviewData({
          title: pageData.title || 'Your Name',
          bio: pageData.bio || 'Your bio description',
          avatar_url: pageData.avatar_url
        })
        
        if (pageData.avatar_url) {
          setAvatarPreview(pageData.avatar_url)
        }
        
        if (pageData.theme) {
          setTheme({ ...defaultTheme, ...pageData.theme })
        }
      }
    } catch (error) {
      console.error('Error loading customization:', error)
    } finally {
      setLoading(false)
    }
  }

  async function saveCustomization() {
    if (!pageId) return
    
    setSaving(true)
    setSaved(false)

    try {
      const supabase = createClient()
      const updates: any = { theme }
      
      // If there's an avatar file, upload it first
      if (avatarFile) {
        const fileName = `avatar_${pageId}_${Date.now()}`
        const { data, error: uploadError } = await supabase
          .storage
          .from('avatars')
          .upload(fileName, avatarFile, { 
            cacheControl: '3600',
            upsert: true 
          })
          
        if (uploadError) {
          console.error('Error uploading avatar:', uploadError)
          throw uploadError
        }
        
        // Get the public URL of the uploaded image
        const { data: urlData } = supabase
          .storage
          .from('avatars')
          .getPublicUrl(fileName)
          
        updates.avatar_url = urlData.publicUrl
      }
      
      const { error } = await supabase
        .from('pages')
        .update(updates)
        .eq('id', pageId)

      if (error) throw error

      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch (error) {
      console.error('Error saving customization:', error)
      alert('Failed to save changes')
    } finally {
      setSaving(false)
    }
  }

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setAvatarFile(file)
      
      // Clean up the previous object URL if it exists
      if (avatarPreview && !avatarPreview.startsWith('http')) {
        URL.revokeObjectURL(avatarPreview)
      }
      
      // Create a preview URL for the selected image
      const previewUrl = URL.createObjectURL(file)
      setAvatarPreview(previewUrl)
    }
  }

  const updateTheme = (key: keyof ThemeConfig, value: any) => {
    setTheme(prev => ({ ...prev, [key]: value }))
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-slate-50">
        <Loader2 className="w-8 h-8 text-slate-400 animate-spin" />
      </div>
    )
  }

  const accentColors = [
    { name: 'Blue', value: '#3b82f6' },
    { name: 'Purple', value: '#8b5cf6' },
    { name: 'Pink', value: '#ec4899' },
    { name: 'Green', value: '#10b981' },
    { name: 'Orange', value: '#f59e0b' },
    { name: 'Red', value: '#ef4444' },
    { name: 'Cyan', value: '#06b6d4' },
    { name: 'Indigo', value: '#6366f1' }
  ]

  const backgroundPresets = [
    { name: 'Light', bg: '#ffffff', card: '#f8fafc' },
    { name: 'Slate', bg: '#f1f5f9', card: '#e2e8f0' },
    { name: 'Warm', bg: '#fffbeb', card: '#fef3c7' },
    { name: 'Cool', bg: '#ecfeff', card: '#cffafe' }
  ]

  const buttonStyles = [
    { name: 'Rounded', value: 'rounded' as const, preview: 'rounded-xl' },
    { name: 'Square', value: 'square' as const, preview: 'rounded-none' },
    { name: 'Pill', value: 'pill' as const, preview: 'rounded-full' }
  ]

  const avatarShapes = [
    { name: 'Circle', value: 'circle' as const, preview: 'rounded-full' },
    { name: 'Square', value: 'square' as const, preview: 'rounded-none' },
    { name: 'Rounded', value: 'rounded' as const, preview: 'rounded-2xl' }
  ]

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-white border border-slate-200 shadow-sm">
              <Palette className="w-5 h-5 text-slate-700" />
            </div>
            <h1 className="text-3xl font-semibold text-slate-800">Customize</h1>
          </div>
          <p className="text-slate-600">Personalize your page appearance</p>
        </div>

        {/* Save Button - Sticky at top */}
        <div className="mb-6 flex items-center gap-3">
          <Button
            onClick={saveCustomization}
            disabled={saving}
            size="lg"
            className="bg-purple-600 hover:bg-purple-700 text-white shadow-sm transition-all hover:shadow-md"
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : saved ? (
              <>
                <CheckCircle2 className="w-4 h-4 mr-2" />
                Saved!
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </>
            )}
          </Button>
          
          {saved && (
            <Badge className="bg-green-100 text-green-800 border-green-200">
              Changes saved successfully
            </Badge>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Settings Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Color Scheme */}
            <Card className="border-slate-200 bg-white shadow-sm hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Palette className="w-5 h-5 text-slate-600" />
                  <CardTitle className="text-lg text-slate-800">Color Scheme</CardTitle>
                </div>
                <CardDescription className="text-slate-600">Choose your page colors</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Background Presets */}
                <div>
                  <Label className="text-sm text-slate-700 mb-3 block">Background Theme</Label>
                  <div className="grid grid-cols-4 gap-3">
                    {backgroundPresets.map((preset) => (
                      <button
                        key={preset.name}
                        onClick={() => {
                          updateTheme('backgroundColor', preset.bg)
                          updateTheme('cardColor', preset.card)
                        }}
                        className={`p-4 rounded-xl border-2 transition-all ${
                          theme.backgroundColor === preset.bg
                            ? 'border-purple-500 ring-2 ring-purple-200'
                            : 'border-slate-200 hover:border-slate-300'
                        }`}
                        style={{ backgroundColor: preset.bg }}
                      >
                        <div className="text-xs font-medium text-slate-700">{preset.name}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Accent Color */}
                <div>
                  <Label className="text-sm text-slate-700 mb-3 block">Accent Color</Label>
                  <div className="grid grid-cols-8 gap-2">
                    {accentColors.map((color) => (
                      <button
                        key={color.value}
                        onClick={() => updateTheme('accentColor', color.value)}
                        className={`w-full aspect-square rounded-lg border-2 transition-all ${
                          theme.accentColor === color.value
                            ? 'border-slate-400 scale-110 ring-2 ring-offset-2 ring-purple-300'
                            : 'border-slate-300 hover:border-slate-400'
                        }`}
                        style={{ backgroundColor: color.value }}
                        title={color.name}
                      />
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Layout & Style */}
            <Card className="border-slate-200 bg-white shadow-sm hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Layout className="w-5 h-5 text-slate-600" />
                  <CardTitle className="text-lg text-slate-800">Layout & Style</CardTitle>
                </div>
                <CardDescription className="text-slate-600">Customize button and avatar styles</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Button Style */}
                <div>
                  <Label className="text-sm text-slate-700 mb-3 block">Link Button Style</Label>
                  <div className="grid grid-cols-3 gap-3">
                    {buttonStyles.map((style) => (
                      <button
                        key={style.value}
                        onClick={() => updateTheme('buttonStyle', style.value)}
                        className={`p-4 border-2 transition-all ${style.preview} ${
                          theme.buttonStyle === style.value
                            ? 'border-purple-500 bg-purple-50 ring-2 ring-purple-200'
                            : 'border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <div className="text-sm font-medium text-slate-700">{style.name}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Avatar Shape */}
                <div>
                  <Label className="text-sm text-slate-700 mb-3 block">Avatar Shape</Label>
                  <div className="grid grid-cols-3 gap-3">
                    {avatarShapes.map((shape) => (
                      <button
                        key={shape.value}
                        onClick={() => updateTheme('avatarShape', shape.value)}
                        className={`p-4 border-2 transition-all rounded-lg ${
                          theme.avatarShape === shape.value
                            ? 'border-purple-500 bg-purple-50 ring-2 ring-purple-200'
                            : 'border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <div className={`w-12 h-12 mx-auto mb-2 bg-slate-200 ${shape.preview}`}></div>
                        <div className="text-sm font-medium text-slate-700">{shape.name}</div>
                      </button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Display Options */}
            <Card className="border-slate-200 bg-white shadow-sm hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Eye className="w-5 h-5 text-slate-600" />
                  <CardTitle className="text-lg text-slate-800">Display Options</CardTitle>
                </div>
                <CardDescription className="text-slate-600">Control what appears on your page</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Avatar Upload */}
                <div className="p-4 rounded-lg bg-slate-50 border border-slate-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-slate-800">Profile Picture</div>
                      <p className="text-sm text-slate-500">Upload your profile picture</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <label className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-300 rounded-lg cursor-pointer hover:bg-slate-50 transition-colors">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleAvatarChange}
                          className="hidden"
                        />
                        <span className="text-sm font-medium text-slate-700">Choose File</span>
                      </label>
                    </div>
                  </div>
                  {avatarPreview && (
                    <div className="mt-3 flex justify-center">
                      <div className="relative w-24 h-24 rounded-full overflow-hidden border-2 border-slate-300">
                        <img
                          src={avatarPreview}
                          alt="Preview"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between p-4 rounded-lg bg-slate-50 border border-slate-200 hover:bg-slate-100 transition-colors">
                  <div>
                    <div className="font-medium text-slate-800">Show Avatar</div>
                    <p className="text-sm text-slate-500">Display your profile picture</p>
                  </div>
                  <Switch
                    checked={theme.showAvatar}
                    onCheckedChange={(checked) => updateTheme('showAvatar', checked)}
                  />
                </div>

                <div className="flex items-center justify-between p-4 rounded-lg bg-slate-50 border border-slate-200 hover:bg-slate-100 transition-colors">
                  <div>
                    <div className="font-medium text-slate-800">Show Bio</div>
                    <p className="text-sm text-slate-500">Display your bio description</p>
                  </div>
                  <Switch
                    checked={theme.showBio}
                    onCheckedChange={(checked) => updateTheme('showBio', checked)}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Preview Column - Sticky */}
          <div className="lg:sticky lg:top-6 h-fit">
            <Card className="border-slate-200 bg-white shadow-sm hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Eye className="w-5 h-5 text-slate-600" />
                  <CardTitle className="text-lg text-slate-800">Live Preview</CardTitle>
                </div>
                <CardDescription className="text-slate-600">See your changes in real-time</CardDescription>
              </CardHeader>
              <CardContent>
                <div 
                  className="rounded-2xl p-6 min-h-[500px] border flex flex-col"
                  style={{ 
                    backgroundColor: theme.backgroundColor,
                    borderColor: theme.cardColor
                  }}
                >
                  {/* Profile Header */}
                  <div className="flex flex-col items-center py-4">
                    {/* Avatar */}
                    {theme.showAvatar && (
                      <div 
                        className={`w-24 h-24 mb-4 ${
                          theme.avatarShape === 'circle' ? 'rounded-full' :
                          theme.avatarShape === 'square' ? 'rounded-none' :
                          'rounded-2xl'
                        }`}
                        style={{ 
                          backgroundImage: avatarPreview ? `url(${avatarPreview})` : 'none',
                          backgroundColor: avatarPreview ? 'transparent' : '#e2e8f0',
                          backgroundSize: avatarPreview ? 'cover' : 'auto',
                          border: avatarPreview ? 'none' : '2px dashed #cbd5e1'
                        }}
                      >
                        {!avatarPreview && (
                          <div className="w-full h-full flex items-center justify-center text-slate-400">
                            <Image size={32} />
                          </div>
                        )}
                      </div>
                    )}

                    {/* Title */}
                    <h2 
                      className="text-xl font-bold mb-1 text-center"
                      style={{ color: theme.textColor }}
                    >
                      {previewData.title}
                    </h2>
                    {theme.showBio && (
                      <p 
                        className="text-sm text-center opacity-70"
                        style={{ color: theme.textColor }}
                      >
                        {previewData.bio}
                      </p>
                    )}
                  </div>

                  {/* Sample Links */}
                  <div className="flex-1 flex flex-col justify-center mt-4">
                    <div className="w-full max-w-sm space-y-3">
                      {[1, 2, 3].map((i) => (
                        <div
                          key={i}
                          className={`w-full p-4 text-center font-medium transition-all ${
                            theme.buttonStyle === 'rounded' ? 'rounded-xl' :
                            theme.buttonStyle === 'pill' ? 'rounded-full' :
                            'rounded-none'
                          }`}
                          style={{
                            backgroundColor: theme.cardColor,
                            color: theme.textColor,
                            border: `2px solid ${theme.accentColor}`
                          }}
                        >
                          Sample Link {i}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Info Alert */}
            <Alert className="mt-4 border-slate-200 bg-slate-50">
              <AlertDescription className="text-slate-600 text-sm">
                Changes are saved to your page immediately after clicking Save Changes
              </AlertDescription>
            </Alert>
          </div>
        </div>
      </div>
    </div>
  )
}