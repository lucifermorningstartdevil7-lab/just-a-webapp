'use client';

import { motion } from 'framer-motion';
import { Zap, Twitter, Github, Mail } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const links = [
    { name: 'Privacy', href: '#' },
    { name: 'Terms', href: '#' },
    { name: 'Support', href: '#' },
    { name: 'Contact', href: '#' },
  ];

  const socialLinks = [
    { icon: <Twitter className="w-4 h-4" />, href: '#', label: 'Twitter' },
    { icon: <Github className="w-4 h-4" />, href: '#', label: 'GitHub' },
    { icon: <Mail className="w-4 h-4" />, href: '#', label: 'Email' },
  ];

  return (
    <footer className="bg-gray-900 text-white py-16 border-t border-gray-800">
      <div className="container mx-auto px-6">
        {/* Main Footer Content */}
        <div className="grid md:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="md:col-span-2"
          >
            <div className="flex items-center space-x-3 mb-4">
              <motion.div 
                whileHover={{ rotate: 180 }}
                transition={{ duration: 0.5 }}
                className="w-8 h-8 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center"
              >
                <Zap className="w-4 h-4 text-white" />
              </motion.div>
              <span className="text-2xl font-bold">ClickSprout</span>
            </div>
            <p className="text-gray-400 mb-6 max-w-md">
              The intelligent bio-link platform that helps creators maximize engagement and grow their audience automatically.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((social, index) => (
                <motion.a
                  key={index}
                  href={social.href}
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-10 h-10 bg-gray-800 hover:bg-gray-700 rounded-lg flex items-center justify-center transition-colors duration-200"
                  aria-label={social.label}
                >
                  {social.icon}
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <h3 className="font-semibold text-lg mb-4">Product</h3>
            <ul className="space-y-3">
              {links.map((link, index) => (
                <li key={index}>
                  <motion.a
                    href={link.href}
                    whileHover={{ x: 5 }}
                    className="text-gray-400 hover:text-white transition-colors duration-200"
                  >
                    {link.name}
                  </motion.a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Company */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h3 className="font-semibold text-lg mb-4">Company</h3>
            <ul className="space-y-3">
              <li>
                <motion.a
                  href="#"
                  whileHover={{ x: 5 }}
                  className="text-gray-400 hover:text-white transition-colors duration-200"
                >
                  About
                </motion.a>
              </li>
              <li>
                <motion.a
                  href="#"
                  whileHover={{ x: 5 }}
                  className="text-gray-400 hover:text-white transition-colors duration-200"
                >
                  Blog
                </motion.a>
              </li>
              <li>
                <motion.a
                  href="#"
                  whileHover={{ x: 5 }}
                  className="text-gray-400 hover:text-white transition-colors duration-200"
                >
                  Careers
                </motion.a>
              </li>
              <li>
                <motion.a
                  href="#"
                  whileHover={{ x: 5 }}
                  className="text-gray-400 hover:text-white transition-colors duration-200"
                >
                  Press
                </motion.a>
              </li>
            </ul>
          </motion.div>
        </div>

        {/* Bottom Bar */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center"
        >
          <div className="text-gray-400 text-sm mb-4 md:mb-0">
            © {currentYear} ClickSprout. All rights reserved.
          </div>
          
          <div className="flex space-x-6">
            {links.map((link, index) => (
              <motion.a
                key={index}
                href={link.href}
                whileHover={{ scale: 1.05 }}
                className="text-gray-400 hover:text-white transition-colors duration-200 text-sm"
              >
                {link.name}
              </motion.a>
            ))}
          </div>
        </motion.div>
      </div>
    </footer>
  );
}