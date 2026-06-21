import { useEffect, useState } from 'react'
import Lenis from 'lenis'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import HeroSection from './components/HeroSection'
import DashboardPreview from './components/DashboardPreview'
import AudioPlayerSection from './components/AudioPlayerSection'
import EcosystemRibbon from './components/EcosystemRibbon'
import FeatureGrid from './components/FeatureGrid'
import IDEIntegration from './components/IDEIntegration'
import ComparisonTable from './components/ComparisonTable'
import Changelog from './components/Changelog'
import Pricing from './components/Pricing'
import DownloadCTA from './components/DownloadCTA'
import SocialProof from './components/SocialProof'
import FAQ from './components/FAQ'
import PrivacyCallout from './components/PrivacyCallout'
import { useAudioStore } from './hooks/useAudioStore'
import { useAudioVisualizer } from './hooks/useAudioVisualizer'

function App() {
  // Global Audio State
  const { songs, isReady, addSong, deleteSong } = useAudioStore();
  const { isPlaying, playSong, pause, resume, getFrequencyData, getAudioElement } = useAudioVisualizer();
  const [currentSongIndex, setCurrentSongIndex] = useState(0);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      direction: 'vertical',
      gestureDirection: 'vertical',
      smooth: true,
      mouseMultiplier: 1,
      smoothTouch: false,
      touchMultiplier: 2,
      infinite: false,
    })

    function raf(time) {
      lenis.raf(time)
      requestAnimationFrame(raf)
    }

    requestAnimationFrame(raf)

    return () => {
      lenis.destroy()
    }
  }, [])

  return (
    <div className="bg-slate-50 min-h-screen font-sans text-slate-900 selection:bg-purple-500 selection:text-white">
      <Navbar
        songs={songs}
        isPlaying={isPlaying}
        playSong={playSong}
        pause={pause}
        resume={resume}
        addSong={addSong}
        deleteSong={deleteSong}
        currentSongIndex={currentSongIndex}
        setCurrentSongIndex={setCurrentSongIndex}
        getAudioElement={getAudioElement}
      />

      <main>
        <HeroSection
          songs={songs}
          currentSongIndex={currentSongIndex}
          getFrequencyData={getFrequencyData}
        />
        <SocialProof />
        <EcosystemRibbon />
        <FeatureGrid />
        <DashboardPreview />
        <IDEIntegration />
        <PrivacyCallout />
        <ComparisonTable />
        <Pricing />
        <FAQ />
        <Changelog />
        <DownloadCTA />
      </main>

      <Footer />
    </div>
  )
}

export default App
