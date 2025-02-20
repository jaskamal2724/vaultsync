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
    Array<{
      x: number
      y: number
      size: number
      speedX: number
      speedY: number
    }>
  >([])

  useEffect(() => {
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext("2d")
      setContext(ctx)
    }
  }, [])

  useEffect(() => {
    if (context) {
      initParticles()
      animate && animateParticles()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [context, animate]) // Added 'animate' to dependencies

  const initParticles = () => {
    const particlesArray = []
    for (let i = 0; i < particleDensity; i++) {
      const particle = {
        x: Math.random() * window.innerWidth + particleOffsetX,
        y: Math.random() * window.innerHeight + particleOffsetY,
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

    context.clearRect(0, 0, window.innerWidth, window.innerHeight)
    context.fillStyle = background
    context.fillRect(0, 0, window.innerWidth, window.innerHeight)

    particles.forEach((particle) => {
      context.beginPath()
      context.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
      context.fillStyle = particleColor
      context.fill()

      particle.x += particle.speedX
      particle.y += particle.speedY

      if (particle.x > window.innerWidth) particle.x = 0
      else if (particle.x < 0) particle.x = window.innerWidth

      if (particle.y > window.innerHeight) particle.y = 0
      else if (particle.y < 0) particle.y = window.innerHeight
    })

    animate && requestAnimationFrame(animateParticles)
  }

  return (
    <canvas
      ref={canvasRef}
      id={id}
      className={cn("fixed inset-0 h-screen w-screen", className)}
      width={window.innerWidth}
      height={window.innerHeight}
    />
  )
}

