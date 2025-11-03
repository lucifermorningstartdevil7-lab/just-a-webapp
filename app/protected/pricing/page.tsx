'use client';

import { motion } from 'framer-motion';
import { Check, Star, Sparkles, ArrowRight, Users, Target, TrendingUp, BarChart3, Zap, CheckCircle } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/app/components/ui/card';
import { createClient } from '@/lib/supabase/client';
import { useEffect, useState } from 'react';

const plans = [
  {
    name: 'Starter',
    price: '₹0',
    description: 'Perfect for getting started',
    features: [
      { text: 'Basic Bio-Link Page', included: true, icon: Users },
      { text: '2 Smart Scheduled Links', included: true, icon: Target },
      { text: '1 A/B Test', included: true, icon: TrendingUp },
      { text: 'Basic Analytics', included: true, icon: BarChart3 },
      { text: 'Community Support', included: true, icon: Users },
    ],
    cta: 'Get Started',
    popular: false,
    color: 'slate',
    bgColor: 'bg-white',
    borderColor: 'border-slate-200',
    accentColor: 'from-slate-500 to-slate-600'
  },
  {
    name: 'Professional',
    price: '₹150',
    period: '/month',
    description: 'For serious creators',
    features: [
      { text: 'Everything in Starter', included: true, icon: Check },
      { text: 'Unlimited Links', included: true, icon: Target },
      { text: 'Multiple A/B Tests', included: true, icon: TrendingUp },
      { text: 'Peak Time Intelligence', included: true, icon: Zap },
      { text: 'Competitor Benchmark', included: true, icon: BarChart3 },
      { text: 'Advanced Analytics', included: true, icon: BarChart3 },
      { text: 'Priority Support', included: true, icon: Users },
    ],
    cta: 'Start Free Trial',
    popular: true,
    color: 'emerald',
    bgColor: 'bg-gradient-to-b from-white to-emerald-50',
    borderColor: 'border-emerald-200',
    highlight: true,
    accentColor: 'from-emerald-500 to-teal-500'
  }
];

export default function PricingPage() {
  const [user, setUser] = useState<any>(null);
  const [currentPlan, setCurrentPlan] = useState<'Starter' | 'Professional' | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        
        if (user) {
          setUser(user);
          
          // Check current subscription status
          const { data: subscription } = await supabase
            .from('subscriptions')
            .select('plan_type')
            .eq('user_id', user.id)
            .eq('status', 'active')
            .single();
            
          if (subscription) {
            setCurrentPlan(subscription.plan_type as 'Starter' | 'Professional');
          } else {
            // Default to Starter if no active subscription
            setCurrentPlan('Starter');
          }
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        // Default to Starter
        setCurrentPlan('Starter');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-card py-8 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-primary/10 to-secondary/10 text-primary px-4 py-1.5 rounded-full text-sm font-medium mb-3"
          >
            <Sparkles className="w-4 h-4" />
            <span>Audience growth tools that work</span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent mb-4"
          >
            Simple, transparent pricing
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="text-lg text-muted-foreground max-w-2xl mx-auto mb-6"
          >
            Choose the plan that fits your needs. Start for free, upgrade when you're ready.
          </motion.p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-5xl mx-auto mb-8">
          {plans.map((plan, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="relative"
            >
              {plan.popular && (
                <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 z-10">
                  <span className="bg-gradient-to-r from-primary to-secondary text-white text-xs font-semibold px-4 py-1 rounded-full flex items-center gap-1 shadow-lg shadow-primary/25">
                    <Star className="w-3 h-3" /> 
                    <span>Popular</span>
                  </span>
                </div>
              )}
              
              <Card className={`${
                plan.highlight ? 'border-2 ring-4 ring-primary/10' : 'border'
              } rounded-xl shadow-lg overflow-hidden border-border bg-card`}>
                <div className="p-6">
                  <CardHeader className="p-0 text-center pb-4">
                    <CardTitle className="text-xl font-bold text-foreground">{plan.name}</CardTitle>
                    <CardDescription className="text-muted-foreground mt-1">{plan.description}</CardDescription>
                    
                    <div className="mt-4">
                      <div className="text-4xl font-bold text-foreground">
                        {plan.price}
                        {plan.period && <span className="text-base font-normal text-muted-foreground"> {plan.period}</span>}
                      </div>
                      {plan.popular && (
                        <>
                          <p className="text-primary text-sm font-medium mt-1">Save 40% annually</p>
                          <p className="text-muted-foreground mt-2 text-xs italic">
                            Less than your monthly Starbucks habit
                          </p>
                        </>
                      )}
                    </div>
                  </CardHeader>
                  
                  <CardContent className="p-0 pb-6">
                    <ul className="space-y-3">
                      {plan.features.map((feature, idx) => {
                        const IconComponent = feature.icon;
                        return (
                          <li key={idx} className="flex items-center gap-3">
                            <div className={`flex-shrink-0 flex items-center justify-center w-5 h-5 rounded-full ${
                              feature.included 
                                ? 'bg-primary/10 text-primary' 
                                : 'bg-muted text-muted-foreground'
                            }`}>
                              {feature.included ? (
                                <IconComponent className="w-3 h-3" />
                              ) : (
                                <IconComponent className="w-3 h-3" />
                              )}
                            </div>
                            <span className={`text-foreground text-sm ${feature.included ? 'font-medium' : 'text-muted-foreground'}`}>
                              {feature.text}
                            </span>
                          </li>
                        );
                      })}
                    </ul>
                  </CardContent>
                  
                  <CardFooter className="p-0">
                    {currentPlan === plan.name ? (
                      <Button 
                        variant="outline"
                        className="w-full py-3 rounded-lg text-base font-semibold border-primary text-primary bg-primary/5"
                        disabled
                      >
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Currently Using
                      </Button>
                    ) : (
                      <Button 
                        className={`w-full py-3 rounded-lg text-base font-semibold shadow-md ${
                          plan.popular 
                            ? `bg-gradient-to-r ${plan.accentColor} hover:opacity-90 text-white shadow-primary/30` 
                            : 'bg-gradient-to-r from-foreground to-muted-foreground hover:opacity-90 text-white shadow-muted-foreground/30'
                        }`}
                      >
                        {plan.cta}
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    )}
                  </CardFooter>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Compact FAQ Section */}
        <div className="max-w-2xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.6 }}
            className="bg-card rounded-xl border border-border p-5 text-sm"
          >
            <h3 className="font-semibold text-foreground mb-2">Frequently asked</h3>
            <div className="space-y-3 text-muted-foreground">
              <p><span className="font-medium">Can I change plans?</span> Yes, upgrade or downgrade anytime.</p>
              <p><span className="font-medium">Free plan features?</span> Basic tools to get started.</p>
              <p><span className="font-medium">Payment methods?</span> Currently UPI, Google Play, Stripe coming soon.</p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}