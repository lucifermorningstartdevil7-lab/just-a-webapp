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

  return (
    <div className="bg-black text-white min-h-screen flex flex-col overflow-hidden">
      {/* Navbar */}
      <nav className="max-w-7xl mx-auto w-full flex items-center justify-between px-6 py-5 relative z-50 h-30">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="text-3xl font-black bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent"
        >
          LinkTrim
        </motion.div>
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex gap-3 items-center"
        >
          <Button variant="ghost" className="text-gray-300 hover:text-white hover:bg-neutral-900">Features</Button>
          <Button variant="ghost" className="text-gray-300 hover:text-white hover:bg-neutral-900">Pricing</Button>
          <Button className="bg-white text-black hover:bg-gray-200 font-semibold px-6"><Link href={'auth/login'}>Sign in</Link></Button>
        </motion.div>
      </nav>

      {/* Hero Section */}
      <section className="flex flex-col-reverse lg:flex-row items-center justify-between max-w-7xl mx-auto px-6 py-24 gap-16 flex-1">
        <motion.div 
          className="flex-1 space-y-8"
          variants={staggerContainer}
          initial="initial"
          animate="animate"
        >
          <motion.h1 
            variants={fadeInUp}
            className="text-6xl md:text-7xl font-black leading-tight tracking-tight"
          >
            Your clean link-in-bio, ready in <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">seconds</span>
          </motion.h1>
          <motion.p 
            variants={fadeInUp}
            className="text-xl text-gray-400 leading-relaxed max-w-md"
          >
            Build a beautiful, sharable page for your socials or projects. Simple, fast, and designed for creators.
          </motion.p>
          <motion.div variants={fadeInUp}>
            <Button className="bg-white text-black hover:bg-gray-200 font-bold px-8 py-6 text-lg rounded-lg">Start Free</Button>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
          className="flex-1 flex justify-center lg:justify-end"
        >
          <div className="relative w-full max-w-sm">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 blur-3xl rounded-3xl"></div>
            <div className="relative bg-neutral-900 border border-neutral-800 rounded-3xl overflow-hidden shadow-2xl p-6">
              <div className="relative w-full aspect-square bg-gradient-to-br from-neutral-800 to-neutral-900 rounded-2xl overflow-hidden flex items-center justify-center">
                <Image 
                  src="/p.jpg"
                  width={400}
                  height={400}
                  alt="LinkTrim Preview"
                  className="w-full h-full "
                  priority
                />
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-6 py-24 w-full">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-black mb-4">Why creators love LinkTrim</h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">Everything you need to build, customize, and share your perfect link page.</p>
        </motion.div>

        <motion.div 
          className="grid gap-8 md:grid-cols-3"
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
        >
          {features.map((f, idx) => (
            <motion.div key={idx} variants={fadeInUp}>
              <Card className="relative bg-neutral-900/50 border border-neutral-800 rounded-2xl hover:border-neutral-700 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/10 group overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 to-cyan-500/0 group-hover:from-blue-500/10 group-hover:to-cyan-500/10 transition-all duration-300"></div>
                <CardContent className="relative p-8 space-y-4">
                  <div className="text-4xl">{f.icon}</div>
                  <h3 className="text-xl font-bold text-white">{f.title}</h3>
                  <p className="text-gray-400 leading-relaxed">{f.desc}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* CTA Section */}
      <motion.section 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
        viewport={{ once: true }}
        className="max-w-4xl mx-auto px-6 py-24 w-full text-center"
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          viewport={{ once: true }}
          className="space-y-6"
        >
          <h2 className="text-5xl md:text-6xl font-black leading-tight">Ready to transform your bio?</h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">Create your stunning link page in seconds and start converting followers into customers.</p>
          <Button className="bg-white text-black hover:bg-gray-200 font-bold px-10 py-7 text-lg rounded-lg">Start Free — No credit card needed</Button>
        </motion.div>
      </motion.section>

      {/* Footer */}
      <footer className="bg-neutral-950 py-8 px-6 text-center text-gray-500 border-t border-neutral-800 mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <p>&copy; 2025 LinkTrim. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Terms</a>
            <a href="#" className="hover:text-white transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}