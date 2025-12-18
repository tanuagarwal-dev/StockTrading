import Hero from '@/components/about/Hero';
import Team from '@/components/about/Team';
import Header from '@/components/common/header';
import React from 'react'
import Footer from './../../components/common/footer';

const page = () => {
  return (
    <>
      <Header/>
      <Hero />
      <Team />
      <Footer/>
    </>
  );
}

export default page
