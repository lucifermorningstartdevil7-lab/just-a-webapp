'use client';

import { motion } from 'framer-motion';
import { Check, Star, Zap, Sparkles, ArrowRight } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/app/components/ui/card';

const plans = [
  {
    name: 'Free Forever',
    price: '₹0',
    description: 'Perfect for getting started',
    features: [
      { text: 'Basic Bio-Link Page', included: true },
      { text: '2 Smart Scheduled Links', included: true },
      { text: '1 A/B Test at a Time', included: true },
      { text: 'Basic Analytics', included: true },
      { text: 'Custom Branding', included: false },
      { text: 'Priority Support', included: false },
    ],
    cta: 'Get Started Free',
    popular: false,
    color: 'gray',
    bgColor: 'bg-white',
    borderColor: 'border-slate-200'
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
      { text: 'Advanced Analytics', included: true },
      { text: 'Custom Branding', included: true },
      { text: 'Priority Support', included: true },
    ],
    cta: 'Go Premium',
    popular: true,
    color: 'premium',
    bgColor: 'bg-white',
    borderColor: 'border-green-500',
    highlight: true
  }
];

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-medium mb-4"
          >
            <Sparkles className="w-4 h-4" />
            <span>Grow your audience faster</span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-3xl md:text-4xl font-bold text-slate-800 mb-4"
          >
            Simple, transparent pricing
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg text-slate-600 max-w-3xl mx-auto"
          >
            Choose a plan that fits your needs. No hidden fees, no surprises.
          </motion.p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {plans.map((plan, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className={`${plan.bgColor} ${plan.borderColor} ${plan.highlight ? 'border-2 relative' : 'border'} rounded-xl shadow-sm`}>
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs font-semibold px-4 py-1 rounded-full flex items-center gap-1">
                      <Star className="w-3 h-3" /> MOST POPULAR
                    </span>
                  </div>
                )}
                
                <CardHeader className="pt-8 pb-6 text-center">
                  <CardTitle className="text-2xl font-bold text-slate-800">{plan.name}</CardTitle>
                  <CardDescription className="text-slate-600 mt-2">{plan.description}</CardDescription>
                  
                  <div className="mt-6">
                    <div className="text-4xl font-bold text-slate-900">
                      {plan.price}
                      {plan.period && <span className="text-lg font-normal text-slate-500"> {plan.period}</span>}
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="px-8">
                  <ul className="space-y-4">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <div className={`mt-1 ${feature.included ? 'text-green-500' : 'text-slate-300'}`}>
                          {feature.included ? (
                            <Check className="w-5 h-5" />
                          ) : (
                            <div className="w-5 h-5 rounded-full border border-slate-300" />
                          )}
                        </div>
                        <span className={`text-slate-600 ${feature.included ? 'font-medium' : 'text-slate-400'}`}>
                          {feature.text}
                        </span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                
                <CardFooter className="p-8 pt-0">
                  <Button 
                    className={`w-full ${plan.popular 
                      ? 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-lg shadow-green-500/25' 
                      : 'bg-slate-800 hover:bg-slate-900 text-white'}`}
                  >
                    {plan.cta}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* FAQ Section */}
        <div className="mt-16 max-w-3xl mx-auto">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="text-2xl font-bold text-center text-slate-800 mb-8"
          >
            Frequently asked questions
          </motion.h2>
          
          <div className="space-y-4">
            {[
              {
                question: "Can I change plans anytime?",
                answer: "Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately."
              },
              {
                question: "Do you offer refunds?",
                answer: "We offer a 30-day money-back guarantee on all paid plans. No questions asked."
              },
              {
                question: "Is there a free trial?",
                answer: "Our free plan gives you full access to basic features. Premium features are available through subscription."
              },
              {
                question: "What payment methods do you accept?",
                answer: "We accept all major credit cards, UPI, and net banking. Payments are securely processed."
              }
            ].map((faq, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
                className="bg-white rounded-xl border border-slate-200 p-6"
              >
                <h3 className="font-semibold text-lg text-slate-800 mb-2">{faq.question}</h3>
                <p className="text-slate-600">{faq.answer}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}