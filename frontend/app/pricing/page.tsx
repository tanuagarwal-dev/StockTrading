import type { Metadata } from "next";
import Footer from "@/components/common/footer";
import Header from "@/components/common/header";
import OpenAccount from "@/components/common/OpenAccount";
import Brokerage from "@/components/pricing/Brokerage";
import Hero from "@/components/pricing/Hero";

export const metadata: Metadata = {
  title: "Pricing - Unbeatable Rates",
  description:
    "Free equity delivery and flat ₹20 intraday and F&O trades. No hidden charges, complete transparency.",
};

const page = () => {
  return (
    <>
      <Header />
      <Hero />
      <OpenAccount />
      <Brokerage />
      <Footer />
    </>
  );
};

export default page;
