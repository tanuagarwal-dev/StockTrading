import React from "react";

const Hero = () => {
  return (
    <section className="max-w-7xl mx-auto px-6 py-20 text-center">
      {/* Hero image */}
      <img
        src="/media/images/homeHero.png"
        alt="Hero"
        className="mx-auto mb-12 w-full max-w-4xl"
      />

      {/* Headline */}
      <h1 className="text-4xl md:text-5xl font-bold mb-4">
        Invest in everything
      </h1>

      {/* Subtitle */}
      <p className="text-gray-600 text-lg mb-8">
        Online platform to invest in stocks, derivatives, mutual funds, and more
      </p>

      {/* CTA */}
      <button className="px-8 py-3 text-lg font-medium text-white bg-blue-600 rounded hover:bg-blue-700 transition">
        Signup Now
      </button>
    </section>
  );
};

export default Hero;
