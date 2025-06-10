'use client'

import { useEffect, useState } from 'react'

export default function BgmPlayer() {
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null)

  useEffect(() => {
    const handleInteraction = () => {
      if (!audio) {
        const bgm = new Audio('/sounds/prontera-bgm.mp3')
        bgm.loop = true
        bgm.volume = 0.5 // optional
        bgm.play().catch((err) => console.warn('Autoplay blocked:', err))
        setAudio(bgm)
      }
      document.removeEventListener('click', handleInteraction)
    }

    document.addEventListener('click', handleInteraction)
    return () => document.removeEventListener('click', handleInteraction)
  }, [audio])

  return null
}
