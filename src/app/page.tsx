import Header from "./components/Header";
import Footer from "./components/Footer";
import HeroSection from "./components/HeroSection";
import LatestQuestions from "./components/LatestQuestions";
import TopContributers from "./components/TopContributers";


export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
     

     <main className="flex-grow pt-[64px]">
  <HeroSection />

  {/* Wrap the rest in a section that pulls up slightly */}
  <section className="-mt-8 space-y-8">
    <LatestQuestions />
    <TopContributers />
  </section>
</main>


      
    </div>
  );
}
