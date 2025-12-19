import type { Metadata } from "next";
import Header from "@/components/common/header";
import CreateTicket from "@/components/support/CreateTicket";
import Hero from "@/components/support/Hero";
import Footer from "./../../components/common/footer";

export const metadata: Metadata = {
  title: "Support Portal",
  description:
    "Search for help topics, track tickets, and get assistance with your trading account.",
};

const page = () => {
  return (
    <>
      <Header />
      <Hero />
      <CreateTicket />
      <Footer />
    </>
  );
};

export default page;
