import React from "react";

export function Ripple({
  numCircles = 8,
}) {
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        pointerEvents: "none",
      }}
    >
      {Array.from({ length: numCircles }, (_, i) => {
        const size = 300 + i * 150;
        const opacity = 0.25 - i * 0.025;
        const delay = i * 0.3;
        const borderStyle = i === numCircles - 1 ? "dashed" : "solid";

        return (
          <div
            key={i}
            style={{
              position: "absolute",
              width: `${size}px`,
              height: `${size}px`,
              borderRadius: "50%",
              border: `1px ${borderStyle} rgba(168, 85, 247, ${Math.max(opacity, 0.04)})`,
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              animation: `ripple-pulse 4s ease-in-out ${delay}s infinite`,
            }}
          />
        );
      })}
      <style>{`
        @keyframes ripple-pulse {
          0%, 100% {
            transform: translate(-50%, -50%) scale(1);
            opacity: 1;
          }
          50% {
            transform: translate(-50%, -50%) scale(1.05);
            opacity: 0.6;
          }
        }
      `}</style>
    </div>
  );
}
