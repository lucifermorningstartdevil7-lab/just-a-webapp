'use client'
import { motion } from 'framer-motion'
import BlurText from '@/app/components/BlurText'
import SplitText from '@/app/components/SplitText'
import TextType from '@/app/components/TextType'
import Shuffle from '@/app/components/Shuffle'
import GradientText from '@/app/components/GradientText'

interface LinkItemProps {
  title: string
  url: string
  icon?: string
  theme?: {
    cardColor?: string;
    textColor?: string;
    accentColor?: string;
    buttonStyle?: 'rounded' | 'square' | 'pill';
  }
  animation?: 'none' | 'blur' | 'split' | 'type' | 'shuffle' | 'gradient' | 'countup';
}

// Default theme values
const defaultTheme = {
  cardColor: '#f8fafc',
  textColor: '#1e293b',
  accentColor: '#3b82f6',
  buttonStyle: 'rounded'
};

export default function LinkItem({ title, url, icon, theme, animation = 'none' }: LinkItemProps) {
  const finalTheme = { ...defaultTheme, ...theme };
  
  // Determine button style classes based on theme
  const getButtonStyleClass = () => {
    switch (finalTheme.buttonStyle) {
      case 'rounded':
        return 'rounded-xl'; // Using xl for consistency with default
      case 'pill':
        return 'rounded-full';
      case 'square':
        return 'rounded-none';
      default:
        return 'rounded-xl';
    }
  };

  return (
    <motion.a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ 
        y: -2, 
        boxShadow: `0 4px 12px -2px rgba(0, 0, 0, 0.1), 0 3px 8px -2px rgba(0, 0, 0, 0.08)` 
      }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      className={`group w-full ${getButtonStyleClass()} bg-white/90 backdrop-blur-sm 
                 border border-gray-200/80 shadow-sm hover:shadow-md 
                 px-5 py-4 flex items-center justify-between transition-all duration-300`}
      style={{
        backgroundColor: `${finalTheme.cardColor}90`,
        color: finalTheme.textColor,
        borderColor: `${finalTheme.textColor}20`
      }}
    >
      <div className="flex items-center gap-3 min-w-0">
        {icon && (
          <div 
            className="flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: `${finalTheme.textColor}10` }}
          >
            <img src={icon} alt="" className="w-5 h-5 object-contain" />
          </div>
        )}
        <div className="min-w-0">
          {animation === 'blur' ? (
            <BlurText 
              text={title}
              className="font-medium tracking-tight truncate transition-colors group-hover:text-current"
              style={{ 
                color: finalTheme.textColor,
                '--tw-text-opacity': 1
              } as React.CSSProperties}
            />
          ) : animation === 'split' ? (
            <SplitText 
              text={title} 
              className="font-medium tracking-tight truncate transition-colors group-hover:text-current"
              style={{ 
                color: finalTheme.textColor,
              } as React.CSSProperties}
            />
          ) : animation === 'type' ? (
            <TextType text={title} />
          ) : animation === 'shuffle' ? (
            <Shuffle 
              text={title}
              className="font-medium tracking-tight truncate transition-colors group-hover:text-current"
              style={{ 
                color: finalTheme.textColor,
              } as React.CSSProperties}
            />
          ) : animation === 'gradient' ? (
            <GradientText className="font-medium tracking-tight truncate transition-colors group-hover:text-current">
              <span style={{ 
                color: finalTheme.textColor,
                '--tw-text-opacity': 1
              } as React.CSSProperties}>
                {title}
              </span>
            </GradientText>
          ) : (
            <span 
              className="font-medium tracking-tight truncate transition-colors group-hover:text-current"
              style={{ 
                color: finalTheme.textColor,
                '--tw-text-opacity': 1
              } as React.CSSProperties}
            >
              {title}
            </span>
          )}
        </div>
      </div>
      <div className="flex-shrink-0 ml-2">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none" viewBox="0 0 24 24" 
          strokeWidth={1.5} 
          stroke="currentColor"
          className="w-5 h-5 transition-colors duration-300"
          style={{ 
            color: `${finalTheme.textColor}60`, // 60% opacity for default state
            '--tw-stroke-opacity': 1
          } as React.CSSProperties}
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3" 
          />
        </svg>
      </div>
    </motion.a>
  )
}
