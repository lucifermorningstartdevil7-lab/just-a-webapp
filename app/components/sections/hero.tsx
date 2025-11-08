'use client';

import { motion } from 'framer-motion';
import { useEffect, useMemo, useState } from 'react';
import { Zap, ArrowRight, Play, Sparkles } from 'lucide-react';
import { TypeWriter } from '../Animations/Typewriter';
import PreviewCard from '../ui/previewCard';
import { useRouter } from 'next/navigation';

export default function Hero() {
  const router = useRouter();
  const handleClick = (path: string) => {
    router.push(path);
  };

  const [blocks, setBlocks] = useState<JSX.Element[]>([]);
  
  const activeDivs = useMemo(
    () => ({
      0: new Set([4, 1]),
      2: new Set([3]),
      4: new Set([2, 5, 8]),
      5: new Set([4]),
      6: new Set([0]),
      7: new Set([1]),
      10: new Set([3]),
      12: new Set([7]),
      13: new Set([2, 4]),
      14: new Set([1, 5]),
      15: new Set([3, 6]),
    }),
    [], // No dependencies, so `activeDivs` will only be created once
  );

  useEffect(() => {
    const updateBlocks = () => {
      const { innerWidth, innerHeight } = window;
      const blockSize = innerWidth * 0.06; // Using 6vw for the block size
      const amountOfBlocks = Math.ceil(innerHeight / blockSize);

      const newBlocks = Array.from({ length: 17 }, (_, columnIndex) => (
        <div key={columnIndex} className="w-[6vw] h-full">
          {Array.from({ length: amountOfBlocks }, (_, rowIndex) => (
            <div
              key={rowIndex}
              className={`h-[6vw] w-full border-[1px] dark:border-[rgba(255,255,255,0.015)] border-gray-50 ${
                // @ts-ignore
                activeDivs[columnIndex]?.has(rowIndex)
                  ? "dark:bg-[rgba(255,255,255,0.03)] bg-green-50"
                  : ""
              }`}
              style={{ height: `${blockSize}px` }}
            ></div>
          ))}
        </div>
      ));
      // @ts-ignore
      setBlocks(newBlocks);
    };

    updateBlocks();
    window.addEventListener("resize", updateBlocks);

    return () => window.removeEventListener("resize", updateBlocks);
  }, [activeDivs]);

  return (
    <section className="pt-20 pb-16 relative overflow-hidden">
      {/* Vaul-inspired animated grid background */}
      <div className="absolute inset-0 -z-10 h-screen w-full">
        <div className="absolute inset-0 -z-0 h-screen w-full dark:bg-[radial-gradient(#1d1d1d_1px,transparent_1px)] bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px]"></div>
        <div className="absolute inset-0 top-0 left-0 h-screen w-full items-center px-5 py-24 bg-gradient-to-t dark:from-[#050505] from-white from-0% to-transparent to-60%"></div>
        
        <div className="pointer-events-none absolute inset-0 flex w-screen justify-end [mask-image:radial-gradient(transparent_5%,white)]">
          <div className="flex w-[6vw] h-full">{blocks}</div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white to-transparent dark:from-gray-900"></div>

      <div className="container mx-auto px-6 relative z-10 pt-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center max-w-7xl mx-auto">
          {/* Left Content */}
          <div className="text-left">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center space-x-2 bg-white/80 backdrop-blur-sm border border-gray-200/60 text-gray-700 px-4 py-2.5 rounded-2xl text-sm font-medium mb-8 shadow-lg"
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
              <button 
                onClick={() => handleClick('/auth/login')} 
                className="bg-gradient-to-br from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold py-4 px-8 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg shadow-green-500/25 flex items-center space-x-2"
              >
                <span>Start Growing Free</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button className="bg-white/80 backdrop-blur-sm border border-gray-300/60 hover:border-gray-400 text-gray-700 font-semibold py-4 px-8 rounded-xl transition-all duration-200 flex items-center space-x-2 shadow-lg">
                <Play className="w-4 h-4" />
                <span>Watch Demo</span>
              </button>
            </motion.div>
          </div>

          {/* Right Content - Preview Card */}
          <div className="relative z-10">
            <PreviewCard/>
          </div>
        </div>
      </div>
    </section>
  );
}