
'use client';

import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { 
  Calendar, 
  BarChart3, 
  TrendingUp, 
  Bot, 
  Check, 
  Star, 
  Clock 
} from 'lucide-react';

const features = [
  {
    icon: <Calendar className="w-6 h-6" />,
    title: "Smart Link Scheduling",
    description: "Schedule links to appear/disappear based on time/date. Perfect for limited-time offers and live stream announcements.",
    free: "2 scheduled links",
    premium: "Unlimited scheduling",
    color: "blue"
  },
  {
    icon: <BarChart3 className="w-6 h-6" />,
    title: "Basic A/B Testing",
    description: "Test two different link titles/descriptions. See which performs better over 7 days.",
    free: "1 A/B test at a time",
    premium: "Multiple simultaneous tests",
    color: "green"
  },
  {
    icon: <Clock className="w-6 h-6" />,
    title: "Peak Time Intelligence",
    description: "Automatically analyzes when YOUR specific audience is most active. Auto-promotes links during peak hours.",
    premium: true,
    color: "purple"
  },
  {
    icon: <TrendingUp className="w-6 h-6" />,
    title: "Competitor Benchmark",
    description: "See how your click-through rates compare to similar creators in your niche. Anonymous insights.",
    premium: true,
    color: "orange"
  },
  {
    icon: <Bot className="w-6 h-6" />,
    title: "Content Auto-Promotion",
    description: "Integrates with social platforms. Automatically creates and pins links when you post new content.",
    premium: true,
    color: "pink"
  }
];

const FeatureCard = ({ feature, index }: { feature: any; index: number }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  const getColorClasses = (color: string) => {
    const colors = {
      blue: 'bg-blue-50 text-blue-600 border-blue-200',
      green: 'bg-green-50 text-green-600 border-green-200',
      purple: 'bg-purple-50 text-purple-600 border-purple-200',
      orange: 'bg-orange-50 text-orange-600 border-orange-200',
      pink: 'bg-pink-50 text-pink-600 border-pink-200'
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -5 }}
      className="bg-white rounded-2xl border border-gray-200 p-8 hover:shadow-xl transition-all duration-300 h-full flex flex-col group"
    >
      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 border ${getColorClasses(feature.color)} group-hover:scale-110 transition-transform duration-300`}>
        {feature.icon}
      </div>
      
      <div className="flex-1">
        <h3 className="text-xl font-semibold text-gray-900 mb-3">
          {feature.title}
        </h3>
        <p className="text-gray-600 mb-6 leading-relaxed">
          {feature.description}
        </p>
        
        {feature.free && (
          <div className="space-y-3">
            <motion.div 
              initial={{ opacity: 0, x: -10 }}
              animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -10 }}
              transition={{ delay: index * 0.1 + 0.3 }}
              className="flex items-center space-x-3 text-sm text-green-600 bg-green-50 px-3 py-2 rounded-lg"
            >
              <Check className="w-4 h-4" />
              <span className="font-medium">Free: {feature.free}</span>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, x: -10 }}
              animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -10 }}
              transition={{ delay: index * 0.1 + 0.4 }}
              className="flex items-center space-x-3 text-sm text-purple-600 bg-purple-50 px-3 py-2 rounded-lg"
            >
              <Star className="w-4 h-4" />
              <span className="font-medium">Premium: {feature.premium}</span>
            </motion.div>
          </div>
        )}
        
        {feature.premium && !feature.free && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
            transition={{ delay: index * 0.1 + 0.3 }}
            className="inline-flex items-center space-x-2 bg-gradient-to-r from-purple-50 to-pink-50 text-purple-700 px-4 py-2.5 rounded-xl text-sm font-medium border border-purple-200"
          >
            <Star className="w-4 h-4" />
            <span>Premium Exclusive</span>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default function Features() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="features" className="py-24 bg-gray-50/50" ref={ref}>
      <div className="container mx-auto px-6">
        <div className="text-center mb-20">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.6 }}
            className="text-4xl font-bold text-gray-900 mb-4"
          >
            Built for Growth-Minded Creators
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-xl text-gray-600 max-w-2xl mx-auto"
          >
            Get the basic functionality free forever, plus exclusive features that turn clicks into growth.
          </motion.p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {features.map((feature, index) => (
            <FeatureCard key={index} feature={feature} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}