'use client'
import { motion, AnimatePresence } from 'framer-motion'
import LinkItem from '../[username]/components/LinkItem'
import { useState, useEffect } from 'react'
import BlurText from '@/app/components/BlurText'
import SplitText from '@/app/components/SplitText'
import TextType from '@/app/components/TextType'
import Shuffle from '@/app/components/Shuffle'
import GradientText from '@/app/components/GradientText'

interface BundleContainerProps {
  title: string
  links: { id: string; title: string; url: string; icon?: string }[]
  theme?: {
    cardColor?: string;
    textColor?: string;
    accentColor?: string;
    buttonStyle?: 'rounded' | 'square' | 'pill';
    hoverEffect?: 'lift' | 'shadow' | 'none';
    transitionSpeed?: 'fast' | 'medium' | 'slow';
    titleAnimation?: 'none' | 'blur' | 'split' | 'type' | 'shuffle' | 'gradient' | 'countup';
    linkAnimation?: 'none' | 'blur' | 'split' | 'type' | 'shuffle' | 'gradient' | 'countup';
  }
}

export default function BundleContainer({ title, links, theme }: BundleContainerProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Default bundle theme values
  const defaultBundleTheme = {
    cardColor: '#f8fafc',
    textColor: '#1e293b',
    accentColor: '#3b82f6',
    buttonStyle: 'rounded',
    hoverEffect: 'lift',
    transitionSpeed: 'medium'
  };

  // Use provided theme or default values
  const finalTheme = { ...defaultBundleTheme, ...theme };

  // Map transition speed to duration values
  const getTransitionDuration = () => {
    switch (finalTheme.transitionSpeed) {
      case 'fast':
        return 0.2;
      case 'slow':
        return 0.6;
      case 'medium':
      default:
        return 0.4;
    }
  };

  // Determine button style classes based on theme
  const getButtonStyleClass = () => {
    switch (finalTheme.buttonStyle) {
      case 'rounded':
        return 'rounded-2xl';
      case 'pill':
        return 'rounded-full';
      case 'square':
        return 'rounded-none';
      default:
        return 'rounded-2xl';
    }
  };

  // Detect if user is on mobile device
  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768); // Adjust breakpoint as needed
    };
    
    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
    
    return () => {
      window.removeEventListener('resize', checkIsMobile);
    };
  }, []);

  // Determine if the bundle content should be visible
  const showContent = isMobile ? isMobileOpen : isHovered;

  return (
    <>
      {/* Bundle Container */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 200, damping: 25 }}
        className={`w-full overflow-hidden ${getButtonStyleClass()} bg-white/90 backdrop-blur-sm 
                   border border-gray-200/80 transition-all duration-300 ${isMobile ? 'cursor-pointer' : ''}`}
        style={{
          backgroundColor: `${finalTheme.cardColor}90`, // Add slight transparency
          color: finalTheme.textColor,
          transform: finalTheme.hoverEffect === 'lift' && isHovered ? 'translateY(-2px)' : 'none',
          boxShadow: finalTheme.hoverEffect === 'shadow' && isHovered 
            ? '0 6px 16px -4px rgba(0, 0, 0, 0.1), 0 4px 8px -4px rgba(0, 0, 0, 0.1)' 
            : '0 2px 4px -2px rgba(0, 0, 0, 0.05), 0 1px 2px -1px rgba(0, 0, 0, 0.05)'
        }}
        onMouseEnter={!isMobile ? () => setIsHovered(true) : undefined}
        onMouseLeave={!isMobile ? () => setIsHovered(false) : undefined}
        onClick={isMobile ? () => setIsMobileOpen(!isMobileOpen) : undefined}
      >
        {/* Bundle Header */}
        <div 
          className="px-5 py-4 border-b border-gray-200/60"
          style={{
            backgroundColor: `${finalTheme.cardColor}60`, // Slightly more opaque than main container
          }}
        >
          <div className="flex items-center justify-between">
            {finalTheme.titleAnimation === 'blur' ? (
              <BlurText 
                text={title}
                className="font-semibold tracking-tight truncate"
                style={{ color: finalTheme.textColor }}
              />
            ) : finalTheme.titleAnimation === 'split' ? (
              <SplitText 
                text={title} 
                tag="h3"
                className="font-semibold tracking-tight truncate"
                style={{ color: finalTheme.textColor }}
                splitType="chars"
              />
            ) : finalTheme.titleAnimation === 'type' ? (
              <TextType text={title} />
            ) : finalTheme.titleAnimation === 'shuffle' ? (
              <Shuffle 
                text={title}
                tag="h3"
                className="font-semibold tracking-tight truncate"
                style={{ color: finalTheme.textColor }}
              />
            ) : finalTheme.titleAnimation === 'gradient' ? (
              <GradientText className="font-semibold tracking-tight truncate">
                <span style={{ color: finalTheme.textColor }}>{title}</span>
              </GradientText>
            ) : (
              <h3 
                className="font-semibold tracking-tight truncate"
                style={{ color: finalTheme.textColor }}
              >
                {title}
              </h3>
            )}
            <span 
              className="text-xs px-2 py-1 rounded-full flex items-center"
              style={{
                color: finalTheme.textColor,
                backgroundColor: `${finalTheme.accentColor}20`,
              }}
            >
              {links.length} {links.length === 1 ? 'link' : 'links'}
              {!isMobile && (
                <motion.svg
                  animate={{ rotate: showContent ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none" viewBox="0 0 24 24" 
                  strokeWidth={1.5} 
                  stroke="currentColor"
                  className="w-4 h-4 ml-1"
                  style={{ color: finalTheme.accentColor }}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                </motion.svg>
              )}
            </span>
          </div>
        </div>
        
        {/* Bundle Links Container - only visible on desktop hover or if mobile interface is open */}
        <AnimatePresence>
          {showContent && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: getTransitionDuration() * 1.5, ease: [0.34, 1.56, 0.64, 1] }} // Slower expansion with custom easing
              className="overflow-hidden"
            >
              <div className="p-4 space-y-2 border-t" style={{ borderColor: `${finalTheme.textColor}10` }}>
                {links.map((link, index) => (
                  <div key={link.id} className="first:mt-0 last:mb-0">
                    <LinkItem 
                      title={link.title} 
                      url={link.url} 
                      icon={link.icon} 
                      theme={finalTheme} // Use bundle theme for links inside bundles
                      animation={finalTheme.linkAnimation}
                    />
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Mobile Overlay - shown when bundle is tapped on mobile */}
      <AnimatePresence>
        {isMobileOpen && isMobile && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-end"
            onClick={() => setIsMobileOpen(false)}
          >
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className={`w-full bg-white rounded-t-2xl p-6 max-h-[70vh] overflow-y-auto ${getButtonStyleClass()}`}
              onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside modal
            >
              <div className="flex justify-between items-center mb-4">
                <h3 
                  className="text-lg font-semibold truncate"
                  style={{ color: finalTheme.textColor }}
                >
                  {title}
                </h3>
                <button 
                  onClick={() => setIsMobileOpen(false)}
                  style={{ color: finalTheme.textColor }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="space-y-3">
                {links.map((link) => (
                  <div key={link.id} className="p-0 m-0">
                    <LinkItem 
                      title={link.title} 
                      url={link.url} 
                      icon={link.icon} 
                      theme={finalTheme} // Use bundle theme for links inside bundles
                      animation={finalTheme.linkAnimation}
                    />
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}