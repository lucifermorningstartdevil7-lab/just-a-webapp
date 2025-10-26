"use client";


import { createClient } from "@/lib/supabase/client";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { motion } from "framer-motion";

export function SignUpForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    const supabase = createClient();
    setIsLoading(true);
    setError(null);

    if (password !== repeatPassword) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/protected`,
        },
      });
      if (error) throw error;
      router.push("/auth/sign-up-success");
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, ease: 'easeOut' }
  };

  return (
    <div className="fixed inset-0 bg-black overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl opacity-20 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl opacity-20 translate-y-1/2"></div>
      </div>

      <div className="relative z-10 w-full h-full flex flex-col items-center justify-center px-4 py-8 sm:py-12">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8 sm:mb-12"
        >
          <Link href="/" className="text-2xl sm:text-3xl font-black bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent inline-block hover:opacity-80 transition-opacity">
            ClickSprout
          </Link>
        </motion.div>

        {/* Form Container */}
        <motion.div
          variants={fadeInUp}
          initial="initial"
          animate="animate"
          className="w-full max-w-md bg-neutral-900/40 border border-neutral-800/50 rounded-2xl backdrop-blur-sm p-6 sm:p-8 space-y-6"
        >
          {/* Header */}
          <motion.div
            variants={fadeInUp}
            initial="initial"
            animate="animate"
            className="space-y-1 sm:space-y-2"
          >
            <h1 className="text-2xl sm:text-3xl font-black text-white">Get started</h1>
            <p className="text-sm sm:text-base text-gray-400">Create your ClickSprout account</p>
          </motion.div>

          <form onSubmit={handleSignUp} className="space-y-5 sm:space-y-6">
            {/* Email Field */}
            <motion.div
              variants={fadeInUp}
              initial="initial"
              animate="animate"
              className="space-y-2"
            >
              <Label htmlFor="email" className="text-sm text-gray-200 font-semibold">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-neutral-800/60 border border-neutral-700/50 rounded-lg px-4 py-2.5 sm:py-3 text-white text-sm sm:text-base placeholder:text-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30 transition-all"
              />
            </motion.div>

            {/* Password Field */}
            <motion.div
              variants={fadeInUp}
              initial="initial"
              animate="animate"
              className="space-y-2"
            >
              <Label htmlFor="password" className="text-sm text-gray-200 font-semibold">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-neutral-800/60 border border-neutral-700/50 rounded-lg px-4 py-2.5 sm:py-3 text-white text-sm sm:text-base placeholder:text-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30 transition-all"
              />
            </motion.div>

            {/* Repeat Password Field */}
            <motion.div
              variants={fadeInUp}
              initial="initial"
              animate="animate"
              className="space-y-2"
            >
              <Label htmlFor="repeat-password" className="text-sm text-gray-200 font-semibold">Confirm Password</Label>
              <Input
                id="repeat-password"
                type="password"
                placeholder="••••••••"
                required
                value={repeatPassword}
                onChange={(e) => setRepeatPassword(e.target.value)}
                className="w-full bg-neutral-800/60 border border-neutral-700/50 rounded-lg px-4 py-2.5 sm:py-3 text-white text-sm sm:text-base placeholder:text-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30 transition-all"
              />
            </motion.div>

            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 bg-red-500/10 border border-red-500/50 rounded-lg text-red-400 text-xs sm:text-sm"
              >
                {error}
              </motion.div>
            )}

            {/* Submit Button */}
            <motion.div
              variants={fadeInUp}
              initial="initial"
              animate="animate"
            >
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-white text-black hover:bg-gray-200 font-bold py-2.5 sm:py-3 text-sm sm:text-base rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? "Creating account..." : "Sign Up"}
              </Button>
            </motion.div>

            {/* Login Link */}
            <motion.div
              variants={fadeInUp}
              initial="initial"
              animate="animate"
              className="text-center text-xs sm:text-sm text-gray-400"
            >
              Already have an account?{" "}
              <Link
                href="/auth/login"
                className="text-white font-semibold hover:text-gray-200 transition-colors"
              >
                Sign in
              </Link>
            </motion.div>
          </form>
        </motion.div>

        {/* Footer Link */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-center mt-6 sm:mt-8"
        >
          <Link href="/" className="text-xs sm:text-sm text-gray-500 hover:text-gray-300 transition-colors">
            ← Back to home
          </Link>
        </motion.div>
      </div>
    </div>
  );
}