
import Hero from "@/components/home/Hero";
import Stats from "@/components/home/Stats";
import Awards from "@/components/home/Awards";
import Pricing from "@/components/home/Pricing";
import Education from "@/components/home/Education";
import OpenAccount from "@/components/common/OpenAccount";
import Header from "@/components/common/header";
import Footer from "@/components/common/footer";

export default function Home() {
  return (
    <>
      <Header/>
      <>
        
        <Hero />
        <Awards />
        <Stats />
        <Pricing />
        <Education />
        <OpenAccount />
        
      </>
      <Footer/>
    </>
  );
}
