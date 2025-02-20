"use client"
import { motion } from "framer-motion"

export const BeatingText = ({ text, className }: { text: string; className?: string }) => {
  const letters = Array.from(text)

  return (
    <div className={className}>
      {letters.map((letter, index) => (
        <motion.span
          key={index}
          initial={{ opacity: 0, y: 50 }}
          animate={{
            opacity: 1,
            y: 0,
            scale: [1, 1.2, 1],
            textShadow: ["0 0 5px #8B5CF6", "0 0 20px #8B5CF6", "0 0 5px #8B5CF6"],
          }}
          transition={{
            duration: 2,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "reverse",
            ease: "easeInOut",
            delay: index * 0.1,
          }}
          className="inline-block"
        >
          {letter === " " ? "\u00A0" : letter}
        </motion.span>
      ))}
    </div>
  )
}

