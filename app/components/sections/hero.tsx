'use client';

import { motion } from 'framer-motion';

import { Zap, ArrowRight, Play, Sparkles } from 'lucide-react';

import { TypeWriter } from '../Animations/Typewriter';
import PreviewCard from '../ui/previewCard';

export default function Hero() {
  return (
    <section className="pt-20 pb-28 relative overflow-hidden">
      {/* Background Blurs */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.2 }}
          transition={{ duration: 1 }}
          className="absolute -top-40 -right-40 w-80 h-80 bg-green-200 rounded-full blur-3xl"
        />
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.2 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-200 rounded-full blur-3xl"
        />
      </div>

      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-12 items-center max-w-7xl mx-auto">
          {/* Left Content */}
          <div className="text-left">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center space-x-2 bg-white border border-gray-200 text-gray-700 px-4 py-2.5 rounded-2xl text-sm font-medium mb-8 shadow-sm"
            >
              <Sparkles className="w-4 h-4" />
              <span>Your Bio-Link, with a Brain</span>
            </motion.div>
            
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight">
              <br />
              <TypeWriter texts={["Start Growing", "Maximize Clicks", "Automate links","Go Clicksprout"]} />
            </h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-xl text-gray-600 mb-10 leading-relaxed"
            >
              ClickSprout is the intelligent bio-link platform that automatically optimizes your links for maximum engagement.
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-4 items-center mb-12"
            >
              <button className="bg-gradient-to-br from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold py-4 px-8 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg shadow-green-500/25 flex items-center space-x-2">
                <span>Start Growing Free</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button className="bg-white border border-gray-300 hover:border-gray-400 text-gray-700 font-semibold py-4 px-8 rounded-xl transition-all duration-200 flex items-center space-x-2 shadow-sm hover:shadow-md">
                <Play className="w-4 h-4" />
                <span>Watch Demo</span>
              </button>
            </motion.div>
          </div>

          {/* Right Content - Preview Card */}
          <PreviewCard/>
        </div>
      </div>
    </section>
  );
}