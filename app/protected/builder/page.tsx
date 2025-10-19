'use client'
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Eye, EyeOff, GripVertical, Star, TrendingUp, Zap, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

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

export default function builder() {
  const [links, setLinks] = useState([]);
  const [creatorName, setCreatorName] = useState('');
  const [tagline, setTagline] = useState('');
  const [category, setCategory] = useState('');
  const [stats, setStats] = useState({ followers: '', views: '', posts: '' });
  const [pinnedLinks, setPinnedLinks] = useState([]);

  const addLink = () => {
    const newLink = {
      id: Date.now(),
      title: '',
      url: '',
      type: 'custom',
      description: '',
      active: true,
      pinned: false,
      clickCount: 0
    };
    setLinks([...links, newLink]);
  };

  const updateLink = (id, field, value) => {
    setLinks(links.map(link => link.id === id ? { ...link, [field]: value } : link));
  };

  const deleteLink = (id) => {
    setLinks(links.filter(link => link.id !== id));
  };

  const togglePin = (id) => {
    if (pinnedLinks.includes(id)) {
      setPinnedLinks(pinnedLinks.filter(pid => pid !== id));
    } else {
      setPinnedLinks([...pinnedLinks, id]);
    }
    updateLink(id, 'pinned', !pinnedLinks.includes(id));
  };

  const toggleLink = (id) => {
    setLinks(links.map(link => link.id === id ? { ...link, active: !link.active } : link));
  };

  const getLinkIcon = (type) => linkTypes.find(t => t.value === type)?.icon || '🔗';

  const activePinnedLinks = links.filter(l => l.active && pinnedLinks.includes(l.id));
  const activeRegularLinks = links.filter(l => l.active && !pinnedLinks.includes(l.id));

  return (
    <div className="min-h-screen bg-neutral-950 pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main Editor */}
        <div className="lg:col-span-2 space-y-6">
          {/* Creator Profile Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <Card className="bg-neutral-900 border-neutral-800">
              <CardHeader>
                <CardTitle className="text-neutral-100">Creator Profile</CardTitle>
                <CardDescription className="text-neutral-400">Make your presence known</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-neutral-300">Creator Name</Label>
                  <Input
                    value={creatorName}
                    onChange={(e) => setCreatorName(e.target.value)}
                    className="bg-neutral-800 border-neutral-700 text-neutral-100 mt-2 placeholder:text-neutral-600"
                    placeholder="@yourname"
                  />
                </div>
                <div>
                  <Label className="text-neutral-300">Tagline</Label>
                  <Input
                    value={tagline}
                    onChange={(e) => setTagline(e.target.value)}
                    className="bg-neutral-800 border-neutral-700 text-neutral-100 mt-2 placeholder:text-neutral-600"
                    placeholder="What do you create?"
                  />
                </div>
                <div>
                  <Label className="text-neutral-300">Creator Category</Label>
                  <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger className="bg-neutral-800 border-neutral-700 text-neutral-100 mt-2">
                      <SelectValue placeholder="Select your niche" />
                    </SelectTrigger>
                    <SelectContent className="bg-neutral-800 border-neutral-700">
                      <SelectItem value="music" className="text-neutral-100">🎵 Music Producer</SelectItem>
                      <SelectItem value="gaming" className="text-neutral-100">🎮 Gaming/Streamer</SelectItem>
                      <SelectItem value="art" className="text-neutral-100">🎨 Artist/Designer</SelectItem>
                      <SelectItem value="writing" className="text-neutral-100">✍️ Writer/Author</SelectItem>
                      <SelectItem value="fitness" className="text-neutral-100">💪 Fitness Coach</SelectItem>
                      <SelectItem value="education" className="text-neutral-100">📚 Educator</SelectItem>
                      <SelectItem value="photography" className="text-neutral-100">📸 Photographer</SelectItem>
                      <SelectItem value="other" className="text-neutral-100">🌟 Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

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
        </div>

        {/* Live Preview - Creator Style */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="lg:col-span-2"
        >
          <div className="sticky top-24">
            {/* Header Card */}
            <Card className="bg-neutral-900 border-neutral-800 mb-4">
              <CardContent className="pt-6">
                <div className="text-center space-y-3 pb-4 border-b border-neutral-800">
                  <h2 className="text-2xl font-bold text-neutral-100">{creatorName || 'Creator Name'}</h2>
                  <p className="text-neutral-400">{tagline || 'Your creative tagline'}</p>
                  {category && (
                    <p className="text-sm text-neutral-500">{linkTypes.find(t => t.value === category)?.icon} {category.charAt(0).toUpperCase() + category.slice(1)}</p>
                  )}
                </div>

                {/* Creator Stats */}
                {(stats.followers || stats.views || stats.posts) && (
                  <div className="grid grid-cols-3 gap-2 pt-4 mb-4">
                    {stats.followers && (
                      <div className="text-center">
                        <p className="text-lg font-bold text-neutral-100">{stats.followers}</p>
                        <p className="text-xs text-neutral-500">Followers</p>
                      </div>
                    )}
                    {stats.views && (
                      <div className="text-center">
                        <p className="text-lg font-bold text-neutral-100">{stats.views}</p>
                        <p className="text-xs text-neutral-500">Views</p>
                      </div>
                    )}
                    {stats.posts && (
                      <div className="text-center">
                        <p className="text-lg font-bold text-neutral-100">{stats.posts}</p>
                        <p className="text-xs text-neutral-500">Content</p>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Pinned Links */}
            {activePinnedLinks.length > 0 && (
              <Card className="bg-neutral-900 border-neutral-800 mb-4">
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-2">
                    <Star className="w-4 h-4 text-neutral-400" fill="currentColor" />
                    <CardTitle className="text-sm text-neutral-300">Featured</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-2">
                  {activePinnedLinks.map(link => (
                    <a
                      key={link.id}
                      href={link.url || '#'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block p-3 rounded-lg bg-neutral-800 border border-neutral-700 hover:bg-neutral-700 transition-all group"
                    >
                      <div className="flex items-start gap-2">
                        <span className="text-xl">{getLinkIcon(link.type)}</span>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-neutral-100 truncate">{link.title}</p>
                          {link.description && <p className="text-xs text-neutral-500 line-clamp-1">{link.description}</p>}
                        </div>
                      </div>
                    </a>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* Regular Links */}
            {activeRegularLinks.length > 0 && (
              <Card className="bg-neutral-900 border-neutral-800">
                <CardContent className="pt-6 space-y-2">
                  {activeRegularLinks.map(link => (
                    <a
                      key={link.id}
                      href={link.url || '#'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block p-3 rounded-lg bg-neutral-800 border border-neutral-700 hover:bg-neutral-700 transition-all"
                    >
                      <div className="flex items-start gap-2">
                        <span className="text-xl">{getLinkIcon(link.type)}</span>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-neutral-100 truncate">{link.title}</p>
                          {link.description && <p className="text-xs text-neutral-500 line-clamp-1">{link.description}</p>}
                        </div>
                      </div>
                    </a>
                  ))}
                </CardContent>
              </Card>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}