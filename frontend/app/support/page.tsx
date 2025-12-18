import Header from '@/components/common/header';
import CreateTicket from '@/components/support/CreateTicket';
import Hero from '@/components/support/Hero';
import React from 'react'
import Footer from './../../components/common/footer';

const page = () => {
  return (
    <>
      <Header/>
      <Hero />
      <CreateTicket />
      <Footer/>
    </>
  );
}

export default page
