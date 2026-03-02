import { Hero } from "@/components/sections/hero"
import ImpactSection from "@/components/sections/impact"
import MarqueeStrip  from "@/components/sections/marquee-strip"
import SelectedWork from "@/components/sections/work"
export default function Home() {
  return (
    <main className="flex flex-col min-h-screen">
      <Hero />
      <MarqueeStrip />
      <ImpactSection/>
      <SelectedWork />
    </main>
  )
}
