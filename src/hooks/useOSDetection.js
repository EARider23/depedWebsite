import { useState, useEffect } from 'react'

export function useOSDetection() {
  const [os, setOs] = useState('unknown')

  useEffect(() => {
    const userAgent = window.navigator.userAgent
    const platform = window.navigator.platform
    const macosPlatforms = ['Macintosh', 'MacIntel', 'MacPPC', 'Mac68K']
    const windowsPlatforms = ['Win32', 'Win64', 'Windows', 'WinCE']
    const iosPlatforms = ['iPhone', 'iPad', 'iPod']

    let detectedOS = 'unknown'

    if (macosPlatforms.indexOf(platform) !== -1) {
      detectedOS = 'macOS'
    } else if (iosPlatforms.indexOf(platform) !== -1) {
      detectedOS = 'iOS'
    } else if (windowsPlatforms.indexOf(platform) !== -1) {
      detectedOS = 'Windows'
    } else if (/Android/.test(userAgent)) {
      detectedOS = 'Android'
    } else if (!detectedOS && /Linux/.test(platform)) {
      detectedOS = 'Linux'
    }

    setOs(detectedOS)
  }, [])

  return os
}
