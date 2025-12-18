import Footer from '@/components/common/footer';
import Header from '@/components/common/header';
import OpenAccount from '@/components/common/OpenAccount';
import Brokerage from '@/components/pricing/Brokerage';
import Hero from '@/components/pricing/Hero';
import React from 'react'

const page = () => {
  return (
    <>
      <Header/>
      <Hero />
      <OpenAccount />
      <Brokerage />
      <Footer/>
    </>
  );
}

export default page
