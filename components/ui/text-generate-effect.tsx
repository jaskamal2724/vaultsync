"use client"
import { useEffect } from "react"
import { motion, useAnimationControls } from "framer-motion"

export const TextGenerateEffect = ({
  words,
  className,
}: {
  words: string
  className?: string
}) => {
  const controls = useAnimationControls()
  const wordsArray = words.split(" ")

  useEffect(() => {
    controls.start((i) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.1 },
    }))
  }, [controls])

  return (
    <motion.div className={className}>
      {wordsArray.map((word, idx) => (
        <motion.span
          key={word + idx}
          custom={idx}
          animate={controls}
          initial={{ opacity: 0, y: 20 }}
          className="inline-block mr-1"
        >
          {word}
        </motion.span>
      ))}
    </motion.div>
  )
}

