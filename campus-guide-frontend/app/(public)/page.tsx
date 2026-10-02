import HeroSection from "@/components/home/HeroSection";
import FeaturesSection from "@/components/home/FeaturesSection";
import MentorsSection from "@/components/home/MentorsSection";
import EventsSection from "@/components/home/EventsSection";
import StoriesSection from "@/components/home/StoriesSection";
import CTASection from "@/components/home/CTASection";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#FAFAF9]">
      <HeroSection />
      <FeaturesSection />
      <MentorsSection />
      <EventsSection />
      <StoriesSection />
      <CTASection />
   
    </div>
  );
}