// components/pages/CustomizationPage.tsx
'use client'
import { motion } from "framer-motion";
import { useState } from "react";

export default function CustomizationPage() {
  const [theme, setTheme] = useState("dark");
  const [primaryColor, setPrimaryColor] = useState("#3B82F6");
  const [buttonStyle, setButtonStyle] = useState("rounded");
  const [font, setFont] = useState("inter");

  const colors = [
    { name: "Blue", value: "#3B82F6" },
    { name: "Cyan", value: "#06B6D4" },
    { name: "Purple", value: "#8B5CF6" },
    { name: "Pink", value: "#EC4899" },
    { name: "Green", value: "#10B981" },
    { name: "Orange", value: "#F59E0B" },
    { name: "Red", value: "#EF4444" },
    { name: "Indigo", value: "#6366F1" },
  ];

  const themes = [
    { name: "Dark", description: "Classic dark theme", bgColor: "#1a1a1a" },
    { name: "Light", description: "Clean light theme", bgColor: "#f5f5f5" },
    { name: "Gradient", description: "Modern gradient", bgColor: "linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)" },
  ];

  const buttonStyles = [
    { name: "Rounded", class: "rounded-lg" },
    { name: "Square", class: "rounded-none" },
    { name: "Pill", class: "rounded-full" },
    { name: "Soft", class: "rounded-2xl" },
  ];

  const fonts = [
    { name: "Inter", value: "inter" },
    { name: "Poppins", value: "poppins" },
    { name: "Playfair", value: "playfair" },
    { name: "Roboto", value: "roboto" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="p-8 space-y-8"
    >
      <div className="space-y-2">
        <h1 className="text-3xl font-black">Customize Your Page</h1>
        <p className="text-gray-400">Make your link page uniquely yours</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Settings Panel */}
        <div className="lg:col-span-2 space-y-6">
          {/* Theme Selection */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-neutral-900/40 border border-neutral-800/50 rounded-2xl p-8 space-y-4"
          >
            <h3 className="text-xl font-bold">Theme</h3>
            <div className="grid grid-cols-3 gap-3">
              {themes.map((t) => (
                <motion.button
                  key={t.name}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setTheme(t.name)}
                  className={`p-4 rounded-lg border-2 transition-all text-left ${
                    theme === t.name
                      ? "border-white bg-white/10"
                      : "border-neutral-700/50 hover:border-neutral-600/50"
                  }`}
                >
                  <div className="font-semibold text-sm">{t.name}</div>
                  <div className="text-xs text-gray-400 mt-1">{t.description}</div>
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* Primary Color Selection */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-neutral-900/40 border border-neutral-800/50 rounded-2xl p-8 space-y-4"
          >
            <h3 className="text-xl font-bold">Primary Color</h3>
            <div className="grid grid-cols-4 gap-3">
              {colors.map((color) => (
                <motion.button
                  key={color.value}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setPrimaryColor(color.value)}
                  className={`w-full aspect-square rounded-lg border-2 transition-all ${
                    primaryColor === color.value
                      ? "border-white scale-110 shadow-lg"
                      : "border-neutral-700/50 hover:border-white/50"
                  }`}
                  style={{ backgroundColor: color.value }}
                  title={color.name}
                />
              ))}
            </div>
          </motion.div>

          {/* Button Style Selection */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-neutral-900/40 border border-neutral-800/50 rounded-2xl p-8 space-y-4"
          >
            <h3 className="text-xl font-bold">Link Button Style</h3>
            <div className="grid grid-cols-2 gap-3">
              {buttonStyles.map((style) => (
                <motion.button
                  key={style.name}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setButtonStyle(style.name)}
                  className={`py-3 px-4 border-2 font-semibold text-sm transition-all ${
                    buttonStyle === style.name
                      ? `border-white bg-white/10 ${style.class}`
                      : `border-neutral-700/50 hover:border-neutral-600/50 ${style.class}`
                  }`}
                >
                  {style.name}
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* Font Selection */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-neutral-900/40 border border-neutral-800/50 rounded-2xl p-8 space-y-4"
          >
            <h3 className="text-xl font-bold">Typography</h3>
            <div className="space-y-3">
              <div>
                <label className="text-sm text-gray-300 block mb-2">Heading Font</label>
                <select 
                  value={font}
                  onChange={(e) => setFont(e.target.value)}
                  className="w-full bg-neutral-800/50 border border-neutral-700/50 rounded-lg px-4 py-2 text-white text-sm hover:border-neutral-600/50 transition-colors focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20"
                >
                  {fonts.map((f) => (
                    <option key={f.value} value={f.value}>{f.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-sm text-gray-300 block mb-2">Body Font</label>
                <select className="w-full bg-neutral-800/50 border border-neutral-700/50 rounded-lg px-4 py-2 text-white text-sm hover:border-neutral-600/50 transition-colors focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20">
                  {fonts.map((f) => (
                    <option key={f.value} value={f.value}>{f.name}</option>
                  ))}
                </select>
              </div>
            </div>
          </motion.div>

          {/* Additional Options */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-neutral-900/40 border border-neutral-800/50 rounded-2xl p-8 space-y-4"
          >
            <h3 className="text-xl font-bold">Additional Options</h3>
            <div className="space-y-3">
              {[
                { label: "Show avatar", description: "Display your profile picture" },
                { label: "Enable animations", description: "Add smooth transitions" },
                { label: "Dark mode toggle", description: "Let visitors switch themes" },
              ].map((option, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + idx * 0.05 }}
                  className="flex items-center justify-between p-3 bg-neutral-800/30 border border-neutral-700/50 rounded-lg"
                >
                  <div>
                    <div className="font-semibold text-sm">{option.label}</div>
                    <p className="text-xs text-gray-400">{option.description}</p>
                  </div>
                  <input
                    type="checkbox"
                    defaultChecked={idx === 0}
                    className="w-5 h-5 rounded cursor-pointer accent-blue-500"
                  />
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Live Preview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-neutral-900/40 border border-neutral-800/50 rounded-2xl p-8 space-y-4 h-fit sticky top-8"
        >
          <h2 className="text-lg font-bold">Live Preview</h2>
          <div 
            className="rounded-2xl p-6 space-y-4 min-h-96 flex flex-col items-center justify-center border border-neutral-700/50"
            style={{ 
              backgroundColor: theme === "Light" ? "#f5f5f5" : theme === "Gradient" ? "linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)" : "#1a1a1a",
              color: theme === "Light" ? "#000" : "#fff"
            }}
          >
            {/* Preview Header */}
            <div className="w-full text-center space-y-3 mb-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 mx-auto"></div>
              <div className="h-3 bg-neutral-700 rounded w-2/3 mx-auto"></div>
              <div className="h-2 bg-neutral-800 rounded w-1/2 mx-auto"></div>
            </div>

            {/* Preview Links */}
            <div className="w-full space-y-2">
              {[1, 2, 3].map((i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + i * 0.1 }}
                  className={`p-3 border-2 text-center font-semibold text-sm cursor-pointer transition-all hover:opacity-80 ${buttonStyle === "Rounded" ? "rounded-lg" : buttonStyle === "Pill" ? "rounded-full" : buttonStyle === "Soft" ? "rounded-2xl" : "rounded-none"}`}
                  style={{ 
                    borderColor: primaryColor,
                    backgroundColor: theme === "Light" ? `${primaryColor}15` : `${primaryColor}20`,
                    color: theme === "Light" ? "#000" : "#fff"
                  }}
                >
                  Link {i}
                </motion.div>
              ))}
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full py-3 bg-white text-black hover:bg-gray-200 font-semibold rounded-lg transition-colors"
          >
            Save & Publish
          </motion.button>
        </motion.div>
      </div>
    </motion.div>
  );
}