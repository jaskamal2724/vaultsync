"use client"
import { motion } from "framer-motion"

export const BeatingText = ({ text, className }: { text: string; className?: string }) => {
  const letters = Array.from(text)

  return (
    <div className={`${className} relative`}>
      <div className="relative py-8">
        {" "}
        {/* Added padding to prevent clipping */}
        {letters.map((letter, index) => (
          <motion.span
            key={index}
            initial={{ opacity: 0, y: 50 }}
            animate={{
              opacity: 1,
              y: 0,
              scale: [1, 1.2, 1], // Reduced scale for smoother animation
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
            style={{
              display: "inline-block",
              whiteSpace: "pre",
              padding: "0 1px", // Added slight padding between letters
            }}
          >
            {letter === " " ? "\u00A0" : letter}
          </motion.span>
        ))}
      </div>
    </div>
  )
}

