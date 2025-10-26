'use client'
<<<<<<< HEAD
import { useState, useEffect } from 'react';
import {motion , AnimatePresence } from 'framer-motion'

import { Plus, Trash2, Eye, EyeOff, GripVertical, Star, Save, Loader2, ArrowLeft } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Label } from '@/app/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/app/components/ui/select';
import { Textarea } from '@/app/components/ui/textarea';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { ScheduleEditor } from '@/app/components/linkScheduleEditor';


=======
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Eye, EyeOff, GripVertical, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
>>>>>>> 59c4acd742833a567c3817b01f237bc2978a0525

interface Link {
  id: number;
  title: string;
  url: string;
  type: string;
  description: string;
  active: boolean;
  pinned: boolean;
  clickCount: number;
}

const linkTypes = [
  { value: 'featured', label: 'Featured Work', icon: '⭐' },
  { value: 'portfolio', label: 'Portfolio', icon: '🎨' },
  { value: 'shop', label: 'Shop/Products', icon: '🛍️' },
  { value: 'content', label: 'Latest Content', icon: '📺' },
  { value: 'collab', label: 'Collaboration', icon: '🤝' },
  { value: 'community', label: 'Community', icon: '👥' },
  { value: 'support', label: 'Support/Donate', icon: '❤️' },
  { value: 'custom', label: 'Custom', icon: '🔗' },
];

<<<<<<< HEAD
const categories = [
  { value: 'music', label: 'Music Producer', icon: '🎵' },
  { value: 'gaming', label: 'Gaming/Streamer', icon: '🎮' },
  { value: 'art', label: 'Artist/Designer', icon: '🎨' },
  { value: 'writing', label: 'Writer/Author', icon: '✍️' },
  { value: 'fitness', label: 'Fitness Coach', icon: '💪' },
  { value: 'education', label: 'Educator', icon: '📚' },
  { value: 'photography', label: 'Photographer', icon: '📸' },
  { value: 'other', label: 'Other', icon: '🌟' },
];

export default function Builder() {
  const router = useRouter();
  const [links, setLinks] = useState([]);
  const [slug, setSlug] = useState('');
=======
export default function Builder() {
  const [links, setLinks] = useState<Link[]>([]);
>>>>>>> 59c4acd742833a567c3817b01f237bc2978a0525
  const [creatorName, setCreatorName] = useState('');
  const [tagline, setTagline] = useState('');
  const [category, setCategory] = useState('');
  const [stats, setStats] = useState({ followers: '', views: '', posts: '' });
<<<<<<< HEAD
  const [pinnedLinks, setPinnedLinks] = useState([]);
  const [saving, setSaving] = useState(false);
  const [slugAvailable, setSlugAvailable] = useState(null);
  const [pageId, setPageId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isPublished,setIsPublished] = useState(false);


  

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
        

      if (pageError && pageError.code !== 'PGRST116') { // PGRST116 = no rows
        console.error('Error loading page:', pageError);
        return;
      }

      if (pageData) {
        setPageId(pageData.id);
        setSlug(pageData.slug);
        setCreatorName(pageData.title);
        setTagline(pageData.description);
        setIsPublished(pageData.is_published||false);
        
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
              schedule:link.schedule || null,
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

  async function checkSlugAvailability(slugValue) {
    if (slugValue.length < 3) {
      setSlugAvailable(null);
      return;
    }
    
    const supabase = createClient();
    const { data, error } = await supabase
      .from('pages')
      .select('slug')
      .eq('slug', slugValue)
      .neq('id', pageId) // Exclude current page when checking
      .single();
    
    if (error && error.code === 'PGRST116') { // No rows found
      setSlugAvailable(true);
    } else if (data) {
      setSlugAvailable(false);
    } else {
      setSlugAvailable(null);
    }
  }

  function validateUrl(url) {
    if (!url) return true; // Allow empty for draft
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

    // Validate links
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

      // Save or update page
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
        // Update existing page
        const { error } = await supabase
          .from('pages')
          .update(pageData)
          .eq('id', pageId);
        
        if (error) throw error;
      } else {
        // Create new page
        const { data, error } = await supabase
          .from('pages')
          .insert(pageData)
          .select()
          .single();
        
        if (error) throw error;
        currentPageId = data.id;
        setPageId(data.id);
      }

      // Delete existing links for this page
      const { error: deleteError } = await supabase
        .from('links')
        .delete()
        .eq('page_id', currentPageId);

      if (deleteError) throw deleteError;

      // Insert new links
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
          schedule:link.schedule,
        }));

        const { error: linksError } = await supabase
          .from('links')
          .insert(linksData);
        
        if (linksError) throw linksError;
      }

      alert('Page saved successfully!');
      router.push('/protected/overview');
    } catch (error) {
      console.error('Error saving page:', error);
      
      if (error.code === '23505') { // Unique constraint violation
        alert('This slug is already taken. Please choose another.');
      } else {
        alert('Failed to save page: ' + error.message);
      }
    } finally {
      setSaving(false);
    }
  }

  const addLink = () => {
    const newLink = {
      id: crypto.randomUUID(), 
=======
  const [pinnedLinks, setPinnedLinks] = useState<number[]>([]);

  const addLink = () => {
    const newLink: Link = {
      id: Date.now(),
>>>>>>> 59c4acd742833a567c3817b01f237bc2978a0525
      title: '',
      url: '',
      type: 'custom',
      description: '',
      active: true,
      pinned: false,
      schedule:null,
    };
    setLinks([...links, newLink]);
  };

  const updateLink = (id: number, field: keyof Link, value: string | boolean) => {
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

  const activePinnedLinks = links.filter(l => l.active && pinnedLinks.includes(l.id));
  const activeRegularLinks = links.filter(l => l.active && !pinnedLinks.includes(l.id));

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-950 flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="w-8 h-8 animate-spin text-blue-500 mx-auto" />
          <p className="text-neutral-400">Loading your page...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-950 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex items-center">
          <div className="flex items-center gap-4">
            <div className='mr-[610px]'>
              <h1 className="text-3xl font-bold text-neutral-50">Page Builder</h1>
              <p className="text-neutral-400 text-sm mt-1">Create your personalized bio link page</p>
            </div>
          </div>


          
          <div className="flex items-center gap-5 mr-10">
            {/* Publish Toggle */}
            <div className="flex items-center gap-2">
              <label className="text-sm text-neutral-400">Page Status:</label>
              <button
                onClick={() => setIsPublished(!isPublished)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  isPublished ? 'bg-green-500' : 'bg-neutral-700'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    isPublished ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
              <span className={`text-sm font-medium ${isPublished ? 'text-green-400' : 'text-neutral-400'}`}>
                {isPublished ? 'Live' : 'Draft'}
              </span>
            </div>
           
          </div>

          <Button
            onClick={handleSave}
            disabled={saving || slugAvailable === false}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6"
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

<<<<<<< HEAD
            
          
=======
                {/* Creator Stats */}
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <Label className="text-neutral-400 text-xs">Followers</Label>
                    <Input
                      type="number"
                      value={stats.followers}
                      onChange={(e) => setStats({...stats, followers: e.target.value})}
                      className="bg-neutral-800 border-neutral-700 text-neutral-100 mt-1 placeholder:text-neutral-600"
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <Label className="text-neutral-400 text-xs">Monthly Views</Label>
                    <Input
                      type="number"
                      value={stats.views}
                      onChange={(e) => setStats({...stats, views: e.target.value})}
                      className="bg-neutral-800 border-neutral-700 text-neutral-100 mt-1 placeholder:text-neutral-600"
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <Label className="text-neutral-400 text-xs">Posts/Content</Label>
                    <Input
                      type="number"
                      value={stats.posts}
                      onChange={(e) => setStats({...stats, posts: e.target.value})}
                      className="bg-neutral-800 border-neutral-700 text-neutral-100 mt-1 placeholder:text-neutral-600"
                      placeholder="0"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Links Management */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <Card className="bg-neutral-900 border-neutral-800">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-neutral-100">Your Creator Links</CardTitle>
                  <CardDescription className="text-neutral-400">{links.filter(l => l.active).length} active • {pinnedLinks.length} pinned</CardDescription>
                </div>
                <Button
                  onClick={addLink}
                  className="bg-neutral-700 hover:bg-neutral-600 text-neutral-50"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Link
                </Button>
              </CardHeader>
              <CardContent className="space-y-3">
                <AnimatePresence>
                  {links.map((link) => (
                    <motion.div
                      key={link.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ duration: 0.2 }}
                      className={`p-4 rounded-lg border transition-all ${
                        pinnedLinks.includes(link.id)
                          ? 'border-neutral-600 bg-neutral-800'
                          : 'border-neutral-700 bg-neutral-800/50'
                      }`}
                    >
                      <div className="space-y-3">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-2 flex-1">
                            <GripVertical className="w-4 h-4 text-neutral-500 flex-shrink-0 mt-1" />
                            <span className="text-2xl">{getLinkIcon(link.type)}</span>
                            <Select value={link.type} onValueChange={(val) => updateLink(link.id, 'type', val)}>
                              <SelectTrigger className="w-32 bg-neutral-700 border-neutral-600 text-neutral-100 text-sm">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent className="bg-neutral-800 border-neutral-700">
                                {linkTypes.map(type => (
                                  <SelectItem key={type.value} value={type.value} className="text-neutral-100">
                                    {type.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => togglePin(link.id)}
                            className={`${pinnedLinks.includes(link.id) ? 'text-neutral-100' : 'text-neutral-500'}`}
                          >
                            <Star className="w-4 h-4" fill={pinnedLinks.includes(link.id) ? 'currentColor' : 'none'} />
                          </Button>
                        </div>

                        <Input
                          value={link.title}
                          onChange={(e) => updateLink(link.id, 'title', e.target.value)}
                          placeholder="Link title"
                          className="bg-neutral-700 border-neutral-600 text-neutral-100 placeholder:text-neutral-500"
                        />

                        <Input
                          value={link.url}
                          onChange={(e) => updateLink(link.id, 'url', e.target.value)}
                          placeholder="https://example.com"
                          className="bg-neutral-700 border-neutral-600 text-neutral-100 placeholder:text-neutral-500"
                        />

                        <Textarea
                          value={link.description}
                          onChange={(e) => updateLink(link.id, 'description', e.target.value)}
                          placeholder="Add a description (optional)"
                          className="bg-neutral-700 border-neutral-600 text-neutral-100 placeholder:text-neutral-500 resize-none"
                          rows={2}
                        />

                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => toggleLink(link.id)}
                            className={`flex-1 ${link.active ? 'bg-neutral-700 border-neutral-600 text-neutral-100' : 'bg-neutral-800 border-neutral-700 text-neutral-400'}`}
                          >
                            {link.active ? <Eye className="w-4 h-4 mr-1" /> : <EyeOff className="w-4 h-4 mr-1" />}
                            {link.active ? 'Visible' : 'Hidden'}
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => deleteLink(link.id)}
                            className="bg-neutral-800 border-neutral-700 text-neutral-400 hover:bg-neutral-700 hover:text-neutral-200"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </CardContent>
            </Card>
          </motion.div>
>>>>>>> 59c4acd742833a567c3817b01f237bc2978a0525
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
              <Card className="bg-neutral-900 border-neutral-800">
                <CardHeader>
                  <CardTitle className="text-neutral-100">Your Page URL</CardTitle>
                  <CardDescription className="text-neutral-400">Choose a unique URL for your page</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <Label className="text-neutral-300 mb-2 block">Page Slug *</Label>
                    <div className="flex items-center gap-2">
                      <span className="text-neutral-500 text-sm">yoursite.com/</span>
                      <Input
                        value={slug}
                        onChange={(e) => {
                          const val = e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '');
                          setSlug(val);
                        }}
                        className="bg-neutral-800 border-neutral-700 text-neutral-100 placeholder:text-neutral-600"
                        placeholder="your-name"
                      />
                    </div>
                    {slugAvailable === false && (
                      <p className="text-red-400 text-xs mt-2">❌ This slug is already taken</p>
                    )}
                    {slugAvailable === true && (
                      <p className="text-green-400 text-xs mt-2">✅ Available!</p>
                    )}
                    {slug && slug.length < 3 && (
                      <p className="text-yellow-400 text-xs mt-2">Slug must be at least 3 characters</p>
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
              <Card className="bg-neutral-900 border-neutral-800">
                <CardHeader>
                  <CardTitle className="text-neutral-100">Creator Profile</CardTitle>
                  <CardDescription className="text-neutral-400">Tell your audience who you are</CardDescription>
                </CardHeader>
                <CardContent className="space-y-5">
                  <div>
                    <Label className="text-neutral-300 mb-2 block">Creator Name *</Label>
                    <Input
                      value={creatorName}
                      onChange={(e) => setCreatorName(e.target.value)}
                      className="bg-neutral-800 border-neutral-700 text-neutral-100 placeholder:text-neutral-600"
                      placeholder="@yourname"
                    />
                  </div>
                  <div>
                    <Label className="text-neutral-300 mb-2 block">Tagline</Label>
                    <Input
                      value={tagline}
                      onChange={(e) => setTagline(e.target.value)}
                      className="bg-neutral-800 border-neutral-700 text-neutral-100 placeholder:text-neutral-600"
                      placeholder="What do you create?"
                    />
                  </div>
                  <div>
                    <Label className="text-neutral-300 mb-2 block">Creator Category</Label>
                    <Select value={category} onValueChange={setCategory}>
                      <SelectTrigger className="bg-neutral-800 border-neutral-700 text-neutral-100">
                        <SelectValue placeholder="Select your niche" />
                      </SelectTrigger>
                      <SelectContent className="bg-neutral-800 border-neutral-700">
                        {categories.map(cat => (
                          <SelectItem key={cat.value} value={cat.value} className="text-neutral-100">
                            {cat.icon} {cat.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Creator Stats */}
                  <div>
                    <Label className="text-neutral-300 mb-3 block">Stats (Optional)</Label>
                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <Label className="text-neutral-400 text-xs mb-1 block">Followers</Label>
                        <Input
                          type="number"
                          value={stats.followers}
                          onChange={(e) => setStats({...stats, followers: e.target.value})}
                          className="bg-neutral-800 border-neutral-700 text-neutral-100 placeholder:text-neutral-600"
                          placeholder="0"
                        />
                      </div>
                      <div>
                        <Label className="text-neutral-400 text-xs mb-1 block">Views</Label>
                        <Input
                          type="number"
                          value={stats.views}
                          onChange={(e) => setStats({...stats, views: e.target.value})}
                          className="bg-neutral-800 border-neutral-700 text-neutral-100 placeholder:text-neutral-600"
                          placeholder="0"
                        />
                      </div>
                      <div>
                        <Label className="text-neutral-400 text-xs mb-1 block">Posts</Label>
                        <Input
                          type="number"
                          value={stats.posts}
                          onChange={(e) => setStats({...stats, posts: e.target.value})}
                          className="bg-neutral-800 border-neutral-700 text-neutral-100 placeholder:text-neutral-600"
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
              <Card className="bg-neutral-900 border-neutral-800">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                  <div>
                    <CardTitle className="text-neutral-100">Your Creator Links</CardTitle>
                    <CardDescription className="text-neutral-400 mt-1">
                      {links.filter(l => l.active).length} active • {pinnedLinks.length} pinned
                    </CardDescription>
                  </div>
                  <Button
                    onClick={addLink}
                    size="sm"
                    className="bg-neutral-700 hover:bg-neutral-600 text-neutral-50"
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
                        className={`p-5 rounded-lg border transition-all ${
                          pinnedLinks.includes(link.id)
                            ? 'border-blue-600/50 bg-blue-950/20'
                            : 'border-neutral-700 bg-neutral-800/50'
                        }`}
                      >
                        <div className="space-y-4">
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex items-center gap-3 flex-1">
                              <GripVertical className="w-5 h-5 text-neutral-500 flex-shrink-0 cursor-move" />
                              <span className="text-2xl">{getLinkIcon(link.type)}</span>
                              <Select value={link.type} onValueChange={(val) => updateLink(link.id, 'type', val)}>
                                <SelectTrigger className="w-40 bg-neutral-700 border-neutral-600 text-neutral-100 text-sm h-9">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="bg-neutral-800 border-neutral-700">
                                  {linkTypes.map(type => (
                                    <SelectItem key={type.value} value={type.value} className="text-neutral-100">
                                      {type.icon} {type.label}
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
                                className={`${pinnedLinks.includes(link.id) ? 'text-blue-400' : 'text-neutral-500'} hover:text-blue-400`}
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
                              className="bg-neutral-700 border-neutral-600 text-neutral-100 placeholder:text-neutral-500"
                            />
                            
                            <Input
                              value={link.url}
                              onChange={(e) => updateLink(link.id, 'url', e.target.value)}
                              placeholder="https://example.com"
                              className={`bg-neutral-700 border-neutral-600 text-neutral-100 placeholder:text-neutral-500 ${
                                link.url && !validateUrl(link.url) ? 'border-red-500' : ''
                              }`}
                            />
                            {link.url && !validateUrl(link.url) && (
                              <p className="text-red-400 text-xs">Please enter a valid URL</p>
                            )}

                            <Textarea
                              value={link.description}
                              onChange={(e) => updateLink(link.id, 'description', e.target.value)}
                              placeholder="Add a description (optional)"
                              className="bg-neutral-700 border-neutral-600 text-neutral-100 placeholder:text-neutral-500 resize-none"
                              rows={2}
                            />


                          </div>
                          
                          <div className="pt-2 border-t border-neutral-700">

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
                              className={`flex-1 ${link.active ? 'bg-neutral-700 border-neutral-600 text-neutral-100' : 'bg-neutral-800 border-neutral-700 text-neutral-400'}`}
                            >
                              {link.active ? <Eye className="w-4 h-4 mr-2" /> : <EyeOff className="w-4 h-4 mr-2" />}
                              {link.active ? 'Visible' : 'Hidden'}
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => deleteLink(link.id)}
                              className="bg-neutral-800 border-neutral-700 text-red-400 hover:bg-red-950/30 hover:text-red-300 hover:border-red-700"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>

                  {links.length === 0 && (
                    <div className="text-center py-12 text-neutral-500">
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
                <h2 className="text-lg font-semibold text-neutral-100 mb-2">Live Preview</h2>
                <p className="text-sm text-neutral-400">See how your page will look</p>
              </div>

              {/* Preview Card */}
              <div className="bg-gradient-to-br from-neutral-900 to-neutral-950 rounded-2xl p-1 border border-neutral-800">
                <div className="bg-neutral-950 rounded-xl p-6 space-y-4">
                  {/* Header */}
                  <div className="text-center space-y-3 pb-5 border-b border-neutral-800">
                    <div className="w-20 h-20 mx-auto bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-2xl">
                      {creatorName.charAt(0) || '?'}
                    </div>
                    <h2 className="text-2xl font-bold text-neutral-100">{creatorName || 'Creator Name'}</h2>
                    <p className="text-neutral-400 text-sm">{tagline || 'Your creative tagline'}</p>
                    {category && (
                      <div className="inline-block px-3 py-1 bg-neutral-800 rounded-full text-xs text-neutral-300">
                        {categories.find(c => c.value === category)?.icon} {categories.find(c => c.value === category)?.label}
                      </div>
                    )}
                  </div>

                  {/* Stats */}
                  {(stats.followers || stats.views || stats.posts) && (
                    <div className="grid grid-cols-3 gap-3 py-4">
                      {stats.followers && (
                        <div className="text-center p-3 bg-neutral-900 rounded-lg">
                          <p className="text-xl font-bold text-neutral-100">{stats.followers}</p>
                          <p className="text-xs text-neutral-500 mt-1">Followers</p>
                        </div>
                      )}
                      {stats.views && (
                        <div className="text-center p-3 bg-neutral-900 rounded-lg">
                          <p className="text-xl font-bold text-neutral-100">{stats.views}</p>
                          <p className="text-xs text-neutral-500 mt-1">Views</p>
                        </div>
                      )}
                      {stats.posts && (
                        <div className="text-center p-3 bg-neutral-900 rounded-lg">
                          <p className="text-xl font-bold text-neutral-100">{stats.posts}</p>
                          <p className="text-xs text-neutral-500 mt-1">Posts</p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Pinned Links */}
                  {activePinnedLinks.length > 0 && (
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 px-2">
                        <Star className="w-4 h-4 text-blue-400" fill="currentColor" />
                        <p className="text-xs font-semibold text-neutral-300 uppercase tracking-wide">Featured</p>
                      </div>
                      {activePinnedLinks.map(link => (
                        <div
                          key={link.id}
                          className="p-4 rounded-xl bg-gradient-to-r from-blue-950/30 to-purple-950/30 border border-blue-800/30 hover:border-blue-600/50 transition-all cursor-pointer group"
                        >
                          <div className="flex items-start gap-3">
                            <span className="text-xl">{getLinkIcon(link.type)}</span>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-neutral-100 truncate group-hover:text-blue-400 transition-colors">
                                {link.title || 'Untitled Link'}
                              </p>
                              {link.description && (
                                <p className="text-xs text-neutral-500 line-clamp-1 mt-1">{link.description}</p>
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
                          className="p-4 rounded-xl bg-neutral-900 border border-neutral-800 hover:border-neutral-700 hover:bg-neutral-800 transition-all cursor-pointer group"
                        >
                          <div className="flex items-start gap-3">
                            <span className="text-xl">{getLinkIcon(link.type)}</span>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-neutral-100 truncate group-hover:text-blue-400 transition-colors">
                                {link.title || 'Untitled Link'}
                              </p>
                              {link.description && (
                                <p className="text-xs text-neutral-500 line-clamp-1 mt-1">{link.description}</p>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Empty State */}
                  {activeRegularLinks.length === 0 && activePinnedLinks.length === 0 && (
                    <div className="text-center py-12 text-neutral-600">
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
