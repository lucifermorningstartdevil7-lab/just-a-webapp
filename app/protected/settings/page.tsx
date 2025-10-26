// components/pages/SettingsPage.tsx
'use client'
import { motion } from "framer-motion";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff, Check, Trash2, Mail, User, Shield, Bell, CreditCard, AlertTriangle } from "lucide-react";

export default function SettingsPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("user@example.com");
  const [username, setUsername] = useState("username");
  const [displayName, setDisplayName] = useState("Your Name");
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="p-6 space-y-8 max-w-4xl mx-auto"
    >
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-black">Settings</h1>
        <p className="text-gray-400">Manage your account and preferences</p>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
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
              <h3 className="text-xl font-bold">Account Information</h3>
            </div>
            
            <div className="space-y-5">
              <div>
                <label className="text-sm font-semibold text-gray-200  mb-2 flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  Email Address
                </label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-neutral-800/50 border-neutral-700/50 text-white placeholder:text-gray-500"
                />
                <p className="text-xs text-gray-500 mt-2">Your email address is used for login and notifications</p>
              </div>

              <div>
                <label className="text-sm font-semibold text-gray-200 block mb-2 flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Username
                </label>
                <Input
                  type="text"
                  value={username}
                  disabled
                  className="w-full bg-neutral-800/50 border-neutral-700/50 text-gray-400 placeholder:text-gray-500 cursor-not-allowed"
                />
                <p className="text-xs text-gray-500 mt-2">Your unique LinkTrim username (cannot be changed)</p>
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
              </div>
            </div>

            <motion.button
              onClick={handleSave}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-3 bg-white text-black hover:bg-gray-200 font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              {saved ? (
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
              <h3 className="text-xl font-bold">Security</h3>
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
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-3 px-4 bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 font-semibold rounded-lg border border-red-500/30 hover:border-red-500/50 transition-colors flex items-center justify-center gap-2"
              >
                <Trash2 size={18} />
                Delete All Data
              </motion.button>
              <motion.button
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
          {/* Plan Information */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-neutral-900/40 border border-neutral-800/50 rounded-2xl p-6 space-y-4"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-500/10 rounded-lg">
                <CreditCard className="h-5 w-5 text-purple-400" />
              </div>
              <h3 className="text-xl font-bold">Plan & Billing</h3>
            </div>
            <div className="p-4 bg-neutral-800/30 border border-neutral-700/50 rounded-lg space-y-3">
              <div>
                <div className="font-semibold text-lg">Free Plan</div>
                <p className="text-sm text-gray-400 mt-1">3 links • Basic customization • 1,000 clicks/month</p>
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
            transition={{ delay: 0.4 }}
            className="bg-neutral-900/40 border border-neutral-800/50 rounded-2xl p-6 space-y-4"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-500/10 rounded-lg">
                <Bell className="h-5 w-5 text-yellow-400" />
              </div>
              <h3 className="text-xl font-bold">Notifications</h3>
            </div>
            <div className="space-y-3">
              {[
                { label: "Email on high traffic", description: "Get notified when your page receives lots of clicks" },
                { label: "Weekly summary", description: "Receive a weekly report of your link performance" },
                { label: "New comment alerts", description: "Get notified when someone comments on your page" },
              ].map((notif, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + idx * 0.05 }}
                  className="flex items-center justify-between p-3 bg-neutral-800/30 border border-neutral-700/50 rounded-lg"
                >
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-sm truncate">{notif.label}</div>
                    <p className="text-xs text-gray-400 truncate">{notif.description}</p>
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