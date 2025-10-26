'use client';

import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { Check, Star, Zap, Sparkles } from 'lucide-react';

const plans = [
  {
    name: 'Free Forever',
    price: '₹0',
    description: 'Perfect for getting started',
    features: [
      { text: 'Basic Bio-Link Page', included: true },
      { text: '2 Smart Scheduled Links', included: true },
      { text: '1 A/B Test at a Time', included: true },
     
    ],
    cta: 'Get Started Free',
    popular: false,
    color: 'gray'
  },
  {
    name: 'Premium',
    price: '₹150',
    period: '/month',
    description: 'For serious creators who want to scale',
    features: [
      { text: 'Everything in Free', included: true },
      { text: 'Unlimited Link Scheduling', included: true },
      { text: 'Multiple A/B Tests', included: true },
      { text: 'Peak Time Intelligence', included: true },
      { text: 'Competitor Benchmark', included: true },
      { text: 'Content Auto-Promotion', included: true },
    ],
    cta: 'Go Premium',
    popular: true,
    color: 'premium'
  }
];

const PricingCard = ({ plan, index }: { plan: any; index: number }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  const isPremium = plan.color === 'premium';

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={isInView ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 30, scale: 0.95 }}
      transition={{ duration: 0.6, delay: index * 0.2 }}
      whileHover={{ y: -5  }}
      className={`relative rounded-3xl p-8 h-full ${
        isPremium 
          ? 'bg-gradient-to-br from-gray-900 to-gray-800 text-white shadow-2xl' 
          : 'bg-white border-2 border-gray-200 text-gray-900 shadow-xl'
      }`}
    >
      {/* Popular Badge */}
      {plan.popular && (
        <motion.div
         
         
         
          className="absolute -top-4 left-1/2 transform-gpu  -translate-x-1/2 "
        >
          <div className="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-2 rounded-full text-sm font-semibold shadow-lg flex items-center space-x-2">
            <Sparkles className="w-4 h-4" />
            <span>Popular</span>
          </div>
        </motion.div>
      )}

      {/* Header */}
      <div className="text-center mb-8">
        <motion.h3
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ delay: index * 0.2 + 0.1 }}
          className={`text-2xl font-bold mb-3 ${isPremium ? 'text-white' : 'text-gray-900'}`}
        >
          {plan.name}
        </motion.h3>
        
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
          transition={{ delay: index * 0.2 + 0.2 }}
          className="flex items-baseline justify-center space-x-1 mb-2"
        >
          <span className="text-4xl font-bold">{plan.price}</span>
          {plan.period && (
            <span className={isPremium ? 'text-gray-300' : 'text-gray-600'}>
              {plan.period}
            </span>
          )}
        </motion.div>
        
        <motion.p
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ delay: index * 0.2 + 0.3 }}
          className={isPremium ? 'text-gray-300' : 'text-gray-600'}
        >
          {plan.description}
        </motion.p>
      </div>

      {/* Features List */}
      <div className="space-y-4 mb-8">
        {plan.features.map((feature: any, featureIndex: number) => (
          <motion.div
            key={featureIndex}
            initial={{ opacity: 0, x: -20 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
            transition={{ duration: 0.4, delay: index * 0.2 + 0.4 + featureIndex * 0.1 }}
            className={`flex items-center space-x-3 ${
              isPremium 
                ? feature.included ? 'text-gray-100' : 'text-gray-500' 
                : feature.included ? 'text-gray-700' : 'text-gray-400'
            }`}
          >
            <motion.div
              whileHover={{ scale: 1.2 }}
              className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${
                feature.included
                  ? isPremium
                    ? 'bg-green-500/20 text-green-400'
                    : 'bg-green-100 text-green-600'
                  : isPremium
                    ? 'bg-gray-700 text-gray-600'
                    : 'bg-gray-100 text-gray-400'
              }`}
            >
              <Check className="w-3 h-3" />
            </motion.div>
            <span className={!feature.included ? 'line-through' : ''}>
              {feature.text}
            </span>
          </motion.div>
        ))}
      </div>

      {/* CTA Button */}
      <motion.button
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        transition={{ delay: index * 0.2 + 0.8 }}
        whileHover={{ 
          scale: 1.05,
          boxShadow: isPremium ? '0 20px 40px rgba(34, 197, 94, 0.3)' : '0 10px 25px rgba(0, 0, 0, 0.1)'
        }}
        whileTap={{ scale: 0.95 }}
        className={`w-full py-4 px-6 rounded-xl font-semibold transition-all duration-200 ${
          isPremium
            ? 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white shadow-lg shadow-green-500/25'
            : 'bg-gray-100 hover:bg-gray-200 text-gray-900 border border-gray-300'
        }`}
      >
        {plan.cta}
      </motion.button>

      {/* Premium Glow Effect */}
      {isPremium && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 3, repeat: Infinity }}
          className="absolute inset-0 rounded-3xl bg-gradient-to-r from-green-500/10 to-blue-500/10 -z-10 blur-xl"
        />
      )}
    </motion.div>
  );
};

const PricingFeature = ({ text, delay }: { text: string; delay: number }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: -20 }}
      animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
      transition={{ duration: 0.5, delay }}
      className="flex items-center space-x-3 text-gray-600"
    >
      <div className="w-2 h-2 bg-green-500 rounded-full" />
      <span className="text-sm">{text}</span>
    </motion.div>
  );
};

export default function Pricing() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const features = [
    "No credit card required to start",
    "2 exclusive features included in both plans",
    "All 5 exclusive features included in premium plan"
  ];

  return (
    <section id="pricing" className="py-24 bg-white" ref={ref}>
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center space-x-2 bg-green-50 text-green-700 px-4 py-2 rounded-full text-sm font-medium mb-6"
          >
            <Zap className="w-4 h-4" />
            <span>Transparent Pricing</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl font-bold text-gray-900 mb-4"
          >
            Simple, Fair Pricing
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl text-gray-600 max-w-2xl mx-auto mb-8"
          >
            Start free forever. Upgrade when you're ready to scale. No hidden fees, no surprises.
          </motion.p>

          {/* Features */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-wrap justify-center gap-6 max-w-2xl mx-auto"
          >
            {features.map((feature, index) => (
              <PricingFeature key={index} text={feature} delay={0.4 + index * 0.1} />
            ))}
          </motion.div>
        </div>

        {/* Pricing Cards */}
        <div className="grid lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {plans.map((plan, index) => (
            <PricingCard key={plan.name} plan={plan} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}