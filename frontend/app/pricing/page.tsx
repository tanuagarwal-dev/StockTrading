import OpenAccount from '@/components/common/OpenAccount';
import Brokerage from '@/components/pricing/Brokerage';
import Hero from '@/components/pricing/Hero';
import React from 'react'

const page = () => {
  return (
    <>
      <Hero />
      <OpenAccount />
      <Brokerage />
    </>
  );
}

export default page
