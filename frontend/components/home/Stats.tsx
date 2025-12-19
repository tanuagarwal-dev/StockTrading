import Image from "next/image";

const Stats = () => {
  return (
    <section className="max-w-7xl mx-auto px-6 py-20 bg-white dark:bg-gray-900">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
        <div>
          <h1 className="text-3xl md:text-4xl font-semibold mb-10 text-gray-900 dark:text-white">
            Trust with confidence
          </h1>

          <div className="space-y-8 text-gray-600 dark:text-gray-300">
            <div>
              <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-1">
                Customer-first always
              </h2>
              <p>
                That&apos;s why 1.3+ crore customers trust Zerodha with ₹3.5+
                lakh crores worth of equity investments.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-1">
                No spam or gimmicks
              </h2>
              <p>
                No gimmicks, spam, gamification, or annoying push notifications.
                High quality apps that you use at your pace.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-1">
                The Zerodha universe
              </h2>
              <p>
                Not just an app, but a whole ecosystem. Our investments in 30+
                fintech startups offer services tailored to your needs.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-1">
                Do better with money
              </h2>
              <p>
                With initiatives like Nudge and Kill Switch, we actively help
                you make better financial decisions.
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center">
          <Image
            src="/media/images/ecosystem.png"
            alt="Ecosystem"
            width={600}
            height={400}
            sizes="(max-width: 640px) 100vw, 512px"
            className="w-full max-w-lg mb-8"
          />

          <div className="flex gap-8 text-sm">
            <a
              href="/products"
              className="text-blue-600 hover:underline inline-flex items-center gap-1"
            >
              Explore our products <span aria-hidden>→</span>
            </a>

            <a
              href="/dashboard"
              className="text-blue-600 hover:underline inline-flex items-center gap-1"
            >
              Try Kite demo <span aria-hidden>→</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Stats;
