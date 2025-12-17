import React from "react";

const Hero = () => {
  return (
    <section className="max-w-7xl mx-auto px-6 py-20">
      {/* Top heading */}
      <div className="text-center border-b border-gray-200 pb-12 mb-16">
        <h1 className="text-4xl font-bold mb-4">Pricing</h1>
        <h3 className="text-gray-500 text-lg">
          Free equity investments and flat ₹20 intraday and F&amp;O trades
        </h3>
      </div>

      {/* Pricing cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-12 text-center">
        <div>
          <img
            src="/media/images/pricingEquity.svg"
            alt="Free equity delivery"
            className="mx-auto mb-6 h-24"
          />
          <h2 className="text-xl font-semibold mb-2">Free equity delivery</h2>
          <p className="text-gray-600">
            All equity delivery investments (NSE, BSE) are absolutely free — ₹0
            brokerage.
          </p>
        </div>

        <div>
          <img
            src="/media/images/intradayTrades.svg"
            alt="Intraday and F&O trades"
            className="mx-auto mb-6 h-24"
          />
          <h2 className="text-xl font-semibold mb-2">
            Intraday and F&amp;O trades
          </h2>
          <p className="text-gray-600">
            Flat ₹20 or 0.03% (whichever is lower) per executed order on
            intraday trades across equity, currency, and commodity.
          </p>
        </div>

        <div>
          <img
            src="/media/images/pricingEquity.svg"
            alt="Free direct MF"
            className="mx-auto mb-6 h-24"
          />
          <h2 className="text-xl font-semibold mb-2">Free direct MF</h2>
          <p className="text-gray-600">
            All direct mutual fund investments are absolutely free — ₹0
            commissions &amp; DP charges.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Hero;
