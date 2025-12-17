import React from "react";

const Team = () => {
  return (
    <section className="max-w-7xl mx-auto px-6 py-20">
      {/* Heading */}
      <div className="border-t border-gray-200 pt-12 mb-12">
        <h1 className="text-3xl font-semibold text-center">People</h1>
      </div>

      {/* Content */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 text-gray-600 text-lg leading-relaxed">
        {/* Left: Profile */}
        <div className="flex flex-col items-center text-center">
          <img
            src="/media/images/nithinKamath.jpg"
            alt="Nithin Kamath"
            className="w-48 h-48 object-cover rounded-full mb-6"
          />

          <h4 className="text-xl font-semibold text-gray-900">Nithin Kamath</h4>
          <p className="text-sm text-gray-500">Founder, CEO</p>
        </div>

        {/* Right: Bio */}
        <div className="space-y-4">
          <p>
            Nithin bootstrapped and founded Zerodha in 2010 to overcome the
            hurdles he faced during his decade long stint as a trader. Today,
            Zerodha has changed the landscape of the Indian broking industry.
          </p>

          <p>
            He is a member of the SEBI Secondary Market Advisory Committee
            (SMAC) and the Market Data Advisory Committee (MDAC).
          </p>

          <p>Playing basketball is his zen.</p>

          <p>
            Connect on{" "}
            <a href="#" className="text-blue-600 hover:underline">
              Homepage
            </a>{" "}
            /{" "}
            <a href="#" className="text-blue-600 hover:underline">
              TradingQnA
            </a>{" "}
            /{" "}
            <a href="#" className="text-blue-600 hover:underline">
              Twitter
            </a>
          </p>
        </div>
      </div>
    </section>
  );
};

export default Team;
