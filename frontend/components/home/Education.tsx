import React from "react";

const Education = () => {
  return (
    <section className="max-w-7xl mx-auto px-6 py-20">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        {/* Left: Image */}
        <div className="flex justify-center">
          <img
            src="/media/images/education.svg"
            alt="Education"
            className="w-full max-w-md"
          />
        </div>

        {/* Right: Content */}
        <div>
          <h1 className="text-3xl md:text-4xl font-semibold mb-4">
            Free and open market education
          </h1>

          <p className="text-gray-600 mb-4">
            Varsity, the largest online stock market education book in the world
            covering everything from the basics to advanced trading.
          </p>

          <a
            href="#"
            className="inline-flex items-center gap-1 text-blue-600 hover:underline mb-8"
          >
            Varsity <span aria-hidden>→</span>
          </a>

          <p className="text-gray-600 mb-4">
            TradingQ&amp;A, the most active trading and investment community in
            India for all your market related queries.
          </p>

          <a
            href="#"
            className="inline-flex items-center gap-1 text-blue-600 hover:underline"
          >
            TradingQ&amp;A <span aria-hidden>→</span>
          </a>
        </div>
      </div>
    </section>
  );
};

export default Education;
