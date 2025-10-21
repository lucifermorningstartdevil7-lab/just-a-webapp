// components/pages/SettingsPage.tsx
'use client'
import { motion } from "framer-motion";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff, Check, Trash2 } from "lucide-react";

export default function SettingsPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("user@example.com");
  const [username] = useState("yourusername");
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
      className="p-8 space-y-8"
    >
      <div className="space-y-2">
        <h1 className="text-3xl font-black">Settings</h1>
        <p className="text-gray-400">Manage your account and preferences</p>
      </div>

      <div className="max-w-2xl space-y-6">
        {/* Account Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-neutral-900/40 border border-neutral-800/50 rounded-2xl p-8 space-y-6"
        >
          <div>
            <h3 className="text-xl font-bold mb-6">Account Information</h3>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm font-semibold text-gray-200 block mb-2">Email Address</label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-neutral-800/50 border-neutral-700/50 text-white placeholder:text-gray-500"
                />
                <p className="text-xs text-gray-500 mt-2">Your email address is used for login and notifications</p>
              </div>

              <div>
                <label className="text-sm font-semibold text-gray-200 block mb-2">Username</label>
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
          className="bg-neutral-900/40 border border-neutral-800/50 rounded-2xl p-8 space-y-6"
        >
          <h3 className="text-xl font-bold">Security</h3>
          
          <div className="space-y-4">
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

        {/* Plan Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-neutral-900/40 border border-neutral-800/50 rounded-2xl p-8 space-y-4"
        >
          <h3 className="text-xl font-bold mb-4">Plan & Billing</h3>
          <div className="flex items-start justify-between p-4 bg-neutral-800/30 border border-neutral-700/50 rounded-lg">
            <div>
              <div className="font-semibold">Free Plan</div>
              <p className="text-sm text-gray-400 mt-1">3 links • Basic customization • 1,000 clicks/month</p>
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-6 py-2 bg-white text-black hover:bg-gray-200 font-semibold rounded-lg transition-colors whitespace-nowrap"
            >
              Upgrade
            </motion.button>
          </div>
        </motion.div>

        {/* Notifications */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-neutral-900/40 border border-neutral-800/50 rounded-2xl p-8 space-y-4"
        >
          <h3 className="text-xl font-bold mb-4">Notifications</h3>
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
                <div>
                  <div className="font-semibold text-sm">{notif.label}</div>
                  <p className="text-xs text-gray-400">{notif.description}</p>
                </div>
                <input
                  type="checkbox"
                  defaultChecked
                  className="w-5 h-5 rounded cursor-pointer"
                />
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Danger Zone */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-red-500/10 border border-red-500/30 rounded-2xl p-8 space-y-4"
        >
          <h3 className="text-xl font-bold text-red-400">Danger Zone</h3>
          <p className="text-sm text-gray-400">These actions cannot be undone</p>
          
          <div className="space-y-2">
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
    </motion.div>
  );
}