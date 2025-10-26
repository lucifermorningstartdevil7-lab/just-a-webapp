
'use client'
import { motion } from "framer-motion";
import { TrendingUp, Users, MousePointerClick } from "lucide-react";

export default function AnalyticsPage() {
  const stats = [
    { 
      label: "Total Clicks", 
      value: "1,234", 
      trend: "+12%",
      icon: MousePointerClick,
      color: "from-blue-500 to-blue-600"
    },
    { 
      label: "Unique Visitors", 
      value: "892", 
      trend: "+8%",
      icon: Users,
      color: "from-purple-500 to-purple-600"
    },
    { 
      label: "Conversion Rate", 
      value: "3.2%", 
      trend: "+0.5%",
      icon: TrendingUp,
      color: "from-green-500 to-green-600"
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="p-8 space-y-8"
    >
      <div className="space-y-2">
        <h1 className="text-3xl font-black">Analytics</h1>
        <p className="text-gray-400">Track your link performance and visitor insights</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-neutral-900/40 border border-neutral-800/50 rounded-2xl p-6 space-y-4 group hover:border-neutral-700/50 transition-colors"
            >
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <div className="text-gray-400 text-sm">{stat.label}</div>
                  <div className="text-3xl font-black">{stat.value}</div>
                </div>
                <div className={`p-3 rounded-lg bg-gradient-to-br ${stat.color} text-white`}>
                  <Icon size={20} />
                </div>
              </div>
              <div className="text-xs text-green-400">{stat.trend} this month</div>
            </motion.div>
          );
        })}
      </div>

      {/* Chart Placeholder */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-neutral-900/40 border border-neutral-800/50 rounded-2xl p-8"
      >
        <h2 className="text-xl font-bold mb-6">Clicks Over Time</h2>
        <div className="h-80 flex items-center justify-center text-gray-500 rounded-xl bg-neutral-800/20">
          <div className="text-center space-y-2">
            <div className="text-sm">Chart visualization</div>
            <div className="text-xs text-gray-600">Connect your analytics data to see graphs</div>
          </div>
        </div>
      </motion.div>

      {/* Top Links */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-neutral-900/40 border border-neutral-800/50 rounded-2xl p-8 space-y-4"
      >
        <h2 className="text-xl font-bold">Top Performing Links</h2>
        <div className="space-y-3">
          {[
            { title: "Portfolio", clicks: 456, percentage: 37 },
            { title: "GitHub", clicks: 312, percentage: 25 },
            { title: "Twitter", clicks: 289, percentage: 23 },
            { title: "Newsletter", clicks: 177, percentage: 15 },
          ].map((link, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 + i * 0.05 }}
              className="flex items-center gap-4"
            >
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold">{link.title}</span>
                  <span className="text-sm text-gray-400">{link.clicks} clicks</span>
                </div>
                <div className="w-full h-2 bg-neutral-800 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${link.percentage}%` }}
                    transition={{ delay: 0.6 + i * 0.1, duration: 0.8 }}
                    className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full"
                  />
                </div>
              </div>
              <div className="text-sm font-semibold text-gray-400 w-12 text-right">{link.percentage}%</div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}