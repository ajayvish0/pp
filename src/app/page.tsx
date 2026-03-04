import CurrentlyBuilding from "@/components/sections/CurrentlyBuilding"
import EngineeringNotes from "@/components/sections/EngineerNotes"
import ExperienceTimeline from "@/components/sections/ExperienceTimeline"
import FinalCTA from "@/components/sections/FinalCTA"
import { Hero } from "@/components/sections/hero"
import ImpactSection from "@/components/sections/impact"
import MarqueeStrip  from "@/components/sections/marquee-strip"
import EngineeringMatrix from "@/components/sections/TechnicalExpertise"
import SelectedWork from "@/components/sections/work"
export default function Home() {
  return (
    <main className="flex flex-col min-h-screen">
      <Hero />
      <MarqueeStrip />
      <ImpactSection/>
      <SelectedWork />
      <ExperienceTimeline />
      <EngineeringMatrix />
      <CurrentlyBuilding />
      <EngineeringNotes />
      <FinalCTA/>
    </main>
  )
}
