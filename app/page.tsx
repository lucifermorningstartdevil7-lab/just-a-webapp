<<<<<<< HEAD
import Features from "./components/sections/features";
import Footer from "./components/sections/footer";
import Header from "./components/sections/header";
import Hero from "./components/sections/hero";
import Pricing from "./components/sections/pricing";
=======
'use client'
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';

export default function LandingPage() {


  

  const features = [
    { 
      title: 'Lightning Fast', 
      desc: 'Create your link page in under 30 seconds with our intuitive builder.',
      icon: '⚡'
    },
    { 
      title: 'Fully Customizable', 
      desc: 'Control every detail — colors, fonts, layouts, and links to match your brand.',
      icon: '🎨'
    },
    { 
      title: 'Smart Analytics', 
      desc: 'Track clicks, engagement, and visitor behavior in real-time dashboards.',
      icon: '📊'
    }
  ];

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.4, ease: 'easeOut' }
  };

  const staggerContainer = {
    animate: {
      transition: { staggerChildren: 0.1, delayChildren: 0.2 }
    }
  };
>>>>>>> 59c4acd742833a567c3817b01f237bc2978a0525

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      <Header/>
      <Hero />
      <Features />
      <Pricing />
      <Footer/>
      
     
    </main>
  );
}