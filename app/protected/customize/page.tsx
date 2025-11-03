'use client'

import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/app/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/app/components/ui/card'
import { Alert, AlertDescription } from '@/app/components/ui/alert'
import { Loader2, Palette, Layout, Eye, Save, CheckCircle2, ImageIcon, Sparkles, Info } from 'lucide-react'
import { Label } from '@/app/components/ui/label'
import { Switch } from '@radix-ui/react-switch'
import { BundleManager } from '@/app/components/BundleManager'
import { useRouter } from 'next/navigation'

// Define template types
type BundleTemplate = 
  | 'default'
  | 'vibrant'
  | 'elegant'
  | 'minimal'
  | 'bold'
  | 'soft'
  | 'dark';

// Define animation types
type AnimationType = 
  | 'none'
  | 'blur'
  | 'split'
  | 'type'
  | 'shuffle'
  | 'gradient'
  | 'countup';

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
  presetTheme?: string // Added for predefined themes
  // Bundle-specific settings
  bundleCardColor?: string
  bundleTextColor?: string
  bundleAccentColor?: string
  bundleButtonStyle?: 'rounded' | 'square' | 'pill'
  bundleHoverEffect?: 'lift' | 'shadow' | 'none'
  bundleTransitionSpeed?: 'fast' | 'medium' | 'slow'
  // Template settings
  bundleTemplate?: BundleTemplate;
  // Animation settings
  bundleTitleAnimation?: AnimationType;
  bundleLinkAnimation?: AnimationType;
}

// Updated theme presets with your provided colors
const themePresets = {
  red: {
    name: 'Red Passion',
    bg: '#FED7D7', // Light red
    card: '#FEB2B2', // Medium red
    text: '#742A2A', // Dark red
    accent: '#E53E3E' // Vibrant red
  },
  orange: {
    name: 'Warm Orange',
    bg: '#FEEBC8', // Light orange
    card: '#FBD38D', // Medium orange
    text: '#7B341E', // Dark orange
    accent: '#DD6B20' // Vibrant orange
  },
  yellow: {
    name: 'Sunny Yellow',
    bg: '#FEF3C7', // Light yellow
    card: '#FDE68A', // Medium yellow
    text: '#744210', // Dark yellow
    accent: '#D69E2E' // Vibrant yellow
  },
  green: {
    name: 'Emerald Green',
    bg: '#C6F6D5', // Light green
    card: '#9AE6B4', // Medium green
    text: '#1A5717', // Dark green
    accent: '#38A169' // Vibrant green
  },
  mint: {
    name: 'Mint Breeze',
    bg: '#C6F6E9', // Light mint
    card: '#81E6D9', // Medium mint
    text: '#0A5748', // Dark mint
    accent: '#2C7A7B' // Vibrant mint
  },
  teal: {
    name: 'Teal Ocean',
    bg: '#B6E0FF', // Light teal
    card: '#7EDCE2', // Medium teal
    text: '#084B55', // Dark teal
    accent: '#2F855A' // Vibrant teal
  },
  cyan: {
    name: 'Cyan Sky',
    bg: '#A5D8FF', // Light cyan
    card: '#76E4F7', // Medium cyan
    text: '#074C68', // Dark cyan
    accent: '#06B6D4' // Vibrant cyan
  },
  blue: {
    name: 'Ocean Blue',
    bg: '#BFDBFE', // Light blue
    card: '#93C5FD', // Medium blue
    text: '#1E3A8A', // Dark blue
    accent: '#2563EB' // Vibrant blue
  },
  indigo: {
    name: 'Royal Indigo',
    bg: '#C7D2FE', // Light indigo
    card: '#A5B4FC', // Medium indigo
    text: '#312E81', // Dark indigo
    accent: '#4F46E5' // Vibrant indigo
  },
  purple: {
    name: 'Royal Purple',
    bg: '#DDD6FE', // Light purple
    card: '#C4B5FD', // Medium purple
    text: '#5B21B6', // Dark purple
    accent: '#7C3AED' // Vibrant purple
  },
  pink: {
    name: 'Blush Pink',
    bg: '#FED7E2', // Light pink
    card: '#FBB6CE', // Medium pink
    text: '#702459', // Dark pink
    accent: '#E936A7' // Vibrant pink
  },
  brown: {
    name: 'Rustic Brown',
    bg: '#EDE9FE', // Light brown/amber
    card: '#DDD6FE', // Medium brown/amber
    text: '#713F12', // Dark brown
    accent: '#B45309' // Vibrant brown
  }
};

// Bundle template definitions
const bundleTemplates: Record<BundleTemplate, {
  name: string;
  description: string;
  cardColor: string;
  textColor: string;
  accentColor: string;
  buttonStyle: 'rounded' | 'square' | 'pill';
  hoverEffect: 'lift' | 'shadow' | 'none';
}> = {
  default: {
    name: 'Default',
    description: 'Classic look with subtle styling',
    cardColor: '#f8fafc',
    textColor: '#1e293b',
    accentColor: '#3b82f6',
    buttonStyle: 'rounded',
    hoverEffect: 'lift'
  },
  vibrant: {
    name: 'Vibrant',
    description: 'Bright and energetic colors',
    cardColor: '#fef7ee',
    textColor: '#7c2d12',
    accentColor: '#ea580c',
    buttonStyle: 'rounded',
    hoverEffect: 'shadow'
  },
  elegant: {
    name: 'Elegant',
    description: 'Sophisticated and refined',
    cardColor: '#f5f3ff',
    textColor: '#312e81',
    accentColor: '#7c3aed',
    buttonStyle: 'pill',
    hoverEffect: 'lift'
  },
  minimal: {
    name: 'Minimal',
    description: 'Clean and simple',
    cardColor: '#ffffff',
    textColor: '#1f2937',
    accentColor: '#4b5563',
    buttonStyle: 'square',
    hoverEffect: 'none'
  },
  bold: {
    name: 'Bold',
    description: 'Strong and impactful',
    cardColor: '#fff1f2',
    textColor: '#7f1d1d',
    accentColor: '#dc2626',
    buttonStyle: 'rounded',
    hoverEffect: 'shadow'
  },
  soft: {
    name: 'Soft',
    description: 'Gentle and calming',
    cardColor: '#f0f9ff',
    textColor: '#083344',
    accentColor: '#0284c7',
    buttonStyle: 'rounded',
    hoverEffect: 'lift'
  },
  dark: {
    name: 'Dark Mode',
    description: 'Modern dark theme',
    cardColor: '#1e293b',
    textColor: '#f1f5f9',
    accentColor: '#60a5fa',
    buttonStyle: 'rounded',
    hoverEffect: 'lift'
  }
};

const defaultTheme: ThemeConfig = {
  backgroundColor: '#ffffff',
  cardColor: '#f8fafc',
  textColor: '#1e293b',
  accentColor: '#3b82f6',
  buttonStyle: 'rounded',
  font: 'inter',
  showAvatar: true,
  showBio: true,
  avatarShape: 'circle',
  presetTheme: 'default',
  // Bundle-specific defaults
  bundleCardColor: '#f8fafc',
  bundleTextColor: '#1e293b',
  bundleAccentColor: '#3b82f6',
  bundleButtonStyle: 'rounded',
  bundleHoverEffect: 'lift',
  bundleTransitionSpeed: 'fast', // Set to fast as default
  bundleTemplate: 'default', // Default template
  bundleTitleAnimation: 'none',
  bundleLinkAnimation: 'none'
}

export default function CustomizePage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [pageId, setPageId] = useState<string | null>(null)
  const [links, setLinks] = useState<any[]>([])
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

        const { data: linksData, error: linksError } = await supabase
          .from('links')
          .select('*')
          .eq('page_id', pageData.id)
          .order('position')

        if (linksError) {
          console.error('Error loading links:', linksError)
        } else {
          setLinks(linksData || [])
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
      
      if (avatarPreview && !avatarPreview.startsWith('http')) {
        URL.revokeObjectURL(avatarPreview)
      }
      
      const previewUrl = URL.createObjectURL(file)
      setAvatarPreview(previewUrl)
    }
  }

  const updateTheme = (key: keyof ThemeConfig, value: any) => {
    setTheme(prev => ({ ...prev, [key]: value }))
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-background">
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
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-4 py-8 md:px-6 md:py-10">
        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2.5 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 shadow-lg shadow-purple-200">
                  <Palette className="w-5 h-5 text-white" />
                </div>
                <h1 className="text-3xl font-bold text-foreground">Customize</h1>
              </div>
              <p className="text-muted-foreground ml-14">Personalize your page appearance and organization</p>
            </div>

            {/* Save Button */}
            <Button
              onClick={saveCustomization}
              disabled={saving}
              size="lg"
              className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white shadow-lg shadow-purple-200 hover:shadow-xl hover:shadow-purple-300 transition-all"
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
          </div>

          {/* Success Alert */}
          {saved && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
            >
              <Alert className="bg-green-50 border-green-200 mb-6">
                <CheckCircle2 className="w-4 h-4 text-green-600" />
                <AlertDescription className="text-green-800 font-medium ml-2">
                  Your changes have been saved successfully!
                </AlertDescription>
              </Alert>
            </motion.div>
          )}
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column - Settings */}
          <div className="lg:col-span-3 space-y-6">
            {/* Color Scheme Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card className="border-border bg-card shadow-md hover:shadow-lg transition-shadow">
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-2">
                    <Palette className="w-5 h-5 text-purple-600" />
                    <CardTitle className="text-lg text-foreground">Color Scheme</CardTitle>
                  </div>
                  <CardDescription className="text-muted-foreground">Choose your page colors and style</CardDescription>
                </CardHeader>
                <CardContent className="space-y-5">
                  {/* Theme Presets */}
                  <div>
                    <Label className="text-sm text-foreground font-medium mb-3 block">Theme Presets</Label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {Object.entries(themePresets).map(([key, preset]) => (
                        <button
                          key={key}
                          onClick={() => {
                            updateTheme('backgroundColor', preset.bg);
                            updateTheme('cardColor', preset.card);
                            updateTheme('textColor', preset.text);
                            updateTheme('accentColor', preset.accent);
                            updateTheme('presetTheme', key);
                          }}
                          className={`p-3 rounded-lg border-2 transition-all hover:scale-105 ${
                            theme.presetTheme === key
                              ? 'border-purple-500 ring-2 ring-purple-200 shadow-md'
                              : 'border-border hover:border-border'
                          }`}
                          style={{ backgroundColor: preset.bg }}
                        >
                          <div className="text-xs font-semibold" style={{ color: preset.text }}>
                            {preset.name}
                          </div>
                          <div className="flex gap-1 mt-2">
                            <div 
                              className="w-3 h-3 rounded-full" 
                              style={{ backgroundColor: preset.accent }}
                            ></div>
                            <div 
                              className="w-3 h-3 rounded-full" 
                              style={{ backgroundColor: preset.card }}
                            ></div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Custom Colors */}
                  <div>
                    <Label className="text-sm text-foreground font-medium mb-3 block">Custom Colors</Label>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-xs text-foreground mb-1 block">Background</Label>
                        <input
                          type="color"
                          value={theme.backgroundColor}
                          onChange={(e) => updateTheme('backgroundColor', e.target.value)}
                          className="w-full h-10 rounded border border-border cursor-pointer"
                        />
                      </div>
                      <div>
                        <Label className="text-xs text-foreground mb-1 block">Card Background</Label>
                        <input
                          type="color"
                          value={theme.cardColor}
                          onChange={(e) => updateTheme('cardColor', e.target.value)}
                          className="w-full h-10 rounded border border-border cursor-pointer"
                        />
                      </div>
                      <div>
                        <Label className="text-xs text-foreground mb-1 block">Text Color</Label>
                        <input
                          type="color"
                          value={theme.textColor}
                          onChange={(e) => updateTheme('textColor', e.target.value)}
                          className="w-full h-10 rounded border border-border cursor-pointer"
                        />
                      </div>
                      <div>
                        <Label className="text-xs text-foreground mb-1 block">Accent Color</Label>
                        <input
                          type="color"
                          value={theme.accentColor}
                          onChange={(e) => updateTheme('accentColor', e.target.value)}
                          className="w-full h-10 rounded border border-border cursor-pointer"
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Layout & Style Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="border-border bg-card shadow-md hover:shadow-lg transition-shadow">
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-2">
                    <Layout className="w-5 h-5 text-purple-600" />
                    <CardTitle className="text-lg text-foreground">Layout & Style</CardTitle>
                  </div>
                  <CardDescription className="text-muted-foreground">Customize button and avatar styles</CardDescription>
                </CardHeader>
                <CardContent className="space-y-5">
                  {/* Button Style */}
                  <div>
                    <Label className="text-sm text-foreground font-medium mb-3 block">Link Button Style</Label>
                    <div className="grid grid-cols-3 gap-3">
                      {buttonStyles.map((style) => (
                        <button
                          key={style.value}
                          onClick={() => updateTheme('buttonStyle', style.value)}
                          className={`p-4 border-2 transition-all hover:scale-105 ${style.preview} ${
                            theme.buttonStyle === style.value
                              ? 'border-purple-500 bg-purple-50 ring-2 ring-purple-200 shadow-md'
                              : 'border-border hover:border-border bg-card'
                          }`}
                        >
                          <div className="text-sm font-semibold text-foreground">{style.name}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Avatar Shape */}
                  <div>
                    <Label className="text-sm text-foreground font-medium mb-3 block">Avatar Shape</Label>
                    <div className="grid grid-cols-3 gap-3">
                      {avatarShapes.map((shape) => (
                        <button
                          key={shape.value}
                          onClick={() => updateTheme('avatarShape', shape.value)}
                          className={`p-3 border-2 transition-all hover:scale-105 rounded-lg ${
                            theme.avatarShape === shape.value
                              ? 'border-purple-500 bg-purple-50 ring-2 ring-purple-200 shadow-md'
                              : 'border-border hover:border-border bg-card'
                          }`}
                        >
                          <div className={`w-10 h-10 mx-auto mb-2 bg-slate-300 ${shape.preview}`}></div>
                          <div className="text-sm font-semibold text-foreground">{shape.name}</div>
                        </button>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Display Options Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="border-border bg-card shadow-md hover:shadow-lg transition-shadow">
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-2">
                    <Eye className="w-5 h-5 text-purple-600" />
                    <CardTitle className="text-lg text-foreground">Display Options</CardTitle>
                  </div>
                  <CardDescription className="text-muted-foreground">Control what appears on your page</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Avatar Upload */}
                  <div className="p-4 rounded-lg bg-gradient-to-r from-slate-50 to-slate-100 border border-border">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <div className="font-semibold text-foreground">Profile Picture</div>
                        <p className="text-sm text-muted-foreground">Upload your profile picture</p>
                      </div>
                      <label className="flex items-center gap-2 px-4 py-2 bg-card border-2 border-border rounded-lg cursor-pointer hover:bg-slate-50 hover:border-purple-400 transition-all shadow-sm">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleAvatarChange}
                          className="hidden"
                        />
                        <span className="text-sm font-medium text-foreground">Choose File</span>
                      </label>
                    </div>
                    {avatarPreview && (
                      <div className="flex justify-center">
                        <div className="relative w-20 h-20 rounded-full overflow-hidden border-2 border-border shadow-md">
                          <img
                            src={avatarPreview}
                            alt="Preview"
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-lg bg-slate-50 border border-border hover:bg-slate-100 transition-colors">
                    <div>
                      <div className="font-semibold text-foreground">Show Avatar</div>
                      <p className="text-sm text-muted-foreground">Display your profile picture</p>
                    </div>
                    <Switch
                      checked={theme.showAvatar}
                      onCheckedChange={(checked) => updateTheme('showAvatar', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-lg bg-slate-50 border border-border hover:bg-slate-100 transition-colors">
                    <div>
                      <div className="font-semibold text-foreground">Show Bio</div>
                      <p className="text-sm text-muted-foreground">Display your bio description</p>
                    </div>
                    <Switch
                      checked={theme.showBio}
                      onCheckedChange={(checked) => updateTheme('showBio', checked)}
                    />
                  </div>
                </CardContent>
              </Card>
              
              {/* Bundle Customization Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <Card className="border-border bg-card shadow-md hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-4">
                    <div className="flex items-center gap-2">
                      <Palette className="w-5 h-5 text-purple-600" />
                      <CardTitle className="text-lg text-foreground">Bundle Appearance</CardTitle>
                    </div>
                    <CardDescription className="text-muted-foreground">Customize how bundles appear on your page</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Bundle Template Selection */}
                    <div>
                      <Label className="text-sm text-foreground font-medium mb-3 block">Bundle Template</Label>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {Object.entries(bundleTemplates).map(([key, template]) => (
                          <button
                            key={`template-${key}`}
                            onClick={() => {
                              updateTheme('bundleTemplate', key as BundleTemplate);
                              // Apply template settings
                              updateTheme('bundleCardColor', template.cardColor);
                              updateTheme('bundleTextColor', template.textColor);
                              updateTheme('bundleAccentColor', template.accentColor);
                              updateTheme('bundleButtonStyle', template.buttonStyle);
                              updateTheme('bundleHoverEffect', template.hoverEffect);
                              // Set transition speed to fast as default
                              updateTheme('bundleTransitionSpeed', 'fast');
                            }}
                            className={`p-3 rounded-lg border-2 transition-all hover:scale-105 ${
                              theme.bundleTemplate === key
                                ? 'border-purple-500 ring-2 ring-purple-200 shadow-md'
                                : 'border-border hover:border-border'
                              }`}
                            style={{ backgroundColor: template.cardColor }}
                          >
                            <div className="font-semibold text-sm truncate" style={{ color: template.textColor }}>
                              {template.name}
                            </div>
                            <div className="text-xs opacity-70 mt-1" style={{ color: template.textColor }}>
                              {template.description}
                            </div>
                            <div className="flex gap-1 mt-2">
                              <div 
                                className="w-3 h-3 rounded-full" 
                                style={{ backgroundColor: template.accentColor }}
                              ></div>
                              <div 
                                className="w-3 h-3 rounded-full" 
                                style={{ backgroundColor: template.textColor }}
                              ></div>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Text Animation Effects */}
                      <div className="border border-border rounded-lg p-4">
                        <Label className="text-sm text-foreground font-medium mb-3 block">Text Animation Effects</Label>
                        <div className="space-y-4">
                          <div>
                            <Label className="text-xs text-foreground mb-2 block">Bundle Title Animation</Label>
                            <div className="grid grid-cols-3 gap-2">
                              {[
                                { name: 'None', value: 'none' },
                                { name: 'Blur', value: 'blur' },
                                { name: 'Split', value: 'split' },
                                { name: 'Type', value: 'type' },
                                { name: 'Shuffle', value: 'shuffle' },
                                { name: 'Gradient', value: 'gradient' }
                              ].map((anim) => (
                                <button
                                  key={`title-anim-${anim.value}`}
                                  onClick={() => updateTheme('bundleTitleAnimation', anim.value)}
                                  className={`p-2 border transition-all rounded text-xs ${
                                    theme.bundleTitleAnimation === anim.value
                                      ? 'border-purple-500 bg-purple-50'
                                      : 'border-border hover:border-purple-300'
                                  }`}
                                >
                                  {anim.name}
                                </button>
                              ))}
                            </div>
                          </div>
                          
                          <div>
                            <Label className="text-xs text-foreground mb-2 block">Link Title Animation</Label>
                            <div className="grid grid-cols-3 gap-2">
                              {[
                                { name: 'None', value: 'none' },
                                { name: 'Blur', value: 'blur' },
                                { name: 'Split', value: 'split' },
                                { name: 'Type', value: 'type' },
                                { name: 'Shuffle', value: 'shuffle' },
                                { name: 'Gradient', value: 'gradient' }
                              ].map((anim) => (
                                <button
                                  key={`link-anim-${anim.value}`}
                                  onClick={() => updateTheme('bundleLinkAnimation', anim.value)}
                                  className={`p-2 border transition-all rounded text-xs ${
                                    theme.bundleLinkAnimation === anim.value
                                      ? 'border-purple-500 bg-purple-50'
                                      : 'border-border hover:border-purple-300'
                                  }`}
                                >
                                  {anim.name}
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Advanced Bundle Customization */}
                      <div className="border border-border rounded-lg p-4">
                        <Label className="text-sm text-foreground font-medium mb-3 block">Advanced Settings</Label>
                        
                        {/* Bundle Button Style */}
                        <div className="mb-4">
                          <Label className="text-xs text-foreground mb-2 block">Button Style</Label>
                          <div className="grid grid-cols-3 gap-2">
                            {buttonStyles.map((style) => (
                              <button
                                key={`bundle-adv-${style.value}`}
                                onClick={() => updateTheme('bundleButtonStyle', style.value)}
                                className={`p-2 border transition-all rounded ${style.preview} ${
                                  theme.bundleButtonStyle === style.value
                                    ? 'border-purple-500 bg-purple-50'
                                    : 'border-border hover:border-purple-300'
                                }`}
                              >
                                <div className="text-xs font-semibold text-foreground">{style.name}</div>
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Bundle Hover Effect */}
                        <div className="mb-4">
                          <Label className="text-xs text-foreground mb-2 block">Hover Effect</Label>
                          <div className="grid grid-cols-3 gap-2">
                            {[
                              { name: 'Lift', value: 'lift' },
                              { name: 'Shadow', value: 'shadow' },
                              { name: 'None', value: 'none' }
                            ].map((effect) => (
                              <button
                                key={`bundle-adv-hover-${effect.value}`}
                                onClick={() => updateTheme('bundleHoverEffect', effect.value as any)}
                                className={`p-2 border transition-all rounded ${
                                  theme.bundleHoverEffect === effect.value
                                    ? 'border-purple-500 bg-purple-50'
                                    : 'border-border hover:border-purple-300'
                                }`}
                              >
                                <div className="text-xs font-semibold text-foreground">{effect.name}</div>
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Bundle Colors */}
                        <div>
                          <Label className="text-xs text-foreground mb-2 block">Custom Colors</Label>
                          <div className="grid grid-cols-3 gap-2">
                            <div>
                              <Label className="text-xs text-foreground mb-1 block">Bg</Label>
                              <input
                                type="color"
                                value={theme.bundleCardColor}
                                onChange={(e) => updateTheme('bundleCardColor', e.target.value)}
                                className="w-full h-8 rounded border border-border cursor-pointer"
                              />
                            </div>
                            <div>
                              <Label className="text-xs text-foreground mb-1 block">Text</Label>
                              <input
                                type="color"
                                value={theme.bundleTextColor}
                                onChange={(e) => updateTheme('bundleTextColor', e.target.value)}
                                className="w-full h-8 rounded border border-border cursor-pointer"
                              />
                            </div>
                            <div>
                              <Label className="text-xs text-foreground mb-1 block">Accent</Label>
                              <input
                                type="color"
                                value={theme.bundleAccentColor}
                                onChange={(e) => updateTheme('bundleAccentColor', e.target.value)}
                                className="w-full h-8 rounded border border-border cursor-pointer"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                  {/* Advanced Bundle Customization */}
                  <div className="pt-4 border-t border-border">
                    <Label className="text-sm text-foreground font-medium mb-3 block">Advanced Bundle Customization</Label>
                    
                    {/* Bundle Colors */}
                    <div>
                      <Label className="text-xs text-foreground mb-2 block">Bundle Colors (Overrides Template)</Label>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label className="text-xs text-foreground mb-1 block">Background</Label>
                          <input
                            type="color"
                            value={theme.bundleCardColor}
                            onChange={(e) => updateTheme('bundleCardColor', e.target.value)}
                            className="w-full h-10 rounded border border-border cursor-pointer"
                          />
                        </div>
                        <div>
                          <Label className="text-xs text-foreground mb-1 block">Text</Label>
                          <input
                            type="color"
                            value={theme.bundleTextColor}
                            onChange={(e) => updateTheme('bundleTextColor', e.target.value)}
                            className="w-full h-10 rounded border border-border cursor-pointer"
                          />
                        </div>
                        <div>
                          <Label className="text-xs text-foreground mb-1 block">Accent</Label>
                          <input
                            type="color"
                            value={theme.bundleAccentColor}
                            onChange={(e) => updateTheme('bundleAccentColor', e.target.value)}
                            className="w-full h-10 rounded border border-border cursor-pointer"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Bundle Button Style */}
                    <div className="mt-4">
                      <Label className="text-xs text-foreground mb-2 block">Button Style</Label>
                      <div className="grid grid-cols-3 gap-3">
                        {buttonStyles.map((style) => (
                          <button
                            key={`bundle-adv-${style.value}`}
                            onClick={() => updateTheme('bundleButtonStyle', style.value)}
                            className={`p-3 border-2 transition-all hover:scale-105 ${style.preview} ${
                              theme.bundleButtonStyle === style.value
                                ? 'border-purple-500 bg-purple-50 ring-2 ring-purple-200 shadow-md'
                                : 'border-border hover:border-border bg-card'
                            }`}
                          >
                            <div className="text-xs font-semibold text-foreground">{style.name}</div>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Bundle Hover Effect */}
                    <div className="mt-4">
                      <Label className="text-xs text-foreground mb-2 block">Hover Effect</Label>
                      <div className="grid grid-cols-3 gap-3">
                        {[
                          { name: 'Lift', value: 'lift' },
                          { name: 'Shadow', value: 'shadow' },
                          { name: 'None', value: 'none' }
                        ].map((effect) => (
                          <button
                            key={`bundle-adv-hover-${effect.value}`}
                            onClick={() => updateTheme('bundleHoverEffect', effect.value as any)}
                            className={`p-3 border-2 transition-all hover:scale-105 rounded-lg ${
                              theme.bundleHoverEffect === effect.value
                                ? 'border-purple-500 bg-purple-50 ring-2 ring-purple-200 shadow-md'
                                : 'border-border hover:border-border bg-card'
                            }`}
                          >
                            <div className="text-xs font-semibold text-foreground">{effect.name}</div>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                  </CardContent>
                </Card>
              </motion.div>
            </motion.div>

        </div>

        {/* Bundle Manager - Full Width Below */}
        {pageId && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-6"
          >
            <BundleManager pageId={pageId} links={links} />
          </motion.div>
        )}
      </div>
    </div>
    </div>
  )
}