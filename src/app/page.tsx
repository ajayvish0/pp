import CurrentlyBuilding from "@/components/sections/currently-building"
import EducationFoundation from "@/components/sections/education-foundation"
import EngineeringNotes from "@/components/sections/engineer-notes"
import ExperienceTimeline from "@/components/sections/experience-timeline"
import FinalCTA from "@/components/sections/final-cta"
import { Hero } from "@/components/sections/hero"
import ImpactSection from "@/components/sections/impact"
import MarqueeStrip  from "@/components/sections/marquee-strip"
import EngineeringMatrix from "@/components/sections/technical-expertise"
import SelectedWork from "@/components/sections/work"
export default function Home() {
  return (
    <main className="flex flex-col min-h-screen">
      <Hero />
      <MarqueeStrip />
      <ImpactSection/>
      <SelectedWork />
     
      <ExperienceTimeline />
       <EducationFoundation />
      <EngineeringMatrix />
      <CurrentlyBuilding />
      <EngineeringNotes />
      <FinalCTA/>
    </main>
  )
}

