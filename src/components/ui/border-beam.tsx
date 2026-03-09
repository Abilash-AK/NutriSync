import { cn } from "@/lib/utils"
import { motion } from "framer-motion"

interface BorderBeamProps {
  /** Size of the beam in pixels */
  size?: number
  /** Duration of one full rotation in seconds */
  duration?: number
  /** Delay before the animation starts in seconds */
  delay?: number
  /** Color at the start of the beam gradient */
  colorFrom?: string
  /** Color at the end of the beam gradient */
  colorTo?: string
  /** Whether to reverse rotation direction */
  reverse?: boolean
  className?: string
}

/**
 * BorderBeam — animated gradient beam that orbits around a container's border.
 * Place this component as direct children of a `relative overflow-hidden` container.
 */
export function BorderBeam({
  size = 200,
  duration = 8,
  delay = 0,
  colorFrom = "#ffaa40",
  colorTo = "#9c40ff",
  reverse = false,
  className,
}: BorderBeamProps) {
  return (
    <div
      className={cn(
        "pointer-events-none absolute inset-0 rounded-[inherit]",
        className
      )}
      style={
        {
          "--size": `${size}px`,
          "--duration": `${duration}s`,
          "--delay": `-${delay}s`,
          "--color-from": colorFrom,
          "--color-to": colorTo,
        } as React.CSSProperties
      }
    >
      <motion.div
        className="absolute inset-0"
        style={{
          borderRadius: "inherit",
        }}
      >
        <motion.div
          className="absolute"
          style={{
            width: "var(--size)",
            height: "var(--size)",
            offsetPath: `rect(0 auto auto 0 round ${size / 2}px)`,
            offsetDistance: "0%",
            background: `conic-gradient(from 90deg, transparent, var(--color-from), var(--color-to))`,
            filter: "blur(12px)",
            opacity: 0.8,
          }}
          animate={{
            offsetDistance: ["0%", reverse ? "-100%" : "100%"],
          }}
          transition={{
            duration,
            repeat: Infinity,
            ease: "linear",
            delay,
          }}
        />
      </motion.div>
      {/* Visible border overlay */}
      <motion.div
        className="absolute inset-0 rounded-[inherit]"
        style={{
          background: `linear-gradient(transparent, transparent)`,
          border: "1px solid transparent",
        }}
      >
        <motion.div
          className="absolute"
          style={{
            inset: 0,
            borderRadius: "inherit",
            background: `linear-gradient(var(--color-from), var(--color-to))`,
            WebkitMask:
              "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
            mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
            WebkitMaskComposite: "xor",
            maskComposite: "exclude",
            padding: "1px",
            offsetPath: `rect(0 auto auto 0 round inherit)`,
          }}
        />
      </motion.div>
    </div>
  )
}
