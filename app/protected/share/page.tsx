'use client'
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { Copy, Check, Twitter, Linkedin, Mail, Link as LinkIcon, Loader2, Share2, Eye, MousePointerClick, Users } from "lucide-react";
import { createClient } from '@/lib/supabase/client';

interface ShareStats {
  totalViews: number;
  totalClicks: number;
  uniqueVisitors: number;
}

export default function SharePage() {
  const [copied, setCopied] = useState(false);
  const [pageSlug, setPageSlug] = useState('');
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<ShareStats>({
    totalViews: 0,
    totalClicks: 0,
    uniqueVisitors: 0
  });

  useEffect(() => {
    loadPageData();
  }, []);

  async function loadPageData() {
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        setLoading(false);
        return;
      }

      // Get user's page
      const { data: pageData, error: pageError } = await supabase
        .from('pages')
        .select('id, slug, total_views, total_clicks')
        .eq('user_id', user.id)
        .single();

      if (pageError) {
        console.error('Error loading page:', pageError);
        setLoading(false);
        return;
      }

      if (pageData) {
        setPageSlug(pageData.slug);

        // Get unique visitors count from page_views
        const { data: viewsData, error: viewsError } = await supabase
          .from('page_views')
          .select('id')
          .eq('page_id', pageData.id);

        const uniqueVisitors = viewsData ? viewsData.length : 0;

        setStats({
          totalViews: pageData.total_views || 0,
          totalClicks: pageData.total_clicks || 0,
          uniqueVisitors
        });
      }
    } catch (error) {
      console.error('Error loading page data:', error);
    } finally {
      setLoading(false);
    }
  }

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Generate the proper URL for sharing
  const getProperUrl = () => {
    if (process.env.NEXT_PUBLIC_APP_URL) {
      return `${process.env.NEXT_PUBLIC_APP_URL}/${pageSlug}`;
    }
    return `${window.location.origin}/${pageSlug}`;
  };

  const pageUrl = pageSlug ? getProperUrl() : '';

  const shareOptions = [
    { 
      name: "Twitter", 
      icon: Twitter, 
      color: "bg-blue-500 hover:bg-blue-600",
      action: () => {
        const shareUrl = getProperUrl();
        window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=Check%20out%20my%20page`, "_blank");
      }
    },
    { 
      name: "LinkedIn", 
      icon: Linkedin, 
      color: "bg-blue-700 hover:bg-blue-800",
      action: () => {
        const shareUrl = getProperUrl();
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`, "_blank");
      }
    },
    { 
      name: "Email", 
      icon: Mail, 
      color: "bg-red-500 hover:bg-red-600",
      action: () => {
        const shareUrl = getProperUrl();
        window.location.href = `mailto:?subject=Check%20out%20my%20page&body=${encodeURIComponent(shareUrl)}`;
      }
    },
    { 
      name: "Copy Link", 
      icon: Copy, 
      color: "bg-gray-600 hover:bg-gray-700",
      action: () => {
        const shareUrl = getProperUrl();
        handleCopy(shareUrl);
      }
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <Loader2 className="w-8 h-8 text-slate-400 animate-spin" />
        </motion.div>
      </div>
    );
  }

  if (!pageSlug) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="p-8"
      >
        <div className="bg-card rounded-xl border border-border p-8 text-center shadow-sm">
          <h2 className="text-xl font-bold text-foreground mb-2">No Page Found</h2>
          <p className="text-muted-foreground">Create a page first to share it with your audience.</p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="p-6 md:p-8"
    >
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-foreground flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-100">
              <Share2 className="w-6 h-6 text-blue-600" />
            </div>
            Share Your Page
          </h1>
          <p className="text-muted-foreground mt-2">Get your unique link and share with the world</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Share Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-2 bg-card rounded-xl border border-border p-6 shadow-sm"
          >
            {/* URL Section */}
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">Your Page URL</label>
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={pageUrl}
                    readOnly
                    className="flex-1 bg-muted border border-border rounded-lg px-4 py-3 text-foreground font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <motion.button
                    onClick={() => handleCopy(pageUrl)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`px-4 py-3 rounded-lg font-medium transition-colors flex items-center gap-2 ${
                      copied
                        ? "bg-green-500 text-white"
                        : "bg-blue-600 text-white hover:bg-blue-700"
                    }`}
                  >
                    {copied ? (
                      <>
                        <Check size={18} />
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy size={18} />
                        <span>Copy</span>
                      </>
                    )}
                  </motion.button>
                </div>
              </div>
            </div>

            {/* Share Buttons */}
            <div className="pt-6 space-y-4">
              <h3 className="font-semibold text-foreground text-lg">Share On</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {shareOptions.map((option, idx) => {
                  const Icon = option.icon;
                  return (
                    <motion.button
                      key={idx}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 + idx * 0.05 }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={option.action}
                      className={`py-3 px-4 rounded-lg font-medium text-white transition-all flex items-center justify-center gap-2 ${option.color}`}
                    >
                      <Icon size={18} />
                      <span className="hidden sm:inline">{option.name}</span>
                    </motion.button>
                  );
                })}
              </div>
            </div>

            {/* Analytics */}
            <div className="pt-6 space-y-4">
              <h3 className="font-semibold text-foreground text-lg">Share Statistics</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  { label: "Total Views", value: stats.totalViews.toLocaleString() },
                  { label: "Link Clicks", value: stats.totalClicks.toLocaleString() },
                  { label: "Unique Visitors", value: stats.uniqueVisitors.toLocaleString() },
                ].map((stat, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 + idx * 0.05 }}
                    className="bg-slate-50 rounded-lg p-4 border border-border text-center"
                  >
                    <div className="text-xl font-bold text-foreground">{stat.value}</div>
                    <div className="text-xs text-slate-500 mt-1">{stat.label}</div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Side Panel - Preview & Tips */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            

            {/* Tips Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-blue-50 border border-blue-200 rounded-xl p-5"
            >
              <h3 className="font-semibold text-blue-800 mb-3">Sharing Tips</h3>
              <ul className="space-y-2 text-sm text-blue-700">
                <li className="flex gap-2">
                  <span className="text-blue-500 font-bold">•</span>
                  <span>Share your link on social media regularly</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-blue-500 font-bold">•</span>
                  <span>Add it to your email signature</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-blue-500 font-bold">•</span>
                  <span>Include in your video descriptions</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-blue-500 font-bold">•</span>
                  <span>Pin it as a comment on your posts</span>
                </li>
              </ul>
            </motion.div>

            
            
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}