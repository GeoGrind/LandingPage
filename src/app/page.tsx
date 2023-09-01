import Image from 'next/image'
import { Hero } from './components/Hero'
import { AboutUs } from './components/AboutUs'
import { PitchDeck } from './components/PitchDeck'
import { Team } from './components/Team'

export default function Home() {
  return (
    <main className="flex bg-gradient-to-br from-a0d9da to-80cdbf min-h-screen flex-col items-center justify-between p-24">
      <Hero />
      <AboutUs />
      <PitchDeck />
      <Team />
      {/* Include any other components as necessary */}
    </main>
  )
}
