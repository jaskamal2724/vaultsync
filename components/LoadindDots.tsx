"use client";

import { motion } from "framer-motion";

export default function LoadingWave() {
  const disks = [0, 1, 2];

  return (
    <div className="flex justify-center items-center">
      <div className="flex gap-2">
        {disks.map((i) => (
          <motion.div
            key={i}
            className="w-2.5 h-2.5 rounded-full bg-white"
            animate={{
              y: [0, -10, 0], // Moves up and down
            }}
            transition={{
              duration: 0.6,
              repeat: Infinity,
              repeatType: "loop",
              ease: "easeInOut",
              delay: i * 0.15, // Stagger effect for wave motion
            }}
          />
        ))}
      </div>
    </div>
  );
}
