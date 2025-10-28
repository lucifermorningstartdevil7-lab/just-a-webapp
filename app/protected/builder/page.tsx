'use client'
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Trash2, Eye, EyeOff, GripVertical, Star, Save, Loader2, ArrowLeft, Calendar, Link2 } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Label } from '@/app/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/app/components/ui/select';
import { Textarea } from '@/app/components/ui/textarea';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { ScheduleEditor } from '@/app/components/linkScheduleEditor';
import { Badge } from '@/app/components/ui/badge';
import { Switch } from '@/app/components/ui/switch';

interface Link {
  id: number;
  title: string;
  url: string;
  type: string;
  description: string;
  active: boolean;
  pinned: boolean;
  clickCount: number;
  schedule: any;
}

const linkTypes = [
  { value: 'featured', label: 'Featured Work', icon: '⭐', color: 'text-amber-600' },
  { value: 'portfolio', label: 'Portfolio', icon: '🎨', color: 'text-purple-600' },
  { value: 'shop', label: 'Shop/Products', icon: '🛍️', color: 'text-emerald-600' },
  { value: 'content', label: 'Latest Content', icon: '📺', color: 'text-blue-600' },
  { value: 'collab', label: 'Collaboration', icon: '🤝', color: 'text-violet-600' },
  { value: 'community', label: 'Community', icon: '👥', color: 'text-orange-600' },
  { value: 'support', label: 'Support/Donate', icon: '❤️', color: 'text-rose-600' },
  { value: 'custom', label: 'Custom', icon: '🔗', color: 'text-slate-600' },
];

const categories = [
  { value: 'music', label: 'Music Producer', icon: '🎵', color: 'bg-purple-100 text-purple-700' },
  { value: 'gaming', label: 'Gaming/Streamer', icon: '🎮', color: 'bg-green-100 text-green-700' },
  { value: 'art', label: 'Artist/Designer', icon: '🎨', color: 'bg-pink-100 text-pink-700' },
  { value: 'writing', label: 'Writer/Author', icon: '✍️', color: 'bg-blue-100 text-blue-700' },
  { value: 'fitness', label: 'Fitness Coach', icon: '💪', color: 'bg-red-100 text-red-700' },
  { value: 'education', label: 'Educator', icon: '📚', color: 'bg-amber-100 text-amber-700' },
  { value: 'photography', label: 'Photographer', icon: '📸', color: 'bg-cyan-100 text-cyan-700' },
  { value: 'other', label: 'Other', icon: '🌟', color: 'bg-slate-100 text-slate-700' },
];

export default function Builder() {
  const router = useRouter();
  const [links, setLinks] = useState<Link[]>([]);
  const [slug, setSlug] = useState('');
  const [creatorName, setCreatorName] = useState('');
  const [tagline, setTagline] = useState('');
  const [category, setCategory] = useState('');
  const [stats, setStats] = useState({ followers: '', views: '', posts: '' });
  const [pinnedLinks, setPinnedLinks] = useState<number[]>([]);
  const [saving, setSaving] = useState(false);
  const [slugAvailable, setSlugAvailable] = useState<boolean | null>(null);
  const [pageId, setPageId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [isPublished, setIsPublished] = useState(false);

  // Debounced slug availability check
  useEffect(() => {
    if (slug.length < 3) {
      setSlugAvailable(null);
      return;
    }

    const timer = setTimeout(() => {
      checkSlugAvailability(slug);
    }, 500);

    return () => clearTimeout(timer);
  }, [slug]);

  // Load existing page data
  useEffect(() => {
    loadExistingPage();
  }, []);

  async function loadExistingPage() {
    try {
      setLoading(true);
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        router.push('/login');
        return;
      }

      // Load user's page
      const { data: pageData, error: pageError } = await supabase
        .from('pages')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (pageError && pageError.code !== 'PGRST116') {
        console.error('Error loading page:', pageError);
        return;
      }

      if (pageData) {
        setPageId(pageData.id);
        setSlug(pageData.slug);
        setCreatorName(pageData.title);
        setTagline(pageData.description);
        setIsPublished(pageData.is_published || false);

        // Parse bio data
        if (pageData.bio) {
          try {
            const bioData = JSON.parse(pageData.bio);
            setCategory(bioData.category || '');
            setStats(bioData.stats || { followers: '', views: '', posts: '' });
          } catch (e) {
            console.error('Error parsing bio data:', e);
          }
        }

        // Load links
        const { data: linksData, error: linksError } = await supabase
          .from('links')
          .select('*')
          .eq('page_id', pageData.id)
          .order('position');

        if (linksError) {
          console.error('Error loading links:', linksError);
          return;
        }

        if (linksData) {
          const loadedLinks = linksData.map(link => {
            let metadata = {};
            try {
              metadata = link.metadata ? JSON.parse(link.metadata) : {};
            } catch (e) {
              console.error('Error parsing link metadata:', e);
            }

            return {
              id: link.id,
              title: link.title,
              url: link.url,
              type: metadata.type || 'custom',
              description: metadata.description || '',
              active: link.is_active,
              pinned: metadata.pinned || false,
              schedule: link.schedule || null,
              clickCount: 0
            };
          });

          setLinks(loadedLinks);
          setPinnedLinks(loadedLinks.filter(link => link.pinned).map(link => link.id));
        }
      }
    } catch (error) {
      console.error('Error loading page:', error);
    } finally {
      setLoading(false);
    }
  }

  async function checkSlugAvailability(slugValue: string) {
    if (slugValue.length < 3) {
      setSlugAvailable(null);
      return;
    }

    const supabase = createClient();
    const { data, error } = await supabase
      .from('pages')
      .select('slug')
      .eq('slug', slugValue)
      .neq('id', pageId)
      .single();

    if (error && error.code === 'PGRST116') {
      setSlugAvailable(true);
    } else if (data) {
      setSlugAvailable(false);
    } else {
      setSlugAvailable(null);
    }
  }

  function validateUrl(url: string) {
    if (!url) return true;
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }

  function validateForm() {
    if (!slug || !creatorName) {
      return 'Please fill in slug and creator name';
    }

    if (slug.length < 3) {
      return 'Slug must be at least 3 characters';
    }

    if (!/^[a-z0-9-]+$/.test(slug)) {
      return 'Slug can only contain lowercase letters, numbers, and hyphens';
    }

    if (slugAvailable === false) {
      return 'This slug is already taken';
    }

    for (const link of links) {
      if (link.active && link.title.trim() === '') {
        return 'All active links must have a title';
      }

      if (link.active && link.url && !validateUrl(link.url)) {
        return `Invalid URL format for "${link.title || 'untitled link'}"`;
      }
    }

    return null;
  }

  async function handleSave() {
    const validationError = validateForm();
    if (validationError) {
      alert(validationError);
      return;
    }

    setSaving(true);
    const supabase = createClient();

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const pageData = {
        user_id: user.id,
        slug,
        title: creatorName,
        description: tagline,
        bio: JSON.stringify({ category, stats }),
        is_published: isPublished,
        updated_at: new Date().toISOString(),
      };

      let currentPageId = pageId;

      if (pageId) {
        const { error } = await supabase
          .from('pages')
          .update(pageData)
          .eq('id', pageId);

        if (error) throw error;
      } else {
        const { data, error } = await supabase
          .from('pages')
          .insert(pageData)
          .select()
          .single();

        if (error) throw error;
        currentPageId = data.id;
        setPageId(data.id);
      }

      const { error: deleteError } = await supabase
        .from('links')
        .delete()
        .eq('page_id', currentPageId);

      if (deleteError) throw deleteError;

      if (links.length > 0) {
        const linksData = links.map((link, index) => ({
          page_id: currentPageId,
          title: link.title,
          url: link.url,
          icon: getLinkIcon(link.type),
          position: index,
          is_active: link.active,
          metadata: JSON.stringify({}),
          type: link.type,
          description: link.description,
          pinned: pinnedLinks.includes(link.id),
          schedule: link.schedule,
        }));

        const { error: linksError } = await supabase
          .from('links')
          .insert(linksData);

        if (linksError) throw linksError;
      }

      alert('Page saved successfully!');
      router.push('/protected/overview');
    } catch (error: any) {
      console.error('Error saving page:', error);

      if (error.code === '23505') {
        alert('This slug is already taken. Please choose another.');
      } else {
        alert('Failed to save page: ' + error.message);
      }
    } finally {
      setSaving(false);
    }
  }

  const addLink = () => {
    const newLink: Link = {
      id: Date.now(),
      title: '',
      url: '',
      type: 'custom',
      description: '',
      active: true,
      pinned: false,
      schedule: null,
      clickCount: 0
    };
    setLinks([...links, newLink]);
  };

  const updateLink = (id: number, field: keyof Link, value: any) => {
    setLinks(links.map(link => link.id === id ? { ...link, [field]: value } : link));
  };

  const deleteLink = (id: number) => {
    setLinks(links.filter(link => link.id !== id));
    setPinnedLinks(pinnedLinks.filter(pid => pid !== id));
  };

  const togglePin = (id: number) => {
    if (pinnedLinks.includes(id)) {
      setPinnedLinks(pinnedLinks.filter(pid => pid !== id));
    } else {
      setPinnedLinks([...pinnedLinks, id]);
    }
  };

  const toggleLink = (id: number) => {
    setLinks(links.map(link => link.id === id ? { ...link, active: !link.active } : link));
  };

  const getLinkIcon = (type: string) => linkTypes.find(t => t.value === type)?.icon || '🔗';
  const getLinkColor = (type: string) => linkTypes.find(t => t.value === type)?.color || 'text-slate-600';

  const activePinnedLinks = links.filter(l => l.active && pinnedLinks.includes(l.id));
  const activeRegularLinks = links.filter(l => l.active && !pinnedLinks.includes(l.id));

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="w-8 h-8 animate-spin text-blue-500 mx-auto" />
          <p className="text-slate-600">Loading your page...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="rounded-2xl p-3 bg-white border border-slate-200 shadow-sm">
              <Link2 className="w-7 h-7 text-blue-500" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-800">Page Builder</h1>
              <p className="text-slate-600 text-sm mt-1">Create your personalized bio link page</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Publish Toggle */}
            <div className="flex items-center gap-3 bg-white rounded-xl border border-slate-200 px-4 py-3 shadow-sm">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-slate-700">Page Status:</span>
                <Switch
                  checked={isPublished}
                  onCheckedChange={setIsPublished}
                  className="data-[state=checked]:bg-emerald-500"
                />
              </div>
              <Badge className={isPublished ? 'bg-emerald-100 text-emerald-700 border-emerald-200' : 'bg-slate-100 text-slate-600 border-slate-200'}>
                {isPublished ? '● Live' : '○ Draft'}
              </Badge>
            </div>

            <Button
              onClick={handleSave}
              disabled={saving || slugAvailable === false}
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 shadow-sm"
            >
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Save Page
                </>
              )}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Editor Section */}
          <div className="space-y-6">
            {/* Slug Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <Card className="border border-slate-200 bg-white shadow-sm">
                <CardHeader>
                  <CardTitle className="text-slate-800">Your Page URL</CardTitle>
                  <CardDescription className="text-slate-600">Choose a unique URL for your page</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <Label className="text-slate-700 mb-2 block">Page Slug *</Label>
                    <div className="flex items-center gap-2">
                      <span className="text-slate-500 text-sm">linktrim.com/</span>
                      <Input
                        value={slug}
                        onChange={(e) => {
                          const val = e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '');
                          setSlug(val);
                        }}
                        className="bg-white border-slate-300 text-slate-800 placeholder:text-slate-400"
                        placeholder="your-name"
                      />
                    </div>
                    {slugAvailable === false && (
                      <p className="text-red-500 text-xs mt-2 flex items-center gap-1">
                        ❌ This slug is already taken
                      </p>
                    )}
                    {slugAvailable === true && (
                      <p className="text-emerald-500 text-xs mt-2 flex items-center gap-1">
                        ✅ Available!
                      </p>
                    )}
                    {slug && slug.length < 3 && (
                      <p className="text-amber-500 text-xs mt-2">Slug must be at least 3 characters</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Creator Profile Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
            >
              <Card className="border border-slate-200 bg-white shadow-sm">
                <CardHeader>
                  <CardTitle className="text-slate-800">Creator Profile</CardTitle>
                  <CardDescription className="text-slate-600">Tell your audience who you are</CardDescription>
                </CardHeader>
                <CardContent className="space-y-5">
                  <div>
                    <Label className="text-slate-700 mb-2 block">Creator Name *</Label>
                    <Input
                      value={creatorName}
                      onChange={(e) => setCreatorName(e.target.value)}
                      className="bg-white border-slate-300 text-slate-800 placeholder:text-slate-400"
                      placeholder="@yourname"
                    />
                  </div>
                  <div>
                    <Label className="text-slate-700 mb-2 block">Tagline</Label>
                    <Input
                      value={tagline}
                      onChange={(e) => setTagline(e.target.value)}
                      className="bg-white border-slate-300 text-slate-800 placeholder:text-slate-400"
                      placeholder="What do you create?"
                    />
                  </div>
                  <div>
                    <Label className="text-slate-700 mb-2 block">Creator Category</Label>
                    <Select value={category} onValueChange={setCategory}>
                      <SelectTrigger className="bg-white border-slate-300 text-slate-800">
                        <SelectValue placeholder="Select your niche" />
                      </SelectTrigger>
                      <SelectContent className="bg-white border-slate-200">
                        {categories.map(cat => (
                          <SelectItem key={cat.value} value={cat.value} className="text-slate-800">
                            <span className={cat.color.replace('bg-', 'text-').replace('text-', '')}>{cat.icon}</span>
                            <span className="ml-2">{cat.label}</span>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Creator Stats */}
                  <div>
                    <Label className="text-slate-700 mb-3 block">Stats (Optional)</Label>
                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <Label className="text-slate-600 text-xs mb-1 block">Followers</Label>
                        <Input
                          type="number"
                          value={stats.followers}
                          onChange={(e) => setStats({ ...stats, followers: e.target.value })}
                          className="bg-white border-slate-300 text-slate-800 placeholder:text-slate-400"
                          placeholder="0"
                        />
                      </div>
                      <div>
                        <Label className="text-slate-600 text-xs mb-1 block">Views</Label>
                        <Input
                          type="number"
                          value={stats.views}
                          onChange={(e) => setStats({ ...stats, views: e.target.value })}
                          className="bg-white border-slate-300 text-slate-800 placeholder:text-slate-400"
                          placeholder="0"
                        />
                      </div>
                      <div>
                        <Label className="text-slate-600 text-xs mb-1 block">Posts</Label>
                        <Input
                          type="number"
                          value={stats.posts}
                          onChange={(e) => setStats({ ...stats, posts: e.target.value })}
                          className="bg-white border-slate-300 text-slate-800 placeholder:text-slate-400"
                          placeholder="0"
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Links Management */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
            >
              <Card className="border border-slate-200 bg-white shadow-sm">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                  <div>
                    <CardTitle className="text-slate-800">Your Creator Links</CardTitle>
                    <CardDescription className="text-slate-600 mt-1">
                      {links.filter(l => l.active).length} active • {pinnedLinks.length} pinned
                    </CardDescription>
                  </div>
                  <Button
                    onClick={addLink}
                    size="sm"
                    className="bg-blue-500 hover:bg-blue-600 text-white shadow-sm"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Link
                  </Button>
                </CardHeader>
                <CardContent className="space-y-4">
                  <AnimatePresence>
                    {links.map((link) => (
                      <motion.div
                        key={link.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ duration: 0.2 }}
                        className={`p-5 rounded-xl border-2 transition-all ${
                          pinnedLinks.includes(link.id)
                            ? 'border-blue-200 bg-blue-50'
                            : 'border-slate-200 bg-slate-50'
                        }`}
                      >
                        <div className="space-y-4">
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex items-center gap-3 flex-1">
                              <GripVertical className="w-5 h-5 text-slate-400 flex-shrink-0 cursor-move" />
                              <span className={`text-2xl ${getLinkColor(link.type)}`}>{getLinkIcon(link.type)}</span>
                              <Select value={link.type} onValueChange={(val) => updateLink(link.id, 'type', val)}>
                                <SelectTrigger className="w-40 bg-white border-slate-300 text-slate-800 text-sm h-9">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="bg-white border-slate-200">
                                  {linkTypes.map(type => (
                                    <SelectItem key={type.value} value={type.value} className="text-slate-800">
                                      <span className={type.color}>{type.icon}</span>
                                      <span className="ml-2">{type.label}</span>
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="flex items-center gap-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => togglePin(link.id)}
                                className={`${pinnedLinks.includes(link.id) ? 'text-blue-500' : 'text-slate-400'} hover:text-blue-500`}
                              >
                                <Star className="w-4 h-4" fill={pinnedLinks.includes(link.id) ? 'currentColor' : 'none'} />
                              </Button>
                            </div>
                          </div>

                          <div className="space-y-3">
                            <Input
                              value={link.title}
                              onChange={(e) => updateLink(link.id, 'title', e.target.value)}
                              placeholder="Link title"
                              className="bg-white border-slate-300 text-slate-800 placeholder:text-slate-400"
                            />

                            <Input
                              value={link.url}
                              onChange={(e) => updateLink(link.id, 'url', e.target.value)}
                              placeholder="https://example.com"
                              className={`bg-white border-slate-300 text-slate-800 placeholder:text-slate-400 ${
                                link.url && !validateUrl(link.url) ? 'border-red-300' : ''
                              }`}
                            />
                            {link.url && !validateUrl(link.url) && (
                              <p className="text-red-500 text-xs">Please enter a valid URL</p>
                            )}

                            <Textarea
                              value={link.description}
                              onChange={(e) => updateLink(link.id, 'description', e.target.value)}
                              placeholder="Add a description (optional)"
                              className="bg-white border-slate-300 text-slate-800 placeholder:text-slate-400 resize-none"
                              rows={2}
                            />
                          </div>

                          <div className="pt-2 border-t border-slate-200">
                            <ScheduleEditor
                              schedule={link.schedule}
                              onChange={(newSchedule) => updateLink(link.id, 'schedule', newSchedule)}
                            />
                          </div>

                          <div className="flex gap-2 pt-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => toggleLink(link.id)}
                              className={`flex-1 ${link.active ? 'bg-slate-100 border-slate-300 text-slate-800' : 'bg-slate-50 border-slate-200 text-slate-500'}`}
                            >
                              {link.active ? <Eye className="w-4 h-4 mr-2" /> : <EyeOff className="w-4 h-4 mr-2" />}
                              {link.active ? 'Visible' : 'Hidden'}
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => deleteLink(link.id)}
                              className="bg-white border-slate-300 text-red-500 hover:bg-red-50 hover:text-red-600 hover:border-red-300"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>

                  {links.length === 0 && (
                    <div className="text-center py-12 text-slate-500">
                      <div className="w-16 h-16 mx-auto mb-4 bg-slate-100 rounded-full flex items-center justify-center">
                        <Link2 className="w-8 h-8 text-slate-400" />
                      </div>
                      <p className="text-sm">No links added yet. Click "Add Link" to get started!</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Live Preview */}
          <div className="lg:sticky lg:top-8 lg:h-fit">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.3 }}
            >
              <div className="mb-4">
                <h2 className="text-lg font-semibold text-slate-800 mb-2">Live Preview</h2>
                <p className="text-sm text-slate-600">See how your page will look to visitors</p>
              </div>

              {/* Preview Card */}
              <div className="bg-gradient-to-br from-white to-slate-50 rounded-2xl p-1 border-2 border-slate-200 shadow-lg">
                <div className="bg-white rounded-xl p-6 space-y-4">
                  {/* Header */}
                  <div className="text-center space-y-3 pb-5 border-b border-slate-200">
                    <div className="w-20 h-20 mx-auto bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-2xl text-white font-bold">
                      {creatorName.charAt(0) || '?'}
                    </div>
                    <h2 className="text-2xl font-bold text-slate-800">{creatorName || 'Creator Name'}</h2>
                    <p className="text-slate-600 text-sm">{tagline || 'Your creative tagline'}</p>
                    {category && (
                      <Badge className={categories.find(c => c.value === category)?.color}>
                        {categories.find(c => c.value === category)?.icon} {categories.find(c => c.value === category)?.label}
                      </Badge>
                    )}
                  </div>

                  {/* Stats */}
                  {(stats.followers || stats.views || stats.posts) && (
                    <div className="grid grid-cols-3 gap-3 py-4">
                      {stats.followers && (
                        <div className="text-center p-3 bg-slate-50 rounded-lg border border-slate-200">
                          <p className="text-xl font-bold text-slate-800">{stats.followers}</p>
                          <p className="text-xs text-slate-500 mt-1">Followers</p>
                        </div>
                      )}
                      {stats.views && (
                        <div className="text-center p-3 bg-slate-50 rounded-lg border border-slate-200">
                          <p className="text-xl font-bold text-slate-800">{stats.views}</p>
                          <p className="text-xs text-slate-500 mt-1">Views</p>
                        </div>
                      )}
                      {stats.posts && (
                        <div className="text-center p-3 bg-slate-50 rounded-lg border border-slate-200">
                          <p className="text-xl font-bold text-slate-800">{stats.posts}</p>
                          <p className="text-xs text-slate-500 mt-1">Posts</p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Pinned Links */}
                  {activePinnedLinks.length > 0 && (
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 px-2">
                        <Star className="w-4 h-4 text-blue-500" fill="currentColor" />
                        <p className="text-xs font-semibold text-slate-700 uppercase tracking-wide">Featured</p>
                      </div>
                      {activePinnedLinks.map(link => (
                        <div
                          key={link.id}
                          className="p-4 rounded-xl bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200 hover:border-blue-300 transition-all cursor-pointer group"
                        >
                          <div className="flex items-start gap-3">
                            <span className={`text-xl ${getLinkColor(link.type)}`}>{getLinkIcon(link.type)}</span>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-slate-800 truncate group-hover:text-blue-600 transition-colors">
                                {link.title || 'Untitled Link'}
                              </p>
                              {link.description && (
                                <p className="text-xs text-slate-600 line-clamp-1 mt-1">{link.description}</p>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Regular Links */}
                  {activeRegularLinks.length > 0 && (
                    <div className="space-y-2 pt-2">
                      {activeRegularLinks.map(link => (
                        <div
                          key={link.id}
                          className="p-4 rounded-xl bg-slate-50 border-2 border-slate-200 hover:border-slate-300 hover:bg-white transition-all cursor-pointer group"
                        >
                          <div className="flex items-start gap-3">
                            <span className={`text-xl ${getLinkColor(link.type)}`}>{getLinkIcon(link.type)}</span>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-slate-800 truncate group-hover:text-blue-600 transition-colors">
                                {link.title || 'Untitled Link'}
                              </p>
                              {link.description && (
                                <p className="text-xs text-slate-600 line-clamp-1 mt-1">{link.description}</p>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Empty State */}
                  {activeRegularLinks.length === 0 && activePinnedLinks.length === 0 && (
                    <div className="text-center py-12 text-slate-400">
                      <div className="w-12 h-12 mx-auto mb-3 bg-slate-100 rounded-full flex items-center justify-center">
                        <Link2 className="w-6 h-6 text-slate-400" />
                      </div>
                      <p className="text-sm">Your links will appear here</p>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}