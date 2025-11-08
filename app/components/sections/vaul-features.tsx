"use client";

import { ArrowRight, Calendar, TrendingUp, Bot, BarChart3 } from "lucide-react";
import { motion } from "motion/react";
import { useRef } from "react";
import HoverTranslateTwo from "../vaul/interactive-card-stack";
import { TimelineContent } from "../ui/timeline-animation";

const ClickSproutFeatures = () => {
  const featuresRef = useRef<HTMLDivElement>(null);

  const revealVariants = {
    visible: (i: number) => ({
      y: 0,
      opacity: 1,
      filter: "blur(0px)",
      transition: {
        delay: i * 0.4,
        duration: 0.5,
      },
    }),
    hidden: {
      filter: "blur(10px)",
      y: -20,
      opacity: 0,
    },
  };

  const colorClasses = {
    green: "before:bg-green-500 shadow-green-500/20",
    orange: "before:bg-orange-500 shadow-orange-500/20",
    blue: "before:bg-blue-500 shadow-blue-500/20",
  };

  return (
    <section className="max-w-7xl mx-auto p-4 py-20" ref={featuresRef}>
      <article className="max-w-5xl mx-auto py-10 text-center space-y-2 px-8">
        <TimelineContent
          as="h1"
          animationNum={0}
          timelineRef={featuresRef}
          customVariants={revealVariants}
          className="md:text-5xl sm:text-4xl text-3xl font-medium text-black dark:text-white"
        >
          Powerful Bio-Link Features, <br />
          Intelligently Designed
        </TimelineContent>
        <TimelineContent
          as="p"
          animationNum={1}
          timelineRef={featuresRef}
          customVariants={revealVariants}
          className="text-gray-600 dark:text-gray-300 sm:text-base text-sm sm:w-[70%] w-full mx-auto"
        >
          Discover the tools that elevate your audience engagement—Smart scheduling,
          peak-time intelligence, auto-promotion, and intuitive analytics.
        </TimelineContent>
      </article>
      <div className="grid grid-cols-12 gap-4">
        {/* Interactive Card Stack for Link Bundles */}
        <TimelineContent
          as="div"
          animationNum={0}
          timelineRef={featuresRef}
          customVariants={revealVariants}
          className="lg:col-span-5 sm:col-span-6 col-span-12 relative w-full h-[350px] rounded-xl overflow-hidden border border-neutral-200"
        >
          <div className="absolute bottom-0 left-0 right-0 top-0 bg-[linear-gradient(to_right,#b0b0b02e_1px,transparent_1px),linear-gradient(to_bottom,#b0b0b02e_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)] dark:bg-[linear-gradient(to_right,#5050502e_1px,transparent_1px),linear-gradient(to_bottom,#5050502e_1px,transparent_1px)]"></div>
          
          {/* Static representation of Link Bundles */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="grid grid-cols-1 gap-3 w-full max-w-xs px-4">
              {[
                { name: "Social Links", count: "8 links", color: "bg-blue-500" },
                { name: "Shop Links", count: "6 links", color: "bg-green-500" },
                { name: "Resource Links", count: "12 links", color: "bg-purple-500" },
                { name: "Promotional", count: "5 links", color: "bg-orange-500" },
              ].map((bundle, index) => (
                <div 
                  key={index}
                  className="flex items-center p-3 bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700"
                >
                  <div className={`w-3 h-3 rounded-full ${bundle.color} mr-3`}></div>
                  <div className="flex-1">
                    <div className="font-medium text-gray-900 dark:text-white">{bundle.name}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">{bundle.count}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <article className="absolute right-0 bottom-0 left-0 w-full bg-gradient-to-t from-white via-white to-transparent dark:from-gray-900 dark:via-gray-900 p-6 pt-[100px]">
            <h3 className="px-1 pt-1 text-black dark:text-white text-2xl font-medium">
              Link Bundles & Organization
            </h3>
            <p className="mt-1 px-1 pb-1 font-normal text-gray-600 dark:text-gray-300 text-sm w-full">
              Organize your links into themed bundles with smart grouping and custom styling.
            </p>
          </article>
        </TimelineContent>

        {/* Usage Stats */}
        <TimelineContent
          as="div"
          animationNum={1}
          timelineRef={featuresRef}
          customVariants={revealVariants}
          className="lg:col-span-3 sm:col-span-6 col-span-12 border flex flex-col justify-between rounded-lg p-4 relative border-neutral-200 dark:border-neutral-800"
        >
          <div
            className="absolute inset-0 z-0 rounded-lg dark:from-[#0a0a0a]"
            style={{
              background:
                "radial-gradient(125% 125% at 50% 10%, #ffffff00 40%, #6366f1 100%)",
            }}
          />
          <motion.div
            className="flex -space-x-3"
            initial={{ x: -30, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 1.8, duration: 0.6 }}
          >
            {[
              "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=200",
              "https://images.unsplash.com/photo-1617171594279-3aa1f300a0f2?q=80&w=200",
              "https://images.unsplash.com/photo-1659228135452-c4c7b5118047?q=80&w=200",
            ].map((src, i) => (
              <motion.img
                key={i}
                src={src}
                width={24}
                height={24}
                className="rounded-xl border-4 border-white h-14 w-14 object-cover"
                initial={{ scale: 0, rotate: 180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{
                  delay: 2.0 + i * 0.2,
                  duration: 0.5,
                  type: "spring",
                  stiffness: 200,
                }}
              />
            ))}
          </motion.div>
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 2.6, duration: 0.5 }}
          >
            <motion.h1
              className="text-4xl font-semibold sm:pt-0 pt-20"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ delay: 2.8, duration: 0.3, type: "spring" }}
            >
              500K+
            </motion.h1>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Links optimized monthly by ClickSprout creators
            </p>
          </motion.div>
        </TimelineContent>

        {/* Smart Features */}
        <TimelineContent
          as="div"
          animationNum={2}
          timelineRef={featuresRef}
          customVariants={revealVariants}
          className="lg:col-span-4 sm:col-span-6 col-span-12 border rounded-lg p-4 group border-neutral-200 dark:border-neutral-800"
        >
          <motion.h1
            className="text-4xl font-semibold dark:text-white"
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1.6, duration: 0.5 }}
          >
            Smart Features
          </motion.h1>
          <motion.p
            className="text-sm dark:text-gray-300"
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1.8, duration: 0.5 }}
          >
            Tools that grow your audience automatically
          </motion.p>
          <div className="space-y-2 mt-6">
            {[
              {
                title: "Smart Scheduling",
                desc: "Schedule links for optimal times",
                color: "green",
                rotation: 0,
                icon: <Calendar className="w-4 h-4" />
              },
              {
                title: "Advanced Tracking",
                desc: "Monitor link performance",
                color: "orange",
                rotation: 3,
                icon: <BarChart3 className="w-4 h-4" />
              },
              {
                title: "Auto Promotion",
                desc: "Automatically promotes links",
                color: "blue",
                rotation: -1,
                icon: <Bot className="w-4 h-4" />
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                className={`flex gap-2 justify-between items-center bg-neutral-50 dark:bg-gray-800 p-2 rounded-xl border border-neutral-200 dark:border-gray-700 shadow-lg pl-7 relative before:content-[''] before:absolute before:left-2.5 before:rounded-md before:top-1.5 before:w-1.5 before:h-[80%] ${colorClasses[item.color as keyof typeof colorClasses]} group-hover:rotate-0 transition-all`}
                style={{
                  rotate: `${item.rotation}deg`,
                  boxShadow: `0 10px 15px -3px rgb(${item.color === "green" ? "34 197 94" : item.color === "orange" ? "249 115 22" : "59 130 246"} / 0.1)`,
                }}
                initial={{ x: -30, opacity: 0, rotate: item.rotation + 10 }}
                animate={{ x: 0, opacity: 1, rotate: item.rotation }}
                transition={{
                  delay: i * 0.2,
                  duration: 0.6,
                  type: "spring",
                  stiffness: 100,
                }}
                whileHover={{ rotate: 0 }}
              >
                <div className="flex items-center gap-3">
                  <div className="text-white">
                    {item.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold dark:text-white">{item.title}</h3>
                    <p className="text-sm dark:text-gray-300">{item.desc}</p>
                  </div>
                </div>
                <ArrowRight className="dark:text-gray-300" />
              </motion.div>
            ))}
          </div>
        </TimelineContent>

        <TimelineContent
          as="div"
          animationNum={3}
          timelineRef={featuresRef}
          customVariants={revealVariants}
          className="lg:col-span-7 sm:col-span-6 col-span-12 relative border p-4 rounded-xl overflow-hidden border-neutral-200 dark:border-gray-800"
        >
          <article className="w-full font-helvetica">
            <h3 className="px-1 pt-1 text-black dark:text-white text-2xl font-medium">
              Peak-Time Intelligence
            </h3>
            <p className="mt-2 px-1 text-gray-600 dark:text-gray-300 text-sm">
              Our AI analyzes your audience activity patterns to automatically promote your links during peak engagement hours.
            </p>
            <div className="mt-6 grid grid-cols-3 gap-4">
              {[55, 87, 63].map((percent, idx) => (
                <motion.div
                  key={idx}
                  className="text-center"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 3.5 + idx * 0.2 }}
                >
                  <div className="text-3xl font-bold text-green-600 dark:text-green-400">{percent}%</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Higher clicks</div>
                </motion.div>
              ))}
            </div>
            <div className="mt-6 flex items-center text-sm dark:text-gray-300">
              <TrendingUp className="w-4 h-4 text-green-600 dark:text-green-400 mr-2" />
              <span>Engagement increases when using Peak-Time Intelligence</span>
            </div>
          </article>
        </TimelineContent>

        {/* Analytics Section */}
        <TimelineContent
          as="div"
          animationNum={4}
          timelineRef={featuresRef}
          customVariants={revealVariants}
          className="lg:col-span-5 sm:col-span-6 col-span-12 border rounded-lg p-4 relative border-neutral-200 dark:border-gray-800"
        >
          <div
            className="absolute inset-0 z-0 rounded-lg"
            style={{
              background:
                "radial-gradient(125% 125% at 50% 10%, #ffffff00 40%, #10b981 100%)",
            }}
          />
          <motion.h1
            className="text-2xl font-semibold relative z-10 dark:text-white"
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1.6, duration: 0.5 }}
          >
            Advanced Analytics
          </motion.h1>
          <motion.p
            className="text-sm relative z-10 dark:text-gray-300"
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1.8, duration: 0.5 }}
          >
            Understand what drives engagement with detailed insights
          </motion.p>
          <div className="mt-6 grid grid-cols-2 gap-4 relative z-10">
            {[
              { label: "Click-through rate", value: "4.2%", change: "+1.2%" },
              { label: "Conversion rate", value: "2.8%", change: "+0.7%" },
              { label: "Avg. session", value: "2m 34s", change: "+45s" },
              { label: "Bounce rate", value: "32%", change: "-8%" },
            ].map((stat, i) => (
              <motion.div
                key={i}
                className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-3 rounded-lg border border-gray-200 dark:border-gray-700"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 2.0 + i * 0.1 }}
              >
                <div className="text-sm text-gray-600 dark:text-gray-300">{stat.label}</div>
                <div className="flex items-baseline justify-between mt-1">
                  <div className="text-lg font-semibold dark:text-white">{stat.value}</div>
                  <div className="text-green-600 dark:text-green-400 text-xs">↑ {stat.change}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </TimelineContent>

        {/* Competitor Benchmark */}
        <TimelineContent
          as="div"
          animationNum={5}
          timelineRef={featuresRef}
          customVariants={revealVariants}
          className="lg:col-span-7 sm:col-span-6 col-span-12 border rounded-xl p-6 relative border-neutral-200 dark:border-gray-800 overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-green-50 to-transparent dark:from-gray-800 z-0"></div>
          
          <div className="relative z-10">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Competitor Benchmark</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Compare your performance against similar creators in your niche
            </p>
            
            <div className="space-y-4">
              {[
                { platform: "Your Page", value: 4.2, color: "bg-green-500", barWidth: "85%" },
                { platform: "Similar Creators", value: 2.8, color: "bg-blue-500", barWidth: "55%" },
                { platform: "Industry Average", value: 2.1, color: "bg-gray-500", barWidth: "40%" },
              ].map((item, i) => (
                <div key={i} className="space-y-1">
                  <div className="flex justify-between text-sm dark:text-gray-200">
                    <span>{item.platform}</span>
                    <span>{item.value}% CTR</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                    <motion.div
                      className={`${item.color} h-2.5 rounded-full`}
                      initial={{ width: "0%" }}
                      animate={{ width: item.barWidth }}
                      transition={{ delay: 2.2 + i * 0.2, duration: 1, ease: "easeOut" }}
                    ></motion.div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </TimelineContent>
      </div>
    </section>
  );
};

export default ClickSproutFeatures;