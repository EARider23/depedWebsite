import React from "react";

export function BorderBeam({
  size = 200,
  duration = 10,
  colorFrom = "#a855f7",
  colorTo = "#06b6d4",
  borderWidth = 2,
}) {
  return (
    <>
      <style>{`
        @property --border-beam-angle {
          syntax: "<angle>";
          initial-value: 0deg;
          inherits: false;
        }
        @keyframes border-beam-spin {
          from { --border-beam-angle: 0deg; }
          to { --border-beam-angle: 360deg; }
        }
      `}</style>
      
      {/* Neon Backlight Glow */}
      <div
        style={{
          position: "absolute",
          inset: "-2px",
          borderRadius: "inherit",
          pointerEvents: "none",
          zIndex: -20,
          background: `conic-gradient(from var(--border-beam-angle), transparent 0%, transparent 60%, ${colorFrom} 80%, ${colorTo} 95%, transparent 100%)`,
          filter: "blur(24px)",
          opacity: 0.7,
          animation: `border-beam-spin ${duration}s linear infinite`,
        }}
      />

      {/* Main Border Beam */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: "inherit",
          padding: `${borderWidth}px`,
          pointerEvents: "none",
          zIndex: 50,
          background: `conic-gradient(from var(--border-beam-angle), transparent 0%, transparent 75%, ${colorFrom} 85%, ${colorTo} 95%, transparent 100%)`,
          WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
          WebkitMaskComposite: "xor",
          mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
          maskComposite: "exclude",
          animation: `border-beam-spin ${duration}s linear infinite`,
        }}
      />
    </>
  );
}
