'use client';

import { motion } from 'framer-motion';

export default function PreviewCard() {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="bg-gray-100 rounded-2xl border-2 border-dashed border-gray-300 p-12 w-100 aspect-video ml-10 flex items-center justify-center"
    >
      <div className="text-center text-gray-500">
        <div className="text-lg font-medium mb-2">Preview Area</div>
        <p className="text-sm">Your video/image will go here</p>
      </div>
    </motion.div>
  );
}