"use client";


import NumberFlow from "@number-flow/react";
import { BarChart3, Bot, Briefcase, Calendar, CheckCheck, Clock, Database, Server, TrendingUp } from "lucide-react";
import { motion } from "motion/react";
import { useRef, useState } from "react";
import { Card, CardContent, CardHeader } from "../../ui/card";
import { TimelineContent } from "./timeline-animation";
import { Button } from "../button";

const plans = [
  {
    name: "Free Forever",
    description:
      "Perfect for getting started",
    price: 0,
    buttonText: "Get Started Free",
    buttonVariant: "outline" as const,
    popular: false,
    features: [
      { text: "Basic Bio-Link Page", icon: <Briefcase size={20} /> },
      { text: "Link Bundling", icon: <Briefcase size={20} /> },
      { text: "Basic Link Tracking", icon: <BarChart3 size={20} /> },
      { text: "Customizable Profile", icon: <Server size={20} /> },
    ],
    includes: [
      "Includes:",
      "Up to 3 Links Total",
      "Customizable Profile",
      "Basic Link Tracking",
    ],
  },
  {
    name: "Premium",
    description:
      "For serious creators who want to scale",
    price: 150,
    buttonText: "Go Premium",
    buttonVariant: "default" as const,
    popular: true,
    features: [
      { text: "Everything in Free", icon: <CheckCheck size={20} /> },
      { text: "Smart Link Bundling", icon: <Briefcase size={20} /> },
      { text: "Peak-Time Intelligence", icon: <Clock size={20} /> },
      { text: "Content Auto-Promotion", icon: <Bot size={20} /> },
    ],
    includes: [
      "Everything in Free, plus:",
      "Unlimited Links",
      "Advanced Analytics",
      "Priority Support",
    ],
  },
];



export default function PricingSection() {
  const pricingRef = useRef<HTMLDivElement>(null);

  const revealVariants = {
    visible: (i: number) => ({
      y: 0,
      opacity: 1,
      filter: "blur(0px)",
      transition: {
        delay: i * 0.15,
        duration: 0.4,
      },
    }),
    hidden: {
      filter: "blur(10px)",
      y: -20,
      opacity: 0,
    },
  };

  return (
    <div className="px-4 py-16 min-h-screen mx-auto relative dark:bg-black bg-white" ref={pricingRef}>
      {/* Top seamless transition */}
      <div className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-white to-transparent dark:from-gray-900"></div>
      
      <div
        className="absolute top-0 left-[10%] right-[10%] w-[80%] h-full z-0"
        style={{
          backgroundImage: `
        radial-gradient(circle at center, #206ce8 0%, transparent 70%)
      `,
          opacity: 0.6,
          mixBlendMode: "multiply",
        }}
      />

      <div className="text-center mb-6 max-w-3xl mx-auto">
        <TimelineContent
          as="h2"
          animationNum={0}
          timelineRef={pricingRef}
          customVariants={revealVariants}
          className="md:text-6xl sm:text-4xl text-3xl font-medium text-gray-900 dark:text-white mb-4"
        >
          Plans that works best for your{" "}
          <TimelineContent
            as="span"
            animationNum={1}
            timelineRef={pricingRef}
            customVariants={revealVariants}
            className="border border-dashed border-blue-500 px-2 py-1 rounded-xl bg-blue-100 dark:bg-blue-950/50 dark:text-blue-200 capitalize inline-block"
          >
            business
          </TimelineContent>
        </TimelineContent>

        <TimelineContent
          as="p"
          animationNum={2}
          timelineRef={pricingRef}
          customVariants={revealVariants}
          className="sm:text-base text-sm text-gray-600 dark:text-gray-300 sm:w-[70%] w-[80%] mx-auto"
        >
          Trusted by millions, We help teams all around the world, Explore which
          option is right for you.
        </TimelineContent>
      </div>



      <div className="grid md:grid-cols-2 max-w-5xl gap-8 py-6 mx-auto">
        {plans.map((plan, index) => (
          <TimelineContent
            key={plan.name}
            as="div"
            animationNum={4 + index}
            timelineRef={pricingRef}
            customVariants={revealVariants}
          >
            <Card
              className={`relative border-neutral-200 ${
                plan.popular ? "ring-2 ring-blue-500 bg-blue-50 dark:bg-blue-950/30 dark:border-blue-700" : "bg-white dark:bg-zinc-950 dark:border-neutral-800"
              }`}
            >
              <CardHeader className="text-left">
                <div className="flex justify-between">
                  <h3 className="text-3xl font-semibold text-gray-900 dark:text-white mb-2">
                    {plan.name}
                  </h3>
                  {plan.popular && (
                    <div className="">
                      <span className="bg-blue-500 dark:bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                        Popular
                      </span>
                    </div>
                  )}
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">{plan.description}</p>
                <div className="flex items-baseline">
                  <span className="text-4xl font-semibold text-gray-900 dark:text-white">
                    ₹
                    <NumberFlow
                      value={plan.price}
                      className="text-4xl font-semibold"
                    />
                  </span>
                  <span className="text-gray-600 dark:text-gray-300 ml-1">
                    /month
                  </span>
                </div>
              </CardHeader>

              <CardContent className="pt-0">
                <Button
                  className={`w-full mb-6 p-4 text-xl rounded-xl ${
                    plan.popular
                      ? "bg-gradient-to-t from-blue-500 to-blue-600  shadow-lg shadow-blue-500 border border-blue-400 text-white"
                      : "bg-gradient-to-t from-neutral-900 to-neutral-600 dark:from-zinc-100 dark:to-zinc-300 shadow-lg shadow-neutral-900 dark:shadow-zinc-900 border border-neutral-700 dark:border-neutral-800 text-white dark:text-black"
                  }`}
                >
                  {plan.buttonText}
                </Button>
                <ul className="space-y-2 font-semibold py-5">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center">
                      <span className="text-neutral-800 dark:text-neutral-300 grid place-content-center mt-0.5 mr-3">
                        {feature.icon}
                      </span>
                      <span className="text-sm text-gray-600 dark:text-gray-300">
                        {feature.text}
                      </span>
                    </li>
                  ))}
                </ul>

                <div className="space-y-3 pt-4 border-t border-neutral-200 dark:border-neutral-800">
                  <h4 className="font-medium text-base text-gray-900 dark:text-white mb-3">
                    {plan.includes[0]}
                  </h4>
                  <ul className="space-y-2 font-semibold">
                    {plan.includes.slice(1).map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center">
                        <span className="h-6 w-6 bg-green-50 dark:bg-green-950/50 border border-blue-500 rounded-full grid place-content-center mt-0.5 mr-3">
                          <CheckCheck className="h-4 w-4 text-blue-500 " />
                        </span>
                        <span className="text-sm text-gray-600 dark:text-gray-300">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TimelineContent>
        ))}
      </div>
      
      {/* Bottom seamless transition */}
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white to-transparent dark:from-gray-900"></div>
    </div>
    
  );
  
}
