import type { Metadata } from "next";
import Hero from "@/components/about/Hero";
import Team from "@/components/about/Team";
import Header from "@/components/common/header";
import Footer from "./../../components/common/footer";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "We pioneered the discount broking model in India. Learn about our mission to break barriers in trading and investing.",
};

const page = () => {
  return (
    <>
      <Header />
      <Hero />
      <Team />
      <Footer />
    </>
  );
};

export default page;
