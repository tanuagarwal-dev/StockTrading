import Link from "next/link";

const Hero = () => {
  return (
    <section className="max-w-7xl mx-auto px-6 py-20">
      <h1 className="text-3xl md:text-4xl font-semibold text-center mb-16 leading-snug">
        We pioneered the discount broking model in India
        <br />
        Now, we are breaking ground with our technology.
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 border-t border-gray-200 pt-12 text-gray-600 text-lg leading-relaxed">
        <div className="space-y-4">
          <p>
            We kick-started operations on the 15th of August, 2010 with the goal
            of breaking all barriers that traders and investors face in India in
            terms of cost, support, and technology. We named the company
            TradeCraft, a combination of Zero and "Rodha", the Sanskrit word for
            barrier.
          </p>

          <p>
            Today, our disruptive pricing models and in-house technology have
            made us the biggest stock broker in India.
          </p>

          <p>
            Over 1+ Crore clients place millions of orders every day through our
            powerful ecosystem of investment platforms, contributing over 15% of
            all Indian retail trading volumes.
          </p>
        </div>

        <div className="space-y-4">
          <p>
            In addition, we run a number of popular open online educational and
            community initiatives to empower retail traders and investors.
          </p>

          <p>
            <Link href="#" className="text-blue-600 hover:underline">
              Rainmatter
            </Link>
            , our fintech fund and incubator, has invested in several fintech
            startups with the goal of growing the Indian capital markets.
          </p>

          <p>
            And yet, we are always up to something new every day. Catch up on
            the latest updates on our blog or see what the media is saying about
            us.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Hero;
