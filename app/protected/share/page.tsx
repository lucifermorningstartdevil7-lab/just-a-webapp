// components/pages/SharePage.tsx
'use client'
import { motion } from "framer-motion";
import { useState } from "react";
import { Copy, Check, Twitter, Linkedin, Mail, QrCode, LinkIcon, Download } from "lucide-react";

export default function SharePage() {
  const [copied, setCopied] = useState(false);
  const [copiedQR, setCopiedQR] = useState(false);

  const handleCopy = (text: string, isQR = false) => {
    navigator.clipboard.writeText(text);
    if (isQR) {
      setCopiedQR(true);
      setTimeout(() => setCopiedQR(false), 2000);
    } else {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const shareOptions = [
    { 
      name: "Twitter", 
      icon: Twitter, 
      color: "from-blue-400 to-blue-500",
      action: () => window.open("https://twitter.com/intent/tweet?url=https://linktrim.app/yourusername&text=Check%20out%20my%20LinkTrim", "_blank")
    },
    { 
      name: "LinkedIn", 
      icon: Linkedin, 
      color: "from-blue-600 to-blue-700",
      action: () => window.open("https://www.linkedin.com/sharing/share-offsite/?url=https://linktrim.app/yourusername", "_blank")
    },
    { 
      name: "Email", 
      icon: Mail, 
      color: "from-red-400 to-red-500",
      action: () => window.location.href = "mailto:?subject=Check%20out%20my%20LinkTrim&body=https://linktrim.app/yourusername"
    },
    { 
      name: "Copy Link", 
      icon: Copy, 
      color: "from-purple-400 to-purple-500",
      action: () => handleCopy("https://linktrim.app/yourusername")
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="p-8 space-y-8"
    >
      <div className="space-y-2">
        <h1 className="text-3xl font-black">Share Your Page</h1>
        <p className="text-gray-400">Get your unique LinkTrim link and share with the world</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Share Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-2 bg-neutral-900/40 border border-neutral-800/50 rounded-2xl p-8 space-y-8"
        >
          {/* URL Section */}
          <div className="space-y-3">
            <label className="text-sm font-semibold text-gray-200">Your LinkTrim URL</label>
            <div className="flex gap-3">
              <input
                type="text"
                value="https://linktrim.app/yourusername"
                readOnly
                className="flex-1 bg-neutral-800/50 border border-neutral-700/50 rounded-lg px-4 py-3 text-white font-mono text-sm focus:border-neutral-600/50 transition-colors"
              />
              <motion.button
                onClick={() => handleCopy("https://linktrim.app/yourusername")}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`px-6 py-3 rounded-lg font-semibold transition-colors flex items-center gap-2 ${
                  copied
                    ? "bg-green-500 text-white"
                    : "bg-white text-black hover:bg-gray-200"
                }`}
              >
                {copied ? (
                  <>
                    <Check size={18} />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy size={18} />
                    Copy
                  </>
                )}
              </motion.button>
            </div>
          </div>

          {/* Share Buttons */}
          <div className="pt-6 border-t border-neutral-800/50 space-y-4">
            <h3 className="font-bold text-lg">Share On</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {shareOptions.map((option, idx) => {
                const Icon = option.icon;
                return (
                  <motion.button
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 + idx * 0.05 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={option.action}
                    className={`py-3 px-4 rounded-lg font-semibold text-sm text-white transition-all flex items-center justify-center gap-2 bg-gradient-to-br ${option.color} hover:shadow-lg hover:shadow-blue-500/30`}
                  >
                    <Icon size={18} />
                    <span className="hidden sm:inline">{option.name}</span>
                  </motion.button>
                );
              })}
            </div>
          </div>

          {/* QR Code Section */}
          <div className="pt-6 border-t border-neutral-800/50 space-y-4">
            <h3 className="font-bold text-lg">QR Code</h3>
            <div className="flex flex-col sm:flex-row gap-4 items-center sm:items-start">
              <div className="bg-white p-4 rounded-lg">
                <QrCode size={160} className="text-black" />
              </div>
              <div className="flex-1 space-y-3">
                <p className="text-sm text-gray-400">Scan this QR code to share your LinkTrim page. Perfect for offline sharing!</p>
                <div className="flex gap-2">
                  <motion.button
                    onClick={() => handleCopy("qr-code-data", true)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`flex-1 py-2 px-4 rounded-lg font-semibold text-sm transition-colors flex items-center justify-center gap-2 ${
                      copiedQR
                        ? "bg-green-500 text-white"
                        : "bg-white/10 text-white hover:bg-white/20 border border-white/20"
                    }`}
                  >
                    {copiedQR ? (
                      <>
                        <Check size={16} />
                        Copied
                      </>
                    ) : (
                      <>
                        <Copy size={16} />
                        Copy
                      </>
                    )}
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="py-2 px-4 rounded-lg font-semibold text-sm bg-white/10 text-white hover:bg-white/20 border border-white/20 transition-colors flex items-center justify-center gap-2"
                  >
                    <Download size={16} />
                    Download
                  </motion.button>
                </div>
              </div>
            </div>
          </div>

          {/* Analytics */}
          <div className="pt-6 border-t border-neutral-800/50 space-y-4">
            <h3 className="font-bold text-lg">Share Statistics</h3>
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: "Times Shared", value: "24" },
                { label: "QR Scans", value: "12" },
                { label: "Unique Clicks", value: "156" },
              ].map((stat, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + idx * 0.05 }}
                  className="bg-neutral-800/30 border border-neutral-700/50 rounded-lg p-4 text-center"
                >
                  <div className="text-2xl font-black text-white">{stat.value}</div>
                  <div className="text-xs text-gray-400 mt-1">{stat.label}</div>
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
          {/* Link Preview */}
          <div className="bg-neutral-900/40 border border-neutral-800/50 rounded-2xl p-8 space-y-4 h-fit sticky top-8">
            <h3 className="font-bold">How It Looks</h3>
            <div className="bg-gradient-to-br from-neutral-800 to-neutral-900 rounded-lg p-4 aspect-square flex flex-col items-center justify-center space-y-3 border border-neutral-700/50">
              <LinkIcon size={32} className="text-gray-500" />
              <div className="text-center">
                <div className="text-sm font-semibold text-gray-300">yourusername</div>
                <div className="text-xs text-gray-500">linktrim.app</div>
              </div>
            </div>
          </div>

          {/* Tips Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-blue-500/10 border border-blue-500/30 rounded-2xl p-6 space-y-3"
          >
            <h3 className="font-bold text-blue-400">Sharing Tips</h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li className="flex gap-2">
                <span className="text-blue-400 font-bold">•</span>
                <span>Share your link on social media regularly</span>
              </li>
              <li className="flex gap-2">
                <span className="text-blue-400 font-bold">•</span>
                <span>Use the QR code in photos or business cards</span>
              </li>
              <li className="flex gap-2">
                <span className="text-blue-400 font-bold">•</span>
                <span>Add it to your email signature</span>
              </li>
              <li className="flex gap-2">
                <span className="text-blue-400 font-bold">•</span>
                <span>Include in your video descriptions</span>
              </li>
            </ul>
          </motion.div>

          {/* Upgrade CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-2xl p-6 space-y-3"
          >
            <h3 className="font-bold">Custom Domain</h3>
            <p className="text-sm text-gray-300">Upgrade to Pro to use your own domain instead of linktrim.app</p>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-2 px-4 bg-white text-black hover:bg-gray-200 font-semibold rounded-lg transition-colors text-sm"
            >
              Upgrade Now
            </motion.button>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
}