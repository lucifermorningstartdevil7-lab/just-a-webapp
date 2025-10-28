import Features from "./components/sections/features";
import Footer from "./components/sections/footer";
import Header from "./components/sections/header";
import Hero from "./components/sections/hero";
import Pricing from "./components/sections/pricing";

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      <Header/>
      <Hero />
      <Features />
      <Pricing />
      <Footer/>
      
     
    </main>
  );
}