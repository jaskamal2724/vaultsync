"use client"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { TextGenerateEffect } from "@/components/ui/text-generate-effect"
import { FloatingParticles } from "@/components/ui/floating-particles"
import { SparklesCore } from "@/components/ui/sparkles"
import { MovingGradientText } from "@/components/ui/moving-gradient-text"
import { BeatingText } from "@/components/ui/beating-text"
import { useSpring, animated } from '@react-spring/web'

export default function LandingPage() {
  const fadeIn = useSpring({
    from: { opacity: 0, y: 20 },
    to: { opacity: 1, y: 0 },
    delay: 300,
  })

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-black via-purple-900 to-black text-white overflow-hidden">
      <FloatingParticles />

      <nav className="w-full p-4 absolute top-0 left-0 z-10">
        <div className="container mx-auto flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold">
            <MovingGradientText text="CloudVault" />
          </Link>
          <div className="space-x-4">
            <Button variant="ghost">Login</Button>
            <Button>Sign Up</Button>
          </div>
        </div>
      </nav>

      <main className="text-center z-10">
        <animated.div
          style={{
            transform: fadeIn.y.to((y) => `translateY(${y}px)`),
            opacity: fadeIn.opacity,
          }}
        >
          <div className="relative w-[40rem] h-40 mb-8">
            <SparklesCore
              background="transparent"
              minSize={0.4}
              maxSize={1}
              particleDensity={100}
              className="w-full h-full"
              particleColor="#8B5CF6"
            />
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <BeatingText text="CloudVault" className="text-5xl font-bold" />
            </div>
          </div>

          <div className="max-w-2xl mx-auto mb-8">
            <TextGenerateEffect
              words="Unlock the power of seamless storage. Your files, your world, one cloud."
              className="text-xl"
            />
          </div>

          <div className="relative w-64 h-64 mx-auto mb-8">
            <Image
              src="/placeholder.svg"
              alt="CloudVault Illustration"
              layout="fill"
              objectFit="contain"
              className="animate-float"
            />
          </div>

          <Button
            size="lg"
            className="bg-purple-600 hover:bg-purple-700 text-white animate-pulse hover:animate-none transition-all duration-300"
          >
            Get Started
          </Button>
        </animated.div>
      </main>

      <footer className="absolute bottom-4 text-center text-sm text-gray-400">
        © 2025 CloudVault. All rights reserved.
      </footer>
    </div>
  )
}
