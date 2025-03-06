"use client"
import { useEffect, useRef, useState } from "react"
import { cn } from "@/lib/utils"

export const SparklesCore = (props: {
  id?: string
  className?: string
  background?: string
  minSize?: number
  maxSize?: number
  particleDensity?: number
  particleColor?: string
  particleOffsetX?: number
  particleOffsetY?: number
  speed?: number
  animate?: boolean
}) => {
  const {
    id,
    className,
    background = "transparent",
    minSize = 0.4,
    maxSize = 1,
    particleDensity = 600,
    particleColor = "#FFF",
    particleOffsetX = 0,
    particleOffsetY = 0,
    speed = 1,
    animate = true,
  } = props

  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [context, setContext] = useState<CanvasRenderingContext2D | null>(null)
  const [particles, setParticles] = useState<
    Array<{ x: number; y: number; size: number; speedX: number; speedY: number }>
  >([])
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })

  useEffect(() => {
    if (typeof window !== "undefined") {
      setDimensions({ width: window.innerWidth, height: window.innerHeight })
    }
  }, [])

  useEffect(() => {
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext("2d")
      setContext(ctx)
    }
  }, [])

  useEffect(() => {
    if (context && dimensions.width && dimensions.height) {
      initParticles()
      animate && animateParticles()
    }
  }, []) // Added 'dimensions' to dependencies

  const initParticles = () => {
    const particlesArray = []
    for (let i = 0; i < particleDensity; i++) {
      const particle = {
        x: Math.random() * dimensions.width + particleOffsetX,
        y: Math.random() * dimensions.height + particleOffsetY,
        size: Math.random() * (maxSize - minSize) + minSize,
        speedX: (Math.random() - 0.5) * speed,
        speedY: (Math.random() - 0.5) * speed,
      }
      particlesArray.push(particle)
    }
    setParticles(particlesArray)
  }

  const animateParticles = () => {
    if (!context) return

    context.clearRect(0, 0, dimensions.width, dimensions.height)
    context.fillStyle = background
    context.fillRect(0, 0, dimensions.width, dimensions.height)

    particles.forEach((particle) => {
      context.beginPath()
      context.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
      context.fillStyle = particleColor
      context.fill()

      particle.x += particle.speedX
      particle.y += particle.speedY

      if (particle.x > dimensions.width) particle.x = 0
      else if (particle.x < 0) particle.x = dimensions.width

      if (particle.y > dimensions.height) particle.y = 0
      else if (particle.y < 0) particle.y = dimensions.height
    })

    animate && requestAnimationFrame(animateParticles)
  }

  return (
    <canvas
      ref={canvasRef}
      id={id}
      className={cn("fixed inset-0 h-screen w-screen", className)}
      width={dimensions.width}
      height={dimensions.height}
    />
  )
}
