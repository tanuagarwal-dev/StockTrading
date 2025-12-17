import React from "react";

const Hero = () => {
  return (
    <section className="max-w-7xl mx-auto px-6 border-b border-gray-200 mb-12">
      <div className="text-center py-12">
        <h1 className="text-4xl font-bold">Technology</h1>

        <h3 className="text-gray-500 text-lg mt-4">
          Sleek, modern and intuitive trading platforms
        </h3>

        <p className="mt-6">
          Check out our{" "}
          <a
            href="#"
            className="text-blue-600 hover:underline inline-flex items-center gap-1"
          >
            investment offerings
            <span aria-hidden>→</span>
          </a>
        </p>
      </div>
    </section>
  );
};

export default Hero;
