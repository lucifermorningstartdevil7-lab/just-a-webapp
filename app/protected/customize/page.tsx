'use client'

import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/app/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/app/components/ui/card'
import { Badge } from '@/app/components/ui/badge'
import { Alert, AlertDescription } from '@/app/components/ui/alert'
import { Loader2, Palette, Type, Layout, Eye, Save, CheckCircle2, Image as ImageIcon } from 'lucide-react'
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
  backgroundColor: '#0a0a0a',
  cardColor: '#171717',
  textColor: '#fafafa',
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

  useEffect(() => {
    loadCustomization()
  }, [])

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
      const { error } = await supabase
        .from('pages')
        .update({ theme })
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

  const updateTheme = (key: keyof ThemeConfig, value: any) => {
    setTheme(prev => ({ ...prev, [key]: value }))
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-neutral-950">
        <Loader2 className="w-8 h-8 text-neutral-400 animate-spin" />
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
    { name: 'Midnight', bg: '#0a0a0a', card: '#171717' },
    { name: 'Dark', bg: '#171717', card: '#262626' },
    { name: 'Slate', bg: '#1e293b', card: '#334155' },
    { name: 'Zinc', bg: '#18181b', card: '#27272a' }
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
    <div className="min-h-screen bg-neutral-950 p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-neutral-900 border border-neutral-800">
              <Palette className="w-5 h-5 text-neutral-200" />
            </div>
            <h1 className="text-3xl font-semibold text-neutral-50">Customize</h1>
          </div>
          <p className="text-neutral-400">Personalize your page appearance</p>
        </div>

        {/* Save Button - Sticky at top */}
        <div className="mb-6 flex items-center gap-3">
          <Button
            onClick={saveCustomization}
            disabled={saving}
            size="lg"
            className="bg-neutral-100 text-neutral-900 hover:bg-neutral-200"
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
            <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
              Changes saved successfully
            </Badge>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Settings Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Color Scheme */}
            <Card className="border-neutral-800 bg-neutral-900">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Palette className="w-5 h-5 text-neutral-400" />
                  <CardTitle className="text-lg">Color Scheme</CardTitle>
                </div>
                <CardDescription>Choose your page colors</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Background Presets */}
                <div>
                  <Label className="text-sm text-neutral-300 mb-3 block">Background Theme</Label>
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
                            ? 'border-neutral-100'
                            : 'border-neutral-800 hover:border-neutral-700'
                        }`}
                        style={{ backgroundColor: preset.bg }}
                      >
                        <div className="text-xs font-medium text-neutral-200">{preset.name}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Accent Color */}
                <div>
                  <Label className="text-sm text-neutral-300 mb-3 block">Accent Color</Label>
                  <div className="grid grid-cols-8 gap-2">
                    {accentColors.map((color) => (
                      <button
                        key={color.value}
                        onClick={() => updateTheme('accentColor', color.value)}
                        className={`w-full aspect-square rounded-lg border-2 transition-all ${
                          theme.accentColor === color.value
                            ? 'border-neutral-100 scale-110'
                            : 'border-neutral-800 hover:border-neutral-700'
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
            <Card className="border-neutral-800 bg-neutral-900">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Layout className="w-5 h-5 text-neutral-400" />
                  <CardTitle className="text-lg">Layout & Style</CardTitle>
                </div>
                <CardDescription>Customize button and avatar styles</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Button Style */}
                <div>
                  <Label className="text-sm text-neutral-300 mb-3 block">Link Button Style</Label>
                  <div className="grid grid-cols-3 gap-3">
                    {buttonStyles.map((style) => (
                      <button
                        key={style.value}
                        onClick={() => updateTheme('buttonStyle', style.value)}
                        className={`p-4 border-2 transition-all ${style.preview} ${
                          theme.buttonStyle === style.value
                            ? 'border-neutral-100 bg-neutral-800'
                            : 'border-neutral-800 hover:border-neutral-700'
                        }`}
                      >
                        <div className="text-sm font-medium text-neutral-200">{style.name}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Avatar Shape */}
                <div>
                  <Label className="text-sm text-neutral-300 mb-3 block">Avatar Shape</Label>
                  <div className="grid grid-cols-3 gap-3">
                    {avatarShapes.map((shape) => (
                      <button
                        key={shape.value}
                        onClick={() => updateTheme('avatarShape', shape.value)}
                        className={`p-4 border-2 transition-all rounded-lg ${
                          theme.avatarShape === shape.value
                            ? 'border-neutral-100 bg-neutral-800'
                            : 'border-neutral-800 hover:border-neutral-700'
                        }`}
                      >
                        <div className={`w-12 h-12 mx-auto mb-2 bg-neutral-700 ${shape.preview}`}></div>
                        <div className="text-sm font-medium text-neutral-200">{shape.name}</div>
                      </button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Display Options */}
            <Card className="border-neutral-800 bg-neutral-900">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Eye className="w-5 h-5 text-neutral-400" />
                  <CardTitle className="text-lg">Display Options</CardTitle>
                </div>
                <CardDescription>Control what appears on your page</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-lg bg-neutral-950 border border-neutral-800">
                  <div>
                    <div className="font-medium text-neutral-200">Show Avatar</div>
                    <p className="text-sm text-neutral-400">Display your profile picture</p>
                  </div>
                  <Switch
                    checked={theme.showAvatar}
                    onCheckedChange={(checked) => updateTheme('showAvatar', checked)}
                  />
                </div>

                <div className="flex items-center justify-between p-4 rounded-lg bg-neutral-950 border border-neutral-800">
                  <div>
                    <div className="font-medium text-neutral-200">Show Bio</div>
                    <p className="text-sm text-neutral-400">Display your bio description</p>
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
            <Card className="border-neutral-800 bg-neutral-900">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Eye className="w-5 h-5 text-neutral-400" />
                  <CardTitle className="text-lg">Live Preview</CardTitle>
                </div>
                <CardDescription>See your changes in real-time</CardDescription>
              </CardHeader>
              <CardContent>
                <div 
                  className="rounded-2xl p-8 min-h-[500px] flex flex-col items-center justify-center space-y-6 border"
                  style={{ 
                    backgroundColor: theme.backgroundColor,
                    borderColor: theme.cardColor
                  }}
                >
                  {/* Avatar */}
                  {theme.showAvatar && (
                    <div 
                      className={`w-24 h-24 bg-neutral-700 ${
                        theme.avatarShape === 'circle' ? 'rounded-full' :
                        theme.avatarShape === 'square' ? 'rounded-none' :
                        'rounded-2xl'
                      }`}
                      style={{ 
                        backgroundImage: previewData.avatar_url ? `url(${previewData.avatar_url})` : undefined,
                        backgroundSize: 'cover'
                      }}
                    />
                  )}

                  {/* Title */}
                  <div className="text-center space-y-2">
                    <h2 className="text-xl font-bold" style={{ color: theme.textColor }}>
                      {previewData.title}
                    </h2>
                    {theme.showBio && (
                      <p className="text-sm opacity-70" style={{ color: theme.textColor }}>
                        {previewData.bio}
                      </p>
                    )}
                  </div>

                  {/* Sample Links */}
                  <div className="w-full max-w-sm space-y-3 mt-4">
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
              </CardContent>
            </Card>

            {/* Info Alert */}
            <Alert className="mt-4 border-neutral-800 bg-neutral-900">
              <AlertDescription className="text-neutral-300 text-sm">
                Changes are saved to your page immediately after clicking Save Changes
              </AlertDescription>
            </Alert>
          </div>
        </div>
      </div>
    </div>
  )
}