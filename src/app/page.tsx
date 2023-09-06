import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { AboutUs } from './components/AboutUs';
import { PitchDeck } from './components/PitchDeck';
import { Team } from './components/Team/Team';
import { Footer } from './components/Footer';

export default function Home() {
  return (
    <main className="flex bg-gradient-to-br from-a0d9da to-80cdbf min-h-screen flex-col items-center justify-between">
      <Header />
      <Hero />
      <div className="w-full h-0.5 bg-gray-300 my-10 opacity-50"></div>
      <AboutUs />
      <div className="w-full h-0.5 bg-gray-300 my-10 opacity-50"></div>
      <PitchDeck />
      <div className="w-full h-0.5 bg-gray-300 my-10 opacity-50"></div>
      <Team />
      <Footer />
    </main>
  )
}
