'use client'

import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/app/components/ui/button'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/app/components/ui/card'
import { Alert, AlertDescription } from '@/app/components/ui/alert'
import {
  Loader2,
  Palette,
  Layout,
  Eye,
  Save,
  CheckCircle2,
  Sparkles,
  Info,
  User,
  Package,
  Layers,
  Zap,
  PackageOpen, // Added for the new manager card
} from 'lucide-react'
import { Label } from '@/app/components/ui/label'
import { Switch } from '@/app/components/ui/switch'
import { BundleManager } from '@/app/components/BundleManager' // This is the component you wanted
import { useRouter } from 'next/navigation'
import { Input } from '@/app/components/ui/input'
import { Textarea } from '@/app/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/app/components/ui/select'

// --- Types ---
type BundleTemplate =
  | 'default'
  | 'vibrant'
  | 'elegant'
  | 'minimal'
  | 'bold'
  | 'soft'
  | 'dark'

type AnimationType =
  | 'none'
  | 'blur'
  | 'split'
  | 'type'
  | 'shuffle'
  | 'gradient'
  | 'countup'

type ButtonStyle = 'rounded' | 'square' | 'pill'
type AvatarShape = 'circle' | 'square' | 'rounded'
type HoverEffect = 'lift' | 'shadow' | 'none'
type TransitionSpeed = 'fast' | 'medium' | 'slow'

interface ThemeConfig {
  backgroundColor: string
  cardColor: string
  textColor: string
  accentColor: string
  buttonStyle: ButtonStyle
  font: string
  showAvatar: boolean
  showBio: boolean
  avatarShape: AvatarShape
  presetTheme?: string
  // Bundle-specific settings
  bundleCardColor?: string
  bundleTextColor?: string
  bundleAccentColor?: string
  bundleButtonStyle?: ButtonStyle
  bundleHoverEffect?: HoverEffect
  bundleTransitionSpeed?: TransitionSpeed
  // Template settings
  bundleTemplate?: BundleTemplate
  // Animation settings
  bundleTitleAnimation?: AnimationType
  bundleLinkAnimation?: AnimationType
}

// --- Constants ---
const themePresets = {
  red: {
    name: 'Red Passion',
    bg: '#FED7D7',
    card: '#FEB2B2',
    text: '#742A2A',
    accent: '#E53E3E',
  },
  orange: {
    name: 'Warm Orange',
    bg: '#FEEBC8',
    card: '#FBD38D',
    text: '#7B341E',
    accent: '#DD6B20',
  },
  yellow: {
    name: 'Sunny Yellow',
    bg: '#FEF3C7',
    card: '#FDE68A',
    text: '#744210',
    accent: '#D69E2E',
  },
  green: {
    name: 'Emerald Green',
    bg: '#C6F6D5',
    card: '#9AE6B4',
    text: '#1A5717',
    accent: '#38A169',
  },
  mint: {
    name: 'Mint Breeze',
    bg: '#C6F6E9',
    card: '#81E6D9',
    text: '#0A5748',
    accent: '#2C7A7B',
  },
  teal: {
    name: 'Teal Ocean',
    bg: '#B6E0FF',
    card: '#7EDCE2',
    text: '#084B55',
    accent: '#2F855A',
  },
  cyan: {
    name: 'Cyan Sky',
    bg: '#A5D8FF',
    card: '#76E4F7',
    text: '#074C68',
    accent: '#06B6D4',
  },
  blue: {
    name: 'Ocean Blue',
    bg: '#BFDBFE',
    card: '#93C5FD',
    text: '#1E3A8A',
    accent: '#2563EB',
  },
  indigo: {
    name: 'Royal Indigo',
    bg: '#C7D2FE',
    card: '#A5B4FC',
    text: '#312E81',
    accent: '#4F46E5',
  },
  purple: {
    name: 'Royal Purple',
    bg: '#DDD6FE',
    card: '#C4B5FD',
    text: '#5B21B6',
    accent: '#7C3AED',
  },
  pink: {
    name: 'Blush Pink',
    bg: '#FED7E2',
    card: '#FBB6CE',
    text: '#702459',
    accent: '#E936A7',
  },
  brown: {
    name: 'Rustic Brown',
    bg: '#EDE9FE',
    card: '#DDD6FE',
    text: '#713F12',
    accent: '#B45309',
  },
}

const bundleTemplates: Record<
  BundleTemplate,
  {
    name: string
    description: string
    cardColor: string
    textColor: string
    accentColor: string
    buttonStyle: ButtonStyle
    hoverEffect: HoverEffect
  }
> = {
  default: {
    name: 'Default',
    description: 'Classic look with subtle styling',
    cardColor: '#f8fafc',
    textColor: '#1e293b',
    accentColor: '#3b82f6',
    buttonStyle: 'rounded',
    hoverEffect: 'lift',
  },
  vibrant: {
    name: 'Vibrant',
    description: 'Bright and energetic colors',
    cardColor: '#fef7ee',
    textColor: '#7c2d12',
    accentColor: '#ea580c',
    buttonStyle: 'rounded',
    hoverEffect: 'shadow',
  },
  elegant: {
    name: 'Elegant',
    description: 'Sophisticated and refined',
    cardColor: '#f5f3ff',
    textColor: '#312e81',
    accentColor: '#7c3aed',
    buttonStyle: 'pill',
    hoverEffect: 'lift',
  },
  minimal: {
    name: 'Minimal',
    description: 'Clean and simple',
    cardColor: '#ffffff',
    textColor: '#1f2937',
    accentColor: '#4b5563',
    buttonStyle: 'square',
    hoverEffect: 'none',
  },
  bold: {
    name: 'Bold',
    description: 'Strong and impactful',
    cardColor: '#fff1f2',
    textColor: '#7f1d1d',
    accentColor: '#dc2626',
    buttonStyle: 'rounded',
    hoverEffect: 'shadow',
  },
  soft: {
    name: 'Soft',
    description: 'Gentle and calming',
    cardColor: '#f0f9ff',
    textColor: '#083344',
    accentColor: '#0284c7',
    buttonStyle: 'rounded',
    hoverEffect: 'lift',
  },
  dark: {
    name: 'Dark Mode',
    description: 'Modern dark theme',
    cardColor: '#1e293b',
    textColor: '#f1f5f9',
    accentColor: '#60a5fa',
    buttonStyle: 'rounded',
    hoverEffect: 'lift',
  },
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
  avatarShape: 'circle',
  presetTheme: 'default',
  bundleCardColor: '#f8fafc',
  bundleTextColor: '#1e293b',
  bundleAccentColor: '#3b82f6',
  bundleButtonStyle: 'rounded',
  bundleHoverEffect: 'lift',
  bundleTransitionSpeed: 'fast',
  bundleTemplate: 'default',
  bundleTitleAnimation: 'none',
  bundleLinkAnimation: 'none',
}

// --- Options Arrays ---
const buttonStyles = [
  { name: 'Rounded', value: 'rounded' as const, preview: 'rounded-xl' },
  { name: 'Square', value: 'square' as const, preview: 'rounded-none' },
  { name: 'Pill', value: 'pill' as const, preview: 'rounded-full' },
]

const avatarShapes = [
  { name: 'Circle', value: 'circle' as const, preview: 'rounded-full' },
  { name: 'Square', value: 'square' as const, preview: 'rounded-none' },
  { name: 'Rounded', value: 'rounded' as const, preview: 'rounded-2xl' },
]

const hoverEffects = [
  { name: 'Lift', value: 'lift' as const },
  { name: 'Shadow', value: 'shadow' as const },
  { name: 'None', value: 'none' as const },
]

const transitionSpeeds = [
  { name: 'Fast', value: 'fast' as const },
  { name: 'Medium', value: 'medium' as const },
  { name: 'Slow', value: 'slow' as const },
]

const animationTypes: { name: string; value: AnimationType }[] = [
  { name: 'None', value: 'none' },
  { name: 'Blur In', value: 'blur' },
  { name: 'Split', value: 'split' },
  { name: 'Typing', value: 'type' },
  { name: 'Shuffle', value: 'shuffle' },
  { name: 'Gradient', value: 'gradient' },
  { name: 'Count Up', value: 'countup' },
]

// --- Main Page Component ---

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
    avatar_url: null,
  })
  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)
  const [isFirstTime, setIsFirstTime] = useState(false)

  // --- Data Fetching and Side Effects ---

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
    // ... (Data fetching logic is preserved)
    try {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

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
          avatar_url: pageData.avatar_url,
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
      } else {
        setIsFirstTime(true)
      }
    } catch (error) {
      console.error('Error loading customization:', error)
    } finally {
      setLoading(false)
    }
  }

  async function saveCustomization() {
    // ... (Data saving logic is preserved)
    setSaving(true)
    setSaved(false)

    try {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        throw new Error('User not authenticated')
      }

      let currentPageId = pageId
      if (!currentPageId) {
        const { data: newPageData, error: createError } = await supabase
          .from('pages')
          .insert({
            user_id: user.id,
            title: previewData.title,
            bio: previewData.bio,
            theme,
            slug:
              user.email?.split('@')[0]?.toLowerCase().replace(/[^a-z0-9]/g, '') ||
              `user${Date.now()}`,
            is_published: true,
          })
          .select()
          .single()

        if (createError) throw createError
        currentPageId = newPageData.id
        setPageId(currentPageId)
      }

      const updates: any = { theme }

      if (avatarFile) {
        const fileName = `avatar_${currentPageId}_${Date.now()}`
        const { data, error: uploadError } = await supabase.storage
          .from('avatars')
          .upload(fileName, avatarFile, {
            cacheControl: '3600',
            upsert: true,
          })

        if (uploadError) {
          console.error('Error uploading avatar:', uploadError)
          throw uploadError
        }

        const { data: urlData } = supabase.storage
          .from('avatars')
          .getPublicUrl(fileName)

        updates.avatar_url = urlData.publicUrl
      }

      const allUpdates: any = { ...updates }
      allUpdates.title = previewData.title
      allUpdates.bio = previewData.bio

      if (Object.keys(allUpdates).length > 0) {
        const { error } = await supabase
          .from('pages')
          .update(allUpdates)
          .eq('id', currentPageId)

        if (error) throw error
      }

      if (isFirstTime) {
        const { error: prefError } = await supabase
          .from('user_preferences')
          .upsert(
            {
              user_id: user.id,
              key: 'onboarding_completed',
              value: 'true',
            },
            { onConflict: 'user_id, key' }
          )

        if (prefError) {
          console.error('Error marking onboarding as completed:', prefError)
        }
        setIsFirstTime(false) // No longer first time after successful save
      }

      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch (error) {
      console.error('Error saving customization:', error)
      alert('Failed to save changes')
    } finally {
      setSaving(false)
    }
  }

  // --- Event Handlers ---

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
    setTheme((prev) => ({ ...prev, [key]: value, presetTheme: undefined }))
    if (
      key === 'backgroundColor' ||
      key === 'cardColor' ||
      key === 'textColor' ||
      key === 'accentColor'
    ) {
      setTheme((prev) => ({ ...prev, [key]: value, presetTheme: undefined }))
    } else {
      setTheme((prev) => ({ ...prev, [key]: value }))
    }
  }

  // --- Loading State ---

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-background">
        <Loader2 className="w-8 h-8 text-slate-400 animate-spin" />
      </div>
    )
  }

  // --- Main Render ---

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 py-8 md:px-6 md:py-10">
        {/* --- Header & Save Button --- */}
        <CustomizeHeader
          isFirstTime={isFirstTime}
          saving={saving}
          saved={saved}
          saveCustomization={saveCustomization}
        />

        {/* --- Success Alert --- */}
        {saved && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
          >
            <Alert className="bg-green-50 border-green-200 mb-6">
              <CheckCircle2 className="w-4 h-4 text-green-600" />
              <AlertDescription className="text-green-800 font-medium ml-2">
                {isFirstTime
                  ? 'Your page has been created successfully! You can now customize it further or add more links.'
                  : 'Your changes have been saved successfully!'}
              </AlertDescription>
            </Alert>
          </motion.div>
        )}

        {/* --- Onboarding Banner --- */}
        <OnboardingCard isFirstTime={isFirstTime} />

        {/* --- First Time Profile Form --- */}
        <ProfileFormCard
          isFirstTime={isFirstTime}
          previewData={previewData}
          setPreviewData={setPreviewData}
        />

        {/* --- Main Content Settings --- */}
        <div className="max-w-4xl mx-auto space-y-6">
          {/* --- THIS IS THE NEW CARD YOU WANTED --- */}
          <BundleManagementCard
            pageId={pageId}
            links={links}
            setLinks={setLinks}
            isFirstTime={isFirstTime}
          />

          {/* --- Customization Cards --- */}
          <ColorSettingsCard theme={theme} updateTheme={updateTheme} />
          <LayoutSettingsCard theme={theme} updateTheme={updateTheme} />
          <DisplaySettingsCard
            theme={theme}
            updateTheme={updateTheme}
            handleAvatarChange={handleAvatarChange}
            avatarPreview={avatarPreview}
          />
          <BundleSettingsCard theme={theme} updateTheme={updateTheme} />
        </div>
      </div>
    </div>
  )
}

// --- Child Components ---

/**
 * Header section with Title and Save Button
 */
function CustomizeHeader({ isFirstTime, saving, saved, saveCustomization }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-8"
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 shadow-lg shadow-purple-200">
              <Palette className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-foreground">Customize</h1>
          </div>
          <p className="text-muted-foreground ml-14">
            {isFirstTime
              ? 'Set up your profile and customize your page'
              : 'Personalize your page appearance and organization'}
          </p>
        </div>

        <Button
          onClick={saveCustomization}
          disabled={saving}
          size="lg"
          className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white shadow-lg shadow-purple-200 hover:shadow-xl hover:shadow-purple-300 transition-all self-start sm:self-auto"
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
              {isFirstTime ? 'Create Page & Save' : 'Save Changes'}
            </>
          )}
        </Button>
      </div>
    </motion.div>
  )
}

/**
 * Welcome banner for first-time users
 */
function OnboardingCard({ isFirstTime }) {
  if (!isFirstTime) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-8"
    >
      <Card className="border-blue-200 bg-blue-50/30 shadow-sm">
        <CardContent className="p-5">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-blue-100 flex-shrink-0 mt-0.5">
              <Sparkles className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-foreground">
                Welcome! Let's set up your profile
              </h2>
              <p className="text-muted-foreground mt-1">
                This is your first time here. Let's create your personalized bio
                link page. Fill in your details below and customize your page to
                match your style.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

/**
 * Profile info form (Name, Bio) for first-time users
 */
function ProfileFormCard({ isFirstTime, previewData, setPreviewData }) {
  if (!isFirstTime) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="mb-8 max-w-4xl mx-auto"
    >
      <Card className="border-border bg-card shadow-md hover:shadow-lg transition-shadow">
        <CardHeader>
          <div className="flex items-center gap-2">
            <User className="w-5 h-5 text-purple-600" />
            <CardTitle className="text-lg text-foreground">
              Your Profile
            </CardTitle>
          </div>
          <CardDescription className="text-muted-foreground">
            Set up your basic profile information
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label className="text-sm text-foreground font-medium mb-2 block">
              Name/Username *
            </Label>
            <Input
              value={previewData.title}
              onChange={(e) =>
                setPreviewData({ ...previewData, title: e.target.value })
              }
              className="bg-card border-border text-foreground placeholder:text-muted-foreground"
              placeholder="Your name or username"
            />
          </div>

          <div>
            <Label className="text-sm text-foreground font-medium mb-2 block">
              Bio/Description *
            </Label>
            <Textarea
              value={previewData.bio}
              onChange={(e) =>
                setPreviewData({ ...previewData, bio: e.target.value })
              }
              className="bg-card border-border text-foreground placeholder:text-muted-foreground resize-none"
              placeholder="Tell your audience about yourself"
              rows={3}
            />
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

/**
 * Card for managing (creating, editing, reordering) bundles and links
 */
function BundleManagementCard({ pageId, links, setLinks, isFirstTime }) {
  if (isFirstTime || !pageId) {
    // Don't show bundle manager on first time screen,
    // they need to create the page first.
    // Show a placeholder card instead.
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="border-border bg-card shadow-md">
          <CardHeader>
            <div className="flex items-center gap-2">
              <PackageOpen className="w-5 h-5 text-purple-600" />
              <CardTitle className="text-lg text-foreground">
                Manage Links & Bundles
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Save your page profile and settings first. After your page is
              created, you'll be able to add and manage your links and bundles
              here.
            </p>
          </CardContent>
        </Card>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
    >
      <Card className="border-border bg-card shadow-md hover:shadow-lg transition-shadow">
        <CardHeader>
          <div className="flex items-center gap-2">
            <PackageOpen className="w-5 h-5 text-purple-600" />
            <CardTitle className="text-lg text-foreground">
              Manage Links & Bundles
            </CardTitle>
          </div>
          <CardDescription className="text-muted-foreground">
            Add, edit, reorder, and bundle your links. This is where the
            `BundleManager` component lives.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* This is where the component from '@/app/components/BundleManager' 
            is rendered. We pass it the pageId and the link state
            so it can manage (create, read, update, delete) the links.
          */}
          <BundleManager
            pageId={pageId}
            links={links}
            setLinks={setLinks}
          />
        </CardContent>
      </Card>
    </motion.div>
  )
}

/**
 * Card for managing Color Scheme (Presets and Custom)
 */
function ColorSettingsCard({ theme, updateTheme }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
    >
      <Card className="border-border bg-card shadow-md hover:shadow-lg transition-shadow">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-2">
            <Palette className="w-5 h-5 text-purple-600" />
            <CardTitle className="text-lg text-foreground">
              Color Scheme
            </CardTitle>
          </div>
          <CardDescription className="text-muted-foreground">
            Choose your page colors and style
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          {/* Theme Presets */}
          <div>
            <Label className="text-sm text-foreground font-medium mb-3 block">
              Theme Presets
            </Label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {Object.entries(themePresets).map(([key, preset]) => (
                <button
                  key={key}
                  onClick={() => {
                    updateTheme('backgroundColor', preset.bg)
                    updateTheme('cardColor', preset.card)
                    updateTheme('textColor', preset.text)
                    updateTheme('accentColor', preset.accent)
                    updateTheme('presetTheme', key)
                  }}
                  className={`p-3 rounded-lg border-2 transition-all hover:scale-105 ${
                    theme.presetTheme === key
                      ? 'border-purple-500 ring-2 ring-purple-200 shadow-md'
                      : 'border-border hover:border-border'
                  }`}
                  style={{ backgroundColor: preset.bg }}
                >
                  <div
                    className="text-xs font-semibold"
                    style={{ color: preset.text }}
                  >
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
            <Label className="text-sm text-foreground font-medium mb-3 block">
              Custom Colors (Overrides Preset)
            </Label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <ColorPicker
                label="Background"
                value={theme.backgroundColor}
                onChange={(e) => updateTheme('backgroundColor', e.target.value)}
              />
              <ColorPicker
                label="Card"
                value={theme.cardColor}
                onChange={(e) => updateTheme('cardColor', e.target.value)}
              />
              <ColorPicker
                label="Text"
                value={theme.textColor}
                onChange={(e) => updateTheme('textColor', e.target.value)}
              />
              <ColorPicker
                label="Accent"
                value={theme.accentColor}
                onChange={(e) => updateTheme('accentColor', e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

/**
 * Card for managing Layout & Style (Buttons, Avatars)
 */
function LayoutSettingsCard({ theme, updateTheme }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <Card className="border-border bg-card shadow-md hover:shadow-lg transition-shadow">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-2">
            <Layout className="w-5 h-5 text-purple-600" />
            <CardTitle className="text-lg text-foreground">
              Layout & Style
            </CardTitle>
          </div>
          <CardDescription className="text-muted-foreground">
            Customize button and avatar styles
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          {/* Button Style */}
          <div>
            <Label className="text-sm text-foreground font-medium mb-3 block">
              Link Button Style
            </Label>
            <div className="grid grid-cols-3 gap-3">
              {buttonStyles.map((style) => (
                <button
                  key={style.value}
                  onClick={() => updateTheme('buttonStyle', style.value)}
                  className={`p-4 border-2 transition-all hover:scale-105 ${
                    style.preview
                  } ${
                    theme.buttonStyle === style.value
                      ? 'border-purple-500 bg-purple-50 ring-2 ring-purple-200 shadow-md'
                      : 'border-border hover:border-border bg-card'
                  }`}
                >
                  <div className="text-sm font-semibold text-foreground">
                    {style.name}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Avatar Shape */}
          <div>
            <Label className="text-sm text-foreground font-medium mb-3 block">
              Avatar Shape
            </Label>
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
                  <div
                    className={`w-10 h-10 mx-auto mb-2 bg-slate-300 ${shape.preview}`}
                  ></div>
                  <div className="text-sm font-semibold text-foreground">
                    {shape.name}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

/**
 * Card for managing Display Options (Avatar, Bio)
 */
function DisplaySettingsCard({
  theme,
  updateTheme,
  handleAvatarChange,
  avatarPreview,
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
    >
      <Card className="border-border bg-card shadow-md hover:shadow-lg transition-shadow">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-2">
            <Eye className="w-5 h-5 text-purple-600" />
            <CardTitle className="text-lg text-foreground">
              Display Options
            </CardTitle>
          </div>
          <CardDescription className="text-muted-foreground">
            Control what appears on your page
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Avatar Upload */}
          <div className="p-4 rounded-lg bg-slate-50 border border-border">
            <div className="flex items-center justify-between mb-3">
              <div>
                <div className="font-semibold text-foreground">
                  Profile Picture
                </div>
                <p className="text-sm text-muted-foreground">
                  Upload your profile picture
                </p>
              </div>
              <label className="flex items-center gap-2 px-4 py-2 bg-card border-2 border-border rounded-lg cursor-pointer hover:bg-slate-50 hover:border-purple-400 transition-all shadow-sm">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="hidden"
                />
                <span className="text-sm font-medium text-foreground">
                  Choose File
                </span>
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

          <SwitchRow
            label="Show Avatar"
            description="Display your profile picture"
            checked={theme.showAvatar}
            onCheckedChange={(checked) => updateTheme('showAvatar', checked)}
          />
          <SwitchRow
            label="Show Bio"
            description="Display your bio description"
            checked={theme.showBio}
            onCheckedChange={(checked) => updateTheme('showBio', checked)}
          />
        </CardContent>
      </Card>
    </motion.div>
  )
}

/**
 * Card for managing Bundle-specific STYLE settings
 */
function BundleSettingsCard({ theme, updateTheme }) {
  const applyTemplate = (templateKey: BundleTemplate) => {
    const template = bundleTemplates[templateKey]
    if (!template) return

    updateTheme('bundleTemplate', templateKey)
    updateTheme('bundleCardColor', template.cardColor)
    updateTheme('bundleTextColor', template.textColor)
    updateTheme('bundleAccentColor', template.accentColor)
    updateTheme('bundleButtonStyle', template.buttonStyle)
    updateTheme('bundleHoverEffect', template.hoverEffect)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
    >
      <Card className="border-border bg-card shadow-md hover:shadow-lg transition-shadow">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-2">
            <Package className="w-5 h-5 text-purple-600" />
            <CardTitle className="text-lg text-foreground">
              Bundle Customization
            </CardTitle>
          </div>
          <CardDescription className="text-muted-foreground">
            Customize the *appearance* of your link bundles
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Bundle Templates */}
          <div>
            <Label className="text-sm text-foreground font-medium mb-3 block">
              Bundle Templates
            </Label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {Object.entries(bundleTemplates).map(([key, template]) => (
                <button
                  key={key}
                  onClick={() => applyTemplate(key as BundleTemplate)}
                  className={`p-3 rounded-lg border-2 transition-all text-left ${
                    theme.bundleTemplate === key
                      ? 'border-purple-500 ring-2 ring-purple-200 shadow-md'
                      : 'border-border hover:border-border'
                  }`}
                  style={{ backgroundColor: template.cardColor }}
                >
                  <div
                    className="text-sm font-semibold"
                    style={{ color: template.textColor }}
                  >
                    {template.name}
                  </div>
                  <div
                    className="text-xs mt-1"
                    style={{ color: template.textColor, opacity: 0.8 }}
                  >
                    {template.description}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Bundle Custom Colors */}
          <div>
            <Label className="text-sm text-foreground font-medium mb-3 block">
              Bundle Custom Colors (Overrides Template)
            </Label>
            <div className="grid grid-cols-3 gap-4">
              <ColorPicker
                label="Card Color"
                value={theme.bundleCardColor || '#ffffff'}
                onChange={(e) =>
                  updateTheme('bundleCardColor', e.target.value)
                }
              />
              <ColorPicker
                label="Text Color"
                value={theme.bundleTextColor || '#000000'}
                onChange={(e) =>
                  updateTheme('bundleTextColor', e.target.value)
                }
              />
              <ColorPicker
                label="Accent Color"
                value={theme.bundleAccentColor || '#3b82f6'}
                onChange={(e) =>
                  updateTheme('bundleAccentColor', e.target.value)
                }
              />
            </div>
          </div>

          {/* Bundle Style Options */}
          <div>
            <Label className="text-sm text-foreground font-medium mb-3 block">
              Bundle Style & Animations
            </Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <SelectDropdown
                label="Button Style"
                value={theme.bundleButtonStyle}
                onValueChange={(value) =>
                  updateTheme('bundleButtonStyle', value)
                }
                items={buttonStyles}
              />
              <SelectDropdown
                label="Hover Effect"
                value={theme.bundleHoverEffect}
                onValueChange={(value) =>
                  updateTheme('bundleHoverEffect', value)
                }
                items={hoverEffects}
              />
              <SelectDropdown
                label="Transition Speed"
                value={theme.bundleTransitionSpeed}
                onValueChange={(value) =>
                  updateTheme('bundleTransitionSpeed', value)
                }
                items={transitionSpeeds}
              />
              <SelectDropdown
                label="Title Animation"
                value={theme.bundleTitleAnimation}
                onValueChange={(value) =>
                  updateTheme('bundleTitleAnimation', value)
                }
                items={animationTypes}
              />
              <SelectDropdown
                label="Link Animation"
                value={theme.bundleLinkAnimation}
                onValueChange={(value) =>
                  updateTheme('bundleLinkAnimation', value)
                }
                items={animationTypes}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

// --- Reusable UI Primitives ---

/**
 * A simple color picker input
 */
function ColorPicker({ label, value, onChange }) {
  return (
    <div>
      <Label className="text-xs text-foreground mb-1 block">{label}</Label>
      <input
        type="color"
        value={value}
        onChange={onChange}
        className="w-full h-10 rounded border border-border cursor-pointer"
        style={{ padding: 0 }}
      />
    </div>
  )
}

/**
 * A row with a label, description, and a switch
 */
function SwitchRow({ label, description, checked, onCheckedChange }) {
  return (
    <div className="flex items-center justify-between p-4 rounded-lg bg-slate-50 border border-border hover:bg-slate-100 transition-colors">
      <div>
        <div className="font-semibold text-foreground">{label}</div>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      <Switch checked={checked} onCheckedChange={onCheckedChange} />
    </div>
  )
}

/**
 * A reusable Select dropdown component
 */
function SelectDropdown({ label, value, onValueChange, items }) {
  return (
    <div className="space-y-2">
      <Label className="text-sm text-foreground font-medium">{label}</Label>
      <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger className="w-full bg-card border-border">
          <SelectValue placeholder={`Select ${label}...`} />
        </SelectTrigger>
        <SelectContent>
          {items.map((item) => (
            <SelectItem key={item.value} value={item.value}>
              {item.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}