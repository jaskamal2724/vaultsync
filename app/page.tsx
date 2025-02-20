"use client"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { TextGenerateEffect } from "@/components/ui/text-generate-effect"
import { FloatingParticles } from "@/components/ui/floating-particles"
import { SparklesCore } from "@/components/ui/sparkles"
import { MovingGradientText } from "@/components/ui/moving-gradient-text"
import { BeatingText } from "@/components/ui/beating-text"
import { useSpring, animated as a } from "react-spring"
import { Lock, Share2, RefreshCw } from "lucide-react"

export default function LandingPage() {
  const fadeIn = useSpring({
    from: { opacity: 0, y: 20 },
    to: { opacity: 1, y: 0 },
    delay: 300,
  })

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
  ] as const

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-black via-purple-900 to-black text-white overflow-hidden">
      <FloatingParticles />

      <nav className="w-full p-4">
        <div className="container mx-auto flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold">
            <MovingGradientText text="VaultSync" />
          </Link>
          <div className="space-x-4">
            <Button variant="ghost">Login</Button>
            <Button>Sign Up</Button>
          </div>
        </div>
      </nav>

      {/* Main content with flex-grow */}
      <main className="flex flex-col flex-grow items-center justify-center text-center px-4">
        <div className="relative w-[40rem] h-40 mb-8">
          <SparklesCore background="transparent" minSize={0.4} maxSize={1} particleDensity={100} className="w-full h-full" particleColor="#8B5CF6" />
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <BeatingText text="VaultSync" className="text-5xl font-bold" />
          </div>
        </div>

        <TextGenerateEffect words="Unlock the power of seamless storage. Your files, your world, one cloud." className="text-xl mb-6" />

        <div className="grid grid-cols-1 sm:grid-cols-1 sm:w-80 md:grid-cols-3 md:w-[700px] gap-4 max-w-4xl mb-8">
          {features.map((feature, index) => (
            <div key={index} className="p-4 rounded-lg bg-purple-900/20 backdrop-blur-sm border border-purple-500/20 hover:border-purple-500/40 transition-all duration-300">
              <feature.icon className="w-6 h-6 mb-2 mx-auto text-purple-400" />
              <h3 className="font-semibold mb-1">{feature.title}</h3>
              <p className="text-sm text-gray-300">{feature.description}</p>
            </div>
          ))}
        </div>

        <div className="relative w-64 h-64 mx-auto mb-8">
          <Image src="/cloudvault-animated-logo.svg" alt="CloudVault Illustration" layout="fill" objectFit="contain" className="animate-float" />
        </div>

        {/* Make sure the button doesn't go below footer */}
        <Button size="lg" className="bg-purple-600 hover:bg-purple-700 text-white transition-all animate-bounce duration-3000">
          Get Started
        </Button>
      </main>

      {/* Footer stays at the bottom */}
      <footer className="w-full p-4 text-center text-sm text-gray-400">
        © 2025 CloudVault. All rights reserved.
      </footer>
    </div>
  )
}

