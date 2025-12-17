import React from "react";

const Pricing = () => {
  return (
    <section className="max-w-7xl mx-auto px-6 py-20">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
        {/* Left: Text */}
        <div>
          <h1 className="text-3xl md:text-4xl font-semibold mb-4">
            Unbeatable pricing
          </h1>

          <p className="text-gray-600 mb-6">
            We pioneered the concept of discount broking and price transparency
            in India. Flat fees and no hidden charges.
          </p>

          <a
            href="#"
            className="inline-flex items-center gap-1 text-blue-600 hover:underline"
          >
            See pricing <span aria-hidden>→</span>
          </a>
        </div>

        {/* Right: Pricing cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-center">
          <div className="border border-gray-200 rounded-lg p-8">
            <h1 className="text-4xl font-bold mb-2">₹0</h1>
            <p className="text-gray-600">
              Free equity delivery and
              <br />
              direct mutual funds
            </p>
          </div>

          <div className="border border-gray-200 rounded-lg p-8">
            <h1 className="text-4xl font-bold mb-2">₹20</h1>
            <p className="text-gray-600">Intraday and F&amp;O</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Pricing;
