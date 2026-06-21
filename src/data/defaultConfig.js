export const defaultConfig = {
  version: "1.0.0",
  releaseDate: "2026-06-03",
  downloads: {
    macOS: "https://github.com/AceCentre/peeak/releases/latest/download/PEEAK.dmg",
    Windows: "https://github.com/AceCentre/peeak/releases/latest/download/PEEAK.msi",
    Linux: "https://github.com/AceCentre/peeak/releases/latest/download/PEEAK.AppImage"
  },
  changelog: [
    {
      id: "v1.0.0",
      version: "1.0.0",
      date: "June 3, 2026",
      type: "Feature",
      title: "Initial Release: The Visual Era",
      description: "Welcome to PEEAK! This first release brings visual package management for npm, pip, cargo, pub, and go. Features include smart discovery, size analysis, and system package scanning."
    },
    {
      id: "v0.9.5",
      version: "0.9.5",
      date: "May 20, 2026",
      type: "Optimization",
      title: "Performance Boosts & Tauri v2",
      description: "Migrated to Tauri v2 for massive performance improvements. Added the new aurora orb UI and Framer Motion transitions."
    },
    {
      id: "v0.9.0",
      version: "0.9.0",
      date: "May 10, 2026",
      type: "Feature",
      title: "VS Code Extension & MCP",
      description: "Launched the DepEd VS Code extension and the AI MCP server for deep agent integration."
    }
  ]
}
