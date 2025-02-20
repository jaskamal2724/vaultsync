"use client"
import { useEffect, useRef } from "react"
import { useMousePosition } from "@/lib/mouse-position"

export const BackgroundBeams = () => {
  const beams = [
    "M-380 -189C-380 -189 -253 279 389 279C1031 279 1186 -198 1186 -198",
    "M-373 -197C-373 -197 -246 271 396 271C1038 271 1193 -206 1193 -206",
    "M-363 -205C-363 -205 -236 263 406 263C1048 263 1203 -214 1203 -214",
    "M-353 -213C-353 -213 -226 255 416 255C1058 255 1213 -222 1213 -222",
    "M-343 -221C-343 -221 -216 247 426 247C1068 247 1223 -230 1223 -230",
    "M-333 -229C-333 -229 -206 239 436 239C1078 239 1233 -238 1233 -238",
    "M-323 -237C-323 -237 -196 231 446 231C1088 231 1243 -246 1243 -246",
    "M-313 -245C-313 -245 -186 223 456 223C1098 223 1253 -254 1253 -254",
    "M-303 -253C-303 -253 -176 215 466 215C1108 215 1263 -262 1263 -262",
    "M-293 -261C-293 -261 -166 207 476 207C1118 207 1273 -270 1273 -270",
    "M-283 -269C-283 -269 -156 199 486 199C1128 199 1283 -278 1283 -278",
    "M-273 -277C-273 -277 -146 191 496 191C1138 191 1293 -286 1293 -286",
    "M-263 -285C-263 -285 -136 183 506 183C1148 183 1303 -294 1303 -294",
    "M-253 -293C-253 -293 -126 175 516 175C1158 175 1313 -302 1313 -302",
  ]
  const containerRef = useRef<HTMLDivElement>(null)
  const mousePosition = useMousePosition()
  useEffect(() => {
    if (containerRef.current) {
      const { width, height } = containerRef.current.getBoundingClientRect()
      const x = (mousePosition.x / width) * 100
      const y = (mousePosition.y / height) * 100

      containerRef.current.style.setProperty("--x", `${x}%`)
      containerRef.current.style.setProperty("--y", `${y}%`)
    }
  }, [mousePosition])

  return (
    <div ref={containerRef} className="h-screen w-screen absolute inset-0 [--x:50%] [--y:50%]">
      <div className="absolute inset-0 bg-black [mask-image:radial-gradient(600px_at_var(--x)_var(--y),rgba(255,255,255,0.4)_20%,transparent_80%)]" />
      <svg className="absolute inset-0 h-full w-full stroke-slate-200/10" fill="none" viewBox="0 0 800 800">
        {beams.map((d, index) => (
          <path key={index} d={d} />
        ))}
      </svg>
    </div>
  )
}

