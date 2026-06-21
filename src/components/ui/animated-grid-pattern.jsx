import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

export function AnimatedGridPattern({
  width = 60,
  height = 60,
  x = -1,
  y = -1,
  strokeDasharray = 0,
  numSquares = 60,
  className = "",
  maxOpacity = 0.3,
  duration = 4,
  ...props
}) {
  const [squares, setSquares] = useState([]);

  useEffect(() => {
    // Generate random positions for the squares to light up
    // We cover a large grid area since it can be full screen
    const generateSquares = () => {
      const newSquares = [];
      // Generate across a 60x60 logical grid
      for (let i = 0; i < numSquares; i++) {
        newSquares.push({
          x: Math.floor(Math.random() * 60) - 30, // -30 to 30
          y: Math.floor(Math.random() * 60) - 30, // -30 to 30
        });
      }
      setSquares(newSquares);
    };

    generateSquares();
  }, [numSquares]);

  return (
    <svg
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 h-full w-full ${className}`}
      {...props}
    >
      <defs>
        <pattern
          id="animated-grid-pattern"
          width={width}
          height={height}
          patternUnits="userSpaceOnUse"
          x={x}
          y={y}
        >
          <path
            d={`M.5 ${height}V.5H${width}`}
            fill="none"
            strokeDasharray={strokeDasharray}
          />
        </pattern>
      </defs>
      <rect
        width="100%"
        height="100%"
        strokeWidth={0}
        fill="url(#animated-grid-pattern)"
      />
      <svg x="50%" y="50%" className="overflow-visible">
        {squares.map((square, index) => (
          <motion.rect
            initial={{ opacity: 0 }}
            animate={{ opacity: maxOpacity }}
            transition={{
              duration: duration,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut",
              delay: Math.random() * duration * 2,
            }}
            key={`${square.x}-${square.y}-${index}`}
            width={width - 1}
            height={height - 1}
            x={square.x * width + 1}
            y={square.y * height + 1}
            className="fill-purple-500/30" // Purple glow
          />
        ))}
      </svg>
    </svg>
  );
}
