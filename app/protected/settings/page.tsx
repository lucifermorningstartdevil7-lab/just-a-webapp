
'use client'
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { Input } from "@/app/components/ui/input";
import { Eye, EyeOff, Check, Trash2, Mail, User, Shield, Bell, CreditCard, AlertTriangle, Loader2 } from "lucide-react";
import { createClient } from '@/lib/supabase/client';

export default function SettingsPage() {
  const [showPassword, setShowPassword] = useState(false);
<<<<<<< HEAD
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [pageSlug, setPageSlug] = useState("");
=======
  const [email, setEmail] = useState("user@example.com");
  const [username] = useState("yourusername");
  const [displayName, setDisplayName] = useState("Your Name");
>>>>>>> 59c4acd742833a567c3817b01f237bc2978a0525
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [totalLinks, setTotalLinks] = useState(0);
  const [totalClicks, setTotalClicks] = useState(0);

  useEffect(() => {
    loadUserData();
  }, []);

  async function loadUserData() {
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        setLoading(false);
        return;
      }

      setEmail(user.email || "");
      setUsername(user.email?.split('@')[0] || "");

      // Load user's page data
      const { data: pageData, error: pageError } = await supabase
        
        .from('pages')
        .select('slug, title, total_clicks')
        .eq('user_id', user.id)
        .single();

      if (pageData && !pageError) {
        setPageSlug(pageData.slug);
        setDisplayName(pageData.title || "");
        setTotalClicks(pageData.total_clicks || 0);

        // Load links count
        const { data: linksData, error: linksError } = await supabase
          .from('links')
          .select('id')
          .eq('page_id', pageData.slug);

        if (linksData && !linksError) {
          setTotalLinks(linksData.length);
        }
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleSave() {
    setSaving(true);
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) return;

      // Update page title (display name)
      const { error } = await supabase
        .from('pages')
        .update({ title: displayName })
        .eq('user_id', user.id);

      if (error) throw error;

      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (error) {
      console.error('Error saving:', error);
      alert('Failed to save changes');
    } finally {
      setSaving(false);
    }
  }

  async function handleDeleteAccount() {
    if (!confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      return;
    }

    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) return;

      // Delete user's page (links will cascade delete if foreign key is set up)
      const { error: pageError } = await supabase
        .from('pages')
        .delete()
        .eq('user_id', user.id);

      if (pageError) throw pageError;

      // Sign out
      await supabase.auth.signOut();
      window.location.href = '/';
    } catch (error) {
      console.error('Error deleting account:', error);
      alert('Failed to delete account');
    }
  }

  async function handleDeleteAllData() {
    if (!confirm('Are you sure you want to delete all your links and analytics data? This action cannot be undone.')) {
      return;
    }

    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) return;

      // Get page first
      const { data: pageData } = await supabase
        .from('pages')
        .select('slug')
        .eq('user_id', user.id)
        .single();

      if (pageData) {

        // Delete all links
        await supabase
          .from('links')
          .delete()
          .eq('page_id', pageData.slug);

        // Reset page analytics
        await supabase
          .from('pages')
          .update({ total_views: 0, total_clicks: 0 })
          .eq('user_id', user.id);
      }

      alert('All data deleted successfully');
      loadUserData(); // Reload data
    } catch (error) {
      console.error('Error deleting data:', error);
      alert('Failed to delete data');
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <Loader2 className="w-8 h-8 text-neutral-400 animate-spin" />
        </motion.div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="p-4 sm:p-6 lg:p-8 space-y-8 max-w-6xl mx-auto"
    >
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-black text-neutral-50">Settings</h1>
        <p className="text-gray-400">Manage your account and preferences</p>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        {/* Main Content - 2/3 width */}
        <div className="lg:col-span-2 space-y-6">
          {/* Account Settings */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-neutral-900/40 border border-neutral-800/50 rounded-2xl p-6 space-y-6"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-500/10 rounded-lg">
                <User className="h-5 w-5 text-blue-400" />
              </div>
              <h3 className="text-xl font-bold text-neutral-50">Account Information</h3>
            </div>
            
            <div className="space-y-5">
              <div>
                <label className="text-sm font-semibold text-gray-200 mb-2 flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  Email Address
                </label>
                <Input
                  type="email"
                  value={email}
                  disabled
                  className="w-full bg-neutral-800/50 border-neutral-700/50 text-gray-400 placeholder:text-gray-500 cursor-not-allowed"
                />
                <p className="text-xs text-gray-500 mt-2">Your email address cannot be changed</p>
              </div>

              <div>
                <label className="text-sm font-semibold text-gray-200 mb-2 flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Page Slug
                </label>
                <Input
                  type="text"
                  value={pageSlug}
                  disabled
                  className="w-full bg-neutral-800/50 border-neutral-700/50 text-gray-400 placeholder:text-gray-500 cursor-not-allowed"
                />
                <p className="text-xs text-gray-500 mt-2">Your unique page URL (cannot be changed)</p>
              </div>

              <div>
                <label className="text-sm font-semibold text-gray-200 block mb-2">Display Name</label>
                <Input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="Your Name"
                  className="w-full bg-neutral-800/50 border-neutral-700/50 text-white placeholder:text-gray-500"
                />
                <p className="text-xs text-gray-500 mt-2">This appears on your public page</p>
              </div>
            </div>

            <motion.button
              onClick={handleSave}
              disabled={saving}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-3 bg-white text-black hover:bg-gray-200 font-semibold rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Saving...
                </>
              ) : saved ? (
                <>
                  <Check size={18} />
                  Saved Successfully
                </>
              ) : (
                "Save Changes"
              )}
            </motion.button>
          </motion.div>

          {/* Security Settings */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-neutral-900/40 border border-neutral-800/50 rounded-2xl p-6 space-y-6"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-500/10 rounded-lg">
                <Shield className="h-5 w-5 text-green-400" />
              </div>
              <h3 className="text-xl font-bold text-neutral-50">Security</h3>
            </div>
            
            <div className="space-y-5">
              <div>
                <label className="text-sm font-semibold text-gray-200 block mb-2">Current Password</label>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className="w-full bg-neutral-800/50 border-neutral-700/50 text-white placeholder:text-gray-500 pr-10"
                  />
                  <button
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300 transition-colors"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div>
                <label className="text-sm font-semibold text-gray-200 block mb-2">New Password</label>
                <Input
                  type="password"
                  placeholder="••••••••"
                  className="w-full bg-neutral-800/50 border-neutral-700/50 text-white placeholder:text-gray-500"
                />
              </div>

              <div>
                <label className="text-sm font-semibold text-gray-200 block mb-2">Confirm Password</label>
                <Input
                  type="password"
                  placeholder="••••••••"
                  className="w-full bg-neutral-800/50 border-neutral-700/50 text-white placeholder:text-gray-500"
                />
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-3 px-4 bg-white/10 text-white hover:bg-white/20 font-semibold rounded-lg transition-colors border border-white/20"
            >
              Update Password
            </motion.button>
          </motion.div>

          {/* Danger Zone */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-red-500/10 border border-red-500/30 rounded-2xl p-6 space-y-4"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-500/10 rounded-lg">
                <AlertTriangle className="h-5 w-5 text-red-400" />
              </div>
              <h3 className="text-xl font-bold text-red-400">Danger Zone</h3>
            </div>
            <p className="text-sm text-gray-400">These actions cannot be undone</p>
            
            <div className="space-y-3">
              <motion.button
                onClick={handleDeleteAllData}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-3 px-4 bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 font-semibold rounded-lg border border-red-500/30 hover:border-red-500/50 transition-colors flex items-center justify-center gap-2"
              >
                <Trash2 size={18} />
                Delete All Data
              </motion.button>
              <motion.button
                onClick={handleDeleteAccount}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-3 px-4 bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 font-semibold rounded-lg border border-red-500/30 hover:border-red-500/50 transition-colors flex items-center justify-center gap-2"
              >
                <Trash2 size={18} />
                Delete Account
              </motion.button>
            </div>
          </motion.div>
        </div>

        {/* Sidebar - 1/3 width */}
        <div className="space-y-6">
          {/* Quick Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-neutral-900/40 border border-neutral-800/50 rounded-2xl p-6 space-y-4"
          >
            <h3 className="text-lg font-bold text-neutral-50">Quick Stats</h3>
            <div className="space-y-3">
              <div className="p-4 bg-neutral-800/30 border border-neutral-700/50 rounded-lg">
                <div className="text-2xl font-bold text-neutral-50">{totalLinks}</div>
                <p className="text-sm text-gray-400 mt-1">Total Links</p>
              </div>
              <div className="p-4 bg-neutral-800/30 border border-neutral-700/50 rounded-lg">
                <div className="text-2xl font-bold text-neutral-50">{totalClicks.toLocaleString()}</div>
                <p className="text-sm text-gray-400 mt-1">Total Clicks</p>
              </div>
            </div>
          </motion.div>

          {/* Plan Information */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-neutral-900/40 border border-neutral-800/50 rounded-2xl p-6 space-y-4"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-500/10 rounded-lg">
                <CreditCard className="h-5 w-5 text-purple-400" />
              </div>
              <h3 className="text-lg font-bold text-neutral-50">Plan</h3>
            </div>
            <div className="p-4 bg-neutral-800/30 border border-neutral-700/50 rounded-lg space-y-3">
              <div>
                <div className="font-semibold text-lg text-neutral-50">Free Plan</div>
                <p className="text-sm text-gray-400 mt-1">Unlimited links • Basic analytics</p>
              </div>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-2.5 bg-white text-black hover:bg-gray-200 font-semibold rounded-lg transition-colors"
              >
                Upgrade Plan
              </motion.button>
            </div>
          </motion.div>

          {/* Notifications */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-neutral-900/40 border border-neutral-800/50 rounded-2xl p-6 space-y-4"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-500/10 rounded-lg">
                <Bell className="h-5 w-5 text-yellow-400" />
              </div>
              <h3 className="text-lg font-bold text-neutral-50">Notifications</h3>
            </div>
            <div className="space-y-3">
              {[
                { label: "Weekly summary", description: "Performance reports" },
                { label: "High traffic alerts", description: "Spike notifications" },
              ].map((notif, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + idx * 0.05 }}
                  className="flex items-center justify-between p-3 bg-neutral-800/30 border border-neutral-700/50 rounded-lg"
                >
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-sm text-neutral-100">{notif.label}</div>
                    <p className="text-xs text-gray-400">{notif.description}</p>
                  </div>
                  <input
                    type="checkbox"
                    defaultChecked
                    className="w-4 h-4 rounded cursor-pointer ml-2"
                  />
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}