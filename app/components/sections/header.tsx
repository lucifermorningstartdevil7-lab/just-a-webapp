'use client';

import { motion } from 'framer-motion';
import { Zap } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function Header() {
  const router = useRouter()
  const handleNavigation = (path:string)=>{

    router.push(path);
  }

  const headerItems = [
    {
      id: "features",
      label: "Features",
      href: "/pages/features"
    },
    {
      id: "pricing", 
      label: "Pricing",
      href: "/pages/pricing"
    },
    {
      id: "About us",
      label: "About us", 
      href: "/pages/About us"
    }
  ];

  return (
    <motion.header 
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100"
    >
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="flex items-center space-x-3 cursor-pointer"
          >
            <div className="w-9 h-9 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg shadow-green-500/20">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-br from-gray-900 to-gray-600 bg-clip-text text-transparent">
              ClickSprout
            </span>
          </motion.div>
          
          <nav className="hidden md:flex items-center space-x-10">
            {headerItems.map((item, index) => (
              <motion.a
                key={item.id}
                href={item.href}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -2 }}
                className="text-gray-600 hover:text-green-600 transition-colors font-medium text-sm"
              >
                {item.label}
              </motion.a>
            ))}
          </nav>
          
          <div className="flex items-center space-x-4">
            <motion.button 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={()=>handleNavigation('/auth/login')}
              className=" bg-gradient-to-br from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold py-2.5 px-6 rounded-xl transition-all duration-200 shadow-lg shadow-green-500/25"
            >
              Get Started Free
            </motion.button>
          </div>
        </div>
      </div>
    </motion.header>
  );
}