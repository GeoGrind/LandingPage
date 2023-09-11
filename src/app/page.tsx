import { Header } from "./components/Header";
import { Hero } from "./components/Hero";
import { AboutUs } from "./components/AboutUs";
import { PitchDeck } from "./components/PitchDeck";
import { Team } from "./components/Team/Team";
import { Footer } from "./components/Footer";

export default function Home() {
  return (
    <div className="overflow-x-hidden">
      <main className="flex flex-col items-center justify-between bg-gradient-to-br from-a0d9da to-80cdbf min-h-screen w-full px-4 md:px-0">
        <Header />
        <Hero />
        <Separator id="about" />
        <AboutUs />
        <Separator id="features" />
        <PitchDeck />
        <Separator id="team" />
        <Team />
        <Footer />
      </main>
    </div>
  )
}

interface SeparatorProps {
  id: string
}

const Separator: React.FC<SeparatorProps> = ({ id }) => (
  <div
    className="w-full h-0.5 bg-gray-300 my-10 opacity-50"
    id={id}
  ></div>
)
