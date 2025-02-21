"use client";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { TextGenerateEffect } from "@/components/ui/text-generate-effect";
import { FloatingParticles } from "@/components/ui/floating-particles";
import { SparklesCore } from "@/components/ui/sparkles";
import { MovingGradientText } from "@/components/ui/moving-gradient-text";
import { BeatingText } from "@/components/ui/beating-text";
import { Menu } from "lucide-react";
import { motion } from "framer-motion";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Lock, Share2, RefreshCw } from "lucide-react";
import { useRouter } from "next/navigation";

export default function LandingPage() {
  const  router = useRouter() 

  // Features data
  const features = [
    {
      title: "Secure Storage",
      description: "End-to-end encryption for all your files",
      icon: Lock,
    },
    {
      title: "Easy Sharing",
      description: "Share files with anyone, anywhere",
      icon: Share2,
    },
    {
      title: "Auto Sync",
      description: "Real-time sync across all devices",
      icon: RefreshCw,
    },
  ] as const;

  const handleStarted=()=>{
    router.replace("/signin")
  }
  return (
    <div className="relative min-h-screen w-screen overflow-hidden bg-gradient-to-br from-black via-purple-900 to-black text-white flex flex-col items-center">
      {/* FloatingParticles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <FloatingParticles />
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 p-4 z-50 w-full">
        <div className="container mx-auto flex justify-between items-center max-w-6xl px-2">
          <Link
            href="/"
            className="relative z-50 flex items-center gap-1 hover:opacity-80 transition-opacity"
          >
            <MovingGradientText text="VaultSync" />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-3 relative z-50">
            <Button
              variant="ghost"
              className="text-sm hover:bg-purple-700/50"
              onClick={() => console.log("Login clicked")}
            >
              Login
            </Button>
            <Button
              className="text-sm hover:bg-purple-700"
              onClick={() => console.log("Sign Up clicked")}
            >
              Sign Up
            </Button>
          </div>

          {/* Mobile Navigation */}
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden relative z-50"
              >
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent
              side="right"
              className="bg-black/95 border-purple-900/50 w-[75%] sm:w-[300px]"
            >
              <div className="flex flex-col space-y-3 mt-6">
                <Button
                  variant="ghost"
                  className="w-full justify-start text-sm hover:bg-purple-700/50 py-2"
                  onClick={() => console.log("Mobile Login clicked")}
                >
                  Login
                </Button>
                <Button
                  className="w-full justify-start text-sm hover:bg-purple-700 py-2"
                  onClick={() => console.log("Mobile Sign Up clicked")}
                >
                  Sign Up
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>

      <main className="relative z-10 w-full px-4 pt-16 sm:pt-20 md:pt-24 flex-grow flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-6xl"
        >
          {/* Hero Section */}
          <div className="relative w-full max-w-[90vw] sm:max-w-[40rem] h-24 sm:h-32 md:h-40 mb-6 mx-auto overflow-hidden">
            <SparklesCore
              background="transparent"
              minSize={0.3}
              maxSize={0.8}
              particleDensity={80}
              className="w-full h-full"
              particleColor="#8B5CF6"
            />
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full text-center">
              <BeatingText
                text="VaultSync"
                className="text-2xl sm:text-3xl md:text-5xl font-bold whitespace-nowrap"
              />
            </div>
          </div>

          {/* Tagline */}
          <div className="max-w-[90vw] sm:max-w-lg md:max-w-2xl mx-auto mb-6 text-center">
            <TextGenerateEffect
              words="Unlock the power of seamless storage. Your files, your world, one cloud."
              className="text-sm sm:text-base md:text-xl"
            />
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 max-w-4xl mx-auto mb-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="p-3 sm:p-4 rounded-lg bg-purple-900/20 backdrop-blur-sm border border-purple-500/20 hover:border-purple-500/40 transition-all duration-300"
              >
                <feature.icon className="w-5 h-5 sm:w-6 sm:h-6 mb-2 mx-auto text-purple-400" />
                <h3 className="font-semibold text-sm sm:text-base mb-1 text-center">
                  {feature.title}
                </h3>
                <p className="text-xs sm:text-sm text-gray-300 text-center">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>

          {/* Logo Image */}
          <div className="relative w-32 h-32 sm:w-48 sm:h-48 md:w-64 md:h-64 mx-auto mb-6">
            <Image
              src="/cloudvault-animated-logo.svg"
              alt="CloudVault Illustration"
              layout="fill"
              objectFit="contain"
              className="animate-float"
            />
          </div>

          {/* CTA Button */}
          <div className="text-center">
            <Button
              size="lg"
              className="bg-purple-600 hover:bg-purple-700 text-white text-sm sm:text-base animate-bounce hover:animate-none transition-all duration-3000 w-3/4 sm:w-auto px-6 py-2 sm:py-3 relative z-10"
              onClick={handleStarted}
            >
              Get Started
            </Button>
          </div>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 w-full text-center text-xs text-gray-400 p-4">
        <p>© 2025 CloudVault. All rights reserved.</p>
      </footer>
    </div>
  );
}
