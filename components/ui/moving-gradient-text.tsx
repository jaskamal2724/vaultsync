"use client"
import { motion } from "framer-motion"

export const MovingGradientText = ({ text }: { text: string }) => {
  return (
    <motion.div className="relative inline-block text-xl" whileHover={{ scale: 1.05 }} transition={{ duration: 0.2 }}>
      <motion.span
        className="inline-block text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-purple-600"
        style={{
          backgroundSize: "200% 200%",
        }}
        animate={{
          backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
        }}
        transition={{
          duration: 5,
          repeat: Number.POSITIVE_INFINITY,
          ease: "linear",
        }}
      >
        {text}
      </motion.span>
      <motion.div
        className="absolute inset-0 rounded-lg"
        animate={{
          boxShadow: [
            "0 0 0px rgba(139, 92, 246, 0)",
            "0 0 20px rgba(139, 92, 246, 0.3)",
            "0 0 0px rgba(139, 92, 246, 0)",
          ],
        }}
        transition={{
          duration: 2,
          repeat: Number.POSITIVE_INFINITY,
          ease: "linear",
        }}
      />
    </motion.div>
  )
}

